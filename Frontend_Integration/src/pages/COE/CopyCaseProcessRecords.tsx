import React, { useState, useEffect } from 'react';
import { AlertTriangle, ClipboardCheck, CheckCircle } from 'lucide-react';
import { axiosInstance } from '../../utils/axiosInstance';

interface CopyCaseRecord {
  case_id: number;
  case_status: string;
  incident_description: string;
  penalty_applied: string | null;
  committee_remarks: string | null;
  report_date: string;
  prn: string;
  student_name: string;
  subject_code: string;
  subject_name: string;
  reported_by: string;
}

export const CopyCaseProcessRecords: React.FC = () => {
  const [cases, setCases] = useState<CopyCaseRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedCase, setSelectedCase] = useState<CopyCaseRecord | null>(null);
  const [penalty, setPenalty] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCases = async () => {
    try {
      const response = await axiosInstance.get('/coe/copy-case');
      if (response.data.success) {
        setCases(response.data.data || []);
        setIsLoaded(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading copy cases.');
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchCases();
    return () => { isMounted = false; };
  }, []);

  const openReviewModal = (record: CopyCaseRecord) => {
    setSelectedCase(record);
    setPenalty('');
    setRemarks('');
  };

  const handleResolveCase = async () => {
    if (!selectedCase) return;
    if (!penalty) {
      alert("Please select a penalty before resolving the case.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      await axiosInstance.put(`/coe/copy-case/${selectedCase.case_id}/resolve`, {
        penalty_applied: penalty,
        committee_remarks: remarks
      });
      alert('Case resolved successfully!');
      setSelectedCase(null);
      fetchCases(); // Refresh grid
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resolve copy case.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full max-w-7xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Copy Case Processing (UFM)</h1>
        <p className="text-sm text-gray-500">Review reported malpractice incidents, evaluate the evidence, and apply disciplinary penalties.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm">
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
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student PRN</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reported By</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status / Penalty</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cases.map((record) => {
                  const isResolved = record.case_status === 'RESOLVED';
                  return (
                    <tr key={record.case_id} className={`hover:bg-gray-50 transition-colors ${isResolved ? 'bg-gray-50/30' : ''}`}>
                      <td className="py-4 px-6 text-sm text-gray-600">{new Date(record.report_date).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">{record.prn}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{record.student_name}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-semibold">{record.subject_code}</span>
                          <span className="text-xs truncate max-w-[200px]">{record.subject_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{record.reported_by || 'System'}</td>
                      <td className="py-4 px-6 text-center">
                        {isResolved ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                              <CheckCircle size={12} />
                              RESOLVED
                            </span>
                            <span className="text-xs font-medium text-gray-600">{record.penalty_applied}</span>
                          </div>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {!isResolved ? (
                          <button 
                            onClick={() => openReviewModal(record)}
                            className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            <ClipboardCheck size={16} />
                            Review
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {cases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-sm text-gray-500 text-center">No copy cases have been reported.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── REVIEW & RESOLVE MODAL ── */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="text-orange-500" size={20} />
                Resolve Copy Case
              </h2>
              <button onClick={() => setSelectedCase(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              
              {/* Context Header */}
              <div className="flex items-center justify-between bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Student</span>
                  <span className="text-sm font-bold text-gray-900">{selectedCase.prn} - {selectedCase.student_name}</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Subject</span>
                  <span className="text-sm font-bold text-gray-900">{selectedCase.subject_code}</span>
                </div>
              </div>

              {/* Original Report */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Invigilator's Report</label>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 min-h-[80px] italic">
                  "{selectedCase.incident_description || 'No description provided.'}"
                </div>
              </div>

              {/* Action Form */}
              <div className="flex flex-col gap-4 border-t border-gray-200 pt-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Disciplinary Penalty *</label>
                  <select 
                    value={penalty}
                    onChange={(e) => setPenalty(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-gray-900 font-medium cursor-pointer"
                  >
                    <option value="" disabled>Select a penalty...</option>
                    <option value="Warning">Warning (No Marks Deduction)</option>
                    <option value="Cancel Subject">Cancel Subject</option>
                    <option value="Cancel All Subjects (Current Sem)">Cancel All Subjects (Current Sem)</option>
                    <option value="Debar 1 Semester">Debar for 1 Semester</option>
                    <option value="No Malpractice Found">No Malpractice Found</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Committee Remarks (Optional)</label>
                  <textarea 
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter official committee justification..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow resize-none"
                  />
                </div>
              </div>

            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedCase(null)}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleResolveCase}
                disabled={isProcessing || !penalty}
                className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Resolve Case'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
