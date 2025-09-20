'use server';

import * as xlsx from 'xlsx';
import type { Student } from '@/data/mock-data';

export async function downloadReport(students: Student[]): Promise<{ fileContent: string | null; error: string | null; }> {
    if (!students || students.length === 0) {
        return { fileContent: null, error: 'No student data available to download.' };
    }

    try {
        const maxSemesters = Math.max(0, ...students.map(s => s.semesters.length));

        // Main results sheet
        const mainSheetData = students.map(student => {
            const row: any = {
                'Reg No': student.regNo,
                'Name': student.name,
                'CGPA': student.cgpa?.toFixed(2) ?? 'N/A',
            };
            for (let i = 1; i <= maxSemesters; i++) {
                const sem = student.semesters.find(s => s.semester === i);
                row[`Sem ${i} GPA`] = sem?.gpa?.toFixed(2) ?? 'N/A';
            }
            return row;
        });

        const mainWorksheet = xlsx.utils.json_to_sheet(mainSheetData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, mainWorksheet, 'GPA-CGPA Results');
        
        // Detailed mark sheets for each student
        students.forEach(student => {
            const studentSheetData: any[] = [];
             student.semesters.forEach(semester => {
                studentSheetData.push([{v: `Semester ${semester.semester} - GPA: ${semester.gpa?.toFixed(2)}`}]);
                studentSheetData.push(['Course Code', 'Course Name', 'Credits', 'Marks', 'Grade', 'Grade Point']);
                semester.subjects.forEach(subject => {
                    studentSheetData.push([
                        subject.courseCode,
                        subject.courseName,
                        subject.credits,
                        subject.marks,
                        subject.grade,
                        subject.gradePoint
                    ]);
                });
                studentSheetData.push([]); // Add a blank row for spacing
             });
             const studentWorksheet = xlsx.utils.aoa_to_sheet(studentSheetData);
             xlsx.utils.book_append_sheet(workbook, studentWorksheet, student.regNo);
        });
        
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const base64 = buffer.toString('base64');
        
        return { fileContent: base64, error: null };

    } catch (error: any) {
        console.error("Error generating report:", error);
        return { fileContent: null, error: 'An unexpected error occurred while generating the report.' };
    }
}
