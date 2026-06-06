import React from 'react';
import { useQuestionPaperStore } from '../../../../store/useQuestionPaperStore';

export const PaperDetailsSection: React.FC = () => {
  const { template, setPaperDetails } = useQuestionPaperStore();
  const { paperDetails } = template;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.04)] border border-gray-100 flex flex-col gap-6 animate-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-[18px] font-bold text-[#171822] border-b border-gray-100 pb-3">Paper Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-[14px] font-semibold text-[#344054]">Template Name</label>
          <input 
            type="text" 
            placeholder="e.g. Mid Sem 2024 Template"
            value={paperDetails.templateName}
            onChange={(e) => setPaperDetails({ templateName: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 text-[#101828]"
          />
        </div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-[#344054]">Examination Name</label>
          <input 
            type="text" 
            value={paperDetails.examName}
            onChange={(e) => setPaperDetails({ examName: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 text-[#101828]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-[#344054]">Examination Type</label>
          <input 
            type="text" 
            value={paperDetails.examType}
            onChange={(e) => setPaperDetails({ examType: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 text-[#101828]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-[#344054]">Duration</label>
          <input 
            type="text" 
            placeholder="e.g. 3 Hours"
            value={paperDetails.duration}
            onChange={(e) => setPaperDetails({ duration: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 text-[#101828]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-semibold text-[#344054]">Total Marks</label>
          <input 
            type="number" 
            value={paperDetails.totalMarks}
            onChange={(e) => setPaperDetails({ totalMarks: Number(e.target.value) })}
            className="w-full px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 text-[#101828]"
          />
        </div>
      </div>
    </div>
  );
};
