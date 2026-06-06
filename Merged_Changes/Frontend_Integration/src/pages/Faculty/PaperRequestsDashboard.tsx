import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface AssignedRequest {
  set_id: string;
  event_name?: string;
  subject_name?: string;
  subject_code?: string;
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
    <div className="h-full relative font-['Instrument_Sans']">
      <div className="mb-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px] mb-1">My Question Paper Tasks</h1>
          <p className="text-[#667085] text-[15px]">View and manage your assigned question paper requests.</p>
        </div>
      </div>

      <div className="bg-white border border-[#eaecf0] rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-left">Exam Event</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-left">Subject</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-left">Deadline</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-left">Status</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.set_id} className="border-b border-[#eaecf0] hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-[14px] font-medium text-[#101828]">{req.event_name || '-'}</td>
                <td className="px-6 py-4 text-[14px] text-[#475467]">{req.subject_code ? `[${req.subject_code}] ` : ''}{req.subject_name || '-'}</td>
                <td className="px-6 py-4 text-[14px] text-[#475467]">{req.submission_deadline || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${
                    req.paper_status === 'REQUESTED' ? 'bg-orange-50 text-orange-700' : 
                    req.paper_status === 'DRAFT' ? 'bg-blue-100 text-blue-700' :
                    req.paper_status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                    req.paper_status === 'SUBMITTED_TO_COE' ? 'bg-purple-100 text-purple-700' :
                    req.paper_status === 'FINAL_LOCKED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {req.paper_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {(req.paper_status === 'REQUESTED' || req.paper_status === 'DRAFT' || req.paper_status === 'REJECTED') ? (
                    <button 
                      onClick={() => handleDraftPaper(req.set_id)}
                      className="bg-[#0e1680] hover:bg-[#0a1060] text-white px-4 py-2 rounded-[8px] text-[14px] font-semibold transition-colors"
                    >
                      Draft Question Paper
                    </button>
                  ) : (
                    <span className="text-[#667085] italic text-[14px]">Locked</span>
                  )}
                </td>
              </tr>
            ))}
            {!loading && requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#667085] text-[14px]">
                  You have no assigned requests at the moment.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-[#667085] text-[14px]">
                  Loading requests...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaperRequestsDashboard;
