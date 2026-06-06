import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Check, X } from 'lucide-react';
import api from '../../services/api';
import type { Question } from '../../components/exam/QPQuestionInput';

export const ReviewQP: React.FC = () => {
  const { set_id } = useParams<{ set_id: string }>();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
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
      if (data?.draft_payload?.questions) {
        setQuestions(data.draft_payload.questions);
      }
    } catch (err) {
      console.error('Failed to fetch paper details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (status === 'REJECTED' && !rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/exam/paper-set/${set_id}/review`, {
        status,
        rejection_reason: status === 'REJECTED' ? rejectionReason : null
      });
      
      alert(`Question Paper has been ${status.toLowerCase()} successfully.`);
      navigate('/paper-request-trigger');
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)] bg-[#f8f9fc] font-['Instrument_Sans'] pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-4 md:px-[36px] pt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/paper-request-trigger')}
            className="p-2 bg-white border border-[#d0d5dd] rounded-lg text-[#344054] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[24px] font-bold text-[#171822]">Review Submitted Question Paper</h1>
            <p className="text-[14px] text-[#667085]">Set ID: {set_id}</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-[36px] max-w-5xl">
        <div className="bg-white p-6 rounded-[8px] border border-[#eaecf0] shadow-sm">
          <h2 className="text-[18px] font-semibold text-[#101828] mb-4 border-b border-[#eaecf0] pb-3">Paper Contents</h2>
          
          <div className="space-y-6">
            {loading ? (
              <div className="p-8 text-center text-[#667085] text-[14px]">Loading paper details...</div>
            ) : questions.length === 0 ? (
              <div className="p-8 text-center text-[#667085] text-[14px]">No questions found in this paper set.</div>
            ) : questions.map((q, qIndex) => (
              <div key={q.id} className="border border-[#eaecf0] rounded-[8px] p-4 bg-[#f9fafb]">
                <h3 className="font-semibold text-[#101828] mb-2 text-[14px]">Question {qIndex + 1}</h3>
                
                {q.text && (
                  <div className="mb-4 text-[14px] text-[#475467] bg-white p-3 border border-[#eaecf0] rounded-[8px]">
                    {q.text}
                  </div>
                )}

                {q.subQuestions.length === 0 ? (
                  <div className="bg-white p-3 rounded-[8px] border border-[#eaecf0] text-[14px] grid grid-cols-5 gap-4">
                    <div><span className="font-semibold text-[#667085] block text-[12px]">Marks</span>{q.marks}</div>
                    <div><span className="font-semibold text-[#667085] block text-[12px]">CO</span>{q.co}</div>
                    <div><span className="font-semibold text-[#667085] block text-[12px]">PO</span>{q.po || '-'}</div>
                    <div><span className="font-semibold text-[#667085] block text-[12px]">Bloom's</span>{q.bloom}</div>
                    <div><span className="font-semibold text-[#667085] block text-[12px]">Module</span>{q.module}</div>
                  </div>
                ) : (
                  <div className="space-y-3 pl-4 border-l-2 border-[#0e1680]/30">
                    {q.subQuestions.map((sq, sqIndex) => (
                      <div key={sq.id} className="bg-white p-4 rounded-[8px] border border-[#eaecf0] shadow-sm">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-[14px] text-[#101828]">Part ({String.fromCharCode(97 + sqIndex)})</span>
                          <span className="text-[12px] font-bold text-[#0e1680] bg-[#f2f3fd] px-2 py-1 rounded-[8px]">{sq.marks} Marks</span>
                        </div>
                        <p className="text-[14px] text-[#475467] mb-3">{sq.text}</p>
                        
                        <div className="grid grid-cols-4 gap-4 bg-[#f9fafb] p-2 rounded-[8px] text-[12px] border border-[#eaecf0]">
                          <div><span className="font-semibold text-[#667085] block">CO</span>{sq.co}</div>
                          <div><span className="font-semibold text-[#667085] block">PO</span>{sq.po || '-'}</div>
                          <div><span className="font-semibold text-[#667085] block">Bloom's</span>{sq.bloom}</div>
                          <div><span className="font-semibold text-[#667085] block">Module</span>{sq.module}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-4">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 px-6 py-2.5 rounded-[8px] text-[14px] font-semibold transition-colors disabled:opacity-50"
          >
            <X size={16} /> Reject to Faculty
          </button>
          <button
            onClick={() => handleReview('APPROVED')}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#0e1680] hover:bg-[#0a1060] text-white px-6 py-2.5 rounded-[8px] text-[14px] font-semibold transition-colors disabled:opacity-50"
          >
            <Check size={16} /> {isSubmitting ? 'Processing...' : 'Approve & Publish'}
          </button>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-[12px] shadow-xl w-full max-w-md">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-[18px] font-semibold text-[#101828] mb-2 text-center">Reject Question Paper</h3>
            <p className="text-[14px] text-[#667085] mb-4 text-center">Please provide a reason for rejecting this draft. The faculty will be notified to make corrections.</p>
            
            <textarea
              className="w-full border border-[#d0d5dd] rounded-[8px] p-3 text-[14px] mb-4 min-h-[100px] focus:border-[#0e1680] focus:outline-none"
              placeholder="e.g., Module 2 is tested twice in Q1. Please revise to follow pattern rules."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2.5 border border-[#d0d5dd] text-[#344054] rounded-[8px] text-[14px] font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview('REJECTED')}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-[8px] text-[14px] font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewQP;
