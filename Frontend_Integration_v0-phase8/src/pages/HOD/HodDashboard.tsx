import React, { useState, useEffect } from 'react';
import { ClipboardList, AlertTriangle } from 'lucide-react';
import { axiosInstance } from '../../utils/axiosInstance';
import { HodAuditScreen } from './HodAuditScreen';

interface DepartmentSubject {
  subject_code: string;
  subject_name: string;
  mapping_id: string;
  semester_number: number;
  faculty_name: string | null;
  component: string;
  is_locked: number;
  is_approved: number;
  status: string;
}

export const HodDashboard: React.FC = () => {
  const [subjects, setSubjects] = useState<DepartmentSubject[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedAudit, setSelectedAudit] = useState<{ mapping_id: string, component: string, subject_name: string, subject_code: string } | null>(null);

  const fetchSubjects = async () => {
    try {
      const response = await axiosInstance.get('/hod/approval/subjects');
      if (response.data.success) {
        setSubjects(response.data.data || []);
        setIsLoaded(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading department subjects.');
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchSubjects();
    return () => { isMounted = false; };
  }, []);

  const handleBackToDashboard = () => {
    setSelectedAudit(null);
    fetchSubjects(); // refresh data
  };

  if (selectedAudit) {
    return (
      <div className="p-6">
        <HodAuditScreen 
          mappingId={selectedAudit.mapping_id} 
          component={selectedAudit.component}
          subjectName={selectedAudit.subject_name}
          subjectCode={selectedAudit.subject_code}
          onBack={handleBackToDashboard} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full max-w-6xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">HOD Approval Dashboard</h1>
        <p className="text-sm text-gray-500">Monitor and approve locked marks from your department faculty.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {isLoaded && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject Code</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject Name</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Component</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Faculty</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subjects.map((sub, idx) => (
                  <tr key={`${sub.mapping_id}-${sub.component}-${idx}`} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{sub.subject_code}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{sub.subject_name}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-gray-700">{sub.component}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{sub.faculty_name || 'Not Assigned'}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        sub.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        sub.status === 'Locked/Ready for Review' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {sub.status === 'Locked/Ready for Review' ? (
                        <button 
                          onClick={() => setSelectedAudit({ mapping_id: sub.mapping_id, component: sub.component, subject_name: sub.subject_name, subject_code: sub.subject_code })}
                          className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          <ClipboardList size={16} />
                          Review
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {subjects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-sm text-gray-500 text-center">No subjects found in your department.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
