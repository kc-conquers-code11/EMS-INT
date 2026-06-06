import React, { useState } from 'react';
import { X } from 'lucide-react';
import { axiosInstance } from '../../../../utils/axiosInstance';

interface CopyCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentPRN: string;
  studentName: string;
  seatingId: string;
  onSubmitSuccess: () => void;
}

export const CopyCaseModal: React.FC<CopyCaseModalProps> = ({
  isOpen,
  onClose,
  studentPRN,
  studentName,
  seatingId,
  onSubmitSuccess
}) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide a description of the incident.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/faculty/exam-execution/copy-case', {
        seating_id: seatingId,
        incident_description: description
      });

      if (response.data.success) {
        onSubmitSuccess();
      } else {
        setError(response.data.message || 'Failed to submit report.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while submitting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-[500px] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-[18px] font-semibold text-gray-900">Report Malpractice</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-[14px]">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-gray-700">Student PRN</label>
              <input 
                type="text" 
                value={studentPRN}
                readOnly
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-[14px] text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-gray-700">Student Name</label>
              <input 
                type="text" 
                value={studentName}
                readOnly
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-[14px] text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[14px] font-medium text-gray-700">Incident Description <span className="text-red-500">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident in detail..."
                className="w-full h-32 p-3 bg-white border border-gray-300 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#9BA3F2] focus:border-[#9BA3F2] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 rounded-lg text-[14px] font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
