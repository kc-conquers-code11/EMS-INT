import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FeedbackModal } from '../../../components/modals/FeedbackModal';
import { userFinalizationSchema, type UserFinalizationFormValues } from '../../../schemas/COE/userFinalizationSchema';

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

export const AddUserFinalization = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFinalizationFormValues>({
    resolver: zodResolver(userFinalizationSchema),
  });

  const onValid = (data: UserFinalizationFormValues) => {
    console.log('Submitted', data);
    // In production: call API with data
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/user-finalization');
  };

  return (
    <div className="flex flex-col w-full max-w-[1053px]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Title */}
      <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px] mb-10">
        User Finalization
      </h1>

      <form onSubmit={handleSubmit(onValid)} noValidate className="flex flex-col gap-[32px] w-full">
        <div className="flex flex-col gap-[16px] w-full">
          
          {/* Faculty name (uid) */}
          <div className="flex flex-col gap-[6px] w-full">
            <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
              Faculty name
            </label>
            <div className="relative">
              <select
                {...register('uid', { valueAsNumber: true })}
                className={`w-full bg-white h-[44px] px-[14px] py-[10px] pr-10 border ${
                  errors.uid ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                } rounded-[8px] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] appearance-none focus:outline-none focus:border-[#0e1680] cursor-pointer transition-all`}
                defaultValue={0}
              >
                <option value={0} disabled>Select a faculty member</option>
                {FACULTY_OPTIONS.map((f) => (
                  <option key={f.uid} value={f.uid}>{f.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#667085] pointer-events-none" />
            </div>
            {errors.uid && (
              <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.uid.message}
              </span>
            )}
          </div>

          {/* Role */}
          <div className="flex flex-col gap-[6px] w-full">
            <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
              Role
            </label>
            <div className="relative">
              <select
                {...register('role')}
                className={`w-full bg-white h-[44px] px-[14px] py-[10px] pr-10 border ${
                  errors.role ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                } rounded-[8px] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] appearance-none focus:outline-none focus:border-[#0e1680] cursor-pointer transition-all`}
                defaultValue=""
              >
                <option value="" disabled>Select a role</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#667085] pointer-events-none" />
            </div>
            {errors.role && (
              <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.role.message}
              </span>
            )}
          </div>

          {/* Exam Session */}
          <div className="flex flex-col gap-[6px] w-full">
            <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
              Exam session
            </label>
            <div className="relative">
              <select
                {...register('exam_session')}
                className={`w-full bg-white h-[44px] px-[14px] py-[10px] pr-10 border ${
                  errors.exam_session ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                } rounded-[8px] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] appearance-none focus:outline-none focus:border-[#0e1680] cursor-pointer transition-all`}
                defaultValue=""
              >
                <option value="" disabled>Select an exam session</option>
                {EXAM_SESSIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#667085] pointer-events-none" />
            </div>
            {errors.exam_session && (
              <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.exam_session.message}
              </span>
            )}
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-[6px] w-full">
            <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
              Subject
            </label>
            <div className="relative">
              <select
                {...register('subject_name')}
                className={`w-full bg-white h-[44px] px-[14px] py-[10px] pr-10 border ${
                  errors.subject_name ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                } rounded-[8px] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] appearance-none focus:outline-none focus:border-[#0e1680] cursor-pointer transition-all`}
                defaultValue=""
              >
                <option value="" disabled>Select a subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-[14px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#667085] pointer-events-none" />
            </div>
            {errors.subject_name && (
              <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.subject_name.message}
              </span>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <div className="flex justify-end w-full h-[44px]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-[8px] px-[18px] py-[10px] bg-[#0e1680] text-white text-[16px] font-semibold rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0a1060] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </form>

      <FeedbackModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        type="success"
        title="Role assigned successfully !!"
        backLabel="Back"
      />
    </div>
  );
};
