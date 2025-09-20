
type Course = {
    courseCode: string;
    courseName: string;
    credit: number;
};

type SemesterCourses = {
    [semester: number]: Course[];
};

type CoursesByRegulation = {
    [regulationYear: number]: SemesterCourses;
};

export const coursesByRegulation: CoursesByRegulation = {
    2023: {
        1: [
            { courseCode: '23UCA11', courseName: 'Python Programming', credit: 5 },
            { courseCode: '23UPCA15', courseName: 'Python Programming Lab', credit: 5 },
            { courseCode: '23UECA12A', courseName: 'Statistical Methods & Applications - I', credit: 3 },
            { courseCode: '23UFCA13', courseName: 'Fundamentals of IT', credit: 2 },
            { courseCode: '23USCA14', courseName: 'Structured Programming in C', credit: 2 },
            { courseCode: '23ULT10', courseName: 'Tamil I', credit: 3 },
            { courseCode: '23ULE10', courseName: 'English I', credit: 3 },
        ],
        2: [
            { courseCode: '23UCA21', courseName: 'OOP Using C++', credit: 5 },
            { courseCode: '23UPCA25', courseName: 'OOP Using C++ Lab', credit: 5 },
            { courseCode: '23UECA22A', courseName: 'Statistical Methods & Applications - II', credit: 3 },
            { courseCode: '23USCA23', courseName: 'HTML', credit: 2 },
            { courseCode: '23USCA24', courseName: 'Understanding Internet', credit: 2 },
            { courseCode: '23UNM20', courseName: 'Overview of English', credit: 2 },
            { courseCode: '23ULT20', courseName: 'Tamil II', credit: 3 },
            { courseCode: '23ULE20', courseName: 'English II', credit: 3 },
        ],
        3: [
            { courseCode: '23UCA31', courseName: 'Data Structures & Algorithms', credit: 5 },
            { courseCode: '23UPCA35', courseName: 'DSA Lab', credit: 5 },
            { courseCode: '23UECA32B', courseName: 'Office Automation', credit: 3 },
            { courseCode: '23USCA33', courseName: 'Problem Solving Techniques', credit: 1 },
            { courseCode: '23UES30', courseName: 'Environmental Studies', credit: 2 },
            { courseCode: '23ULT30', courseName: 'Tamil III', credit: 3 },
            { courseCode: '23ULE30', courseName: 'English III', credit: 3 },
            { courseCode: '23UNM30B', courseName: 'Foundation of Coding Using Python', credit: 2 },
        ],
        4: [
            { courseCode: '23UCA41', courseName: 'Java Programming', credit: 5 },
            { courseCode: '23UPCA45', courseName: 'Java Programming Lab', credit: 5 },
            { courseCode: '23UECA42B', courseName: 'Multimedia Systems', credit: 3 },
            { courseCode: '23USCA43', courseName: 'Web Designing', credit: 2 },
            { courseCode: '23ULT40', courseName: 'Tamil IV', credit: 3 },
            { courseCode: '23ULE40', courseName: 'English IV', credit: 3 },
            { courseCode: '23UNM340A', courseName: 'Advanced Data Science with Python', credit: 2 },
        ],
        5: [
            { courseCode: '23UCA51', courseName: 'Operating Systems', credit: 4 },
            { courseCode: '23UCA52', courseName: 'Database Management Systems', credit: 4 },
            { courseCode: '23UPCA56', courseName: 'DBMS Lab', credit: 4 },
            { courseCode: '23UECA53A', courseName: 'Software Engineering', credit: 4 },
            { courseCode: '23UECA54A', courseName: 'Mobile Applications', credit: 4 },
            { courseCode: '23USCA55', courseName: 'PHP & MySQL', credit: 4 },
            { courseCode: '23UVE50', courseName: 'Value Education', credit: 2 },

        ],
        6: [
            { courseCode: '23UCA61', courseName: 'Computer Networks', credit: 4 },
            { courseCode: '23UPCA65', courseName: 'Project Work', credit: 4 },
            { courseCode: '23UECA62A', courseName: 'Information Security', credit: 4 },
            { courseCode: '23UECA63A', courseName: 'Cloud Computing', credit: 4 },
            { courseCode: '23USCA64', courseName: 'Introduction to AI', credit: 4 },
            { courseCode: '23UEA60', courseName: 'Extension Activities', credit: 2 },
        ],
    },
    // Add course data for 2024, 2025, 2026 regulations here when available
    2024: {},
    2025: {},
    2026: {},
};

    
