import React from 'react';
import { Calendar, Users, GraduationCap, ChevronRight } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="flex-1 bg-[#f2f4fd] p-6 rounded-xl flex flex-col items-center gap-2">
    <div className="text-[#0e1680]">{icon}</div>
    <span className="text-[24px] font-bold text-[#101828]">{value}</span>
    <span className="text-sm text-[#667085] text-center">{label}</span>
  </div>
);

export const AddExamDetail: React.FC<{ onNext?: () => void }> = ({ onNext }) => {
  const labelClass = "block text-sm font-medium text-[#344054] mb-1.5";
  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] placeholder-[#687b96] focus:outline-none focus:ring-2 focus:ring-[#0e1680] shadow-sm";

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="flex gap-5 w-full">
        <StatCard icon={<Calendar size={28} />} value="165" label="Total Exam Events" />
        <StatCard icon={<Users size={28} />} value="102" label="Active Exam Event" />
        <StatCard icon={<GraduationCap size={28} />} value="4" label="Total exam Conducted" />
        <StatCard icon={<GraduationCap size={28} />} value="4" label="Pending Exam Events" />
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-6">
        <div>
          <label className={labelClass}>Select Examination Type</label>
          <select className={inputClass} defaultValue="Internal Assessment 1">
            <option>Internal Assessment 1</option>
            <option>Internal Assessment 2</option>
            <option>Semester End Exam</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Academic Year</label>
            <select className={inputClass} defaultValue="2025-26">
              <option>2024-25</option>
              <option>2025-26</option>
              <option>2026-27</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Term Type</label>
            <select className={inputClass} defaultValue="ODD">
              <option>ODD</option>
              <option>EVEN</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Registration Start Date</label>
            <div className="relative">
              <input type="date" className={inputClass} defaultValue="2025-05-10" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Registration End Date</label>
            <div className="relative">
              <input type="date" className={inputClass} defaultValue="2025-05-25" />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Result Expected Date</label>
          <div className="relative">
            <input type="date" className={inputClass} defaultValue="2026-07-01" />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        <button onClick={onNext} className="flex items-center gap-2 px-8 py-2.5 bg-[#0e1680] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md">
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
