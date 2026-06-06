import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Pencil, ChevronDown, AlertCircle } from 'lucide-react';
import { userFinalizationSchema, type UserFinalizationFormValues } from '../../../../../schemas/COE/userFinalizationSchema';
import type { UserFinalization } from '../../../../../types/COE/userFinalization';

interface EditCourseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserFinalization;
  onSubmit: () => void;
}

// Mock options — these would come from API in production
const FACULTY_OPTIONS = [
  { uid: 101, name: 'XYZ' },
  { uid: 102, name: 'PQR' },
  { uid: 103, name: 'ABC' },
  { uid: 104, name: 'abc' },
];
const ROLES = ['Evaluator', 'Paper Setter', 'Moderator', 'Scanning Operator'] as const;
const EXAM_SESSIONS = ['Summer 2026', 'Winter 2026'] as const;
const SUBJECTS = [
  'CSC101- Web Application development',
  'CSC202- Software testing',
  'CSC301- Machine Learning',
  'CSC401- Data Structures',
] as const;

export const EditCourseInfoModal = ({ isOpen, onClose, user, onSubmit }: EditCourseInfoModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFinalizationFormValues>({
    resolver: zodResolver(userFinalizationSchema),
    defaultValues: {
      uid: user.uid,
      role: user.role,
      exam_session: user.exam_session,
      subject_name: user.subject_name?.length > 3 ? user.subject_name : SUBJECTS[0],
    },
  });

  if (!isOpen) return null;

  const onValid = (_data: UserFinalizationFormValues) => {
    // In production: call API with _data
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[110] flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-[580px] rounded-[16px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] overflow-hidden animate-in fade-in zoom-in duration-300"
        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-semibold text-[#101828]">
              Assigned course Information
            </h2>
            <Pencil className="w-[16px] h-[16px] text-[#667085]" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onValid)} noValidate>
          <div className="px-8 pb-4 space-y-5">
            {/* Faculty name (uid) */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1.5">
                Faculty name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('uid', { valueAsNumber: true })}
                  className={`w-full h-[44px] px-3.5 pr-10 border ${
                    errors.uid ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                  } rounded-[8px] bg-white text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] appearance-none focus:outline-none focus:border-[#0e1680] cursor-pointer transition-all`}
                >
                  <option value={0} disabled>Select a faculty member</option>
                  {FACULTY_OPTIONS.map((f) => (
                    <option key={f.uid} value={f.uid}>{f.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#667085] pointer-events-none" />
              </div>
              {errors.uid && (
                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.uid.message}
                </span>
              )}
            </div>

            {/* Exam Session */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1.5">
                Exam Session <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('exam_session')}
                  className={`w-full h-[44px] px-3.5 pr-10 border ${
                    errors.exam_session ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                  } rounded-[8px] bg-white text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] appearance-none focus:outline-none focus:border-[#0e1680] cursor-pointer transition-all`}
                >
                  <option value="" disabled>Select an exam session</option>
                  {EXAM_SESSIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#667085] pointer-events-none" />
              </div>
              {errors.exam_session && (
                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.exam_session.message}
                </span>
              )}
            </div>

            {/* Subject name */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1.5">
                Subject name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('subject_name')}
                  className={`w-full h-[44px] px-3.5 pr-10 border ${
                    errors.subject_name ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                  } rounded-[8px] bg-white text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] appearance-none focus:outline-none focus:border-[#0e1680] cursor-pointer transition-all`}
                >
                  <option value="" disabled>Select a subject</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#667085] pointer-events-none" />
              </div>
              {errors.subject_name && (
                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.subject_name.message}
                </span>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-1.5">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  {...register('role')}
                  className={`w-full h-[44px] px-3.5 pr-10 border ${
                    errors.role ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                  } rounded-[8px] bg-white text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] appearance-none focus:outline-none focus:border-[#0e1680] cursor-pointer transition-all`}
                >
                  <option value="" disabled>Select a role</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#667085] pointer-events-none" />
              </div>
              {errors.role && (
                <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.role.message}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="px-8 pb-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#0e1680] text-white text-[16px] font-semibold rounded-[8px] hover:bg-[#0a1060] transition-colors cursor-pointer shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
