import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Trigger Section */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-100 rounded-t-lg">
            <h2 className="text-xl font-semibold text-gray-800">Assign Question Paper Task</h2>
            <p className="text-sm text-gray-500 mt-1">Select an event, subject, assigned faculty, and deadline to trigger a request.</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Event</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedEvent}
                  onChange={e => setSelectedEvent(e.target.value)}
                >
                  <option value="">-- Select Event --</option>
                  {events.map(e => <option key={e.event_id} value={e.event_id}>{e.event_name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_code ? `[${s.subject_code}] ` : ''}{s.subject_name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mapped Faculty</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedFaculty}
                  onChange={e => setSelectedFaculty(e.target.value)}
                >
                  <option value="">-- Select Faculty --</option>
                  {faculties.map(f => <option key={f.faculty_id} value={f.faculty_id}>{f.name || `${f.first_name} ${f.last_name}`}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Set Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Set A"
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={setName}
                  onChange={e => setSetName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input 
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
              </div>
              
              <div>
                <button 
                  onClick={handleSendRequest}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-100 rounded-t-lg">
            <h2 className="text-lg font-semibold text-gray-800">Current Assigned Requests</h2>
          </div>
          <div className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Exam Event</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requests.map(req => (
                    <tr key={req.set_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{req.event_name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.subject_code ? `[${req.subject_code}] ` : ''}{req.subject_name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.faculty_name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.submission_deadline || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          req.paper_status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' : 
                          req.paper_status === 'DRAFT' ? 'bg-orange-100 text-orange-800' : 
                          req.paper_status === 'SUBMITTED_TO_COE' ? 'bg-blue-100 text-blue-800' :
                          req.paper_status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {req.paper_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        {req.paper_status === 'SUBMITTED_TO_COE' ? (
                          <button 
                            onClick={() => navigate(`/review-qp/${req.set_id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded shadow text-sm font-medium transition-colors"
                          >
                            Review
                          </button>
                        ) : (
                          <span className="text-gray-400 italic">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No requests triggered yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaperRequestTrigger;
