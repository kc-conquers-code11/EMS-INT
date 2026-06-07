import { useMemo } from 'react';
import { useAuth } from './useAuth';
import type { UserScope } from '../types/auth.types';

export function useUserScope() {
  const { user } = useAuth();

  return useMemo(() => {
    const scope: UserScope | null =
      user?.scope ??
      (user
        ? {
            institution_id: user.institution_id ?? null,
            institution_name: user.institution_name ?? null,
            depart_id: user.depart_id ?? null,
            depart_name: user.depart_name ?? null,
            branch_id: user.branch_id ?? null,
            student_id: user.student_id ?? null,
            faculty_id: user.faculty_id ?? null,
            coe_id: user.coe_id ?? null,
            hod_id: user.hod_id ?? null,
            level:
              user.role === 'SuperAdmin' || user.role === 'Admin'
                ? 'GLOBAL'
                : user.role === 'COE'
                  ? 'INSTITUTION'
                  : user.role === 'HOD'
                    ? 'DEPARTMENT'
                  : user.role === 'Student'
                    ? 'SELF'
                    : 'DEPARTMENT',
            unrestricted: user.role === 'SuperAdmin' || user.role === 'Admin',
          }
        : null);

    return {
      user,
      scope,
      institutionId: scope?.institution_id ?? null,
      institutionName: scope?.institution_name ?? null,
      departId: scope?.depart_id ?? null,
      departName: scope?.depart_name ?? null,
      branchId: scope?.branch_id ?? null,
      studentId: scope?.student_id ?? null,
      facultyId: scope?.faculty_id ?? null,
      isUnrestricted: scope?.unrestricted ?? false,
      isInstitutionScoped: scope?.level === 'INSTITUTION',
      isDepartmentScoped: scope?.level === 'DEPARTMENT',
      isSelfScoped: scope?.level === 'SELF',
    };
  }, [user]);
}
