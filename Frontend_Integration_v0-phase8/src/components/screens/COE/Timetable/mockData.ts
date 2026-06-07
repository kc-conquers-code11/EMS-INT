import type { Subject, Timetable } from '../../../../types/COE/timetable';

export const MOCK_BRANCHES = [
  'Information Technology',
  'Computer Science',
  'Artificial Intelligence & Data Science',
  'Mechatronics',
  'Electrical Engineering',
  'Mechanical Engineering'
];

export const MOCK_SEMESTERS = [
  '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'
];

export const MOCK_SCHEMES = [
  'Choice Based Credit System (CBCS) 2024',
  'National Education Policy (NEP) 2025',
  'Autonomous Regulation 2023'
];

export const MOCK_FACULTY = [
  'Dr. A. Kumar',
  'Prof. S. Sharma',
  'Dr. R. Verma',
  'Prof. M. Das',
  'Dr. P. Joshi',
  'Prof. N. Patel',
  'Dr. K. Raghavan',
  'Prof. V. Shinde'
];

export const MOCK_ROOMS = [
  'Room 101',
  'Room 102',
  'Room 203',
  'Room 204',
  'Lab A',
  'Lab B',
  'Seminar Hall'
];

export const TIME_SLOTS = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:15 AM - 12:15 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM'
];

export const MOCK_SUBJECTS_BY_KEY: Record<string, Subject[]> = {
  'Information Technology-2nd': [
    { code: 'IT201', title: 'Calculus and Linear Algebra', credits: 4 },
    { code: 'IT202', title: 'Data Structures and Algorithms', credits: 4 },
    { code: 'IT203', title: 'Digital Logic & Computer Design', credits: 3 },
    { code: 'IT204', title: 'Web Application Development', credits: 3 },
    { code: 'IT205', title: 'Communication Skills', credits: 2 }
  ],
  'Computer Science-2nd': [
    { code: 'CS201', title: 'Discrete Mathematics', credits: 4 },
    { code: 'CS202', title: 'Object-Oriented Programming', credits: 4 },
    { code: 'CS203', title: 'Computer Organization & Architecture', credits: 3 },
    { code: 'CS204', title: 'Database Management Systems', credits: 3 },
    { code: 'CS205', title: 'Environmental Science', credits: 2 }
  ],
  'Artificial Intelligence & Data Science-2nd': [
    { code: 'AI201', title: 'Probability and Statistics', credits: 4 },
    { code: 'AI202', title: 'Introduction to Python & R', credits: 4 },
    { code: 'AI203', title: 'Foundations of Data Science', credits: 3 },
    { code: 'AI204', title: 'Principles of AI', credits: 3 },
    { code: 'AI205', title: 'Basic Electronics', credits: 2 }
  ]
};

// Default subjects for other selections
export const DEFAULT_MOCK_SUBJECTS: Subject[] = [
  { code: 'SUB101', title: 'Applied Mathematics', credits: 4 },
  { code: 'SUB102', title: 'Programming for Problem Solving', credits: 4 },
  { code: 'SUB103', title: 'Engineering Physics', credits: 3 },
  { code: 'SUB104', title: 'Basic Electrical Engineering', credits: 3 },
  { code: 'SUB105', title: 'Engineering Graphics', credits: 2 }
];

export const getSubjects = (branch: string, semester: string): Subject[] => {
  const key = `${branch}-${semester}`;
  return MOCK_SUBJECTS_BY_KEY[key] || DEFAULT_MOCK_SUBJECTS;
};

// Initial populated timetables for demo purposes
export const INITIAL_DEMO_TIMETABLES: Timetable[] = [
  {
    id: '1',
    timetableNo: 'TT-2026-IT-SEM2-01',
    year: '2nd Year',
    branch: 'Information Technology',
    semester: '2nd',
    scheme: 'Choice Based Credit System (CBCS) 2024',
    status: 'active',
    created_at: '2026-05-20',
    slots: [
      { day: 'Monday', timeSlot: '09:00 AM - 10:00 AM', subjectCode: 'IT201', subjectName: 'Calculus and Linear Algebra', facultyName: 'Dr. A. Kumar', roomNo: 'Room 101' },
      { day: 'Monday', timeSlot: '10:00 AM - 11:00 AM', subjectCode: 'IT202', subjectName: 'Data Structures and Algorithms', facultyName: 'Prof. S. Sharma', roomNo: 'Room 102' },
      { day: 'Tuesday', timeSlot: '11:15 AM - 12:15 PM', subjectCode: 'IT203', subjectName: 'Digital Logic & Computer Design', facultyName: 'Dr. R. Verma', roomNo: 'Room 203' },
      { day: 'Wednesday', timeSlot: '01:00 PM - 02:00 PM', subjectCode: 'IT204', subjectName: 'Web Application Development', facultyName: 'Prof. M. Das', roomNo: 'Lab A' }
    ]
  },
  {
    id: '2',
    timetableNo: 'TT-2026-CS-SEM2-02',
    year: '2nd Year',
    branch: 'Computer Science',
    semester: '2nd',
    scheme: 'Choice Based Credit System (CBCS) 2024',
    status: 'active',
    created_at: '2026-05-22',
    slots: [
      { day: 'Monday', timeSlot: '09:00 AM - 10:00 AM', subjectCode: 'CS201', subjectName: 'Discrete Mathematics', facultyName: 'Dr. P. Joshi', roomNo: 'Room 204' },
      { day: 'Monday', timeSlot: '10:00 AM - 11:00 AM', subjectCode: 'CS202', subjectName: 'Object-Oriented Programming', facultyName: 'Prof. N. Patel', roomNo: 'Lab B' },
      { day: 'Wednesday', timeSlot: '11:15 AM - 12:15 PM', subjectCode: 'CS203', subjectName: 'Computer Organization & Architecture', facultyName: 'Dr. K. Raghavan', roomNo: 'Room 101' }
    ]
  }
];
