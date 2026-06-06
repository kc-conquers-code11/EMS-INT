import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface ExamEvent { event_id: string; event_name: string; }
interface Subject { subject_id: string; subject_name: string; subject_code?: string; }
interface Faculty { faculty_id: string; name: string; first_name?: string; last_name?: string; }
interface RequestRecord {
  set_id: string;
  event_name?: string;
  subject_name?: string;
  subject_code?: string;
  faculty_name?: string;
  paper_status: string;
  submission_deadline: string;
}

export const PaperRequestTrigger: React.FC = () => {
  const navigate = useNavigate();
  
  // Form State
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [setName, setSetName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data Options
  const [events, setEvents] = useState<ExamEvent[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  
  // Existing Requests
  const [requests, setRequests] = useState<RequestRecord[]>([]);

  useEffect(() => {
    fetchOptions();
    fetchRequests();
  }, []);

  const fetchOptions = async () => {
    try {
      const [eventsRes, subjectsRes, facultyRes] = await Promise.allSettled([
        api.get('/exam-events'),
        api.get('/subjects'),
        api.get('/faculty-subject-mappings/lookup/faculty')
      ]);
      
      if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value.data.data || []);
      if (subjectsRes.status === 'fulfilled') setSubjects(subjectsRes.value.data.data || []);
      if (facultyRes.status === 'fulfilled') setFaculties(facultyRes.value.data.data || []);
      
    } catch (err) {
      console.error('Error fetching options', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get('/exam/paper-set/coe/requests');
      setRequests(res.data.data || []);
    } catch (err) {
      console.error('Error fetching requests', err);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedEvent || !selectedSubject || !selectedFaculty || !deadline || !setName) {
      alert('Please select all fields, provide a Set Name, and a deadline.');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/exam/paper-set/create-paper-request', {
        event_id: selectedEvent,
        subject_id: selectedSubject,
        faculty_id: selectedFaculty,
        set_name: setName,
        submission_deadline: deadline
      });
      alert('Question Paper request sent successfully!');
      // Reset form and refresh table
      setSelectedEvent('');
      setSelectedSubject('');
      setSelectedFaculty('');
      setSetName('');
      setDeadline('');
      fetchRequests();
    } catch (err: any) {
      alert('Failed to send request: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full relative font-['Instrument_Sans']">
      <div className="mb-[32px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px] mb-1">Question Paper Generation</h1>
          <p className="text-[#667085] text-[15px]">Assign question paper tasks to faculty and track submission status</p>
        </div>
      </div>

      {/* Trigger Section */}
      <div className="bg-white border border-[#eaecf0] rounded-lg overflow-hidden mb-8 shadow-sm">
        <div className="p-6 border-b border-[#eaecf0] bg-[#f9fafb]">
          <h2 className="text-[18px] font-semibold text-[#101828]">Assign Question Paper Task</h2>
          <p className="text-[14px] text-[#667085] mt-1">Select an event, subject, assigned faculty, and deadline to trigger a request.</p>
        </div>
          
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#344054]">Exam Event</label>
              <div className="relative">
                <select 
                  className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#687b96] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                  value={selectedEvent}
                  onChange={e => setSelectedEvent(e.target.value)}
                >
                  <option value="">-- Select Event --</option>
                  {events.map(e => <option key={e.event_id} value={e.event_id}>{e.event_name}</option>)}
                </select>
              </div>
            </div>
              
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#344054]">Subject</label>
              <div className="relative">
                <select 
                  className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#687b96] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_code ? `[${s.subject_code}] ` : ''}{s.subject_name}</option>)}
                </select>
              </div>
            </div>
              
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#344054]">Mapped Faculty</label>
              <div className="relative">
                <select 
                  className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#687b96] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                  value={selectedFaculty}
                  onChange={e => setSelectedFaculty(e.target.value)}
                >
                  <option value="">-- Select Faculty --</option>
                  {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.name || `${f.first_name} ${f.last_name}`}</option>)}
                </select>
              </div>
            </div>
              
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#344054]">Set Name</label>
              <input 
                type="text"
                placeholder="e.g. Set A"
                className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#687b96] bg-white focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                value={setName}
                onChange={e => setSetName(e.target.value)}
              />
            </div>
              
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#344054]">Deadline</label>
              <input 
                type="date"
                className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#687b96] bg-white focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
              
            <div>
              <button 
                onClick={handleSendRequest}
                disabled={loading}
                className="w-full h-[40px] bg-[#0e1680] hover:bg-[#0a1060] disabled:opacity-50 text-white px-4 rounded-[8px] text-[14px] font-semibold transition-colors shadow-sm"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="flex flex-col h-full bg-[#fcfcfd] w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-[16px] gap-4">
          <h2 className="text-[18px] font-semibold text-[#101828]">Current Assigned Requests</h2>
        </div>

        <div className="bg-white border border-[#eaecf0] rounded-lg overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-left">Exam Event</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-left">Subject</th>
                <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-left">Assigned To</th>
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
                  <td className="px-6 py-4 text-[14px] text-[#475467]">{req.faculty_name || '-'}</td>
                  <td className="px-6 py-4 text-[14px] text-[#475467]">{req.submission_deadline || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium ${
                      req.paper_status === 'REQUESTED' ? 'bg-orange-50 text-orange-700' : 
                      req.paper_status === 'DRAFT' ? 'bg-blue-100 text-blue-700' : 
                      req.paper_status === 'SUBMITTED_TO_COE' ? 'bg-purple-100 text-purple-700' :
                      req.paper_status === 'FINAL_LOCKED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {req.paper_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {req.paper_status === 'SUBMITTED_TO_COE' ? (
                      <button 
                        onClick={() => navigate(`/review-qp/${req.set_id}`)}
                        className="inline-flex items-center gap-1.5 bg-[#0e1680] hover:bg-[#0a1060] text-white px-4 py-2 rounded-[8px] text-[14px] font-semibold transition-colors"
                      >
                        <Eye size={16} /> Review
                      </button>
                    ) : req.paper_status === 'FINAL_LOCKED' ? (
                      <button 
                        onClick={() => window.open(`/print-qp/${req.set_id}`, '_blank')}
                        className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-[8px] text-[14px] font-semibold transition-colors"
                      >
                        Download PDF
                      </button>
                    ) : (
                      <span className="text-[#667085] italic text-[14px]">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#667085]">
                      <AlertCircle size={32} className="opacity-40" />
                      <span className="text-[14px]">No requests triggered yet.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaperRequestTrigger;
