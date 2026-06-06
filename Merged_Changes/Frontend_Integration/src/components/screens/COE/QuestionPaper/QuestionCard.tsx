import React, { useState } from 'react';
import { useQuestionPaperStore } from '../../../../store/useQuestionPaperStore';
import type { Question } from '../../../../types/COE/questionPaper';
import { RichTextEditor } from './RichTextEditor';
import { SubQuestionCard } from './SubQuestionCard';
import { Trash2, Copy, GripVertical, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

interface QuestionCardProps {
  question: Question;
  index: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const { updateQuestion, updateQuestionSettings, removeQuestion, duplicateQuestion, addSubQuestion, reorderSubQuestions } = useQuestionPaperStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = question.subQuestions.findIndex((sq) => sq.id === active.id);
      const newIndex = question.subQuestions.findIndex((sq) => sq.id === over.id);
      reorderSubQuestions(question.id, oldIndex, newIndex);
    }
  };

  const QUESTION_TYPES = [
    'Descriptive', 'Long Answer', 'Short Answer', 'MCQ', 'Multiple Correct MCQ',
    'Numerical', 'True/False', 'Fill in the Blank', 'Match the Following',
    'Case Study', 'Image Based', 'Diagram Based', 'Programming', 'Practical'
  ];

  return (
    <div ref={setNodeRef} style={style} className={`bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.04)] border ${isDragging ? 'border-[#0e1680]' : 'border-gray-100'} flex flex-col mb-6 animate-in slide-in-from-bottom-2 duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div {...attributes} {...listeners} className="text-gray-400 hover:text-gray-600 cursor-grab focus:outline-none">
            <GripVertical size={20} />
          </div>
          <h3 className="font-bold text-[#171822] text-[16px] sm:text-[18px] whitespace-nowrap">{question.title}</h3>
          <span className="text-[11px] sm:text-[12px] font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full whitespace-nowrap flex items-center justify-center">
            {question.marks} Marks
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button onClick={() => duplicateQuestion(question.id)} className="p-1.5 sm:p-2 text-gray-500 hover:text-[#0e1680] hover:bg-gray-100 rounded-lg transition-colors" title="Duplicate">
            <Copy size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
          <button onClick={() => removeQuestion(question.id)} className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <Trash2 size={18} className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          </button>
          <div className="w-px h-5 sm:h-6 bg-gray-200 mx-0.5 sm:mx-1"></div>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            {isExpanded ? <ChevronUp size={20} className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown size={20} className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 flex flex-col gap-6">
          {/* Settings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#f8f9fc] p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 md:col-span-1">
              <input 
                type="checkbox" 
                id={`compulsory-${question.id}`}
                checked={question.settings.isCompulsory}
                onChange={(e) => updateQuestionSettings(question.id, { isCompulsory: e.target.checked })}
                className="w-4 h-4 text-[#0e1680] rounded border-gray-300 focus:ring-[#0e1680]"
              />
              <label htmlFor={`compulsory-${question.id}`} className="text-sm font-semibold text-[#344054] cursor-pointer">Compulsory</label>
            </div>


            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rule (e.g. Solve Any 4)</label>
              <input 
                type="text" 
                placeholder="Rule..."
                value={question.settings.rule}
                onChange={(e) => updateQuestionSettings(question.id, { rule: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
              />
            </div>

            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Marks</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={question.marks}
                  onChange={(e) => {
                    updateQuestion(question.id, { marks: Number(e.target.value) });
                    updateQuestionSettings(question.id, { isAutoMarks: false });
                  }}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                />
                {!question.settings.isAutoMarks && question.subQuestions.length > 0 && (
                  <button 
                    onClick={() => {
                      updateQuestionSettings(question.id, { isAutoMarks: true });
                      updateQuestion(question.id, { marks: question.subQuestions.reduce((sum, sq) => sum + (Number(sq.marks) || 0), 0) });
                    }}
                    className="p-1.5 px-3 text-xs font-semibold text-[#0e1680] bg-[#eef0fc] rounded-lg hover:bg-[#d8dcf7] transition-colors whitespace-nowrap"
                    title="Reset to Auto-Calculate"
                  >
                    Auto
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#344054]">Question Description / Common Data</label>
            <RichTextEditor 
              value={question.description} 
              onChange={(val) => updateQuestion(question.id, { description: val })} 
            />
          </div>

          {/* Sub Questions */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <h4 className="text-[15px] font-bold text-[#171822]">Sub Questions</h4>
              <p className="text-[13px] text-gray-500">Add sub-questions like A), B), C)</p>
            </div>

            <DndContext id={`dnd-subquestions-${question.id}`} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={question.subQuestions.map(sq => sq.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-4">
                  {question.subQuestions.map((sq) => (
                    <SubQuestionCard 
                      key={sq.id} 
                      questionId={question.id} 
                      subQuestion={sq} 
                      questionType={question.settings.questionType} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button 
              onClick={() => addSubQuestion(question.id)}
              className="mt-2 w-fit flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-200 text-[#0e1680] rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-sm"
            >
              <Plus size={16} /> Add Sub Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
