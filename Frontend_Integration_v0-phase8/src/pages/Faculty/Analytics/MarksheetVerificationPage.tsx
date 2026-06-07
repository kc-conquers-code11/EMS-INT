import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Save } from 'lucide-react';
import { axiosInstance } from '../../../utils/axiosInstance';
import { useParams } from 'react-router-dom';

interface MarksheetRecord {
  prn: string;
  student_name: string;
  total_marks: number;
  max_marks: number;
  is_ufm: boolean;
  ufm_penalty: string | null;
}

export const MarksheetVerificationPage: React.FC = () => {
  // In a real app, mapping_id would come from useParams() or context. For now, we mock it if not present.
  const { mapping_id } = useParams<{ mapping_id: string }>();
  const activeMappingId = mapping_id || 'mock-mapping-id';

  const [records, setRecords] = useState<MarksheetRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchMarksheet = async () => {
    try {
      const response = await axiosInstance.get(`/faculty/analytics/marksheet/${activeMappingId}`);
      if (response.data.success) {
        setRecords(response.data.data || []);
        setIsLoaded(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading marksheet.');
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchMarksheet();
    return () => { isMounted = false; };
  }, [activeMappingId]);

  const handleVerifyPublish = () => {
    setIsPublishing(true);
    // Simulate API call to publish
    setTimeout(() => {
      alert("Marksheet verified and published successfully! It is now locked for students.");
      setIsPublishing(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full max-w-7xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Marksheet Verification</h1>
        <p className="text-sm text-gray-500">Review the final aggregated scores before publishing. UFM penalties are automatically applied and cannot be overridden here.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex justify-between items-center">
        <p className="text-sm text-gray-600 font-medium">Final Aggregation Grid</p>
        <button 
          onClick={handleVerifyPublish}
          disabled={isPublishing || records.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
          <CheckCircle size={18} />
          {isPublishing ? 'Publishing...' : 'Verify & Publish'}
        </button>
      </div>

      {isLoaded && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Sr.No</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student PRN</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Final Aggregated Marks</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record, idx) => {
                  return (
                    <tr key={record.prn} className={`hover:bg-gray-50 transition-colors ${record.is_ufm ? 'bg-red-50/50 hover:bg-red-50/80' : ''}`}>
                      <td className="py-3 px-6 text-sm text-gray-500 text-center font-mono">{idx + 1}</td>
                      <td className="py-3 px-6 text-sm font-semibold text-gray-900 font-mono">{record.prn}</td>
                      <td className="py-3 px-6 text-sm text-gray-700">{record.student_name}</td>
                      
                      <td className="py-3 px-6 text-center">
                        {record.is_ufm ? (
                          <span className="text-sm font-bold text-red-600 bg-red-100 px-3 py-1 rounded-md">
                            0 / {record.max_marks}
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
                            {record.total_marks} / {record.max_marks}
                          </span>
                        )}
                      </td>
                      
                      <td className="py-3 px-6 text-center">
                        {record.is_ufm ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-sm flex items-center gap-1">
                              <AlertTriangle size={12} />
                              UFM - Nullified
                            </span>
                            <span className="text-[10px] text-red-600 font-semibold">{record.ufm_penalty}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-green-600 font-semibold flex items-center justify-center gap-1">
                            <CheckCircle size={14} /> Clear
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-sm text-gray-500 text-center">No students found for this subject mapping.</td>
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
