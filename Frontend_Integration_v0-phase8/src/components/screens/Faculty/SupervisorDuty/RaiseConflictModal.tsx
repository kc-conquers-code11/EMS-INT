import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, AlertCircle } from 'lucide-react';

interface RaiseConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const conflictSchema = z.object({
  reason: z
    .string()
    .min(10, "Please provide a detailed reason (minimum 10 characters)")
    .max(1000, "Reason cannot exceed 1000 characters"),
});

type ConflictFormValues = z.infer<typeof conflictSchema>;

export const RaiseConflictModal = ({ isOpen, onClose, onSubmit }: RaiseConflictModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ConflictFormValues>({
    resolver: zodResolver(conflictSchema),
    defaultValues: { reason: '' },
  });

  if (!isOpen) return null;

  const onValidSubmit = (data: ConflictFormValues) => {
    onSubmit(data.reason);
    reset(); // Reset form for next time
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-[620px] rounded-[16px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] overflow-hidden animate-in fade-in zoom-in duration-300"
        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#eaecf0]">
          <h2 className="text-[20px] font-bold text-[#101828]">
            Raise a Conflict
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-[#667085] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit(onValidSubmit)} noValidate>
          <div className="px-8 py-8 space-y-3">
            <label className="block text-[14px] font-semibold text-[#344054]">
              Reason for Conflict <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('reason')}
              placeholder="Enter reason details..."
              rows={5}
              className={`w-full p-4 border ${
                errors.reason ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
              } rounded-[8px] text-[15px] text-[#101828] bg-white focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] transition-all resize-none shadow-sm`}
            />
            {errors.reason && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.reason.message}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-[#0e1680] text-white text-[15px] font-bold rounded-[8px] hover:bg-[#0a1060] transition-colors cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
