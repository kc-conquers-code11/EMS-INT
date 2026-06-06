export interface InventoryItem {
  id: string;
  item: string;
  batch: string;
  examSession: string;
  quantity: number;
  distributed: number;
  remaining: number;
}

export type InventoryFeedbackType = 'add_success' | 'edit_success' | 'delete_confirm' | 'delete_success';

export type InventoryTab = 'Inventory Dashboard' | 'Update Stock' | 'Distribute Stock';
