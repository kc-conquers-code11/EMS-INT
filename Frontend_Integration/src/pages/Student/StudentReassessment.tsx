import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { axiosInstance } from '../../utils/axiosInstance';

interface EligibleSubject {
  subject_mapping_id: string;
  subject_name: string;
  subject_code: string;
  component: string;
  marks_obtained: number;
  max_marks: number;
  has_applied_reassessment: boolean;
}

export const StudentReassessment: React.FC = () => {
  const [subjects, setSubjects] = useState<EligibleSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingFor, setApplyingFor] = useState<string | null>(null);

  const fetchEligibleSubjects = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/student/post-exam/eligible-subjects');
      if (res.data?.success) {
        setSubjects(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load eligible subjects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEligibleSubjects();
  }, []);

  const handleApply = async (subject_mapping_id: string, component: string) => {
    const confirmApply = window.confirm(`Are you sure you want to apply for Reassessment in ${component}? A standard fee applies.`);
    if (!confirmApply) return;

    setApplyingFor(`${subject_mapping_id}_${component}`);
    try {
      const res = await axiosInstance.post('/student/post-exam/reassessment/apply', {
        subject_mapping_id,
        component
      });
      if (res.data?.success) {
        alert('Application submitted successfully!');
        fetchEligibleSubjects();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply for reassessment');
    } finally {
      setApplyingFor(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-in fade-in duration-300 font-['Instrument_Sans']">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reassessment Application</h1>
        <p className="text-sm text-gray-500">Apply for reassessment of your evaluated answer sheets.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading your eligible subjects...</div>
        ) : subjects.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
            <FileText size={32} className="text-gray-300" />
            <p>No eligible subjects found for reassessment at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Subject Code</th>
                  <th className="py-4 px-6">Subject Name</th>
                  <th className="py-4 px-6 text-center">Component</th>
                  <th className="py-4 px-6 text-center">Marks Obtained</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{sub.subject_code}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{sub.subject_name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 text-center">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-md font-medium">
                        {sub.component}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-semibold text-center">
                      {sub.marks_obtained} / {sub.max_marks}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {sub.has_applied_reassessment ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg text-sm font-medium">
                          <CheckCircle size={16} />
                          Applied
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApply(sub.subject_mapping_id, sub.component)}
                          disabled={applyingFor === `${sub.subject_mapping_id}_${sub.component}`}
                          className="px-4 py-2 bg-[#0e1680] hover:bg-[#0b0f4d] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                          {applyingFor === `${sub.subject_mapping_id}_${sub.component}` ? 'Processing...' : 'Apply & Pay'}
                        </button>
                      )}
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
