// src/components/modals/AcademicYear/AcademicYearModals.tsx
import { Eye, Pencil } from "lucide-react";
import { BaseModal } from "../BaseModal";
import { type AcademicYearData } from "../../../types/COE/academic-year";


interface ViewAcademicYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AcademicYearData | null;
}

export const ViewAcademicYearModal = ({ isOpen, onClose, data }: ViewAcademicYearModalProps) => {
  if (!data) return null;
  
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Academic Year Details" 
      subtitle="Review and manage academic calendar periods"
      icon={Eye}
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-bold text-[#344054]">Academic Year</label>
          <input type="text" readOnly value={data.academic_name} className="w-full px-4 py-3.5 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Start Date</label>
            <input type="text" readOnly value={data.startDate} className="w-full px-4 py-3.5 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">End Date</label>
            <input type="text" readOnly value={data.endDate} className="w-full px-4 py-3.5 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none" />
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

interface EditAcademicYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  register: any;
  onSubmit: any;
}

export const EditAcademicYearModal = ({ isOpen, onClose, register, onSubmit }: EditAcademicYearModalProps) => {
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Academic Year" 
      subtitle="Review and manage academic calendar periods"
      icon={Pencil}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2.5">
          <label className="text-[15px] font-bold text-[#344054]">Academic Year</label>
          <input {...register("academic_name")} type="text" required className="w-full px-4 py-3.5 bg-white border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Start Date</label>
            <input {...register("start_date")} type="date" required className="w-full px-4 py-3.5 bg-white border border-[#d0d5dd] rounded-lg text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">End Date</label>
            <input {...register("end_date")} type="date" required className="w-full px-4 py-3.5 bg-white border border-[#d0d5dd] rounded-lg text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
          </div>
        </div>
        <div className="flex justify-end pt-6 border-t border-[#eaecf0]">
          <button type="submit" className="px-10 py-3 bg-[#0e1680] text-white rounded-lg font-bold hover:bg-[#0a1060] transition-all shadow-lg shadow-[#0e1680]/20">Save Changes</button>
        </div>
      </form>
    </BaseModal>
  );
};
