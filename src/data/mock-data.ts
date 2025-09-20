export type Subject = {
  courseCode: string;
  courseName: string;
  credits: number;
  marks: number;
  grade?: string;
  gradePoint?: number;
};

export type Semester = {
  semester: number;
  subjects: Subject[];
  gpa?: number;
};

export type Student = {
  id: number;
  name: string;
  regNo: string;
  semesters: Semester[];
  cgpa?: number;
};

export const mockStudentData: Omit<Student, 'cgpa' | 'id'>[] = [
  {
    name: 'Anitha V',
    regNo: 'TU2021001',
    semesters: [
      {
        semester: 1,
        subjects: [
          { courseCode: 'U1TAM11', courseName: 'Tamil I', credits: 3, marks: 85 },
          { courseCode: 'U1ENG11', courseName: 'English I', credits: 3, marks: 78 },
          { courseCode: 'U1CSA11', courseName: 'Programming in C', credits: 4, marks: 92 },
          { courseCode: 'U1CSA12', courseName: 'Digital Logic', credits: 4, marks: 81 },
          { courseCode: 'U1CSAP1', courseName: 'C Programming Lab', credits: 2, marks: 95 },
        ],
      },
      {
        semester: 2,
        subjects: [
          { courseCode: 'U2TAM21', courseName: 'Tamil II', credits: 3, marks: 88 },
          { courseCode: 'U2ENG21', courseName: 'English II', credits: 3, marks: 82 },
          { courseCode: 'U2CSA21', courseName: 'Data Structures', credits: 4, marks: 90 },
          { courseCode: 'U2CSA22', courseName: 'Discrete Mathematics', credits: 4, marks: 75 },
          { courseCode: 'U2CSAP2', courseName: 'Data Structures Lab', credits: 2, marks: 94 },
        ],
      },
    ],
  },
  {
    name: 'Bala K',
    regNo: 'TU2021002',
    semesters: [
      {
        semester: 1,
        subjects: [
          { courseCode: 'U1TAM11', courseName: 'Tamil I', credits: 3, marks: 72 },
          { courseCode: 'U1ENG11', courseName: 'English I', credits: 3, marks: 65 },
          { courseCode: 'U1CSA11', courseName: 'Programming in C', credits: 4, marks: 80 },
          { courseCode: 'U1CSA12', courseName: 'Digital Logic', credits: 4, marks: 70 },
          { courseCode: 'U1CSAP1', courseName: 'C Programming Lab', credits: 2, marks: 85 },
        ],
      },
      {
        semester: 2,
        subjects: [
          { courseCode: 'U2TAM21', courseName: 'Tamil II', credits: 3, marks: 78 },
          { courseCode: 'U2ENG21', courseName: 'English II', credits: 3, marks: 71 },
          { courseCode: 'U2CSA21', courseName: 'Data Structures', credits: 4, marks: 82 },
          { courseCode: 'U2CSA22', courseName: 'Discrete Mathematics', credits: 4, marks: 68 },
          { courseCode: 'U2CSAP2', courseName: 'Data Structures Lab', credits: 2, marks: 88 },
        ],
      },
    ],
  },
  {
    name: 'Catherine S',
    regNo: 'TU2021003',
    semesters: [
      {
        semester: 1,
        subjects: [
          { courseCode: 'U1TAM11', courseName: 'Tamil I', credits: 3, marks: 95 },
          { courseCode: 'U1ENG11', courseName: 'English I', credits: 3, marks: 92 },
          { courseCode: 'U1CSA11', courseName: 'Programming in C', credits: 4, marks: 98 },
          { courseCode: 'U1CSA12', courseName: 'Digital Logic', credits: 4, marks: 94 },
          { courseCode: 'U1CSAP1', courseName: 'C Programming Lab', credits: 2, marks: 99 },
        ],
      },
      {
        semester: 2,
        subjects: [
          { courseCode: 'U2TAM21', courseName: 'Tamil II', credits: 3, marks: 96 },
          { courseCode: 'U2ENG21', courseName: 'English II', credits: 3, marks: 94 },
          { courseCode: 'U2CSA21', courseName: 'Data Structures', credits: 4, marks: 97 },
          { courseCode: 'U2CSA22', courseName: 'Discrete Mathematics', credits: 4, marks: 91 },
          { courseCode: 'U2CSAP2', courseName: 'Data Structures Lab', credits: 2, marks: 100 },
        ],
      },
    ],
  },
  // Add 12 more students to make it a bigger list for top/bottom 10
  ...Array.from({ length: 12 }, (_, i) => ({
    name: `Student ${i + 4}`,
    regNo: `TU2021${(i + 4).toString().padStart(3, '0')}`,
    semesters: [
      {
        semester: 1,
        subjects: [
          { courseCode: 'U1TAM11', courseName: 'Tamil I', credits: 3, marks: 60 + i * 3 },
          { courseCode: 'U1ENG11', courseName: 'English I', credits: 3, marks: 55 + i * 3 },
          { courseCode: 'U1CSA11', courseName: 'Programming in C', credits: 4, marks: 65 + i * 2 },
          { courseCode: 'U1CSA12', courseName: 'Digital Logic', credits: 4, marks: 62 + i * 2.5 },
          { courseCode: 'U1CSAP1', courseName: 'C Programming Lab', credits: 2, marks: 70 + i * 2 },
        ],
      },
      {
        semester: 2,
        subjects: [
          { courseCode: 'U2TAM21', courseName: 'Tamil II', credits: 3, marks: 65 + i * 2 },
          { courseCode: 'U2ENG21', courseName: 'English II', credits: 3, marks: 60 + i * 2.5 },
          { courseCode: 'U2CSA21', courseName: 'Data Structures', credits: 4, marks: 70 + i * 1.5 },
          { courseCode: 'U2CSA22', courseName: 'Discrete Mathematics', credits: 4, marks: 58 + i * 3 },
          { courseCode: 'U2CSAP2', courseName: 'Data Structures Lab', credits: 2, marks: 75 + i * 2 },
        ],
      },
    ],
  })),
];
