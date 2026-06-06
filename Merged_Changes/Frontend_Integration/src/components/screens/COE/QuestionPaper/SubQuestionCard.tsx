import React from 'react';
import { useQuestionPaperStore } from '../../../../store/useQuestionPaperStore';
import type { SubQuestion, QuestionType } from '../../../../types/COE/questionPaper';
import { RichTextEditor } from './RichTextEditor';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SubQuestionCardProps {
  questionId: string;
  subQuestion: SubQuestion;
  questionType: QuestionType;
}

export const SubQuestionCard: React.FC<SubQuestionCardProps> = ({ questionId, subQuestion, questionType }) => {
  const { updateSubQuestion, removeSubQuestion, addOption, updateOption, removeOption } = useQuestionPaperStore();
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: subQuestion.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const isMcq = questionType === 'MCQ' || questionType === 'Multiple Correct MCQ';

  return (
    <div ref={setNodeRef} style={style} className={`flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border bg-gray-50/50 ${isDragging ? 'border-[#0e1680] shadow-lg bg-white' : 'border-gray-200'}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600 cursor-grab focus:outline-none">
            <GripVertical size={18} />
          </div>
          <div className="font-bold text-[#171822]">{subQuestion.label})</div>
          
          {/* Mobile Marks & Delete */}
          <div className="flex sm:hidden items-center gap-3 ml-auto">
             <div className="flex items-center gap-2">
               <span className="text-[11px] text-gray-500 font-medium">Marks</span>
               <input 
                 type="number" 
                 value={subQuestion.marks} 
                 onChange={(e) => updateSubQuestion(questionId, subQuestion.id, { marks: Number(e.target.value) })}
                 className="w-14 px-2 py-1 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0e1680]"
               />
             </div>
             <button 
               onClick={() => removeSubQuestion(questionId, subQuestion.id)}
               className="text-gray-400 hover:text-red-600 transition-colors"
             >
               <Trash2 size={16} />
             </button>
          </div>
        </div>
        
        <div className="w-full sm:flex-1">
          <RichTextEditor 
            value={subQuestion.text} 
            onChange={(val) => updateSubQuestion(questionId, subQuestion.id, { text: val })} 
          />
        </div>
        
        {/* Desktop Marks & Delete */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-[11px] text-gray-500 font-medium mb-1">Marks</span>
            <input 
              type="number" 
              value={subQuestion.marks} 
              onChange={(e) => updateSubQuestion(questionId, subQuestion.id, { marks: Number(e.target.value) })}
              className="w-16 px-2 py-2 text-center border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#0e1680]"
            />
          </div>
          <button 
            onClick={() => removeSubQuestion(questionId, subQuestion.id)}
            className="mt-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {isMcq && (
        <div className="pl-[42px] pr-[90px] flex flex-col gap-3">
          <div className="font-semibold text-[13px] text-gray-600 border-b border-gray-200 pb-2">Options Configuration</div>
          {subQuestion.options?.map((opt, idx) => (
            <div key={opt.id} className="flex items-center gap-3">
              {questionType === 'MCQ' ? (
                <input 
                  type="radio" 
                  name={`mcq-${subQuestion.id}`}
                  checked={opt.isCorrect}
                  onChange={(e) => updateOption(questionId, subQuestion.id, opt.id, { isCorrect: e.target.checked })}
                  className="w-4 h-4 text-[#0e1680] border-gray-300 focus:ring-[#0e1680]"
                />
              ) : (
                <input 
                  type="checkbox" 
                  checked={opt.isCorrect}
                  onChange={(e) => updateOption(questionId, subQuestion.id, opt.id, { isCorrect: e.target.checked })}
                  className="w-4 h-4 text-[#0e1680] border-gray-300 focus:ring-[#0e1680] rounded"
                />
              )}
              <input 
                type="text"
                value={opt.text}
                onChange={(e) => updateOption(questionId, subQuestion.id, opt.id, { text: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0e1680]"
              />
              <button onClick={() => removeOption(questionId, subQuestion.id, opt.id)} className="text-gray-400 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button onClick={() => addOption(questionId, subQuestion.id)} className="w-fit text-[13px] font-semibold text-[#0e1680] hover:text-[#0a1060] flex items-center gap-1 mt-1">
            <Plus size={14} /> Add Option
          </button>
        </div>
      )}
    </div>
  );
};
