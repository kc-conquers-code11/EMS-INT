import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import type { Question } from '../../components/exam/QPQuestionInput';

export const PrintQP: React.FC = () => {
  const { set_id } = useParams<{ set_id: string }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [paperInfo, setPaperInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (set_id) {
      fetchPaperDetails();
    }
  }, [set_id]);

  const fetchPaperDetails = async () => {
    try {
      const res = await api.get(`/exam/paper-set/${set_id}`);
      const data = res.data.data;
      setPaperInfo(data);
      if (data?.draft_payload?.questions) {
        setQuestions(data.draft_payload.questions);
      }
      setTimeout(() => {
        window.print();
      }, 1000);
    } catch (err) {
      console.error('Failed to fetch paper details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fc] font-['Instrument_Sans']">
        <p className="text-[#667085] text-[14px]">Loading Paper...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#101828] p-8 max-w-4xl mx-auto font-serif min-h-screen">
      <div className="text-center border-b-2 border-[#101828] pb-4 mb-6">
        <h1 className="text-[24px] font-bold uppercase text-[#171822]">{paperInfo?.exam_event?.event_name || 'End Semester Examination'}</h1>
        <h2 className="text-[20px] mt-2 text-[#344054]">{paperInfo?.subject?.subject_name} {paperInfo?.subject?.subject_code ? `(${paperInfo.subject.subject_code})` : ''}</h2>
        <div className="flex justify-between mt-4 font-semibold text-[14px] text-[#475467]">
          <span>Set: {paperInfo?.set_name || 'A'}</span>
          <span>Max Marks: {paperInfo?.draft_payload?.pattern?.totalMarks || 100}</span>
          <span>Time: 3 Hours</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={q.id} className="mb-6">
            <div className="flex">
              <span className="font-bold mr-2">Q{qIndex + 1}.</span>
              <div className="flex-1">
                {q.text && <p className="mb-2 whitespace-pre-wrap">{q.text}</p>}
                
                {q.subQuestions.length > 0 && (
                  <ol className="list-lower-alpha pl-5 space-y-3">
                    {q.subQuestions.map((sq, sqIndex) => (
                      <li key={sqIndex}>
                        <div className="flex justify-between">
                          <span className="whitespace-pre-wrap">{sq.text}</span>
                          <span className="ml-4 font-semibold">[{sq.marks}]</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                
                {q.subQuestions.length === 0 && q.marks > 0 && (
                  <div className="text-right font-semibold mt-1">[{q.marks}]</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center text-sm text-gray-500 italic print:block hidden">
        -- End of Paper --
      </div>
      
      <div className="mt-8 text-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-[#0e1680] hover:bg-[#0a1060] text-white px-6 py-2.5 rounded-[8px] shadow-sm text-[14px] font-semibold transition-colors"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
};

export default PrintQP;
