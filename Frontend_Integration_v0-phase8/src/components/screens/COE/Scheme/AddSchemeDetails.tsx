import React, { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { SchemeFeedbackType } from '../../../../types/COE/scheme';
import { schemeAPI, programmeAPI, branchAPI } from '../../../../services/api';

interface AddSchemeDetailsProps {
  onSubmitSuccess: (type: SchemeFeedbackType, message: string) => void;
}

/** Mirrors createSchemeValidation Zod schema exactly */
interface SchemeFormState {
  programm_id: string;
  scheme_name: string;
  scheme_year: string;   // kept as string in state; converted to number before POST
  description: string;
  status: 'active' | 'inactive' | 'draft';
  scheme_code: string;
  scheme_type: string;
  regulation: string;
  applicable_from_year: string;
  total_semesters: string;
  credit_system_type: string;
  total_credits: string;
  grading_system: string;
  branches: string[];
}

interface ProgrammeOption {
  programm_id: string;          // UUID
  programme_name: string;        // display label
}


interface AddSchemeDetailsProps {
  onSubmitSuccess: (type: SchemeFeedbackType, message: string) => void;
}

interface FieldErrors {
  [key: string]: string;
}

export const AddSchemeDetails: React.FC<AddSchemeDetailsProps> = ({ onSubmitSuccess }) => {
  
  const [form, setForm] = useState<SchemeFormState>({
    programm_id: '',
    scheme_name: '',
    scheme_year: String(new Date().getFullYear()),
    description: '',
    status: 'active',
    scheme_code: '',
    scheme_type: '',
    regulation: '',
    applicable_from_year: '',
    total_semesters: '',
    credit_system_type: '',
    total_credits: '',
    grading_system: '',
    branches: [],
  });
 
  const [errors, setErrors]         = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [programmes, setProgrammes] = useState<ProgrammeOption[]>([]);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [loadingProgrammes, setLoadingProgrammes] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoadingProgrammes(true);
      try {
        const [progRes, branchRes] = await Promise.all([
          programmeAPI.getDropdown(),
          branchAPI.getDropdown()
        ]);
        if (progRes.data.success) {
          setProgrammes(progRes.data.data ?? []);
        }
        if (branchRes.data.success) {
          setBranchesList(branchRes.data.data ?? []);
        }
      } catch {
        // Non-blocking: user will see an empty dropdown and can retry
      } finally {
        setLoadingProgrammes(false);
      }
    };
    fetchData();
  }, []);
  console.log(programmes, 'programmes')
  console.log(branchesList, 'branchesList')


  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    const currentYear = new Date().getFullYear();

    if (!form.programm_id) {
      e.programm_id = 'Programme is required';
    }

    if (!form.scheme_name.trim()) {
      e.scheme_name = 'Scheme name is required';
    } else if (form.scheme_name.trim().length > 255) {
      e.scheme_name = 'Scheme name too long (max 255 characters)';
    }

    if (!form.scheme_year.trim()) {
      e.scheme_year = 'Scheme Year is required';
    } else {
      const yr = Number(form.scheme_year);
      if (!Number.isInteger(yr) || yr < 1900 || yr > currentYear + 5) {
        e.scheme_year = `Year must be an integer between 1900 and ${currentYear + 5}`;
      }
    }

    return e;
  };

  // ── Submit → POST /schemes ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      // Transform: match createSchemeValidation exactly
      const payload = {
        programm_id: form.programm_id,
        scheme_name: form.scheme_name.trim(),
        scheme_year: Number(form.scheme_year),
        ...(form.description.trim() && { description: form.description.trim() }),
        status: form.status,
        ...(form.scheme_code && { scheme_code: form.scheme_code }),
        ...(form.scheme_type && { scheme_type: form.scheme_type }),
        ...(form.regulation && { regulation: form.regulation }),
        ...(form.applicable_from_year && { applicable_from_year: form.applicable_from_year }),
        ...(form.total_semesters && { total_semesters: parseInt(form.total_semesters, 10) }),
        ...(form.credit_system_type && { credit_system_type: form.credit_system_type }),
        ...(form.total_credits && { total_credits: parseInt(form.total_credits, 10) }),
        ...(form.grading_system && { grading_system: form.grading_system }),
        ...(form.branches && form.branches.length > 0 && { branches: form.branches }),
      };

      const res = await schemeAPI.create(payload);

      if (res.data.success) {
        onSubmitSuccess('add_success', 'Scheme added successfully !!');
        // Reset form after success
        setForm({
          programm_id: '',
          scheme_name: '',
          scheme_year: String(new Date().getFullYear()),
          description: '',
          status: 'active',
          scheme_code: '',
          scheme_type: '',
          regulation: '',
          applicable_from_year: '',
          total_semesters: '',
          credit_system_type: '',
          total_credits: '',
          grading_system: '',
          branches: [],
        });
      } else {
        setSubmitError(res.data.message ?? 'Failed to create scheme.');
      }
    } catch (err: any) {
      // Extract Zod / server error message from api.ts interceptor response
      const serverMsg =
        err?.response?.data?.errors?.[0]?.message ??
        err?.response?.data?.message ??
        err?.message ??
        'An unexpected error occurred.';
      setSubmitError(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = 'w-full px-[14px] py-[10px] bg-white border rounded-lg text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]';
  const inputOk = `${inputBase} border-[#d0d5dd] text-[#101828]`;
  const inputErr = `${inputBase} border-red-400 bg-red-50 text-[#101828]`;
  const fi = (field: string) => (errors[field] ? inputErr : inputOk);
  const selectBase = `appearance-none ${inputBase}`;
  const fs = (field: string) => (errors[field] ? `${selectBase} border-red-400 bg-red-50 text-[#101828]` : `${selectBase} border-[#d0d5dd] text-[#101828]`);
  const errClass = 'text-xs text-red-500 mt-1';
  const labelClass = 'text-[14px] font-medium text-[#344054] leading-[20px]';

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[32px] w-full max-w-[1070px]">
      <div className="flex flex-col gap-[16px] w-full">

        {/* Row 0 */}
        <div className="flex gap-[19px] w-full">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Programme</label>
            <div className="relative w-full">
              <select
                value={form.programm_id}
                onChange={e => setForm({ ...form, programm_id: e.target.value })}
                className={fs('programm_id')}
              >
                <option value="" disabled>Select Programme</option>
                {programmes.map(p => (
                  <option key={p.programm_id} value={p.programm_id}>{p.programme_name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none">
                <ChevronDown size={20} className="text-[#687b96]" />
              </div>
            </div>
            {errors.programm_id && <p className={errClass}>{errors.programm_id}</p>}
          </div>

        </div>

        {/* Row 1 */}
        <div className="flex gap-[19px] w-full">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Scheme Name</label>
            <input
              type="text"
              value={form.scheme_name}
              onChange={e => setForm({ ...form, scheme_name: e.target.value })}
              className={fi('schemeName')}
              placeholder="R-22 NEP"
            />
            {errors.scheme_name && <p className={errClass}>{errors.scheme_name}</p>}
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Scheme Code</label>
            <input
              type="text"
              value={form.scheme_code}
              onChange={e => setForm({ ...form, scheme_code: e.target.value })}
              className={fi('schemeCode')}
              placeholder="NEP-22"
            />
            {errors.schemeCode && <p className={errClass}>{errors.schemeCode}</p>}
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-[20px] w-full">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Scheme Type</label>
            <div className="relative w-full">
              <select
                value={form.scheme_type}
                onChange={e => setForm({ ...form, scheme_type: e.target.value })}
                className={fs('schemeType')}
              >
                <option value="">Select Scheme Type</option>
                <option value="Credit based">Credit based</option>
                <option value="Non-Credit based">Non-Credit based</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none">
                <ChevronDown size={20} className="text-[#687b96]" />
              </div>
            </div>
            {errors.schemeType && <p className={errClass}>{errors.schemeType}</p>}
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Regulation</label>
            <input
              type="text"
              value={form.regulation}
              onChange={e => setForm({ ...form, regulation: e.target.value })}
              className={fi('regulation')}
              placeholder="2022"
            />
            {errors.regulation && <p className={errClass}>{errors.regulation}</p>}
          </div>
        </div>

        {/* Row 3 - Full Width */}
        <div className="flex w-full">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Applicable From Academic Year</label>
            <input
              type="text"
              value={form.applicable_from_year}
              onChange={e => setForm({ ...form, applicable_from_year: e.target.value })}
              className={fi('applicableFromYear')}
              placeholder="2022-23"
            />
            {errors.applicableFromYear && <p className={errClass}>{errors.applicableFromYear}</p>}
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex gap-[20px] w-full">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Total Semesters</label>
            <input
              type="number"
              value={form.total_semesters}
              onChange={e => setForm({ ...form, total_semesters: e.target.value })}
              className={fi('totalSemesters')}
              placeholder="1"
            />
            {errors.totalSemesters && <p className={errClass}>{errors.totalSemesters}</p>}
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Credit System Type</label>
            <div className="relative w-full">
              <select
                value={form.credit_system_type}
                onChange={e => setForm({ ...form, credit_system_type: e.target.value })}
                className={fs('creditSystemType')}
              >
                <option value="">Select Credit System</option>
                <option value="CBSC">CBSC</option>
                <option value="non-CBSC">Non-CBSC</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none">
                <ChevronDown size={20} className="text-[#687b96]" />
              </div>
            </div>
            {errors.creditSystemType && <p className={errClass}>{errors.creditSystemType}</p>}
          </div>
        </div>

        {/* Row 5 */}
        <div className="flex gap-[20px] w-full">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Total Credits Required</label>
            <input
              type="number"
              value={form.total_credits}
              onChange={e => setForm({ ...form, total_credits: e.target.value })}
              className={fi('totalCredits')}
              placeholder="169"
            />
            {errors.totalCredits && <p className={errClass}>{errors.totalCredits}</p>}
          </div>
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Grading System</label>
            <div className="relative w-full">
              <select
                value={form.grading_system}
                onChange={e => setForm({ ...form, grading_system: e.target.value })}
                className={fs('gradingSystem')}
              >
                <option value="">Select Grading System</option>
                <option value="Percentage">Percentage</option>
                <option value="CGPA">CGPA</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none">
                <ChevronDown size={20} className="text-[#687b96]" />
              </div>
            </div>
            {errors.gradingSystem && <p className={errClass}>{errors.gradingSystem}</p>}
          </div>
        </div>

        {/* Row 6 - Full Width */}
        <div className="flex gap-[20px] w-full items-start">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={labelClass}>Selected Branches</label>
            <div className={`flex items-center min-h-[44px] flex-wrap gap-2 px-[14px] py-[8px] bg-[#f9fafb] border ${errors.branches ? 'border-red-400 bg-red-50' : 'border-[#d0d5dd]'} rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]`}>
              {form.branches.length === 0 && <span className="text-[#98a2b3] text-[15px] italic">No branches selected</span>}
              {form.branches.map(branchId => {
                const branchInfo = branchesList.find(b => b.branch_id === branchId);
                return (
                  <span key={branchId} className="flex items-center gap-1 bg-white text-[#344054] px-2 py-1 rounded-md text-sm border border-[#d0d5dd] shadow-sm">
                    {branchInfo?.branch_name || branchId}
                    <button
                      type="button"
                      className="text-[#98a2b3] hover:text-[#d92d20]"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm({ ...form, branches: form.branches.filter(id => id !== branchId) });
                      }}
                    >
                      <X size={14} />
                    </button>
                  </span>
                );
              })}
            </div>
            {errors.branches && <p className={errClass}>{errors.branches}</p>}
          </div>

          <div className="w-[300px] flex flex-col gap-[6px]">
            <label className={labelClass}>Add Branch</label>
            <div className="relative w-full">
              <select
                value=""
                onChange={e => {
                  if (e.target.value && !form.branches.includes(e.target.value)) {
                    setForm({ ...form, branches: [...form.branches, e.target.value] });
                  }
                }}
                className={fs('addBranch')}
              >
                <option value="" disabled>Select Branch</option>
                {branchesList.map(branch => (
                  <option key={branch.branch_id} value={branch.branch_id} disabled={form.branches.includes(branch.branch_id)}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none">
                <ChevronDown size={20} className="text-[#687b96]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end w-full">
        <button
          type="submit"
          className="cursor-pointer px-[24px] py-[10px] bg-[#0e1680] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
