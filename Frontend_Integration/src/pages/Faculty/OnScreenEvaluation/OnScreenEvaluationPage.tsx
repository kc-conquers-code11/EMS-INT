import React, { useState, useEffect } from 'react';
import { Save, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { axiosInstance } from '../../../utils/axiosInstance';

interface RevaluationTask {
  reval_id: number;
  dummy_no: string;
  subject_code: string;
  subject_name: string;
  component: string;
  original_marks: number | null;
  max_marks: number;
  revised_marks: string | number; // Use string for input state
  evaluation_remarks: string;
  is_locked: boolean | number;
}

export const OnScreenEvaluationPage: React.FC = () => {
  const [tasks, setTasks] = useState<RevaluationTask[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get('/faculty/revaluation/assigned');
      if (response.data.success) {
        const data = response.data.data || [];
        setTasks(data.map((t: any) => ({
          ...t,
          revised_marks: t.revised_marks !== null && t.revised_marks !== undefined ? t.revised_marks : '',
          evaluation_remarks: t.evaluation_remarks || ''
        })));
        setIsLoaded(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching assigned revaluations.');
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchTasks();
    return () => { isMounted = false; };
  }, []);

  const handleInputChange = (reval_id: number, field: 'revised_marks' | 'evaluation_remarks', value: string) => {
    setTasks(prev => prev.map(t => {
      if (t.reval_id === reval_id && !t.is_locked) {
        // Validation for marks
        if (field === 'revised_marks' && value !== '') {
          const numValue = Number(value);
          if (numValue < 0 || numValue > t.max_marks) return t;
        }
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const handleSaveDraft = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      const evaluations = tasks
        .filter(t => !t.is_locked)
        .map(t => ({
          reval_id: t.reval_id,
          revised_marks: t.revised_marks,
          evaluation_remarks: t.evaluation_remarks
        }));

      await axiosInstance.post('/faculty/revaluation/save', { evaluations });
      alert('Draft saved successfully!');
      setIsSaveModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save draft.');
      setIsSaveModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLockSubmit = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      // Find tasks that are not locked and have revised marks filled
      const reval_ids = tasks
        .filter(t => !t.is_locked && t.revised_marks !== '')
        .map(t => t.reval_id);

      if (reval_ids.length === 0) {
        alert('No eligible records to lock. Ensure revised marks are entered.');
        setIsLockModalOpen(false);
        setIsProcessing(false);
        return;
      }

      await axiosInstance.post('/faculty/revaluation/save', { 
        evaluations: tasks.filter(t => !t.is_locked).map(t => ({
          reval_id: t.reval_id, revised_marks: t.revised_marks, evaluation_remarks: t.evaluation_remarks
        }))
      }); // Auto save before locking

      await axiosInstance.post('/faculty/revaluation/lock', { reval_ids });
      alert('Records locked and submitted successfully!');
      setIsLockModalOpen(false);
      fetchTasks(); // Refresh to get the locked status
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to lock records.');
      setIsLockModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full max-w-7xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">On-Screen Evaluation</h1>
        <p className="text-sm text-gray-500">Review assigned papers, securely enter revised marks, and submit your evaluation report. All PRNs are masked for blind-grading compliance.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex justify-between items-center">
        <p className="text-sm text-gray-600 font-medium">Assigned Papers for Revaluation</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button 
            onClick={() => setIsLockModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Lock size={18} />
            Lock & Submit Revised Marks
          </button>
        </div>
      </div>

      {isLoaded && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Sr.No</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Dummy No.</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject & Component</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Original Marks</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Revised Marks</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/3">Evaluation Remarks</th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task, idx) => {
                  const isLocked = task.is_locked === 1 || task.is_locked === true;
                  return (
                    <tr key={task.reval_id} className={`hover:bg-gray-50 transition-colors ${isLocked ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-4 px-6 text-sm text-gray-500 text-center">{idx + 1}</td>
                      <td className="py-4 px-6 text-sm font-bold font-mono text-indigo-700 bg-indigo-50/50">{task.dummy_no}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{task.subject_code} - {task.component}</span>
                          <span className="text-xs text-gray-500">{task.subject_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                          {task.original_marks !== null ? `${task.original_marks} / ${task.max_marks}` : '-'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <input 
                            type="number"
                            min="0"
                            max={task.max_marks}
                            value={task.revised_marks}
                            disabled={isLocked}
                            onChange={(e) => handleInputChange(task.reval_id, 'revised_marks', e.target.value)}
                            className="w-24 h-10 px-3 text-center bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition-shadow"
                            placeholder="-"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <textarea
                          rows={2}
                          value={task.evaluation_remarks}
                          disabled={isLocked}
                          onChange={(e) => handleInputChange(task.reval_id, 'evaluation_remarks', e.target.value)}
                          className="w-full text-sm p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500 transition-shadow"
                          placeholder="Provide justification for mark changes..."
                        />
                      </td>
                      <td className="py-4 px-6 text-center">
                        {isLocked ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800">
                              <CheckCircle size={12} />
                              REVAL COMPLETED
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-sm text-gray-500 text-center">No assigned papers pending revaluation.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SAVE CONFIRMATION MODAL ── */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                <Save size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Save Draft?</h3>
              <p className="text-sm text-gray-500">
                This will save your progress. You can return later to finalize the marks.
              </p>
              
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setIsSaveModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveDraft}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : 'Yes, Save Draft'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LOCK CONFIRMATION MODAL ── */}
      {isLockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-[400px] overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Lock & Submit?</h3>
              <p className="text-sm text-gray-500">
                This action is <span className="font-bold text-red-600">irreversible</span>. Once locked, the revised marks will be finalized and submitted to the COE. You will not be able to edit them.
              </p>
              
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setIsLockModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLockSubmit}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Yes, Lock & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
