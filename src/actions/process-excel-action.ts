
'use server';

import * as xlsx from 'xlsx';
import { processStudentData } from '@/lib/gpa-utils';
import type { Student, Subject } from '@/data/mock-data';
import type { ProcessExcelFileInput, ProcessExcelFileOutput } from '@/data/schemas';
import { coursesByRegulation } from '@/data/course-data';
import { z } from 'zod';

// Schema to parse the header format like "S1 Python Programming Marks" or "23UCA11 Marks"
const subjectHeaderSchema = z.object({
    semester: z.number().optional(),
    courseName: z.string().optional(),
    courseCode: z.string().optional(),
    metric: z.enum(['Marks', 'Grade Point', 'Credit'])
});

function parseHeader(header: string, allCourses: { courseCode: string; courseName: string; credit: number; semester: number }[]): z.infer<typeof subjectHeaderSchema> & { semester: number, courseName: string, courseCode: string } | null {
    // Try matching "S1 Python Programming Marks"
    const longFormatMatch = header.match(/^S(\d+)\s(.+?)\s(Marks|Grade Point|Credit)$/);
    if (longFormatMatch) {
        const courseName = longFormatMatch[2];
        const courseInfo = allCourses.find(c => c.courseName === courseName);
        if (courseInfo) { // Ensure courseInfo is found before proceeding
            return {
                semester: parseInt(longFormatMatch[1], 10),
                courseName: courseName,
                metric: longFormatMatch[3] as 'Marks' | 'Grade Point' | 'Credit',
                courseCode: courseInfo.courseCode
            };
        }
    }

    // Try matching "23UCA11 Marks"
    const shortFormatMatch = header.match(/^(\S+)\s(Marks|Grade Point|Credit)$/);
    if (shortFormatMatch) {
        const courseCode = shortFormatMatch[1];
        const metric = shortFormatMatch[2] as 'Marks' | 'Grade Point' | 'Credit';
        const courseInfo = allCourses.find(c => c.courseCode === courseCode);
        if (courseInfo) {
            return {
                semester: courseInfo.semester,
                courseName: courseInfo.courseName,
                metric: metric,
                courseCode: courseInfo.courseCode,
            };
        }
    }
    
    return null;
}


export async function processExcelFile(input: ProcessExcelFileInput): Promise<ProcessExcelFileOutput> {
    try {
        let workbook;
        if (input.fileUrl) {
            const response = await fetch(input.fileUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer();
            workbook = xlsx.read(buffer, { type: 'buffer' });
        } else if (input.fileContent) {
            const buffer = Buffer.from(input.fileContent, 'base64');
            workbook = xlsx.read(buffer, { type: 'buffer' });
        } else {
            throw new Error('No file content or URL provided.');
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = xlsx.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            throw new Error('The Excel file is empty or could not be read.');
        }
        
        const regulationCourses = coursesByRegulation[input.regulation];
        if (!regulationCourses) {
            throw new Error(`No course data found for regulation year ${input.regulation}.`);
        }
        
        // Flatten all courses and add semester number to each course
        const allCoursesWithSemester = Object.entries(regulationCourses).flatMap(([sem, courses]) => 
            courses.map(course => ({ ...course, semester: parseInt(sem) }))
        );

        const studentsToProcess: Omit<Student, 'id' | 'cgpa'>[] = jsonData.map(row => {
            const regNo = row['Reg No'];
            const name = row['Name'];

            if (!regNo || !name) {
                return null;
            }

            const student: Omit<Student, 'id' | 'cgpa'> = {
                regNo: String(regNo),
                name: String(name),
                semesters: []
            };

            const subjectsBySemester: { [key: number]: { [key: string]: Partial<Subject> } } = {};

            // Iterate over all possible columns for subjects
            for (const header in row) {
                const parsedHeader = parseHeader(header, allCoursesWithSemester);
                if (parsedHeader && parsedHeader.semester <= input.semester) {
                    const { semester, courseName, courseCode, metric } = parsedHeader;
                    if (!subjectsBySemester[semester]) {
                        subjectsBySemester[semester] = {};
                    }
                    if (!subjectsBySemester[semester][courseName]) {
                        subjectsBySemester[semester][courseName] = {};
                    }
                    
                    subjectsBySemester[semester][courseName].courseName = courseName;
                    subjectsBySemester[semester][courseName].courseCode = courseCode;
                    
                    const value = row[header];
                    if (value === undefined || value === null || String(value).trim() === '') continue;


                    if (metric === 'Marks') {
                         subjectsBySemester[semester][courseName].marks = Number(value);
                    } else if (metric === 'Grade Point') {
                        subjectsBySemester[semester][courseName].gradePoint = Number(value);
                    } else if (metric === 'Credit') {
                        subjectsBySemester[semester][courseName].credits = Number(value);
                    }
                }
            }

            for (const semNumberStr in subjectsBySemester) {
                const semNumber = parseInt(semNumberStr, 10);
                const semesterSubjects: Subject[] = [];
                const courseNames = Object.keys(subjectsBySemester[semNumber]);

                for (const courseName of courseNames) {
                    const subjectData = subjectsBySemester[semNumber][courseName];
                    const courseInfo = allCoursesWithSemester.find(c => c.courseName === courseName);

                    // A subject is only valid if it has marks or a grade point.
                    const hasPerformanceMetric = subjectData.marks !== undefined || subjectData.gradePoint !== undefined;
                    const creditValue = subjectData.credits ?? courseInfo?.credit;

                    if (hasPerformanceMetric && creditValue !== undefined) {
                         semesterSubjects.push({
                            courseCode: subjectData.courseCode!,
                            courseName: subjectData.courseName!,
                            credits: Number(creditValue), // Use the determined credit
                            marks: subjectData.marks !== undefined ? Number(subjectData.marks) : 0,
                            gradePoint: subjectData.gradePoint,
                        });
                    }
                }
                
                if (semesterSubjects.length > 0) {
                     student.semesters.push({
                        semester: semNumber,
                        subjects: semesterSubjects
                    });
                }
            }
            
            return student;
        }).filter((s): s is Omit<Student, 'id' | 'cgpa'> => s !== null && s.semesters.length > 0);
        
        if (studentsToProcess.length === 0) {
            throw new Error("No valid student data could be parsed from the file. Please check that 'Reg No', 'Name', and subject 'Credit' and 'Marks'/'Grade Point' columns are present and correctly filled.");
        }

        const processedStudents = processStudentData(studentsToProcess);

        return { students: processedStudents };

    } catch (error: any) {
        console.error("Error processing Excel file:", error);
        return { error: error.message || 'An unexpected error occurred during file processing.' };
    }
}
