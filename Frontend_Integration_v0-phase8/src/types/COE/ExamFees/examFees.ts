export interface StudentFeeMapping {
  id: string;
  enrollmentId: string;
  studentName: string;
  semester: string;
  branch: string;
  scheme: string;
  examType: string;
  academicYear: string;
  amount: number;
  paidAmount: number;
  status: 'Paid' | 'Unpaid' | 'Pending Verification';
  paymentDate?: string;
  paymentMethod?: string;
  referenceNo?: string;
  receiptUrl?: string;
}

export interface FeeConfiguration {
  id: string;
  examType: string;
  semester: string;
  branch: string;
  amount: number;
  backlogAmountPerSubject: number;
  lateFee: number;
  isActive: boolean;
}

export interface OfflinePaymentSubmission {
  id: string;
  enrollmentId: string;
  studentName: string;
  amount: number;
  paymentMethod: string;
  referenceNo: string;
  submissionDate: string;
  receiptUrl: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
}

export interface NotificationHistory {
  id: string;
  targetGroup: string;
  branch?: string;
  semester?: string;
  message: string;
  sentDate: string;
  methods: string[];
  recipientCount: number;
  status: 'Sent' | 'Failed';
}
