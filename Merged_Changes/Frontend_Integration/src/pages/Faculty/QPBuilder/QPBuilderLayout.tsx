import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Send, AlertTriangle } from 'lucide-react';
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
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] bg-[#f8f9fc] font-['Instrument_Sans'] pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-4 sm:px-6 pt-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/faculty/paper-requests')}
            className="p-2 bg-white border border-[#d0d5dd] rounded-lg text-[#344054] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#171822]">Question Paper Builder</h1>
            <p className="text-[14px] text-[#667085]">Drafting for Set ID: {set_id}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 w-full sm:w-auto">
          {!isReadOnly && (
            <>
              <button
                onClick={handleSaveDraft}
                disabled={isSaving || isLocking}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d0d5dd] bg-white rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={handleLockSubmit}
                disabled={isSaving || isLocking}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0e1680] text-white rounded-lg text-[14px] font-bold hover:bg-[#0a1060] transition-colors shadow-sm disabled:opacity-50"
              >
                <Send size={16} /> {isLocking ? 'Submitting...' : 'Lock & Submit'}
              </button>
            </>
          )}
          {isReadOnly && (
            <button
              onClick={() => navigate('/faculty/paper-requests')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#d0d5dd] bg-white rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm"
            >
              Back
            </button>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6">
        {status === 'REJECTED' && rejectionReason && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-[8px] flex items-start gap-3">
            <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold text-[14px]">Paper Rejected by COE</h3>
              <p className="text-red-700 text-[14px] mt-1">{rejectionReason}</p>
            </div>
          </div>
        )}
        
        {isReadOnly && (
          <div className="bg-[#f2f3fd] border border-[#e5e7fb] p-4 mb-6 rounded-[8px]">
            <p className="text-[#0e1680] text-[14px] font-semibold">
              This paper is currently in <span className="uppercase">{status}</span> status and is read-only.
            </p>
          </div>
        )}

        <div className="bg-white p-5 rounded-[8px] border border-[#eaecf0] mb-6 shadow-sm">
          <label className="block text-[14px] font-semibold text-[#101828] mb-1">Select Exam Pattern</label>
          <p className="text-[12px] text-[#667085] mb-3">Choosing a pattern will automatically generate the required question scaffolding.</p>
          <div className="flex flex-wrap items-center gap-4">
            <select
              className="border border-[#d0d5dd] rounded-[8px] p-2.5 bg-white text-[14px] font-medium focus:border-[#0e1680] focus:outline-none min-w-[300px] h-[40px]"
              value={pattern}
              onChange={handlePatternChange}
              disabled={isReadOnly}
            >
              <option value="">-- Choose a Pattern --</option>
              <option value="A">Internal Assessment (Pattern A)</option>
              <option value="B">End Semester (Pattern B)</option>
              <option value="C">Custom (Pattern C)</option>
            </select>
            {pattern === 'A' && <span className="bg-[#effbe7] text-[#095512] px-3 py-1 rounded-full text-[12px] font-bold">40 Marks Total (20/test)</span>}
            {pattern === 'B' && <span className="bg-[#f2f3fd] text-[#0e1680] px-3 py-1 rounded-full text-[12px] font-bold">120 Marks Total (Attempt 100)</span>}
          </div>
        </div>

        {pattern && (
          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="bg-white p-4 rounded-[8px] border border-[#eaecf0] shadow-sm">
                {q.subQuestions.length === 0 ? (
                  <QPQuestionInput 
                    question={q} 
                    index={qIndex} 
                    onChange={(field, value) => handleQuestionChange(qIndex, field, value)}
                    onRemove={() => removeQuestion(qIndex)}
                    disabled={isReadOnly}
                  />
                ) : (
                  <div className="bg-[#f9fafb] p-4 rounded-[8px] border border-[#eaecf0] mb-2">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-[#101828] text-[14px]">Question {qIndex + 1}</h4>
                      {!isReadOnly && (
                        <div className="space-x-3">
                           <button 
                            type="button" onClick={() => addSubQuestion(qIndex)}
                            className="text-[#0e1680] hover:text-blue-900 text-[12px] font-semibold"
                           >+ Add Part</button>
                           <button 
                            type="button" onClick={() => removeQuestion(qIndex)}
                            className="text-red-500 hover:text-red-700 text-[12px] font-semibold"
                           >Remove Question</button>
                        </div>
                      )}
                    </div>
                    <textarea
                      className="w-full border border-[#d0d5dd] rounded-[8px] p-2 text-[14px] focus:border-[#0e1680] focus:outline-none min-h-[40px] mb-2 disabled:bg-gray-50 disabled:text-[#667085]"
                      value={q.text}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      placeholder="Optional general description for Question..."
                      disabled={isReadOnly}
                    />
                  </div>
                )}

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
                  className="bg-white border-2 border-dashed border-[#d0d5dd] text-[#667085] hover:border-[#0e1680] hover:text-[#0e1680] font-semibold py-3 px-6 rounded-[8px] transition-colors w-full max-w-md mx-auto text-[14px]"
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
