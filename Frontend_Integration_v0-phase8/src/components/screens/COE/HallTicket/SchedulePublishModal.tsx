import React from 'react';
import { X, Calendar, Clock } from 'lucide-react';

interface SchedulePublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (date: string, time: string) => void;
}

export const SchedulePublishModal: React.FC<SchedulePublishModalProps> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#02053d]/40 backdrop-blur-[8px]"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[16px] w-[510px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] animate-in fade-in zoom-in duration-300 font-['Instrument_Sans']">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-[#eaecf0]">
          <h2 className="text-[20px] font-semibold text-[#101828]">
            Schedule Hall Ticket Publish
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#667085] hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Select Date */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-medium text-[#344054]">
              Select date
            </label>
            <div className="relative">
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[44px] px-3.5 border border-[#d0d5dd] rounded-[8px] bg-white text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] appearance-none"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085] pointer-events-none" />
            </div>
          </div>

          {/* Select Time */}
          <div className="space-y-1.5">
            <label className="block text-[14px] font-medium text-[#344054]">
              Select Time
            </label>
            <div className="relative">
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-[44px] px-3.5 border border-[#d0d5dd] rounded-[8px] bg-white text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] appearance-none"
              />
              <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex justify-center">
          <button 
            onClick={() => onSave(date, time)}
            disabled={!date || !time}
            className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-6 py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};
