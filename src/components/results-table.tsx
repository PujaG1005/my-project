"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/data/mock-data";

interface ResultsTableProps {
  students: Student[];
  maxSemesters: number;
  onViewMarksheet: (student: Student) => void;
}

export default function ResultsTable({ students, maxSemesters, onViewMarksheet }: ResultsTableProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No students to display.</p>
        <p className="text-sm">Try clearing your search or calculating the results.</p>
      </div>
    );
  }

  const getGpaForSemester = (student: Student, semesterIndex: number) => {
    const semester = student.semesters.find(s => s.semester === semesterIndex + 1);
    return semester?.gpa?.toFixed(2) ?? 'N/A';
  };

  const getCgpaBadgeVariant = (cgpa: number): "default" | "secondary" | "destructive" => {
    if (cgpa >= 8.5) return "default";
    if (cgpa >= 6.5) return "secondary";
    return "destructive";
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Reg. No</TableHead>
            <TableHead>Name</TableHead>
            {Array.from({ length: maxSemesters }).map((_, i) => (
              <TableHead key={i} className="text-center">Sem {i + 1} GPA</TableHead>
            ))}
            <TableHead className="text-center">CGPA</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.regNo}</TableCell>
              <TableCell>{student.name}</TableCell>
              {Array.from({ length: maxSemesters }).map((_, i) => (
                <TableCell key={i} className="text-center">{getGpaForSemester(student, i)}</TableCell>
              ))}
              <TableCell className="text-center">
                 <Badge variant={getCgpaBadgeVariant(student.cgpa ?? 0)} className="font-semibold text-sm">
                  {student.cgpa?.toFixed(2) ?? 'N/A'}
                 </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewMarksheet(student)}>
                  View Marksheet
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
