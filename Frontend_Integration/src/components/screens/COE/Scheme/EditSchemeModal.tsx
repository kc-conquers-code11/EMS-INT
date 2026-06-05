import React, { useState } from 'react';
import { X, Pencil, ChevronDown } from 'lucide-react';
import type { Scheme } from '../../../../types/COE/scheme';

export interface EditSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  scheme?: any;
}
import { schemeAPI, branchAPI, programmeAPI } from '../../../../services/api';

interface FieldErrors { [key: string]: string; }

const parseBranches = (b: any): string[] => {
  if (Array.isArray(b)) return b;
  if (typeof b === 'string') {
    try {
      const parsed = JSON.parse(b);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const EditSchemeModal: React.FC<EditSchemeModalProps> = ({ isOpen, onClose, onSubmit, scheme }) => {
  const [form, setForm] = useState({
    scheme_name: scheme?.scheme_name || '',
    scheme_code: scheme?.scheme_code || '',
    scheme_type: scheme?.scheme_type || '',
    regulation: scheme?.regulation || '',
    scheme_year: scheme?.scheme_year?.toString() || '',
    applicable_from_year: scheme?.applicable_from_year || '',
    total_semesters: scheme?.total_semesters?.toString() || '',
    credit_system_type: scheme?.credit_system_type || '',
    total_credits: scheme?.total_credits?.toString() || '',
    grading_system: scheme?.grading_system || '',
    programm_id: scheme?.programm_id || '',
    branches: parseBranches(scheme?.branches),
    status: scheme?.status || 'active',
    description: scheme?.description || '',
  });
  
  React.useEffect(() => {
    if (scheme) {
      setForm({
        scheme_name: scheme.scheme_name || '',
        scheme_code: scheme.scheme_code || '',
        scheme_type: scheme.scheme_type || '',
        regulation: scheme.regulation || '',
        scheme_year: scheme.scheme_year?.toString() || '',
        applicable_from_year: scheme.applicable_from_year || '',
        total_semesters: scheme.total_semesters?.toString() || '',
        credit_system_type: scheme.credit_system_type || '',
        total_credits: scheme.total_credits?.toString() || '',
        grading_system: scheme.grading_system || '',
        programm_id: scheme.programm_id || '',
        branches: parseBranches(scheme.branches),
        status: scheme.status || 'active',
        description: scheme.description || '',
      });
      setErrors({});
    }
  }, [scheme]);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [programmesList, setProgrammesList] = useState<any[]>([]);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchRes, progRes] = await Promise.all([
          branchAPI.getDropdown(),
          programmeAPI.getDropdown()
        ]);
        if (branchRes.data.success) setBranchesList(branchRes.data.data ?? []);
        if (progRes.data.success) setProgrammesList(progRes.data.data ?? []);
      } catch (err) {
        console.error("Failed to fetch dropdown data", err);
      }
    };
    fetchData();
  }, []);

  if (!isOpen) return null;

  const yearRegex = /^\d{4}(-\d{2})?$/;

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    const currentYear = new Date().getFullYear();

    if (!form.programm_id) e.programm_id = 'Programme is required';
    if (!form.scheme_name.trim()) e.scheme_name = 'Scheme Name is required';
    
    if (!form.scheme_year.trim()) {
      e.scheme_year = 'Scheme Year is required';
    } else {
      const yr = Number(form.scheme_year);
      if (!Number.isInteger(yr) || yr < 1900 || yr > currentYear + 5) {
        e.scheme_year = `Year must be an integer between 1900 and ${currentYear + 5}`;
      }
    }

    if (form.total_semesters && (isNaN(Number(form.total_semesters)) || Number(form.total_semesters) <= 0)) {
      e.total_semesters = 'Total Semesters must be greater than zero';
    }
    if (form.total_credits && (isNaN(Number(form.total_credits)) || Number(form.total_credits) <= 0)) {
      e.total_credits = 'Total Credits must be greater than zero';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (scheme?.scheme_id) {
      try {
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
        await schemeAPI.update(scheme.scheme_id, payload);
        onSubmit();
        onClose();
      } catch (error) {
        console.error("Update failed", error);
      }
    }
  };

  const base = 'w-full px-[14px] py-[10px] bg-white border rounded-lg text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]';
  const fi = (f: string) => errors[f] ? `${base} border-red-400 bg-red-50 text-[#101828]` : `${base} border-[#d0d5dd] text-[#101828]`;
  const fs = (f: string) => errors[f] ? `appearance-none ${base} border-red-400 bg-red-50 text-[#101828]` : `appearance-none ${base} border-[#d0d5dd] text-[#101828]`;
  const ec = 'text-xs text-red-500 mt-1';
  const lc = 'text-[14px] font-medium text-[#344054] leading-[20px]';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px] font-sans">
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl w-[866px] flex flex-col pt-[24px] pb-[20px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-[32px] pb-[20px] border-b border-[#eaecf0]">
          <div className="flex items-center gap-[8px]">
            <h2 className="text-[18px] font-bold text-[#2c3e50] leading-[24px]">Edit Scheme details</h2>
            <Pencil size={18} className="text-[#344054]" />
          </div>
          <button type="button" onClick={onClose} className="text-[#98a2b3] hover:text-[#475467] transition-colors p-[4px]">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-[24px] px-[32px] pt-[24px]">
          {/* Row 0 */}
          <div className="flex gap-[20px]">
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Programme</label>
              <div className="relative w-full">
                <select
                  value={form.programm_id}
                  onChange={e => setForm({ ...form, programm_id: e.target.value })}
                  className={fs('programm_id')}
                >
                  <option value="" disabled>Select Programme</option>
                  {programmesList.map(p => (
                    <option key={p.programm_id} value={p.programm_id}>{p.programme_name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none">
                  <ChevronDown size={20} className="text-[#687b96]" />
                </div>
              </div>
              {errors.programm_id && <p className={ec}>{errors.programm_id}</p>}
            </div>
            {/* Empty space to keep uniform width if needed, or expand Programme. We'll leave it expanded to match other rows or add a placeholder */}
            <div className="flex-1 flex flex-col gap-[6px]"></div>
          </div>
          <div className="flex gap-[20px]">
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Scheme Name</label>
              <input type="text" value={form.scheme_name} onChange={e => setForm({ ...form, scheme_name: e.target.value })} className={fi('scheme_name')} placeholder="R-22 NEP" />
              {errors.scheme_name && <p className={ec}>{errors.scheme_name}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Scheme Code</label>
              <input type="text" value={form.scheme_code} onChange={e => setForm({ ...form, scheme_code: e.target.value })} className={fi('scheme_code')} placeholder="NEP-22" />
              {errors.scheme_code && <p className={ec}>{errors.scheme_code}</p>}
            </div>
          </div>

          <div className="flex gap-[20px]">
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Scheme Type</label>
              <div className="relative w-full">
                <select value={form.scheme_type} onChange={e => setForm({ ...form, scheme_type: e.target.value })} className={fs('scheme_type')}>
                  <option value="">Select Scheme Type</option>
                  <option value="Credit based">Credit based</option>
                  <option value="Non-Credit based">Non-Credit based</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none">
                  <ChevronDown size={20} className="text-[#687b96]" />
                </div>
              </div>
              {errors.scheme_type && <p className={ec}>{errors.scheme_type}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Regulation</label>
              <input type="text" value={form.regulation} onChange={e => setForm({ ...form, regulation: e.target.value })} className={fi('regulation')} placeholder="2022" />
              {errors.regulation && <p className={ec}>{errors.regulation}</p>}
            </div>
          </div>

          <div className="flex gap-[20px]">
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Regulation Year</label>
              <input type="text" value={form.scheme_year} onChange={e => setForm({ ...form, scheme_year: e.target.value })} className={fi('scheme_year')} placeholder="2022" />
              {errors.scheme_year && <p className={ec}>{errors.scheme_year}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Applicable From Academic Year</label>
              <input type="text" value={form.applicable_from_year} onChange={e => setForm({ ...form, applicable_from_year: e.target.value })} className={fi('applicable_from_year')} placeholder="2022-23" />
              {errors.applicable_from_year && <p className={ec}>{errors.applicable_from_year}</p>}
            </div>
          </div>

          <div className="flex gap-[20px]">
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Total Semesters</label>
              <input type="number" value={form.total_semesters} onChange={e => setForm({ ...form, total_semesters: e.target.value })} className={fi('total_semesters')} placeholder="1" />
              {errors.total_semesters && <p className={ec}>{errors.total_semesters}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Credit System Type</label>
              <div className="relative w-full">
                <select value={form.credit_system_type} onChange={e => setForm({ ...form, credit_system_type: e.target.value })} className={fs('credit_system_type')}>
                  <option value="">Select Credit System</option>
                  <option value="CBSC">CBSC</option>
                  <option value="non-CBSC">Non-CBSC</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none"><ChevronDown size={20} className="text-[#687b96]" /></div>
              </div>
              {errors.credit_system_type && <p className={ec}>{errors.credit_system_type}</p>}
            </div>
          </div>

          <div className="flex gap-[20px]">
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Total Credits Required</label>
              <input type="number" value={form.total_credits} onChange={e => setForm({ ...form, total_credits: e.target.value })} className={fi('total_credits')} placeholder="100" />
              {errors.total_credits && <p className={ec}>{errors.total_credits}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-[6px]">
              <label className={lc}>Grading System</label>
              <div className="relative w-full">
                <select value={form.grading_system} onChange={e => setForm({ ...form, grading_system: e.target.value })} className={fs('grading_system')}>
                  <option value="">Select Grading System</option>
                  <option value="Percentage">Percentage</option>
                  <option value="CGPA">CGPA</option>
                  <option value="Both">Both</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-[14px] pointer-events-none"><ChevronDown size={20} className="text-[#687b96]" /></div>
              </div>
              {errors.grading_system && <p className={ec}>{errors.grading_system}</p>}
            </div>
          </div>
        </div>

        <div className="flex gap-[20px] px-[32px] pt-[24px]">
          <div className="flex-1 flex flex-col gap-[6px]">
            <label className={lc}>Selected Branches</label>
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
            {errors.branches && <p className={ec}>{errors.branches}</p>}
          </div>

          <div className="w-[250px] flex flex-col gap-[6px]">
            <label className={lc}>Add Branch</label>
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

        <div className="flex justify-end px-[32px] pt-[32px]">
          <button type="submit" className="px-[24px] py-[10px] bg-[#0e1680] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-md">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
