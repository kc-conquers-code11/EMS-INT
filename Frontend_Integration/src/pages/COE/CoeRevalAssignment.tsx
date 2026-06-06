import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { axiosInstance } from '../../../utils/axiosInstance';

interface Faculty {
  faculty_id: string;
  faculty_name: string;
  email: string;
}

interface Application {
  application_id: string;
  student_prn: string;
  reg_subj_id: string;
  component: string;
  status: string;
  subject_code: string;
  subject_name: string;
}

export const CoeRevalAssignment: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track selected faculty for each application_id
  const [selectedFaculties, setSelectedFaculties] = useState<Record<string, string>>({});
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/coe/reval-assignment/applications');
      if (res.data?.success) {
        setApplications(res.data.data.applications || []);
        setFaculties(res.data.data.faculties || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFacultySelect = (application_id: string, faculty_id: string) => {
    setSelectedFaculties(prev => ({ ...prev, [application_id]: faculty_id }));
  };

  const handleAssign = async (application_id: string) => {
    const faculty_id = selectedFaculties[application_id];
    if (!faculty_id) return alert('Please select a faculty first.');

    const confirmAssign = window.confirm('Are you sure you want to assign this evaluator? This will generate a blind-grading entry.');
    if (!confirmAssign) return;

    setIsAssigning(application_id);
    try {
      const res = await axiosInstance.post('/coe/reval-assignment/assign', {
        application_id,
        faculty_id
      });
      if (res.data?.success) {
        alert('Evaluator dispatched successfully!');
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to dispatch evaluator');
    } finally {
      setIsAssigning(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-in fade-in duration-300 font-['Instrument_Sans']">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Revaluation Assignment</h1>
        <p className="text-sm text-gray-500">Assign faculty evaluators to paid revaluation applications. Blind-grading dummy numbers are auto-generated.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
            <Users size={32} className="text-gray-300" />
            <p>No pending revaluation applications to assign.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Student PRN</th>
                  <th className="py-4 px-6">Subject</th>
                  <th className="py-4 px-6 text-center">Component</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Evaluator Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applications.map((app) => (
                  <tr key={app.application_id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{app.student_prn}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{app.subject_code}</span>
                        <span className="text-xs text-gray-500">{app.subject_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 text-center">
                      <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md font-medium text-xs">
                        {app.component}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {app.status === 'APPLIED' ? (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md font-medium text-xs">
                          Pending Assignment
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md font-medium text-xs">
                          {app.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {app.status === 'APPLIED' ? (
                          <>
                            <select
                              className="h-9 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#0e1680] focus:border-[#0e1680] shadow-sm w-48"
                              value={selectedFaculties[app.application_id] || ''}
                              onChange={(e) => handleFacultySelect(app.application_id, e.target.value)}
                            >
                              <option value="">-- Select Faculty --</option>
                              {faculties.map(f => (
                                <option key={f.faculty_id} value={f.faculty_id}>
                                  {f.faculty_name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAssign(app.application_id)}
                              disabled={isAssigning === app.application_id || !selectedFaculties[app.application_id]}
                              className="px-3 py-1.5 bg-[#0e1680] hover:bg-[#0b0f4d] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isAssigning === app.application_id ? '...' : <><Send size={14} /> Dispatch</>}
                            </button>
                          </>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                            <CheckCircle size={16} /> Dispatched
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
