

import type { Student, Semester, Subject } from '@/data/mock-data';

export const getGradeInfo = (marks: number, gradePoint?: number): { grade: string; gradePoint: number } => {
  let finalGradePoint: number;
  
  if (typeof gradePoint === 'number' && !isNaN(gradePoint)) {
    finalGradePoint = gradePoint;
  } 
  else {
    finalGradePoint = marks / 10.0;
  }

  finalGradePoint = Math.min(finalGradePoint, 10);
  
  let grade: string;
  if (marks >= 90) grade = 'O';
  else if (marks >= 80) grade = 'D+';
  else if (marks >= 70) grade = 'D';
  else if (marks >= 60) grade = 'A+';
  else if (marks >= 50) grade = 'A';
  else grade = 'RA'; 

  if (grade === 'RA') {
    finalGradePoint = 0;
  }

  return { grade, gradePoint: finalGradePoint };
};

export const calculateGPA = (subjects: Subject[]): { gpa: number, processedSubjects: Subject[] } => {
  let totalCredits = 0;
  let weightedGradePoints = 0;

  const processedSubjects = subjects.map(subject => {
    const { grade, gradePoint } = getGradeInfo(subject.marks, subject.gradePoint);
    
    if (grade !== 'RA') {
        totalCredits += subject.credits;
        weightedGradePoints += gradePoint * subject.credits;
    }

    return {...subject, grade, gradePoint};
  });

  const gpa = totalCredits > 0 ? weightedGradePoints / totalCredits : 0;
  return { gpa, processedSubjects };
};

export const calculateCGPA = (semesters: Semester[]): number => {
  let totalWeightedGpa = 0;
  let totalCredits = 0;

  semesters.forEach(semester => {
    const semesterCredits = semester.subjects.reduce((sum, subject) => {
        if (subject.grade !== 'RA') {
            return sum + subject.credits;
        }
        return sum;
    }, 0);
    
    if (semesterCredits > 0 && semester.gpa) {
      totalWeightedGpa += semester.gpa * semesterCredits;
      totalCredits += semesterCredits;
    }
  });

  return totalCredits > 0 ? totalWeightedGpa / totalCredits : 0;
};

export const processStudentData = (students: Omit<Student, 'id' | 'cgpa'>[]): Student[] => {
  return students.map((student, index) => {
    const processedSemesters = student.semesters.map(semester => {
      const { gpa, processedSubjects } = calculateGPA(semester.subjects);
      return { ...semester, subjects: processedSubjects, gpa };
    });

    const cgpa = calculateCGPA(processedSemesters);

    return {
      ...student,
      id: index,
      semesters: processedSemesters,
      cgpa,
    };
  });
};
