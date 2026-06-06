export type Permission = string;

export const MANAGE_INSTITUTION: Permission[] = ['institution:manage'];
export const VIEW_INSTITUTION: Permission[] = ['institution:view', 'institution:manage'];
export const CREATE_INSTITUTION: Permission[] = ['institution:create', 'institution:manage'];
export const EDIT_INSTITUTION: Permission[] = ['institution:edit', 'institution:manage'];
export const DELETE_INSTITUTION: Permission[] = ['institution:delete', 'institution:manage'];

export const VIEW_HALL_TICKET: Permission[] = ['hall_ticket:view'];
export const DOWNLOAD_HALL_TICKET: Permission[] = ['hall_ticket:download'];