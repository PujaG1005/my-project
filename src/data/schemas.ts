
import { z } from 'zod';
import type { Student } from './mock-data';

export const ProcessExcelFileInputSchema = z.object({
  fileContent: z.string().optional(),
  fileType: z.string().optional(),
  fileUrl: z.string().optional(),
  semester: z.number().min(1).max(6), // This now means "up to this semester"
  regulation: z.number().min(2022).max(2027),
});

export type ProcessExcelFileInput = z.infer<typeof ProcessExcelFileInputSchema>;

export const ProcessExcelFileOutputSchema = z.object({
  students: z.custom<Student[]>().optional(),
  error: z.string().optional(),
});

export type ProcessExcelFileOutput = z.infer<typeof ProcessExcelFileOutputSchema>;

export const DownloadSampleExcelInputSchema = z.object({
  regulation: z.number().min(2022).max(2027),
  semester: z.number().min(1).max(6),
});
export type DownloadSampleExcelInput = z.infer<typeof DownloadSampleExcelInputSchema>;

    