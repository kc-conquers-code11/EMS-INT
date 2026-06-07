export interface PaymentHistoryItem {
  srNo: number;
  title: string;
  amount: string;
  date: string;
  status: 'Done' | 'Pending';
}

export interface PendingFeeItem {
  id: string;
  title: string;
  amount: string;
  dueDate: string;
  type: string;
}
