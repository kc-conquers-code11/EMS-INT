export interface HallTicketSubject {
  srNo: number;
  courseCode: string;
  courseName: string;
  date: string;
  time: string;
}

export interface HallTicket {
  enrollmentId: string;
  studentName: string;
  branch: string;
  semester: string;
  examEvent: string;
  seatNumber: string;
  subjects: HallTicketSubject[];
}
