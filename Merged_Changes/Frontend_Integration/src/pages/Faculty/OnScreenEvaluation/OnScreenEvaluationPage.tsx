import React, { useState } from 'react';
import { Save, Lock, AlertTriangle, CheckCircle, UploadCloud, BarChart3 } from 'lucide-react';
import { axiosInstance } from '../../../utils/axiosInstance';

interface RevaluationTask {
  reval_id: number;
  dummy_no: string;
  subject_code: string;
  subject_name: string;
  component: string;
  original_marks: number | null;
  max_marks: number;
  revised_marks: string | number;
  evaluation_remarks: string;
  is_locked: boolean | number;
}

export const OnScreenEvaluationPage: React.FC = () => {
  type TabType = 'Dashboard' | 'Answer Sheet Upload' | 'On-Screen Evaluation';
  const [activeTab, setActiveTab] = useState<TabType>('On-Screen Evaluation');
  const tabs: TabType[] = ['Dashboard', 'Answer Sheet Upload', 'On-Screen Evaluation'];

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

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchTasks();
    return () => { isMounted = false; };
  }, []);

  const handleInputChange = (reval_id: number, field: 'revised_marks' | 'evaluation_remarks', value: string) => {
    setTasks(prev => prev.map(t => {
      if (t.reval_id === reval_id && !t.is_locked) {
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
      });

      await axiosInstance.post('/faculty/revaluation/lock', { reval_ids });
      alert('Records locked and submitted successfully!');
      setIsLockModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to lock records.');
      setIsLockModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderEvaluationTab = () => (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] flex items-center gap-3 mb-6">
          <AlertTriangle size={20} />
          <span className="text-[14px] font-medium">{error}</span>
        </div>
      )}

      <div className="bg-white p-4 border border-[#e5e7fb] rounded-[8px] shadow-sm flex flex-wrap justify-between items-center gap-4 mb-6">
        <p className="text-[14px] text-[#475467] font-medium">Assigned Papers for Revaluation</p>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsSaveModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#344054] border border-[#d0d5dd] hover:bg-gray-50 text-[14px] font-semibold rounded-[8px] transition-colors cursor-pointer shadow-sm"
          >
            <Save size={18} />
            Save Draft
          </button>
          <button 
            onClick={() => setIsLockModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-[8px] shadow-sm transition-colors cursor-pointer"
          >
            <Lock size={18} />
            Lock & Submit Revised Marks
          </button>
        </div>
      </div>

      {isLoaded && (
        <div className="border border-[#c7c6c6] bg-white rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-max">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#c7c6c6]">
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#475467] text-center">Sr.No</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#475467]">Dummy No.</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#475467]">Subject & Component</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#475467] text-center">Original Marks</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#475467] text-center">Revised Marks</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#475467] w-1/3">Evaluation Remarks</th>
                  <th className="py-4 px-6 text-[14px] font-semibold text-[#475467] text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, idx) => {
                  const isTaskLocked = task.is_locked === 1 || task.is_locked === true;
                  return (
                    <tr key={task.reval_id} className={`border-b border-[#c7c6c6] hover:bg-slate-50/50 transition-colors ${isTaskLocked ? 'opacity-90' : ''}`}>
                      <td className="py-4 px-6 text-[14px] text-[#475467] text-center">{idx + 1}</td>
                      <td className="py-4 px-6 text-[14px] font-bold font-mono text-[#0e1680] bg-[#f2f3fd]/50">{task.dummy_no}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-semibold text-[#101828]">{task.subject_code} - {task.component}</span>
                          <span className="text-[12px] text-[#667085]">{task.subject_name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-[14px] font-medium text-[#475467] bg-[#f9fafb] px-3 py-1 rounded-[8px] border border-[#e4e7ec]">
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
                            disabled={isTaskLocked}
                            onChange={(e) => handleInputChange(task.reval_id, 'revised_marks', e.target.value)}
                            className="w-24 h-10 px-3 text-center bg-white border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#101828] font-semibold focus:outline-none focus:border-[#0e1680] disabled:bg-gray-50 disabled:text-[#667085] transition-shadow"
                            placeholder="-"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <textarea
                          rows={2}
                          value={task.evaluation_remarks}
                          disabled={isTaskLocked}
                          onChange={(e) => handleInputChange(task.reval_id, 'evaluation_remarks', e.target.value)}
                          className="w-full text-[14px] p-2 border border-[#d0d5dd] rounded-[8px] resize-none focus:outline-none focus:border-[#0e1680] disabled:bg-gray-50 disabled:text-[#667085] transition-shadow"
                          placeholder="Provide justification for mark changes..."
                        />
                      </td>
                      <td className="py-4 px-6 text-center">
                        {isTaskLocked ? (
                          <span className="flex items-center justify-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-800 w-fit mx-auto">
                            <CheckCircle size={12} />
                            REVAL COMPLETED
                          </span>
                        ) : (
                          <span className="text-[12px] text-[#667085] font-medium">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {tasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-[14px] text-[#667085] text-center">No assigned papers pending revaluation.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[12px] shadow-xl w-[470px] overflow-hidden flex flex-col p-8 items-center text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
              <Save className="w-10 h-10" />
            </div>
            <h3 className="text-[20px] font-semibold text-[#101828] mb-2">Save Draft?</h3>
            <p className="text-[14px] text-[#475467] mb-8 px-4">
              This will save your progress. You can return later to finalize the marks.
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setIsSaveModalOpen(false)}
                disabled={isProcessing}
                className="flex-1 bg-white border border-[#d0d5dd] text-[#344054] py-3 rounded-[8px] font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveDraft}
                disabled={isProcessing}
                className="flex-1 bg-[#0e1680] text-white py-3 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Saving...' : 'Yes, Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[12px] shadow-xl w-[470px] overflow-hidden flex flex-col p-8 items-center text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-[20px] font-semibold text-[#101828] mb-2">Lock & Submit?</h3>
            <p className="text-[14px] text-[#475467] mb-8 px-4">
              This action is irreversible. Once locked, the revised marks will be finalized and submitted to the COE.
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setIsLockModalOpen(false)}
                disabled={isProcessing}
                className="flex-1 bg-white border border-[#d0d5dd] text-[#344054] py-3 rounded-[8px] font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLockSubmit}
                disabled={isProcessing}
                className="flex-1 bg-[#0e1680] text-white py-3 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Yes, Lock & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="flex flex-col gap-6 font-['Instrument_Sans']">
      <div className="flex items-center justify-between">
        <h1 className="text-[28px] font-bold text-[#344054]">On-Screen Evaluation</h1>
      </div>

      <div className="flex gap-2 p-1 bg-[#f8f9fc] rounded-lg w-fit border border-[#eaecf0]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-[#0E1680] text-white shadow-sm'
                : 'text-[#687b96] hover:text-[#101828] hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Dashboard' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#e5e7fb] rounded-[8px] p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-[#f2f3fd] rounded-full flex items-center justify-center text-[#0e1680]">
                <BarChart3 size={24} />
              </div>
              <div>
                <div className="text-[24px] font-semibold text-[#101828]">{tasks.length}</div>
                <div className="text-[14px] text-[#475467]">Assigned Papers</div>
              </div>
            </div>
            <div className="bg-white border border-[#e5e7fb] rounded-[8px] p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700">
                <CheckCircle size={24} />
              </div>
              <div>
                <div className="text-[24px] font-semibold text-[#101828]">
                  {tasks.filter(t => t.is_locked === 1 || t.is_locked === true).length}
                </div>
                <div className="text-[14px] text-[#475467]">Completed</div>
              </div>
            </div>
            <div className="bg-white border border-[#e5e7fb] rounded-[8px] p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                <Lock size={24} />
              </div>
              <div>
                <div className="text-[24px] font-semibold text-[#101828]">
                  {tasks.filter(t => !(t.is_locked === 1 || t.is_locked === true)).length}
                </div>
                <div className="text-[14px] text-[#475467]">Pending</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('On-Screen Evaluation')}
            className="self-start bg-[#0e1680] text-white px-6 py-2.5 rounded-[8px] text-[14px] font-semibold hover:bg-blue-900 transition-colors"
          >
            Go to On-Screen Evaluation
          </button>
        </div>
      )}
      {activeTab === 'Answer Sheet Upload' && (
        <div className="bg-white border border-[#e5e7fb] rounded-[12px] p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
          <div className="w-16 h-16 bg-[#f2f3fd] rounded-full flex items-center justify-center text-[#0e1680]">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-[18px] font-semibold text-[#101828]">Answer Sheet Upload</h3>
          <p className="text-[14px] text-[#667085] text-center max-w-md">
            Upload answer sheets for on-screen evaluation. Use the On-Screen Evaluation tab to enter revised marks.
          </p>
          <button
            onClick={() => setActiveTab('On-Screen Evaluation')}
            className="bg-[#0e1680] text-white px-6 py-2.5 rounded-[8px] text-[14px] font-semibold hover:bg-blue-900 transition-colors"
          >
            Start Evaluation
          </button>
        </div>
      )}
      {activeTab === 'On-Screen Evaluation' && renderEvaluationTab()}
    </div>
  );
};
