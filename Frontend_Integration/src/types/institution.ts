import { z } from 'zod';
import { institutionSchema } from '../schemas/institutionSchema';

// Infer the TypeScript type directly from the Zod schema
export type InstitutionFormData = z.infer<typeof institutionSchema>;

export interface Institution extends InstitutionFormData {
    id: string; // Added by the backend
}

export interface ModalState {
    type: 'none' | 'view' | 'edit' | 'delete' | 'success';
    selectedId?: string;
}