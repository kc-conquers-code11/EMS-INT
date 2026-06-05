import { useState, useRef, useEffect } from 'react';
import { UploadCloud, ChevronDown, Check, AlertTriangle, Lock, Search, Filter, Download, Unlock, Edit2, CheckSquare, X, Eye } from 'lucide-react';
import type { MarksEntrySchema } from '../../../types/Faculty/marksEntry';

type ExamType = 'Internal Assessment' | 'End Sem Exam';
type MarkStatus = string | 'EXTRA' | 'NA';
type FormState = 'initial' | 'draft_saved' | 'view' | 'locked';

interface StudentMark {
  id: number;
  srNo: number;
  seatNo: string;
  name: string;
  marks: Record<string, MarkStatus>;
}

interface DashboardSubject {
  id: number;
  code: string;
  name: string;
  status: 'Pending' | 'Locked' | 'Draft' | 'Submitted';
  assignedDate: string;
}

const END_SEM_STRUCTURE = [
  { id: 'Q1', parts: [{ id: 'Q1a', label: 'a', max: 2 }, { id: 'Q1b', label: 'b', max: 2 }, { id: 'Q1c', label: 'c', max: 1 }, { id: 'Q1d', label: 'd', max: 1 }] },
  { id: 'Q2', parts: [{ id: 'Q2a', label: 'a', max: 5 }, { id: 'Q2b', label: 'b', max: 5 }] },
  { id: 'Q3', parts: [{ id: 'Q3a', label: 'a', max: 5 }, { id: 'Q3b', label: 'b', max: 5 }] },
  { id: 'Q4', parts: [{ id: 'Q4a', label: 'a', max: 5 }, { id: 'Q4b', label: 'b', max: 5 }] },
  { id: 'Q5', parts: [{ id: 'Q5a', label: 'a', max: 5 }, { id: 'Q5b', label: 'b', max: 5 }] },
  { id: 'Q6', parts: [{ id: 'Q6a', label: 'a', max: 5 }, { id: 'Q6b', label: 'b', max: 5 }] },
];

const IA_STRUCTURE = [
  { id: 'Q1', parts: [{ id: 'Q1', label: '', max: 5 }] },
  { id: 'Q2', parts: [{ id: 'Q2', label: '', max: 5 }] },
  { id: 'Q3', parts: [{ id: 'Q3', label: '', max: 5 }] },
  { id: 'Q4', parts: [{ id: 'Q4', label: '', max: 5 }] },
  { id: 'Q5', parts: [{ id: 'Q5', label: '', max: 5 }] },
];

const mockStudents: StudentMark[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  srNo: i + 1,
  seatNo: `A${393435 + i}`,
  name: `Student Name ${i + 1}`,
  marks: {},
}));

const mockDashboard: DashboardSubject[] = [
  { id: 1, code: 'CO1919', name: 'Operating System', status: 'Pending', assignedDate: '10/10/2023' },
  { id: 2, code: 'CO1920', name: 'Data Structures', status: 'Locked', assignedDate: '11/10/2023' },
  { id: 3, code: 'CO1921', name: 'Algorithms', status: 'Draft', assignedDate: '12/10/2023' },
];

const MarkCell = ({ 
  student, 
  qKey, 
  maxMark,
  formState, 
  handleMarkChange 
}: { 
  student: StudentMark, 
  qKey: string, 
  maxMark: number,
  formState: FormState, 
  handleMarkChange: (id: number, q: string, value: MarkStatus) => void 
}) => {
  const val = student.marks[qKey];
  const [isHovered, setIsHovered] = useState(false);

  if (formState === 'view' || formState === 'locked') {
     if (val === 'EXTRA') return <div className="flex items-center justify-center w-full h-full text-gray-400"><CheckSquare className="w-5 h-5" /></div>;
     if (val === 'NA') return <div className="flex items-center justify-center w-full h-full text-gray-400"><X className="w-5 h-5" /></div>;
     return <div className="flex items-center justify-center w-full h-full text-[16px] font-medium">{val || '-'}</div>;
  }

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {val === 'EXTRA' ? (
         <div className="flex items-center justify-center w-full h-full text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleMarkChange(student.id, qKey, '')}>
           <CheckSquare className="w-5 h-5" />
         </div>
      ) : val === 'NA' ? (
         <div className="flex items-center justify-center w-full h-full text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleMarkChange(student.id, qKey, '')}>
           <X className="w-5 h-5" />
         </div>
      ) : (
        <input
          type="text"
          className="w-full h-full text-center text-[16px] font-medium focus:outline-none focus:bg-blue-50/50 bg-transparent pr-12"
          value={val || ''}
          onChange={(e) => {
            const v = e.target.value;
            if (/^\d*$/.test(v)) {
              if (v === '' || parseInt(v, 10) <= maxMark) {
                handleMarkChange(student.id, qKey, v);
              }
            }
          }}
        />
      )}
      
      {(!val || val === '') && (
        <div className={`absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity pointer-events-auto`}>
          <button 
            onClick={() => { handleMarkChange(student.id, qKey, 'EXTRA'); setIsHovered(false); }} 
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-[#0e1680]" title="Mark as Extra"
          >
            <CheckSquare className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { handleMarkChange(student.id, qKey, 'NA'); setIsHovered(false); }} 
            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600" title="Mark as Not Attempted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export const MarksEntryPage = () => {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Enter Marks'>('Enter Marks');
  const [courseTitle, setCourseTitle] = useState('Operating System');
  const [courseCode, setCourseCode] = useState('CO1919');
  const [examType, setExamType] = useState<ExamType>('Internal Assessment');
  const [students, setStudents] = useState<StudentMark[]>(mockStudents);
  const [formState, setFormState] = useState<FormState>('initial');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);
  const [showDraftSavedModal, setShowDraftSavedModal] = useState(false);
  const [showConfirmLockModal, setShowConfirmLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [unlockRequestSubject, setUnlockRequestSubject] = useState<DashboardSubject | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const structure = examType === 'Internal Assessment' ? IA_STRUCTURE : END_SEM_STRUCTURE;

  const hasErrors = students.some(s => {
     const firstQKey = structure[0].parts[0].id;
     return !s.marks[firstQKey] || s.marks[firstQKey] === '';
  });

  useEffect(() => {
    setStudents(prev => prev.map(s => ({ ...s, marks: {} })));
  }, [examType]);

  const handleMarkChange = (id: number, q: string, value: MarkStatus) => {
    if (formState === 'view' || formState === 'locked') return;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, marks: { ...s.marks, [q]: value } } : s
      )
    );
  };

  const calculateTotal = (marks: Record<string, MarkStatus>) => {
    return Object.values(marks).reduce((acc, curr) => {
      if (curr === 'EXTRA' || curr === 'NA') return acc;
      return acc + (Number(curr) || 0);
    }, 0);
  };

  const handleSaveDraft = () => {
    setFormState('draft_saved');
    setShowDraftSavedModal(true);
  };

  const handleSubmit = () => {
    setFormState('view');
  };
  
  const handleLock = () => {
     setFormState('locked');
     setShowConfirmLockModal(false);
  };

  const handleViewSubject = (subject: DashboardSubject) => {
    setActiveTab('Enter Marks');
    if (subject.status === 'Locked') {
      setFormState('locked');
    } else if (subject.status === 'Submitted') {
      setFormState('view');
    } else if (subject.status === 'Draft') {
      setFormState('draft_saved');
    } else {
      setFormState('initial');
    }
  };

  const handleUploadSubmit = () => {
    setShowUploadModal(false);
    setUploadedFile(null);
    setShowUploadSuccessModal(true);
  };

  const handleUnlockRequest = () => {
    console.log('Requesting unlock for:', unlockRequestSubject);
    setShowUnlockModal(false);
    setUnlockRequestSubject(null);
  };

  return (
    <div className="flex flex-col w-full min-h-full pb-[100px]" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-[#2c3e50] leading-[32px]">Marks Entry</h1>
      </div>

      <div className="bg-[#f2f3fd] border border-[#e5e7fb] inline-flex p-1.5 rounded-[10px] mb-8 w-fit">
        <button
          onClick={() => setActiveTab('Dashboard')}
          className={`px-4 py-2.5 rounded-[6px] text-[16px] font-semibold transition-colors ${
            activeTab === 'Dashboard' ? 'bg-[#0e1680] text-white shadow-sm' : 'text-[#687b96] hover:bg-white hover:text-[#0e1680]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('Enter Marks')}
          className={`px-4 py-2.5 rounded-[6px] text-[16px] font-semibold transition-colors ${
            activeTab === 'Enter Marks' ? 'bg-[#0e1680] text-white shadow-sm' : 'text-[#687b96] hover:bg-white hover:text-[#0e1680]'
          }`}
        >
          Enter Marks
        </button>
      </div>

      {activeTab === 'Dashboard' && (
        <div className="flex flex-col gap-6 w-full">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white border border-[#e5e7fb] rounded-[8px] p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0e1680]">
                <span className="font-bold text-xl">📚</span>
              </div>
              <div>
                <div className="text-[24px] font-semibold text-[#101828]">165</div>
                <div className="text-[14px] text-[#475467]">Total Subjects Assigned</div>
              </div>
            </div>
            <div className="bg-white border border-[#e5e7fb] rounded-[8px] p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700">
                <span className="font-bold text-xl">🔒</span>
              </div>
              <div>
                <div className="text-[24px] font-semibold text-[#101828]">102</div>
                <div className="text-[14px] text-[#475467]">Locked Marks</div>
              </div>
            </div>
            <div className="bg-white border border-[#e5e7fb] rounded-[8px] p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                <span className="font-bold text-xl">⏳</span>
              </div>
              <div>
                <div className="text-[24px] font-semibold text-[#101828]">4</div>
                <div className="text-[14px] text-[#475467]">Pending Subject</div>
              </div>
            </div>
          </div>
                    
          <div className="flex flex-col gap-4">
             <div className="flex items-center justify-between w-full">
               <div className="flex items-center gap-3">
                 <div className="relative w-[211px]">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#687b96]" />
                   <input 
                     type="text" 
                     placeholder="Search" 
                     className="w-full pl-9 pr-3 py-2 bg-white border border-[#d0d5dd] rounded-[8px] text-[14px] focus:outline-none focus:border-[#0e1680]"
                   />
                 </div>
                 <div className="relative">
                   <select className="pl-4 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#344054] font-semibold appearance-none focus:outline-none focus:border-[#0e1680]">
                     <option>Semester</option>
                   </select>
                   <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#344054]" />
                 </div>
                 <div className="relative">
                   <select className="pl-4 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#344054] font-semibold appearance-none focus:outline-none focus:border-[#0e1680]">
                     <option>Year</option>
                   </select>
                   <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#344054]" />
                 </div>
                 <div className="relative">
                   <select className="pl-4 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#344054] font-semibold appearance-none focus:outline-none focus:border-[#0e1680]">
                     <option>Status</option>
                   </select>
                   <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#344054]" />
                 </div>
                 <div className="relative">
                   <select className="pl-4 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#344054] font-semibold appearance-none focus:outline-none focus:border-[#0e1680]">
                     <option>Exam Type</option>
                   </select>
                   <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#344054]" />
                 </div>
               </div>

               <button 
                  onClick={() => {}}
                  className="bg-[#0e1680] text-white px-4 py-2.5 rounded-[8px] text-[14px] font-semibold flex items-center gap-2 hover:bg-blue-900 transition-colors shadow-sm"
               >
                  Download Template For Bulk Entry
                  <Download className="w-4 h-4 ml-1" />
               </button>
             </div>
          </div>

          <div className="border border-[#c7c6c6] bg-white rounded-[8px] overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead className="bg-[#f9fafb] border-b border-[#c7c6c6]">
                  <tr>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467]">Subject Code</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467]">Subject Name</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467]">Assigned Date</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467]">Status</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-center">Action</th>
                    <th className="px-6 py-4 text-[14px] font-semibold text-[#475467] text-center">Bulk upload</th>
                  </tr>
                </thead>
                <tbody>
                   {mockDashboard.map((sub) => (
                      <tr key={sub.id} className="border-b border-[#c7c6c6] hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 text-[14px] text-[#101828] font-medium">{sub.code}</td>
                         <td className="px-6 py-4 text-[14px] text-[#475467]">{sub.name}</td>
                         <td className="px-6 py-4 text-[14px] text-[#475467]">{sub.assignedDate}</td>
                         <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium flex items-center gap-1.5 w-fit ${
                               sub.status === 'Locked' ? 'bg-green-100 text-green-700' : 
                               sub.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 
                               sub.status === 'Draft' ? 'bg-orange-100 text-orange-700' : 'bg-orange-50 text-orange-600'
                            }`}>
                               {sub.status === 'Locked' && <Lock className="w-3 h-3" />}
                               {sub.status}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3 text-[#687b96]">
                               {sub.status === 'Pending' ? (
                                  <button 
                                     onClick={() => handleViewSubject(sub)}
                                     className="bg-[#0e1680] text-white px-4 py-2 rounded-[6px] text-[14px] font-medium hover:bg-blue-900"
                                  >
                                     Enter Marks
                                  </button>
                               ) : (
                                  <>
                                    <button onClick={() => handleViewSubject(sub)} className="hover:text-[#0e1680] transition-colors" title="View">
                                       <Eye className="w-4 h-4" />
                                    </button>
                                    
                                    {sub.status === 'Locked' && (
                                      <button 
                                        onClick={() => {
                                          setUnlockRequestSubject(sub);
                                          setShowUnlockModal(true);
                                        }} 
                                        className="hover:text-[#0e1680] transition-colors" 
                                        title="Request Unlock"
                                      >
                                        <Unlock className="w-4 h-4" />
                                      </button>
                                    )}
                                    
                                    <button 
                                      onClick={() => sub.status !== 'Locked' && handleViewSubject(sub)} 
                                      className={`transition-colors ${sub.status === 'Locked' ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#0e1680]'}`}
                                      title={sub.status === 'Locked' ? 'Locked' : 'Edit'}
                                    >
                                       <Edit2 className="w-4 h-4" />
                                    </button>
                                  </>
                               )}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-center">
                            <button 
                               onClick={() => setShowUploadModal(true)}
                               disabled={sub.status === 'Locked'}
                               className={`px-4 py-2 rounded-[6px] text-[14px] font-medium transition-colors ${
                                  sub.status === 'Locked' 
                                    ? 'bg-[#e5e7fb] text-[#3b44b2] opacity-50 cursor-not-allowed'
                                    : 'bg-[#0e1680] text-white hover:bg-blue-900'
                               }`}
                            >
                               Bulk upload
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'Enter Marks' && (
        <div className="flex flex-col flex-1 w-full relative">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-col gap-1.5 w-[240px]">
              <label className="text-[14px] font-medium text-[#344054]">Select Course Title</label>
              <div className="relative">
                <select 
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  disabled={formState === 'view' || formState === 'locked'}
                  className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#687b96] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer disabled:opacity-50"
                >
                  <option value="Operating System">Operating System</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="Algorithms">Algorithms</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-[240px]">
              <label className="text-[14px] font-medium text-[#344054]">Select Course Code</label>
              <div className="relative">
                <select 
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  disabled={formState === 'view' || formState === 'locked'}
                  className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#687b96] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer disabled:opacity-50"
                >
                  <option value="CO1919">CO1919</option>
                  <option value="CO1920">CO1920</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-[240px]">
              <label className="text-[14px] font-medium text-[#344054]">Select Exam Type</label>
              <div className="relative">
                <select
                  disabled={formState === 'view' || formState === 'locked'}
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as ExamType)}
                  className="w-full h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#687b96] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer disabled:opacity-50"
                >
                  <option value="Internal Assessment">Internal Assessment</option>
                  <option value="End Sem Exam">End Sem Exam</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-8 mb-8 justify-between items-center">
             <div className="flex gap-8">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#344054]" />
                  <span className="text-[14px] font-medium text-[#344054]">Extra Question Attempted</span>
                </div>
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-[#344054]" />
                  <span className="text-[14px] font-medium text-[#344054]">Not Attempted Question</span>
                </div>
             </div>
             
             {formState === 'locked' && (
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-[8px] flex items-center gap-2 font-medium">
                   <Lock className="w-4 h-4" />
                   Marks are Locked
                </div>
             )}
          </div>

          <div className={`border border-[#c7c6c6] bg-white rounded-t-[4px] overflow-hidden ${formState === 'view' || formState === 'locked' ? 'opacity-90' : ''}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse whitespace-nowrap min-w-max">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#c7c6c6]">
                    <th rowSpan={examType === 'End Sem Exam' ? 2 : 1} className="px-6 py-4 text-[16px] font-semibold border-r border-[#c7c6c6]">Srno.</th>
                    <th rowSpan={examType === 'End Sem Exam' ? 2 : 1} className="px-6 py-4 text-[16px] font-semibold border-r border-[#c7c6c6]">Seat No</th>
                    <th rowSpan={examType === 'End Sem Exam' ? 2 : 1} className="px-6 py-4 text-[16px] font-semibold border-r border-[#c7c6c6] min-w-[200px]">Student Name</th>
                    
                    {structure.map(q => (
                       <th key={q.id} colSpan={q.parts.length} className="py-2 border-r border-[#c7c6c6]">
                          {examType === 'Internal Assessment' ? (
                             <div className="flex flex-col items-center gap-1.5">
                               <span className="text-[16px] font-semibold">{q.id}</span>
                               <div className="bg-[#effbe7] text-[#095512] text-[14px] font-medium px-2 py-0.5 rounded-[8px] mix-blend-multiply">
                                 {q.parts[0].max}
                               </div>
                             </div>
                          ) : (
                             <span className="text-[16px] font-semibold">{q.id}</span>
                          )}
                       </th>
                    ))}
                    <th rowSpan={examType === 'End Sem Exam' ? 2 : 1} className="px-6 py-4 text-[16px] font-semibold border-r border-[#c7c6c6]">Marks</th>
                  </tr>
                  
                  {examType === 'End Sem Exam' ? (
                     <tr className="bg-[#f9fafb] border-b border-[#c7c6c6]">
                       {structure.map(q => (
                          q.parts.map(p => (
                             <th key={p.id} className="py-2 px-2 border-r border-[#c7c6c6] min-w-[60px]">
                               <div className="flex flex-col items-center gap-1">
                                 <span className="text-[14px] font-medium text-gray-600">{p.label}</span>
                                 <div className="bg-[#effbe7] text-[#095512] text-[12px] font-medium px-2 py-0.5 rounded-[6px] mix-blend-multiply">
                                   {p.max}
                                 </div>
                               </div>
                             </th>
                          ))
                       ))}
                     </tr>
                  ) : (
                     <tr className="bg-[#f9fafb] border-b border-[#c7c6c6]">
                        {structure.map((_, i) => (
                          <th key={`co${i + 1}`} className="py-2 border-r border-[#c7c6c6] text-[12px] font-normal text-gray-500 bg-[#f4f5f7]">
                            CO{1 + (i % 3)}
                          </th>
                        ))}
                     </tr>
                  )}
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-[#c7c6c6] hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-[16px] border-r border-[#c7c6c6] text-black font-medium">{student.srNo}</td>
                      <td className="px-6 py-4 text-[16px] border-r border-[#c7c6c6] text-[#475467] font-medium">{student.seatNo}</td>
                      <td className="px-6 py-4 text-[16px] border-r border-[#c7c6c6] text-[#101828] font-medium text-left">{student.name}</td>
                      
                      {structure.map((q) => (
                         q.parts.map((p) => (
                            <td key={p.id} className="border-r border-[#c7c6c6] p-0 h-[60px] min-w-[60px]">
                               <MarkCell student={student} qKey={p.id} maxMark={p.max} formState={formState} handleMarkChange={handleMarkChange} />
                            </td>
                         ))
                      ))}
                      
                      <td className="px-6 py-4 text-[16px] font-semibold text-[#0e1680] bg-gray-50/30">
                        {calculateTotal(student.marks)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {formState !== 'locked' && (
             <div className="fixed bottom-0 right-0 left-[280px] bg-white border-t border-[#e5e7fb] p-4 flex justify-end gap-4 shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
               {formState === 'initial' && (
                  <button 
                    onClick={handleSaveDraft}
                    className="bg-white border border-[#d0d5dd] text-[#344054] px-6 py-2.5 rounded-[8px] font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Save Draft
                  </button>
               )}
               {formState === 'draft_saved' && (
                  <button 
                    className="bg-white border border-[#d0d5dd] text-[#344054] px-6 py-2.5 rounded-[8px] font-semibold hover:bg-gray-50 transition-colors"
                    onClick={() => console.log('Draft Updated')}
                  >
                    Update Draft
                  </button>
               )}
               
               {(formState === 'initial' || formState === 'draft_saved') && (
                  <button 
                     onClick={handleSubmit}
                     className="bg-[#0e1680] text-white px-6 py-2.5 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors"
                  >
                    Submit
                  </button>
               )}
               
               {formState === 'view' && (
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setFormState('initial')}
                        className="bg-white border border-[#d0d5dd] text-[#344054] px-6 py-2.5 rounded-[8px] font-semibold hover:bg-gray-50 transition-colors"
                     >
                       Edit Marks
                     </button>
                     {hasErrors && (
                        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-[8px]">
                           <AlertTriangle className="w-4 h-4" />
                           <span className="text-[14px] font-medium">Please enter all marks (Check Q1 for empty fields)</span>
                        </div>
                     )}
                     <button 
                        disabled={hasErrors}
                        onClick={() => setShowConfirmLockModal(true)}
                        className="bg-[#0e1680] text-white px-6 py-2.5 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                       <Lock className="w-4 h-4" />
                       Review & Lock
                     </button>
                  </div>
               )}
             </div>
          )}
        </div>
      )}

      {showUploadModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[12px] shadow-xl w-[830px] overflow-hidden flex flex-col">
               <div className="p-6 border-b border-[#e5e7fb] flex justify-between items-center bg-[#fcfcfd]">
                  <h2 className="text-[18px] font-semibold text-[#101828]">Upload Bulk Student</h2>
                  <button onClick={() => { setShowUploadModal(false); setUploadedFile(null); }} className="text-[#667085] hover:text-gray-900">
                     <X className="w-6 h-6" />
                  </button>
               </div>
               
               <div className="p-6 flex-1">
                 {!uploadedFile ? (
                   <div 
                     className="border-2 border-dashed border-[#d0d5dd] rounded-[12px] h-[192px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 hover:border-[#0e1680] transition-all"
                     onClick={() => fileInputRef.current?.click()}
                   >
                     <div className="w-10 h-10 bg-[#f2f3fd] rounded-full flex items-center justify-center text-[#0e1680]">
                       <UploadCloud className="w-5 h-5" />
                     </div>
                     <div className="text-center">
                        <p className="text-[14px] font-semibold text-[#0e1680]">Click to upload <span className="font-normal text-[#475467]">or drag and drop</span></p>
                        <p className="text-[12px] text-[#475467] mt-1">CSV or Excel (max. 10MB)</p>
                     </div>
                     <input 
                       type="file" 
                       className="hidden" 
                       ref={fileInputRef} 
                       onChange={(e) => {
                         if (e.target.files && e.target.files[0]) {
                           setUploadedFile(e.target.files[0]);
                         }
                       }} 
                     />
                   </div>
                 ) : (
                   <div className="border border-[#d0d5dd] rounded-[12px] p-4 flex items-center justify-between bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                           <Check className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[14px] font-medium text-[#101828]">{uploadedFile.name}</p>
                           <p className="text-[12px] text-[#475467]">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setUploadedFile(null)} className="text-[#667085] hover:text-red-600">
                        <X className="w-5 h-5" />
                      </button>
                   </div>
                 )}
               </div>

               <div className="p-6 border-t border-[#e5e7fb] bg-gray-50 flex justify-end gap-3">
                  <button 
                    onClick={() => { setShowUploadModal(false); setUploadedFile(null); }}
                    className="px-4 py-2 bg-white border border-[#d0d5dd] text-[#344054] font-semibold rounded-[8px] hover:bg-gray-50"
                  >
                     Cancel
                  </button>
                  <button 
                    disabled={!uploadedFile}
                    onClick={handleUploadSubmit}
                    className="px-4 py-2 bg-[#0e1680] text-white font-semibold rounded-[8px] hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Upload
                  </button>
               </div>
            </div>
         </div>
      )}

      {showUploadSuccessModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[12px] shadow-xl w-[470px] overflow-hidden flex flex-col p-8 items-center text-center">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                 <Check className="w-10 h-10" />
               </div>
               <h3 className="text-[24px] font-semibold text-[#101828] mb-8 text-center">Bulk Uploaded successfully !!</h3>
               <button 
                 onClick={() => setShowUploadSuccessModal(false)}
                 className="bg-[#0e1680] text-white px-8 py-2.5 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors"
               >
                 Back
               </button>
            </div>
         </div>
      )}

      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-[500px] p-8 flex flex-col items-center">
             <h3 className="text-[20px] font-semibold text-[#101828] mb-8 text-center max-w-[80%] leading-[30px]">
                Do you want send a request to admin to unlock marks?
             </h3>
             <div className="flex gap-4">
                <button
                   onClick={handleUnlockRequest}
                   className="bg-[#0e1680] text-white px-8 py-2.5 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors min-w-[100px]"
                >
                   Yes
                </button>
                <button
                   onClick={() => setShowUnlockModal(false)}
                   className="bg-[#0e1680] text-white px-8 py-2.5 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors min-w-[100px]"
                >
                   No
                </button>
             </div>
          </div>
        </div>
      )}

      {showDraftSavedModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[12px] shadow-xl w-[470px] overflow-hidden flex flex-col p-8 items-center text-center">
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                 <Check className="w-10 h-10" />
               </div>
               <h3 className="text-[20px] font-semibold text-[#101828] mb-8">Draft Saved successfully !!</h3>
               <button 
                 onClick={() => setShowDraftSavedModal(false)}
                 className="w-full max-w-[200px] bg-[#0e1680] text-white py-3 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors"
               >
                 Continue
               </button>
            </div>
         </div>
      )}

      {showConfirmLockModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-[12px] shadow-xl w-[470px] overflow-hidden flex flex-col p-8 items-center text-center">
               <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-6">
                 <AlertTriangle className="w-10 h-10" />
               </div>
               <h3 className="text-[20px] font-semibold text-[#101828] mb-2">Confirm Lock Marks</h3>
               <p className="text-[14px] text-[#475467] mb-8 px-4">
                  Are you sure you want to lock the marks? Once locked, you will not be able to edit them again without administrator approval.
               </p>
               <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setShowConfirmLockModal(false)}
                    className="flex-1 bg-white border border-[#d0d5dd] text-[#344054] py-3 rounded-[8px] font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleLock}
                    className="flex-1 bg-[#0e1680] text-white py-3 rounded-[8px] font-semibold hover:bg-blue-900 transition-colors"
                  >
                    Yes, Lock
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

// Utility function demonstrating how the frontend state maps to the marks_entry schema
export const transformToMarksEntrySchema = (
  students: StudentMark[],
  facultyId: number,
  isLocked: 0 | 1,
  structure: typeof END_SEM_STRUCTURE
): MarksEntrySchema[] => {
  const payload: MarksEntrySchema[] = [];

  students.forEach((student) => {
    // Note: In a real app, reg_subj_id would come from the student's enrollment data.
    // Here we use student.id as a mock reg_subj_id.
    const regSubjId = student.id;

    structure.forEach((question) => {
      question.parts.forEach((part) => {
        const val = student.marks[part.id];
        
        let marksObtained: number | null = null;
        if (val && val !== 'NA' && val !== 'EXTRA') {
          marksObtained = parseFloat(val);
        }

        if (val) {
          payload.push({
            reg_subj_id: regSubjId,
            faculty_id: facultyId,
            component: part.id,
            marks_obtained: marksObtained,
            max_marks: part.max,
            is_locked: isLocked,
            locked_at: isLocked ? new Date().toISOString() : null,
            locked_by: isLocked ? facultyId : null,
          });
        }
      });
    });
  });

  return payload;
};
