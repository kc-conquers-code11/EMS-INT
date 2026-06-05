import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface AssignedRequest {
  set_id: string;
  exam_event?: { event_name: string };
  subject?: { subject_name: string; subject_code: string };
  submission_deadline: string;
  paper_status: string;
}

export const PaperRequestsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AssignedRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/exam/paper-set/faculty/requests');
      setRequests(res.data.data || []);
    } catch (err) {
      console.error('Error fetching paper requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDraftPaper = (id: string) => {
    navigate(`/faculty/qp-builder/${id}`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200 bg-gray-100 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">My Question Paper Tasks</h2>
          <p className="text-sm text-gray-500 mt-1">View and manage your assigned question paper requests.</p>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Exam Event</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map(req => (
                  <tr key={req.set_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{req.exam_event?.event_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.subject?.subject_code ? `[${req.subject.subject_code}] ` : ''}{req.subject?.subject_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.submission_deadline || '-'}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        req.paper_status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' : 
                        req.paper_status === 'DRAFT' ? 'bg-orange-100 text-orange-800' :
                        req.paper_status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                        req.paper_status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' :
                        req.paper_status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {req.paper_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {(req.paper_status === 'REQUESTED' || req.paper_status === 'DRAFT' || req.paper_status === 'REJECTED') ? (
                        <button 
                          onClick={() => handleDraftPaper(req.set_id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded shadow text-sm font-medium transition-colors"
                        >
                          Draft Question Paper
                        </button>
                      ) : (
                        <span className="text-gray-400 italic">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && requests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      You have no assigned requests at the moment.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Loading requests...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperRequestsDashboard;
