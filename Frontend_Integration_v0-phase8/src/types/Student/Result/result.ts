export interface ResultSubject {
  courseCode: string;
  courseTitle: string;
  courseCredits: {
    value: string;
    type: string;
  };
  ese: {
    min: string;
    max: string;
    obtained: string;
  };
  iaTw: {
    max: string;
    obtained: string;
  };
  overall: {
    max: string;
    obtained: string;
  };
  creditsEarned: string;
  gradePoints: {
    points: string;
    grade: string;
  };
  cxg: string;
}

export interface StudentResult {
  studentName: string;
  semester: string;
  examination: string;
  academicYear: string;
  seatNumber: string;
  subjects: ResultSubject[];
  totalCredits: string;
  totalCxg: string;
  remark: string;
  sgpi: string;
  marksObtained: string;
  totalMarks: string;
}
