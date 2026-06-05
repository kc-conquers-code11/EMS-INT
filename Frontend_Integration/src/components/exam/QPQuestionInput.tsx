import React from 'react';

// Using dummy interfaces for now to prevent typescript errors
export interface SubQuestion {
  id: string;
  text: string;
  marks: number;
  co: string;
  po: string;
  bloom: string;
  module: string;
}

export interface Question {
  id: string;
  text: string;
  marks: number;
  co: string;
  po: string;
  bloom: string;
  module: string;
  subQuestions: SubQuestion[];
}

interface Props {
  question: Question | SubQuestion;
  index: number;
  subIndex?: number;
  onChange: (field: string, value: string | number) => void;
  onRemove: () => void;
  disabled?: boolean;
}

const bloomsOptions = [
  'L1 (Remember)',
  'L2 (Understand)',
  'L3 (Apply)',
  'L4 (Analyze)',
  'L5 (Evaluate)',
  'L6 (Create)'
];

const moduleOptions = [
  'Module 1',
  'Module 2',
  'Module 3',
  'Module 4',
  'Module 5',
  'Module 6'
];

export const QPQuestionInput: React.FC<Props> = ({ question, index, subIndex, onChange, onRemove, disabled }) => {
  const isSubQuestion = subIndex !== undefined;
  const title = isSubQuestion ? `Part (${String.fromCharCode(97 + subIndex)})` : `Question ${index + 1}`;

  return (
    <div className={`border rounded-md p-4 bg-white ${isSubQuestion ? 'ml-8 mt-3 border-gray-200 shadow-sm' : 'border-gray-300 shadow'}`}>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
        {!disabled && (
          <button 
            type="button" 
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 text-xs font-medium"
          >
            Remove
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Question Text *</label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[60px] disabled:bg-gray-50 disabled:text-gray-500"
            value={question.text}
            onChange={(e) => onChange('text', e.target.value)}
            placeholder="Type your question here..."
            disabled={disabled}
          />
        </div>

        {/* Dense Grid for Meta Fields */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Marks *</label>
            <input
              type="number"
              min="1"
              className="w-full border border-gray-300 rounded-md p-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              value={question.marks || ''}
              onChange={(e) => onChange('marks', parseInt(e.target.value, 10))}
              disabled={disabled}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Course Outcome (CO) *</label>
            <select
              className="w-full border border-gray-300 rounded-md p-1.5 text-sm bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              value={question.co}
              onChange={(e) => onChange('co', e.target.value)}
              disabled={disabled}
            >
              <option value="">Select CO</option>
              <option value="CO1">CO1</option>
              <option value="CO2">CO2</option>
              <option value="CO3">CO3</option>
              <option value="CO4">CO4</option>
              <option value="CO5">CO5</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Program Outcome (PO)</label>
            <select
              className="w-full border border-gray-300 rounded-md p-1.5 text-sm bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              value={question.po}
              onChange={(e) => onChange('po', e.target.value)}
              disabled={disabled}
            >
              <option value="">Select PO</option>
              <option value="PO1">PO1</option>
              <option value="PO2">PO2</option>
              <option value="PO3">PO3</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bloom's Level *</label>
            <select
              className="w-full border border-gray-300 rounded-md p-1.5 text-sm bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              value={question.bloom}
              onChange={(e) => onChange('bloom', e.target.value)}
              disabled={disabled}
            >
              <option value="">Select Level</option>
              {bloomsOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Syllabus Module *</label>
            <select
              className="w-full border border-gray-300 rounded-md p-1.5 text-sm bg-white focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
              value={question.module}
              onChange={(e) => onChange('module', e.target.value)}
              disabled={disabled}
            >
              <option value="">Select Module</option>
              {moduleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
