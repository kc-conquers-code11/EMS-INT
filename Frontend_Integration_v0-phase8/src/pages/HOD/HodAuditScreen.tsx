import React, { useState, useEffect } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle, Unlock } from 'lucide-react';
import { axiosInstance } from '../../utils/axiosInstance';

interface RosterStudent {
  reg_subj_id: string;
  PRN: string;
  student_name: string;
  marks_obtained: string | number | null;
  max_marks: number;
  is_locked: boolean | number;
  is_approved: boolean | number;
}

interface HodAuditScreenProps {
  mappingId: string;
  component: string;
  subjectName: string;
  subjectCode: string;
  onBack: () => void;
}

export const HodAuditScreen: React.FC<HodAuditScreenProps> = ({ 
  mappingId, 
  component, 
  subjectName, 
  subjectCode, 
  onBack 
}) => {
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRoster = async () => {
      try {
        const response = await axiosInstance.get(`/hod/approval/audit/${mappingId}/${component}`);
        if (response.data.success && isMounted) {
          const data = response.data.data || [];
          setStudents(data.map((s: any) => ({
            ...s,
            marks_obtained: s.marks_obtained !== null && s.marks_obtained !== undefined ? Number(s.marks_obtained) : ''
          })));
          setIsLoaded(true);
        }
      } catch (err: any) {
        if (isMounted) setError(err.response?.data?.message || 'Error loading audit roster.');
      }
    };
    fetchRoster();
    return () => { isMounted = false; };
  }, [mappingId, component]);

  const handleApprove = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      await axiosInstance.post('/hod/approval/approve', { mapping_id: mappingId, component });
      alert('Marks Approved successfully!');
      setIsApproveModalOpen(false);
      onBack();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve marks.');
      setIsApproveModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlock = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      await axiosInstance.post('/hod/approval/unlock', { mapping_id: mappingId, component });
      alert('Marks Unlocked and returned to Faculty!');
      setIsUnlockModalOpen(false);
      onBack();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to unlock marks.');
      setIsUnlockModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-900">Audit Marks</h1>
          <p className="text-sm text-gray-500">{subjectCode} - {subjectName} ({component})</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex justify-between items-center">
        <p className="text-sm text-gray-600">Review the marks below. These marks are currently locked by the faculty.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsUnlockModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Unlock size={18} />
            Unlock & Return
          </button>
          <button 
            onClick={() => setIsApproveModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <CheckCircle size={18} />
            Approve & Publish
          </button>
        </div>
      </div>

      {/* Roster Table Section */}
      {isLoaded && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Sr.No</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student PRN</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, idx) => (
                  <tr key={student.reg_subj_id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 text-sm text-gray-600">{idx + 1}</td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{student.PRN}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{student.student_name}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center">
                        <input 
                          type="text"
                          value={student.marks_obtained !== null ? student.marks_obtained : '-'}
                          disabled
                          className="w-24 h-10 px-3 text-center bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-sm text-gray-500 text-center">No students found for this component.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── APPROVE CONFIRMATION MODAL ── */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Approve & Publish?</h3>
              <p className="text-sm text-gray-500">
                This will finalize the marks for <span className="font-semibold text-gray-700">{component}</span>. Are you sure you want to proceed?
              </p>
              
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setIsApproveModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Yes, Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── UNLOCK CONFIRMATION MODAL ── */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                <Unlock size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Unlock Marks?</h3>
              <p className="text-sm text-gray-500">
                This will unlock the marks for <span className="font-semibold text-gray-700">{component}</span> and return them to the faculty for corrections.
              </p>
              
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setIsUnlockModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUnlock}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Yes, Unlock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
