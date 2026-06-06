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

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full max-w-6xl mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Marks Entry</h1>
        <p className="text-sm text-gray-500">Select a subject and component to manage student marks.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Select Subject</label>
            <div className="relative">
              <select 
                className="w-full h-11 pl-4 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer"
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Select Component</label>
            <div className="relative">
              <select 
                className="w-full h-11 pl-4 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm cursor-pointer"
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleLoadRoster}
            disabled={!selectedSubjectId || !selectedComponent}
            className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Load Roster
          </button>
        </div>
      </div>

      {/* Roster Table Section */}
      {isLoaded && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-900">Student Roster</h2>
              <p className="text-sm text-gray-500">Component: {selectedComponent}</p>
            </div>
            
            {isLocked && (
              <div className="flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg font-bold text-sm">
                <Lock size={16} />
                🔒 MARKS LOCKED
              </div>
            )}
          </div>

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
                    <tr key={student.reg_subj_id} className={`hover:bg-gray-50 transition-colors ${isLocked ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-4 px-6 text-sm text-gray-600">{idx + 1}</td>
                      <td className="py-4 px-6 text-sm font-medium text-gray-900">{student.PRN}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{student.student_name}</td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <input 
                            type="number"
                            value={student.marks_obtained !== null ? student.marks_obtained : ''}
                            onChange={(e) => handleMarksChange(student.reg_subj_id, e.target.value)}
                            disabled={isLocked}
                            placeholder="-"
                            className="w-24 h-10 px-3 text-center bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-200 transition-colors"
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

          {/* Action Bar */}
          {!isLocked && students.length > 0 && (
            <div className="flex justify-end items-center gap-4 mt-2">
              <button 
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              <button 
                onClick={() => setIsLockModalOpen(true)}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Lock & Submit to HOD
              </button>
            </div>
          )}
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
              <h3 className="text-lg font-bold text-gray-900">Are you absolutely sure?</h3>
              <p className="text-sm text-gray-500">
                This action is irreversible. Once locked, the marks for <span className="font-semibold text-gray-700">{selectedComponent}</span> will be submitted to the HOD and you will not be able to modify them.
              </p>
              
              <div className="flex gap-3 w-full mt-4">
                <button 
                  onClick={() => setIsLockModalOpen(false)}
                  disabled={isLocking}
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLockMarks}
                  disabled={isLocking}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isLocking ? 'Locking...' : 'Yes, Lock Marks'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
