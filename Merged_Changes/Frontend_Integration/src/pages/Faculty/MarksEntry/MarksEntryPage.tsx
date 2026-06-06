import React, { useState, useEffect } from 'react';
import { ChevronDown, AlertTriangle, Lock } from 'lucide-react';
import { axiosInstance } from '../../../utils/axiosInstance'; 

interface Subject {
  mapping_id: string;
  subject_id: string;
  subject_name: string;
  subject_code: string;
  max_theory: number;
  max_practical: number;
  max_tw: number;
  max_oral: number;
  semester_number: number;
}

interface ComponentOption {
  name: string;
  maxMarks: number;
}

interface RosterStudent {
  reg_subj_id: string;
  PRN: string;
  student_name: string;
  marks_obtained: string | number | null;
  max_marks: number;
  is_locked: boolean | number;
}

export const MarksEntryPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [availableComponents, setAvailableComponents] = useState<ComponentOption[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('');

  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/faculty/marks-entry/subjects');
        if (response.data?.success && isMounted) {
          setSubjects(response.data.data || []);
        }
      } catch (err) {
        if (isMounted) console.error('Error fetching subjects', err);
      }
    };
    fetchSubjects();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const subject = subjects.find(s => s.mapping_id === selectedSubjectId);
    if (subject) {
      const comps: ComponentOption[] = [];
      if (subject.max_theory > 0) comps.push({ name: 'Theory', maxMarks: subject.max_theory });
      if (subject.max_practical > 0) comps.push({ name: 'Practical', maxMarks: subject.max_practical });
      if (subject.max_tw > 0) comps.push({ name: 'Term Work', maxMarks: subject.max_tw });
      if (subject.max_oral > 0) comps.push({ name: 'Oral', maxMarks: subject.max_oral });
      
      setAvailableComponents(comps);
      setSelectedComponent(comps.length > 0 ? comps[0].name : '');
    } else {
      setAvailableComponents([]);
      setSelectedComponent('');
    }
    setStudents([]);
    setIsLoaded(false);
  }, [selectedSubjectId, subjects]);

  const handleLoadRoster = async () => {
    if (!selectedSubjectId || !selectedComponent) return;
    setError(null);
    try {
      const response = await axiosInstance.get(`/faculty/marks-entry/roster/${selectedSubjectId}/${selectedComponent}`);
      if (response.data.success) {
        const data = response.data.data || [];
        setStudents(data.map((s: any) => ({
          ...s,
          marks_obtained: s.marks_obtained !== null && s.marks_obtained !== undefined ? Number(s.marks_obtained) : ''
        })));
        
        const isCurrentlyLocked = data.length > 0 && (data[0].is_locked === 1 || data[0].is_locked === true);
        setIsLocked(isCurrentlyLocked);
        setIsLoaded(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading roster.');
    }
  };

  const handleMarksChange = (reg_subj_id: string, value: string) => {
    if (isLocked) return;

    const compConfig = availableComponents.find(c => c.name === selectedComponent);
    if (!compConfig) return;

    let parsedValue: number | '' = value === '' ? '' : Number(value);
    
    if (parsedValue !== '') {
      if (parsedValue < 0) parsedValue = 0;
      if (parsedValue > compConfig.maxMarks) parsedValue = compConfig.maxMarks;
    }

    setStudents(prev => prev.map(s => s.reg_subj_id === reg_subj_id ? { ...s, marks_obtained: parsedValue } : s));
  };

  const handleSaveDraft = async () => {
    if (isLocked) return;
    setError(null);
    setIsSaving(true);
    const compConfig = availableComponents.find(c => c.name === selectedComponent);
    
    try {
      const payload = {
        mapping_id: selectedSubjectId,
        component: selectedComponent,
        marks_data: students.map(s => ({
          reg_subj_id: s.reg_subj_id,
          marks_obtained: s.marks_obtained === '' ? null : Number(s.marks_obtained),
          max_marks: compConfig?.maxMarks || 0
        }))
      };
      await axiosInstance.post('/faculty/marks-entry/save', payload);
      alert('Draft saved successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLockMarks = async () => {
    setError(null);
    setIsLocking(true);
    try {
      const compConfig = availableComponents.find(c => c.name === selectedComponent);
      const payloadSave = {
        mapping_id: selectedSubjectId,
        component: selectedComponent,
        marks_data: students.map(s => ({
          reg_subj_id: s.reg_subj_id,
          marks_obtained: s.marks_obtained === '' ? null : Number(s.marks_obtained),
          max_marks: compConfig?.maxMarks || 0
        }))
      };
      await axiosInstance.post('/faculty/marks-entry/save', payloadSave);
      
      await axiosInstance.post('/faculty/marks-entry/lock', {
        mapping_id: selectedSubjectId,
        component: selectedComponent
      });
      
      setIsLocked(true);
      setIsLockModalOpen(false);
      alert('Marks Locked successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to lock marks.');
      setIsLockModalOpen(false);
    } finally {
      setIsLocking(false);
    }
  };

  const selectedSubject = subjects.find(s => s.mapping_id === selectedSubjectId);
  const compConfig = availableComponents.find(c => c.name === selectedComponent);

  return (
    <div className="flex flex-col w-full min-h-full pb-[100px]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-[#2c3e50] leading-[32px]">Marks Entry</h1>
        <p className="text-[14px] text-[#475467] mt-1">Select a subject and component to manage student marks.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] flex items-center gap-3 mb-6">
          <AlertTriangle size={20} />
          <span className="text-[14px] font-medium">{error}</span>
        </div>
      )}

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex flex-col gap-1.5 w-full sm:w-[280px]">
          <label className="text-[14px] font-medium text-[#344054]">Select Subject</label>
          <div className="relative">
            <select 
              className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#687b96] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <option value="">-- Choose Subject --</option>
              {subjects.map(sub => (
                <option key={sub.mapping_id} value={sub.mapping_id}>
                  {sub.subject_code} - {sub.subject_name} (Sem {sub.semester_number})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-[240px]">
          <label className="text-[14px] font-medium text-[#344054]">Select Component</label>
          <div className="relative">
            <select 
              className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#687b96] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer disabled:opacity-50"
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              disabled={availableComponents.length === 0}
            >
              {availableComponents.length === 0 && <option value="">N/A</option>}
              {availableComponents.map(comp => (
                <option key={comp.name} value={comp.name}>
                  {comp.name} (Max: {comp.maxMarks})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-3">
          {selectedSubjectId && (
            <>
              <button 
                onClick={() => window.open(`/faculty/marksheet-verification/${selectedSubjectId}`, '_blank')}
                className="px-4 py-2.5 bg-[#f2f3fd] hover:bg-[#e5e7fb] text-[#0e1680] text-[14px] font-semibold rounded-[8px] shadow-sm transition-colors cursor-pointer flex items-center gap-2 border border-[#e5e7fb]"
              >
                Verify Marksheet
              </button>
              <button 
                onClick={() => window.open(`/faculty/copo-attainment/${selectedSubjectId}`, '_blank')}
                className="px-4 py-2.5 bg-[#effbe7] hover:bg-[#d4f5c4] text-[#095512] text-[14px] font-semibold rounded-[8px] shadow-sm transition-colors cursor-pointer flex items-center gap-2 border border-[#c6f0b4]"
              >
                CO-PO Attainment
              </button>
            </>
          )}
        </div>
        <button 
          onClick={handleLoadRoster}
          disabled={!selectedSubjectId || !selectedComponent}
          className="px-6 py-2.5 bg-[#0e1680] hover:bg-blue-900 disabled:bg-[#d0d5dd] disabled:text-[#667085] text-white text-[14px] font-semibold rounded-[8px] shadow-sm transition-colors cursor-pointer"
        >
          Load Roster
        </button>
      </div>

      {/* Roster Table Section */}
      {isLoaded && (
        <div className="flex flex-col flex-1 w-full relative">
          <div className="flex flex-wrap gap-4 mb-6 justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-[18px] font-semibold text-[#101828]">Student Roster</h2>
              <p className="text-[14px] text-[#475467]">
                {selectedSubject?.subject_code} — {selectedSubject?.subject_name} · {selectedComponent}
                {compConfig ? ` (Max: ${compConfig.maxMarks})` : ''}
              </p>
            </div>
            
            {isLocked && (
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-[8px] flex items-center gap-2 font-medium border border-green-200">
                <Lock className="w-4 h-4" />
                Marks are Locked
              </div>
            )}
          </div>

          <div className="border border-[#c7c6c6] bg-white rounded-t-[4px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse whitespace-nowrap min-w-max">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#c7c6c6]">
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] border-r border-[#c7c6c6]">Sr.No</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] border-r border-[#c7c6c6]">Student PRN</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] border-r border-[#c7c6c6] min-w-[200px]">Student Name</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467]">Marks Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, idx) => (
                    <tr key={student.reg_subj_id} className={`border-b border-[#c7c6c6] hover:bg-slate-50/50 transition-colors ${isLocked ? 'opacity-90' : ''}`}>
                      <td className="px-6 py-4 text-[16px] border-r border-[#c7c6c6] text-[#475467] font-medium">{idx + 1}</td>
                      <td className="px-6 py-4 text-[16px] border-r border-[#c7c6c6] text-[#101828] font-medium">{student.PRN}</td>
                      <td className="px-6 py-4 text-[16px] border-r border-[#c7c6c6] text-[#101828] font-medium text-left">{student.student_name}</td>
                      <td className="p-0 h-[60px] min-w-[100px]">
                        <div className="flex items-center justify-center w-full h-full">
                          <input 
                            type="number"
                            value={student.marks_obtained !== null ? student.marks_obtained : ''}
                            onChange={(e) => handleMarksChange(student.reg_subj_id, e.target.value)}
                            disabled={isLocked}
                            placeholder="-"
                            className="w-24 h-10 px-3 text-center bg-transparent border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#101828] font-medium focus:outline-none focus:bg-blue-50/50 focus:border-[#0e1680] disabled:bg-gray-50 disabled:text-[#667085] transition-colors"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-[14px] text-[#667085] text-center">No students found for this component.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Bar */}
          {!isLocked && students.length > 0 && (
            <div className="fixed bottom-0 right-0 left-[280px] bg-white border-t border-[#e5e7fb] p-4 flex justify-end gap-4 shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
              <button 
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="bg-white border border-[#d0d5dd] text-[#344054] px-6 py-2.5 rounded-[8px] font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <button 
                onClick={() => setIsLockModalOpen(true)}
                className="bg-[#0e1680] text-white px-6 py-2.5 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Lock & Submit to HOD
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lock Confirmation Modal */}
      {isLockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[12px] shadow-xl w-[470px] overflow-hidden flex flex-col p-8 items-center text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h3 className="text-[20px] font-semibold text-[#101828] mb-2">Confirm Lock Marks</h3>
            <p className="text-[14px] text-[#475467] mb-8 px-4">
              Are you sure you want to lock marks for <span className="font-semibold text-[#101828]">{selectedComponent}</span>? Once locked, they will be submitted to the HOD and you will not be able to edit them.
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setIsLockModalOpen(false)}
                disabled={isLocking}
                className="flex-1 bg-white border border-[#d0d5dd] text-[#344054] py-3 rounded-[8px] font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleLockMarks}
                disabled={isLocking}
                className="flex-1 bg-[#0e1680] text-white py-3 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50"
              >
                {isLocking ? 'Locking...' : 'Yes, Lock Marks'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
