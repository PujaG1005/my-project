
"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Calculator, ChevronsUpDown, BarChart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { calculateCGPA, calculateGPA } from '@/lib/gpa-utils';
import type { Semester as SemesterType } from '@/data/mock-data';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { coursesByRegulation } from '@/data/course-data';

const regulationYears = ['2023-2025'];

const subjectSchema = z.object({
    courseCode: z.string().min(1, 'Required'),
    courseName: z.string().min(1, 'Required'),
    credit: z.coerce.number().min(0, 'Must be >= 0'),
    marks: z.coerce.number().min(0, 'Must be <= 100').max(100, 'Must be <= 100'),
});

const semesterSchema = z.object({
    subjects: z.array(subjectSchema),
});

const formSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    regNo: z.string().min(1, 'Register number is required'),
    semesters: z.array(semesterSchema).min(1).max(6),
});

type FormValues = z.infer<typeof formSchema>;

interface Results {
    semesters: { gpa: number; semester: number }[];
    cgpa: number;
}

const defaultSubject = { courseCode: '', courseName: '', credit: 0, marks: 0 };
const defaultSemester = { subjects: [defaultSubject] };

export default function SingleStudentCalculator() {
    const [results, setResults] = useState<Results | null>(null);
    const [selectedRegulation, setSelectedRegulation] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            regNo: '',
            semesters: [defaultSemester],
        },
    });

    const { fields: semesterFields, append: appendSemester, remove: removeSemester } = useFieldArray({
        control: form.control,
        name: "semesters",
    });

    const handleSemesterCountChange = (value: string) => {
        const count = parseInt(value, 10);
        if (isNaN(count)) return;

        const currentCount = semesterFields.length;
        if (count > currentCount) {
            for (let i = currentCount; i < count; i++) {
                appendSemester(defaultSemester);
            }
        } else if (count < currentCount) {
            for (let i = currentCount; i > count; i--) {
                removeSemester(i - 1);
            }
        }
    };

    const onSubmit = (data: FormValues) => {
        const processedSemesters: SemesterType[] = data.semesters.map((sem, index) => {
            const { gpa, processedSubjects } = calculateGPA(sem.subjects);
            return {
                semester: index + 1,
                subjects: processedSubjects,
                gpa,
            };
        });

        const semesterGpaResults = processedSemesters.map(sem => ({
            gpa: sem.gpa ?? 0,
            semester: sem.semester,
        }));
        
        const cgpa = calculateCGPA(processedSemesters);
        
        setResults({ semesters: semesterGpaResults, cgpa });
    };
    
    const regulationYearInt = selectedRegulation ? parseInt(selectedRegulation.split('-')[0], 10) : null;
    const regulationCourses = regulationYearInt ? coursesByRegulation[regulationYearInt] : {};
    
    const renderResults = () => {
        if (!results) return null;
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/>Calculation Results</CardTitle>
                    <CardDescription>The calculated GPA for each semester and the final CGPA are shown below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                        <span className="text-lg font-bold">Final CGPA</span>
                        <Badge className="text-xl font-bold">{results.cgpa.toFixed(2)}</Badge>
                    </div>
                    <div className="space-y-2">
                        {results.semesters.map((sem) => (
                            <div key={sem.semester} className="flex justify-between items-center p-3 border rounded-md">
                                <span className="font-medium">Semester {sem.semester} GPA</span>
                                <span className="font-semibold text-primary">{sem.gpa.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                     <Button onClick={() => { setResults(null); form.reset({ name: '', regNo: '', semesters: [defaultSemester] }); }} className="w-full">
                        <Calculator className="mr-2" />
                        Calculate Again
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const renderForm = () => (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle>Single Student GPA/CGPA</CardTitle>
                <CardDescription>Select the regulation and number of semesters, then enter marks to calculate the results.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Student Name</FormLabel>
                                        <FormControl><Input placeholder="Enter student's name" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="regNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Register Number</FormLabel>
                                        <FormControl><Input placeholder="Enter register number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                         </div>
                         <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                            <div className="w-full sm:w-64">
                               <FormItem>
                                    <FormLabel>Regulation</FormLabel>
                                    <Select onValueChange={setSelectedRegulation} value={selectedRegulation ?? undefined}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a regulation" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {regulationYears.map(year => (
                                                <SelectItem key={year} value={year}>
                                                    Regulation {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            </div>
                            <div className="w-full sm:w-64">
                               <FormItem>
                                    <FormLabel>Number of Semesters</FormLabel>
                                    <Select onValueChange={handleSemesterCountChange} defaultValue={semesterFields.length.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select number of semesters" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Array.from({ length: 6 }, (_, i) => i + 1).map(num => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num} Semester{num > 1 ? 's' : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            </div>
                             <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 mt-auto">
                                <Calculator className="mr-2" />
                                Calculate
                            </Button>
                        </div>
                        <Separator />
                        <Accordion type="multiple" defaultValue={['semester-0']} className="w-full">
                             {semesterFields.map((semester, semIndex) => (
                                <SemesterForm key={semester.id} semIndex={semIndex} form={form} allRegulationCourses={regulationCourses} />
                             ))}
                        </Accordion>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );

    return results ? renderResults() : renderForm();
}


function SemesterForm({ semIndex, form, allRegulationCourses }: { semIndex: number; form: any; allRegulationCourses: any }) {
    const { fields: subjectFields, append: appendSubject, remove: removeSubject } = useFieldArray({
        control: form.control,
        name: `semesters.${semIndex}.subjects`,
    });
    
    // Filter courses for the current semester
    const semesterCourses = allRegulationCourses?.[semIndex + 1] || [];

    const handleCourseChange = (courseCode: string, subIndex: number) => {
        const course = semesterCourses.find((c: any) => c.courseCode === courseCode);
        if (course) {
            form.setValue(`semesters.${semIndex}.subjects.${subIndex}.courseName`, course.courseName);
            form.setValue(`semesters.${semIndex}.subjects.${subIndex}.courseCode`, course.courseCode);
            form.setValue(`semesters.${semIndex}.subjects.${subIndex}.credit`, course.credit);
        }
    };

    return (
        <AccordionItem value={`semester-${semIndex}`}>
            <AccordionTrigger>
                <div className="flex justify-between w-full pr-4 items-center">
                    <span className="font-semibold text-lg">Semester {semIndex + 1}</span>
                    <ChevronsUpDown className="text-muted-foreground" />
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-4 pt-2">
                    {subjectFields.map((subject, subIndex) => (
                        <div key={subject.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-2 p-2 border rounded-lg items-end">
                            <FormField
                                control={form.control}
                                name={`semesters.${semIndex}.subjects.${subIndex}.courseCode`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course</FormLabel>
                                         <Select onValueChange={(value) => handleCourseChange(value, subIndex)} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a course" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {semesterCourses.map((course: any) => (
                                                    <SelectItem key={course.courseCode} value={course.courseCode}>
                                                        {course.courseName} ({course.courseCode})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`semesters.${semIndex}.subjects.${subIndex}.credit`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Credit</FormLabel>
                                        <FormControl><Input type="number" {...field} readOnly /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name={`semesters.${semIndex}.subjects.${subIndex}.marks`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marks</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <Button type="button" variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeSubject(subIndex)}>
                                <Trash2 />
                            </Button>
                        </div>
                    ))}
                    <Separator />
                    <div className="flex justify-start">
                         <Button type="button" variant="outline" onClick={() => appendSubject({ courseCode: '', courseName: '', credit: 0, marks: 0 })}>
                            <Plus className="mr-2"/>
                            Add Subject
                        </Button>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
