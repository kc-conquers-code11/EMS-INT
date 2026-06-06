import React, { useEffect } from 'react';
import { useQuestionPaperStore } from '../../../../store/useQuestionPaperStore';
import { Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const MarksPanel: React.FC = () => {
  const { template, addQuestion } = useQuestionPaperStore();

  const targetMarks = template.paperDetails.totalMarks;
  const currentMarks = template.questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
  const isValid = currentMarks === targetMarks;

  return (
    <div className="bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.04)] border border-gray-100 flex flex-col overflow-hidden sticky top-[88px] animate-in slide-in-from-right-2 duration-300">
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex flex-col gap-2">
        <h3 className="font-bold text-[#171822] flex items-center justify-between">
          <span>Marks Summary</span>
          {isValid ? (
            <span className="text-green-600 flex items-center gap-1 text-[12px] bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
              <CheckCircle2 size={12}/> Valid
            </span>
          ) : (
             <span className="text-red-600 flex items-center gap-1 text-[12px] bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
               <AlertCircle size={12}/> Mismatch
             </span>
          )}
        </h3>
      </div>
      
      <div className="p-5 flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar">
        {template.questions.map((q) => (
          <div key={q.id} className="flex items-center justify-between text-[14px]">
            <span className="font-medium text-[#344054]">{q.title}</span>
            <span className="font-bold text-[#171822] bg-gray-100 px-2.5 py-0.5 rounded text-[13px]">{q.marks}</span>
          </div>
        ))}
        {template.questions.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-4">No questions added yet.</div>
        )}
      </div>

      <div className="p-5 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <span className="font-semibold text-[#475467] text-[14px]">Target Total</span>
           <span className="font-bold text-[#171822] text-[16px]">{targetMarks}</span>
        </div>
        <div className="flex items-center justify-between">
           <span className="font-semibold text-[#475467] text-[14px]">Calculated Total</span>
           <span className={`font-bold text-[18px] ${isValid ? 'text-green-600' : 'text-red-600'}`}>
             {currentMarks}
           </span>
        </div>
        
        <button 
          onClick={addQuestion}
          className="mt-2 w-full py-2.5 flex items-center justify-center gap-2 border border-[#d0d5dd] rounded-lg text-[#344054] font-bold hover:bg-gray-100 transition-colors bg-white shadow-sm"
        >
          <Plus size={18} /> Add Question
        </button>
      </div>
    </div>
  );
};
