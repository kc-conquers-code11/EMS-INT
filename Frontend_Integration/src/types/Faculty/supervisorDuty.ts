/**
 * Supervisor Duty Module Types
 *
 * DB tables referenced:
 *   supervisor_allocation
 *    - duty_id (PK)
 *    - timetable_id (FK)
 *    - room_id (FK)
 *    - faculty_id (FK -> users.uid)
 *    - duty_status (e.g. 'Pending', 'Accepted', 'Conflict', 'Hold')
 *    - assigned_at
 *    - accepted_at
 *    - remarks
 */

// ── Matches `supervisor_allocation` table ──────────────────────
export interface SupervisorAllocation {
  duty_id: number;
  timetable_id: number;
  room_id: number;
  faculty_id: number;
  duty_status: SupervisorDutyStatus;
  assigned_at?: string; // ISO datetime
  accepted_at?: string; // ISO datetime
  conflict_reason?: string;
}

// ── Status union type ──────────────────────────────────────────
export type SupervisorDutyStatus = 
  | 'Pending' 
  | 'Accepted' 
  | 'Conflict' 
  | 'Hold';

// ── Extended interface for Frontend UI Display ─────────────────
// Includes denormalized fields fetched via joins from timetable & room tables
export interface SupervisorDutyView extends SupervisorAllocation {
  // Display fields that would typically be joined from timetable_id and room_id
  date: string;
  time: string;
  subject_name: string;
  room_no: string;
}
