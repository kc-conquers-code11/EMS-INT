import React from 'react';
import { X } from 'lucide-react';

export interface StudentEligibility {
  enrollmentNo: string;
  studentName: string;
  registrationStatus: string;
  feesStatus: string;
  approval: string;
  eligibility: 'Eligible' | 'Not Eligible';
  reason: string;
  examRegId?: string;
  onHold?: boolean;
}

interface StudentDetailsModalProps {
  student: StudentEligibility;
  onClose: () => void;
  onSave?: () => void;
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, onClose, onSave }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-[#344054]/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[20px] w-[866px] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200 font-['Instrument_Sans']">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-[16px] font-bold text-[#2c3e50] leading-[24px]">
            Student details
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-[#667085]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#eaecf0] w-full" />

        {/* Content */}
        <div className="flex flex-col px-[50px] py-[24px] gap-7">
          
          <div className="flex flex-col gap-[15px]">
            {/* Student Name */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
                Student name
              </label>
              <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
                <div className="flex-1 px-[14px] py-[10px]">
                  <input
                    type="text"
                    value={student.studentName}
                    readOnly
                    className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
                  />
                </div>
              </div>
            </div>

            {/* Enrollment Number */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
                Enrollment number
              </label>
              <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
                <div className="flex-1 px-[14px] py-[10px]">
                  <input
                    type="text"
                    value={student.enrollmentNo}
                    readOnly
                    className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
                  />
                </div>
              </div>
            </div>

            {/* Fees status */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
                Fees status
              </label>
              <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
                <div className="flex-1 px-[14px] py-[10px]">
                  <input
                    type="text"
                    value={student.feesStatus}
                    readOnly
                    className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
                  />
                </div>
              </div>
            </div>

            {/* Registration status */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
                Registration status
              </label>
              <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
                <div className="flex-1 px-[14px] py-[10px]">
                  <input
                    type="text"
                    value={student.registrationStatus}
                    readOnly
                    className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
                  />
                </div>
              </div>
            </div>

            {/* Student eligibility */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
                Student eligibility
              </label>
              <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
                <div className="flex-1 px-[14px] py-[10px]">
                  <input
                    type="text"
                    value={student.eligibility}
                    readOnly
                    className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => {
                if (onSave) onSave();
                onClose();
              }}
              className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer"
            >
              Save changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
