import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { QPQuestionInput } from '../../../components/exam/QPQuestionInput';
import type { Question, SubQuestion } from '../../../components/exam/QPQuestionInput';


type PatternType = 'A' | 'B' | 'C' | '';

export const QPBuilderLayout: React.FC = () => {
  const { set_id } = useParams<{ set_id: string }>();
  const navigate = useNavigate();

  const [pattern, setPattern] = useState<PatternType>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [status, setStatus] = useState<string>('REQUESTED'); 
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);

  const isReadOnly = status === 'SUBMITTED' || status === 'APPROVED';

  useEffect(() => {
    if (set_id) {
      fetchPaperDetails();
    }
  }, [set_id]);

  const fetchPaperDetails = async () => {
    try {
      const res = await api.get(`/exam/paper-set/${set_id}`);
      const data = res.data.data;
      if (data) {
        setStatus(data.paper_status);
        if (data.rejection_reason) setRejectionReason(data.rejection_reason);
        if (data.draft_payload?.questions) {
          setQuestions(data.draft_payload.questions);
          setPattern(data.draft_payload.pattern || 'C');
        }
      }
    } catch (err) {
      console.error('Failed to fetch paper details:', err);
    }
  };

  // Helper to create empty subquestion
  const createSubQuestion = (id: string, marks: number = 0): SubQuestion => ({
    id, text: '', marks, co: '', po: '', bloom: '', module: ''
  });

  // Helper to create empty question
  const createQuestion = (id: string, marks: number = 0): Question => ({
    id, text: '', marks, co: '', po: '', bloom: '', module: '', subQuestions: []
  });

  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as PatternType;
    setPattern(selected);

    if (selected === 'A') {
      // Pattern A (IA): 20 marks total per test. Q1 (2,2,1). Q2-Q6 (5 marks each).
      const scaffolding: Question[] = [];
      
      // Q1: Mandatory 2-2-1
      const q1 = createQuestion('q-1', 5);
      q1.subQuestions = [
        createSubQuestion('q-1-a', 2),
        createSubQuestion('q-1-b', 2),
        createSubQuestion('q-1-c', 1),
      ];
      scaffolding.push(q1);

      // Q2 to Q6: 5 marks each (Attempt any 3)
      for (let i = 2; i <= 6; i++) {
        scaffolding.push(createQuestion(`q-${i}`, 5));
      }
      setQuestions(scaffolding);

    } else if (selected === 'B') {
      // Pattern B (End Sem): 6 questions, 20 marks each. Part (a) and (b) per question.
      const scaffolding: Question[] = [];
      for (let i = 1; i <= 6; i++) {
        const q = createQuestion(`q-${i}`, 20);
        q.subQuestions = [
          createSubQuestion(`q-${i}-a`, 10),
          createSubQuestion(`q-${i}-b`, 10),
        ];
        scaffolding.push(q);
      }
      setQuestions(scaffolding);

    } else if (selected === 'C') {
      // Custom: Empty canvas
      setQuestions([createQuestion(`q-${Date.now()}`)]);
    } else {
      setQuestions([]);
    }
  };

  const handleQuestionChange = (qIndex: number, field: string, value: string | number) => {
    if (isReadOnly) return;
    const updated = [...questions];
    (updated[qIndex] as any)[field] = value;
    setQuestions(updated);
  };

  const handleSubQuestionChange = (qIndex: number, sqIndex: number, field: string, value: string | number) => {
    if (isReadOnly) return;
    const updated = [...questions];
    (updated[qIndex].subQuestions[sqIndex] as any)[field] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    if (isReadOnly) return;
    setQuestions([...questions, createQuestion(`q-${Date.now()}`)]);
  };

  const addSubQuestion = (qIndex: number) => {
    if (isReadOnly) return;
    const updated = [...questions];
    updated[qIndex].subQuestions.push(createSubQuestion(`sq-${Date.now()}`));
    setQuestions(updated);
  };

  const removeQuestion = (qIndex: number) => {
    if (isReadOnly) return;
    const updated = [...questions];
    updated.splice(qIndex, 1);
    setQuestions(updated);
  };

  const removeSubQuestion = (qIndex: number, sqIndex: number) => {
    if (isReadOnly) return;
    const updated = [...questions];
    updated[qIndex].subQuestions.splice(sqIndex, 1);
    setQuestions(updated);
  };

  const validateDraft = (): boolean => {
    // Basic validation
    if (questions.length === 0) {
      alert("Please add at least one question.");
      return false;
    }

    // Pattern B Module Validation: Part A and Part B cannot share the same module
    if (pattern === 'B') {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (q.subQuestions.length >= 2) {
          const modA = q.subQuestions[0].module;
          const modB = q.subQuestions[1].module;
          if (modA && modB && modA === modB) {
            alert(`Validation Failed: Question ${i + 1} Part (a) and Part (b) cannot belong to the same Syllabus Module (${modA}).`);
            return false;
          }
        }
      }
    }

    // Require CO mapping
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.subQuestions.length === 0 && !q.co) {
         alert(`Question ${i+1} is missing a CO mapping.`);
         return false;
      }
      for (let j = 0; j < q.subQuestions.length; j++) {
         if (!q.subQuestions[j].co) {
            alert(`Question ${i+1} Part (${String.fromCharCode(97+j)}) is missing a CO mapping.`);
            return false;
         }
      }
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateDraft()) return;

    setIsSaving(true);
    try {
      await api.post(`/exam/paper-set/${set_id}/save-draft`, { 
        pattern,
        questions 
      });
      alert('Draft saved successfully!');
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLockSubmit = async () => {
    if (!validateDraft()) return;
    if (!confirm('Are you sure you want to lock and submit this Question Paper to the COE? You will not be able to edit it afterwards.')) return;

    setIsLocking(true);
    try {
      // Save draft first
      await api.post(`/exam/paper-set/${set_id}/save-draft`, { pattern, questions });
      // Lock and submit
      await api.put(`/exam/paper-set/${set_id}/lock-submit`);
      
      setStatus('SUBMITTED');
      alert('Question Paper locked and submitted successfully!');
    } catch (error: any) {
      console.error('Failed to submit:', error);
      alert('Failed to submit: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsLocking(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Question Paper Builder</h1>
              <p className="text-xs text-gray-500">Drafting for Set ID: {set_id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/faculty/paper-requests')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                {isReadOnly ? 'Back' : 'Cancel'}
              </button>
              {!isReadOnly && (
                <>
                  <button
                    onClick={handleSaveDraft}
                    disabled={isSaving || isLocking}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-medium shadow transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button
                    onClick={handleLockSubmit}
                    disabled={isSaving || isLocking}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium shadow transition-colors disabled:opacity-50"
                  >
                    {isLocking ? 'Submitting...' : 'Lock & Submit to COE'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {status === 'REJECTED' && rejectionReason && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
            <h3 className="text-red-800 font-bold text-sm">Paper Rejected by COE</h3>
            <p className="text-red-700 text-sm mt-1">{rejectionReason}</p>
          </div>
        )}
        
        {isReadOnly && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded shadow-sm">
            <p className="text-blue-800 text-sm font-semibold">
              This paper is currently in <span className="uppercase">{status}</span> status and is read-only.
            </p>
          </div>
        )}

        {/* Pattern Selection */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-200 mb-6 flex items-center justify-between">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Select Exam Pattern</label>
            <p className="text-xs text-gray-500 mb-3">Choosing a pattern will automatically generate the required question scaffolding.</p>
            <select
              className="border border-gray-300 rounded-md p-2 bg-gray-50 text-sm font-medium focus:ring-blue-500 focus:border-blue-500 min-w-[300px]"
              value={pattern}
              onChange={handlePatternChange}
              disabled={isReadOnly}
            >
              <option value="">-- Choose a Pattern --</option>
              <option value="A">Internal Assessment (Pattern A)</option>
              <option value="B">End Semester (Pattern B)</option>
              <option value="C">Custom (Pattern C)</option>
            </select>
          </div>
          {pattern === 'A' && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">40 Marks Total (20/test)</span>}
          {pattern === 'B' && <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold">120 Marks Total (Attempt 100)</span>}
        </div>

        {/* Builder Canvas */}
        {pattern && (
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                {/* Main Question Input (only show meta fields if there are no subquestions) */}
                {q.subQuestions.length === 0 ? (
                  <QPQuestionInput 
                    question={q} 
                    index={qIndex} 
                    onChange={(field, value) => handleQuestionChange(qIndex, field, value)}
                    onRemove={() => removeQuestion(qIndex)}
                    disabled={isReadOnly}
                  />
                ) : (
                  <div className="bg-white p-4 rounded border border-gray-300 shadow-sm mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm">Question {qIndex + 1}</h4>
                      {!isReadOnly && (
                        <div className="space-x-3">
                           <button 
                            type="button" onClick={() => addSubQuestion(qIndex)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                           >+ Add Part</button>
                           <button 
                            type="button" onClick={() => removeQuestion(qIndex)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                           >Remove Question</button>
                        </div>
                      )}
                    </div>
                    {/* Optional overarching question text */}
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500 min-h-[40px] mb-2 disabled:bg-gray-50 disabled:text-gray-500"
                      value={q.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      placeholder="Optional general description for Question..."
                      disabled={isReadOnly}
                    />
                  </div>
                )}

                {/* Sub Questions */}
                {q.subQuestions.map((sq, sqIndex) => (
                  <QPQuestionInput 
                    key={sq.id} 
                    question={sq} 
                    index={qIndex} 
                    subIndex={sqIndex}
                    onChange={(field, value) => handleSubQuestionChange(qIndex, sqIndex, field, value)}
                    onRemove={() => removeSubQuestion(qIndex, sqIndex)}
                    disabled={isReadOnly}
                  />
                ))}
              </div>
            ))}

            {(!isReadOnly) && (
              <div className="text-center pt-4">
                <button
                  onClick={addQuestion}
                  className="bg-white border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 font-medium py-3 px-6 rounded-lg transition-colors w-full max-w-md mx-auto"
                >
                  + Add Another Question
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QPBuilderLayout;
