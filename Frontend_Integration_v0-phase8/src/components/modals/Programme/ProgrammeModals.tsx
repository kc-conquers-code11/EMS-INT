import * as z from "zod";
import { Eye, Pencil } from "lucide-react";
import { BaseModal } from "../BaseModal";
import { type Programme } from "../../../types/COE/programme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProgramme } from "../../../services/programme/programmeApiService";
import { useEffect, useState } from "react";
import { getDepartmentDropdown } from "../../../services/department/departmentApiService";

interface ViewProgrammeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Programme | null;
}

export const ViewProgrammeModal = ({ isOpen, onClose, data }: ViewProgrammeModalProps) => {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      getDepartmentDropdown().then(res => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setDepartments(list);
      }).catch(err => {
        console.error('Failed to fetch departments', err);
      });
    }
  }, [isOpen]);

  if (!data) return null;

  const getDepartmentName = (id: string) => {
    const dept = departments.find(d => d.depart_id === id);
    return dept ? dept.depart_name : id;
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Programme Details"
      subtitle="Review and manage programme information"
      icon={Eye}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-bold text-[#344054]">Programme Name</label>
          <input value={data.programme_name} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-bold text-[#344054]">Department</label>
          <input value={getDepartmentName(data.depart_id)} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Programme Code</label>
            <input value={data.programme_code || ''} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Approved Intake</label>
            <input value={data.approved_intake || 0} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

interface EditProgrammeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: Programme | null;
  onSave: () => void;
}

const editProgrammeSchema = z.object({
  institution_id: z.string().uuid("Institution ID is required"),
  depart_id: z.string().uuid("Department ID is required"),
  programme_name: z.string().min(1, "Programme name is required").max(255, "Programme name must be less than 255 characters"),
  programme_code: z.preprocess(val => val === "" ? null : val, z.string().max(20, "Programme code must be less than 20 characters").optional().nullable()),
  approved_intake: z.preprocess(val => val === "" || val === null || val === undefined || Number.isNaN(val) ? null : val, z.coerce.number().int().nonnegative().optional().nullable()),
});

type EditProgrammeFormValues = z.infer<typeof editProgrammeSchema>;

export const EditProgrammeModal = ({ isOpen, onClose, data, onSave }: EditProgrammeModalProps) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      getDepartmentDropdown().then(res => {
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setDepartments(list);
      }).catch(err => {
        console.error('Failed to fetch departments', err);
      });
    }
  }, [isOpen]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EditProgrammeFormValues>({
    resolver: zodResolver(editProgrammeSchema),
    defaultValues: {
      institution_id: data?.institution_id ?? '',
      depart_id: data?.depart_id ?? '',
      programme_name: data?.programme_name ?? '',
      programme_code: data?.programme_code ?? null,
      approved_intake: data?.approved_intake ?? null,
    }
  });

  useEffect(() => {
    if (data) {
      reset({
        institution_id: data.institution_id,
        depart_id: data.depart_id,
        programme_name: data.programme_name,
        programme_code: data.programme_code ?? null,
        approved_intake: data.approved_intake ?? null,
      });
      setSubmitError(null);
    }
  }, [data, reset]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Edit Programme Form Errors:", errors);
    }
  }, [errors]);

  if (!data) return null;

  const onSubmit = async (formData: EditProgrammeFormValues) => {
    if (!data.programm_id) {
      setSubmitError('Programme ID is missing. Cannot update.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...data,
        ...formData,
        status: data.status === true,
      };
      await updateProgramme(data.programm_id, payload as any);
      onSave();
      onClose();
    } catch (err: any) {
      console.error('Failed to update programme', err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update programme. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Programme"
      subtitle="Review and manage programme information"
      icon={Pencil}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Hidden field to retain and submit institution_id */}
        <input type="hidden" {...register('institution_id')} />

        {/* Programme Name */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-bold text-[#344054]">Programme Name</label>
          <input
            {...register('programme_name')}
            className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5"
          />
          {errors.programme_name && <span className="text-red-500 text-sm">{errors.programme_name.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Programme Code */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Programme Code</label>
            <input
              {...register('programme_code')}
              className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5"
            />
            {errors.programme_code && <span className="text-red-500 text-sm">{errors.programme_code.message}</span>}
          </div>

          {/* Approved Intake */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Approved Intake</label>
            <input
              {...register('approved_intake', { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5"
            />
            {errors.approved_intake && <span className="text-red-500 text-sm">{errors.approved_intake.message}</span>}
          </div>
        </div>
        
        {/* Submit Error */}
        {submitError && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {submitError}
          </div>
        )}

        <div className="flex justify-end pt-6 gap-4 border-t border-[#eaecf0]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer px-8 py-3 bg-white border border-[#d0d5dd] text-[#344054] rounded-lg font-bold hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer px-10 py-3 bg-[#0e1680] text-white rounded-lg font-bold hover:bg-[#0a1060] transition-all shadow-lg shadow-[#0e1680]/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
