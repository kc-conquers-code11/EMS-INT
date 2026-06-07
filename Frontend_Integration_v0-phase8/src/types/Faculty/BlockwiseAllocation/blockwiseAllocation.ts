export interface BlockwiseAllocationRow {
  id: string;
  roomBlockNo: string;
  date: string;
  examSession: string;
  subject: string;
}

export interface SeatingArrangementRow {
  id: string;
  studentName: string;
  rollNo: string;
  seatNo: string;
  subject: string;
  blockNo: string;
}
