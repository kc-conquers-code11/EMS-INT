/**
 * User Finalization Module Types
 *
 * DB tables referenced:
 *   users         → uid (PK), email, user_type (FK → user_types.utid), password
 *   user_types    → utid (PK), base (e.g. 'Faculty', 'Admin', 'Student')
 *   user_auth_token → auth_id (PK), token, user_type, login_time, uid (FK → users.uid)
 *
 * The admin selects a faculty member (from `users` where user_type = faculty)
 * and assigns them a specific role for a subject exam session.
 */

// ── Matches `users` table ──────────────────────────────────────
export interface User {
  uid: number;
  email: string;
  user_type: number;   // FK → user_types.utid
  password?: string;   // never sent to frontend
}

// ── Matches `user_types` table ─────────────────────────────────
export interface UserType {
  utid: number;
  base: string;        // e.g. 'Faculty', 'Admin', 'Student', 'COE'
}

// ── Assigned role for a subject exam session ────────────────────
export interface UserFinalization {
  id: number;                                      // PK in assignment table
  uid: number;                                     // FK → users.uid
  faculty_name: string;                            // denormalised for display
  email: string;                                   // from users.email
  role: UserFinalizationRole;                      // assigned role
  subject_name: string;                            // subject code + name
  exam_session: string;                            // e.g. "Summer 2026"
  privilege: 'Write' | 'Read' | 'Revoked';         // current privilege state
}

// Roles that can be assigned to a faculty member for exam duties
export type UserFinalizationRole =
  | 'Evaluator'
  | 'Paper Setter'
  | 'Moderator'
  | 'Scanning Operator';

// ── Modal state machine ────────────────────────────────────────
export type UserFinalizationModalType =
  | 'view'
  | 'edit'
  | 'delete-confirm'
  | 'delete-success'
  | 'revoke-confirm'
  | 'revoke-success'
  | 'edit-success'
  | null;

// ── Form values for assigning / editing a role ─────────────────
export interface UserFinalizationFormValues {
  uid: number;                    // selected faculty uid
  role: UserFinalizationRole;     // assigned role
  exam_session: string;           // e.g. "Summer 2026"
  subject_name: string;           // subject code + name
}
