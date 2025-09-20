
'use server';

import * as xlsx from 'xlsx';
import type { DownloadSampleExcelInput } from '@/data/schemas';
import { coursesByRegulation } from '@/data/course-data';

export async function downloadSampleExcel(input: DownloadSampleExcelInput): Promise<{ fileContent: string | null; error: string | null; }> {
    try {
        const regulationCourses = coursesByRegulation[input.regulation];
        if (!regulationCourses) {
            return { fileContent: null, error: `No courses defined for regulation year ${input.regulation}.` };
        }

        const workbook = xlsx.utils.book_new();
        
        // Get all courses for only the selected semester for the selected regulation
        const selectedSemesterCourses = regulationCourses[input.semester];

        if (!selectedSemesterCourses || selectedSemesterCourses.length === 0) {
            return { fileContent: null, error: `No courses defined for regulation ${input.regulation} for semester ${input.semester}.`};
        }
        
        // Create headers
        const headers = ['Reg No', 'Name'];
        selectedSemesterCourses.forEach(course => {
            const prefix = course.courseCode; // Use course code as prefix
            headers.push(`${prefix} Marks`);
        });

        // Create sample data rows
        const sampleData: any[] = Array.from({ length: 5 }, (_, i) => ({
            'Reg No': `TU202400${i + 1}`,
            'Name': `Student ${String.fromCharCode(65 + i)}`,
        }));
        
        const worksheet = xlsx.utils.json_to_sheet(sampleData, { header: headers });
        
        const sheetName = `Regulation ${input.regulation} Sem ${input.semester}`;
        xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        const base64 = buffer.toString('base64');
        
        return { fileContent: base64, error: null };

    } catch (error: any) {
        console.error("Error generating sample excel:", error);
        return { fileContent: null, error: 'An unexpected error occurred while generating the sample file.' };
    }
}
