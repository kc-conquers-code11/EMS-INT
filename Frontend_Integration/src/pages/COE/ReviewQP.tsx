import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    <div className="bg-gray-50 min-h-screen pb-12 relative">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Review Submitted Question Paper</h1>
              <p className="text-xs text-gray-500">Set ID: {set_id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/paper-request-trigger')}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Paper Contents</h2>
          
          <div className="space-y-6">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading paper details...</div>
            ) : questions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No questions found in this paper set.</div>
            ) : questions.map((q, qIndex) => (
              <div key={q.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 mb-2">Question {qIndex + 1}</h3>
                
                {q.text && (
                  <div className="mb-4 text-sm text-gray-700 bg-white p-3 border rounded shadow-sm">
                    {q.text}
                  </div>
                )}

                {q.subQuestions.length === 0 ? (
                  <div className="bg-white p-3 rounded border text-sm grid grid-cols-5 gap-4">
                    <div><span className="font-semibold text-gray-500 block text-xs">Marks</span>{q.marks}</div>
                    <div><span className="font-semibold text-gray-500 block text-xs">CO</span>{q.co}</div>
                    <div><span className="font-semibold text-gray-500 block text-xs">PO</span>{q.po || '-'}</div>
                    <div><span className="font-semibold text-gray-500 block text-xs">Bloom's</span>{q.bloom}</div>
                    <div><span className="font-semibold text-gray-500 block text-xs">Module</span>{q.module}</div>
                  </div>
                ) : (
                  <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                    {q.subQuestions.map((sq, sqIndex) => (
                      <div key={sq.id} className="bg-white p-4 rounded border shadow-sm">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-sm text-gray-800">Part ({String.fromCharCode(97 + sqIndex)})</span>
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">{sq.marks} Marks</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{sq.text}</p>
                        
                        <div className="grid grid-cols-4 gap-4 bg-gray-50 p-2 rounded text-xs border">
                          <div><span className="font-semibold text-gray-500 block">CO</span>{sq.co}</div>
                          <div><span className="font-semibold text-gray-500 block">PO</span>{sq.po || '-'}</div>
                          <div><span className="font-semibold text-gray-500 block">Bloom's</span>{sq.bloom}</div>
                          <div><span className="font-semibold text-gray-500 block">Module</span>{sq.module}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isSubmitting}
            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-6 py-2 rounded shadow-sm text-sm font-medium transition-colors"
          >
            Reject to Faculty
          </button>
          <button
            onClick={() => handleReview('APPROVED')}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow-sm text-sm font-medium transition-colors"
          >
            {isSubmitting ? 'Processing...' : 'Approve & Publish'}
          </button>
        </div>
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reject Question Paper</h3>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this draft. The faculty will be notified to make corrections.</p>
            
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 text-sm mb-4 min-h-[100px] focus:ring-red-500 focus:border-red-500"
              placeholder="e.g., Module 2 is tested twice in Q1. Please revise to follow pattern rules."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview('REJECTED')}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors"
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
