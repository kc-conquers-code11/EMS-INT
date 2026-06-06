import { X, Pencil } from 'lucide-react';
import type { UserFinalization } from '../../../../../types/COE/userFinalization';

interface ViewCourseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  user: UserFinalization;
}

export const ViewCourseInfoModal = ({ isOpen, onClose, onEdit, user }: ViewCourseInfoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[110] flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-[580px] rounded-[16px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] overflow-hidden animate-in fade-in zoom-in duration-300"
        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <h2 className="text-[20px] font-semibold text-[#101828]">
            Assigned course Information
          </h2>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 text-[#667085] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <Pencil size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#667085] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Read-only fields */}
        <div className="px-8 pb-8 space-y-5">
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1.5">Faculty name</label>
            <div className="w-full h-[44px] px-3.5 flex items-center border border-[#d0d5dd] rounded-[8px] bg-[#f9fafb] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              {user.faculty_name}
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1.5">Exam Session</label>
            <div className="w-full h-[44px] px-3.5 flex items-center border border-[#d0d5dd] rounded-[8px] bg-[#f9fafb] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              {user.exam_session}
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1.5">Subject name</label>
            <div className="w-full h-[44px] px-3.5 flex items-center border border-[#d0d5dd] rounded-[8px] bg-[#f9fafb] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              {user.subject_name}
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-1.5">Role</label>
            <div className="w-full h-[44px] px-3.5 flex items-center border border-[#d0d5dd] rounded-[8px] bg-[#f9fafb] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
