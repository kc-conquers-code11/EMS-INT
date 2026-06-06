import { useState } from "react";
import { Search, Filter, Eye, Trash2, Edit2, X, Plus } from "lucide-react";

type TabId = "paper-sets" | "add-details" | "publish";
type ModalTabId = "set-details" | "add-questions" | "preview-paper";

// ─── Shared Components ────────────────────────────────────────

function SelectField({
  label,
  value,
  options,
  onChange,
  fullWidth = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  fullWidth?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-[6px] ${fullWidth ? "w-full" : "flex-1"}`}>
      <label className="text-[14px] font-medium text-[#344054]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] pr-[40px] bg-white text-[16px] text-[#687b96] focus:outline-none focus:ring-2 focus:ring-[#0E1680]/10 focus:border-[#0E1680]"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  fullWidth = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-[6px] ${fullWidth ? "w-full" : "flex-1"}`}>
      <label className="text-[14px] font-medium text-[#344054]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96] focus:outline-none focus:ring-2 focus:ring-[#0E1680]/10 focus:border-[#0E1680]"
      />
    </div>
  );
}

// ─── Modal Inner Tab 2: Add Questions ────────────────────────

function AddQuestionsInnerTab({ onBack, onNext }: { onBack: () => void, onNext: () => void }) {
  const [totalQuestions, setTotalQuestions] = useState("8");
  const [totalMarks, setTotalMarks] = useState("20");
  const [passingMarks, setPassingMarks] = useState("7");
  const [courseTitle, setCourseTitle] = useState("Operating System");
  const [courseCode, setCourseCode] = useState("CO1919");
  const [branch, setBranch] = useState("Information Technology");
  const [editingQuestion, setEditingQuestion] = useState(false);

  return (
    <div className="flex flex-col gap-[32px] w-full">
      {/* CO/PO Mapping Table */}
      <div className="w-full border border-[#eaecf0] rounded-[8px] overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-r border-[#eaecf0] text-[#667085]">CO/PO</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-r border-[#eaecf0] text-[#667085]">PO1</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-r border-[#eaecf0] text-[#667085]">PO2</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-r border-[#eaecf0] text-[#667085]">PO3</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">PO4</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            <tr>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">CO1</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">1</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">3</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">2</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">3</td>
            </tr>
            <tr>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">CO2</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">3</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">3</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">1</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">2</td>
            </tr>
            <tr>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">CO3</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">2</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">2</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">3</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">1</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Marks Config */}
      <div className="flex gap-[20px]">
        <InputField label="Total Questions" value={totalQuestions} onChange={setTotalQuestions} />
        <InputField label="Total Marks" value={totalMarks} onChange={setTotalMarks} />
        <InputField label="Passing Marks" value={passingMarks} onChange={setPassingMarks} />
      </div>

      <div className="flex gap-[20px]">
        <InputField label="Course Title" value={courseTitle} onChange={setCourseTitle} />
        <InputField label="Course Code" value={courseCode} onChange={setCourseCode} />
        <InputField label="Branch" value={branch} onChange={setBranch} />
      </div>

      {/* Add Questions Form Block */}
      <div className="flex flex-col gap-[16px]">
        <p className="text-[14px] font-medium text-[#344054]">Add Questions</p>
        <div className="bg-[#f8f9fc] rounded-[8px] p-[16px] flex flex-col gap-[16px]">
          <div className="flex gap-[16px]">
            <div className="flex-1 relative">
              <select className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]">
                <option>1</option>
              </select>
              <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
            <div className="flex-1 relative">
              <select className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]">
                <option>a</option>
              </select>
              <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
            <div className="flex-1">
              <input type="text" placeholder="Enter Marks" className="w-full border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]" />
            </div>
          </div>
          <div className="w-full">
            <input type="text" placeholder="Explain Network Architecture in deatil" className="w-full border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]" />
          </div>
          <div className="flex gap-[16px]">
            <div className="flex-1 relative">
              <select className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]">
                <option>CO3</option>
              </select>
              <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
            <div className="flex-1 relative">
              <select className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]">
                <option>PO2</option>
              </select>
              <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="text-[#687b96] hover:text-[#0E1680] cursor-pointer">
            <Plus size={24} />
          </button>
        </div>
      </div>

      {/* Added Questions List */}
      <div className="w-full border border-[#eaecf0] rounded-[8px] overflow-hidden bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Q no.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Sub Q no.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Question</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Marks</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">CO</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            <tr>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">1</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">-</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Explain Network Architecture in detail</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">5</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">CO3</td>
              <td className="px-8 py-6 text-[15px] font-medium flex gap-[12px]">
                <button className="text-[#667085] hover:text-red-500 cursor-pointer"><Trash2 size={16} /></button>
                <button onClick={() => setEditingQuestion(true)} className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Edit2 size={16} /></button>
              </td>
            </tr>
            <tr>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">2</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">a</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Define Functionalities</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">5</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">CO1</td>
              <td className="px-8 py-6 text-[15px] font-medium flex gap-[12px]">
                <button className="text-[#667085] hover:text-red-500 cursor-pointer"><Trash2 size={16} /></button>
                <button onClick={() => setEditingQuestion(true)} className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Edit2 size={16} /></button>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Table Pagination */}
        <div className="px-[24px] py-[16px] flex items-center justify-between border-t border-[#eaecf0] bg-white">
          <button className="flex items-center gap-[8px] px-[14px] py-[8px] border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] text-[#344054] text-[14px] font-semibold rounded-[8px] cursor-pointer transition-colors">
            &larr; Previous
          </button>
          <div className="flex items-center gap-[2px]">
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] bg-[#f9fafb] text-[#101828]">1</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">2</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">3</button>
            <span className="px-[6px] text-[#475467]">...</span>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">8</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">9</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">10</button>
          </div>
          <button className="flex items-center gap-[8px] px-[14px] py-[8px] border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] text-[#344054] text-[14px] font-semibold rounded-[8px] cursor-pointer transition-colors">
            Next &rarr;
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[16px]">
        <button
          onClick={onBack}
          className="flex items-center gap-[8px] px-[24px] py-[10px] border border-[#d0d5dd] bg-white text-[#344054] rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#f9fafb] transition-colors"
        >
          &larr; Back to Set Details
        </button>
        <button onClick={onNext} className="flex items-center gap-[8px] px-[24px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors">
          Preview Paper &rarr;
        </button>
      </div>

      {editingQuestion && (
        <EditQuestionModal onClose={() => setEditingQuestion(false)} />
      )}
    </div>
  );
}

// ─── Preview Paper Inner Tab ──────────────────────────────────

function PreviewPaperInnerTab({ onBack, onSaveDraft, onFinalize }: { onBack: () => void, onSaveDraft: () => void, onFinalize: () => void }) {
  return (
    <div className="flex flex-col gap-[32px] w-full">
      <div className="w-full border border-[#eaecf0] rounded-[8px] overflow-hidden bg-white px-[24px] py-[32px] flex flex-col items-center">
        {/* Header Details */}
        <div className="flex gap-[24px] text-[12px] font-medium text-[#101828] mb-[16px]">
          <span>Course Title : Data Analytics</span>
          <span>Course Code : 20CS1010</span>
          <span>Marks : 20</span>
        </div>
        <div className="flex gap-[24px] text-[12px] font-medium text-[#101828] mb-[32px]">
          <span>Date : 12/07/26</span>
          <span>Department : IT</span>
          <span>Department : IT</span>
        </div>

        {/* Title */}
        <h4 className="text-[14px] font-bold text-[#101828] mb-[32px]">
          Internal Assessment - I
        </h4>

        {/* Questions List */}
        <div className="w-full flex flex-col gap-[24px]">
          <div className="flex gap-[16px] text-[14px] text-[#475467] border-b border-[#eaecf0] pb-[24px]">
            <span className="font-medium shrink-0">Q.1</span>
            <span>abcabcabcabcabcabcabcabcabcabc</span>
          </div>
          <div className="flex gap-[16px] text-[14px] text-[#475467] border-b border-[#eaecf0] pb-[24px]">
            <span className="font-medium shrink-0">Q.2</span>
            <span>abcabcabcabcabcabcabcabcabcabc</span>
          </div>
          <div className="flex gap-[16px] text-[14px] text-[#475467] border-b border-[#eaecf0] pb-[24px]">
            <span className="font-medium shrink-0">Q.3</span>
            <span>ababcabcabcabcabcabcabcabcabcc</span>
          </div>
          <div className="flex gap-[16px] text-[14px] text-[#475467] border-b border-[#eaecf0] pb-[24px]">
            <span className="font-medium shrink-0">Q.4</span>
            <span>aabcabcabcabcabcabcabcabcabcbc</span>
          </div>
          <div className="flex gap-[16px] text-[14px] text-[#475467] border-b border-[#eaecf0] pb-[24px]">
            <span className="font-medium shrink-0">Q.5</span>
            <span>aabcabcabcabcabcabcabcabcabcbc</span>
          </div>
          <div className="flex gap-[16px] text-[14px] text-[#475467]">
            <span className="font-medium shrink-0">Q.6</span>
            <span>aabcabcabcabcabcabcabcabcabcbc</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[16px]">
        <button
          onClick={onBack}
          className="flex items-center gap-[8px] px-[24px] py-[10px] border border-[#d0d5dd] bg-white text-[#344054] rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#f9fafb] transition-colors"
        >
          &larr; Back
        </button>
        <div className="flex items-center gap-[16px]">
          <button 
            onClick={onSaveDraft}
            className="flex items-center gap-[8px] px-[24px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
          >
            Save Draft
          </button>
          <button 
            onClick={onFinalize}
            className="flex items-center gap-[8px] px-[24px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
          >
            Finalize & Generate
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modals & Overlays ────────────────────────────────────────

function SuccessModal({ message, isError = false, onClose }: { message: string; isError?: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-[4px] bg-[rgba(16,24,40,0.6)] py-[40px]">
      <div className="bg-white rounded-[16px] shadow-2xl w-[400px] flex flex-col items-center justify-center p-[40px] gap-[24px]">
        <div className={`w-[80px] h-[80px] rounded-full border-[4px] flex items-center justify-center ${isError ? 'border-[#f04438]' : 'border-[#68db6e]'}`}>
          {isError ? (
            <Trash2 className="w-[40px] h-[40px] text-[#f04438]" />
          ) : (
            <svg className="w-[40px] h-[40px] text-[#68db6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h3 className="text-[20px] font-semibold text-[#101828] text-center px-[20px]">{message}</h3>
        <button 
          onClick={onClose}
          className="px-[32px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-[4px] bg-[rgba(16,24,40,0.6)] py-[40px]">
      <div className="bg-white rounded-[16px] shadow-2xl w-[400px] flex flex-col items-center justify-center p-[40px] gap-[24px]">
        <div className="w-[80px] h-[80px] rounded-full border-[4px] border-[#f04438] flex items-center justify-center">
          <span className="text-[#f04438] text-[40px] font-bold">i</span>
        </div>
        <h3 className="text-[20px] font-semibold text-[#101828] text-center px-[20px]">
          Do you really want to delete this Paper Set?
        </h3>
        <div className="flex gap-[16px] w-full justify-center">
          <button 
            onClick={onConfirm}
            className="px-[32px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
          >
            Delete
          </button>
          <button 
            onClick={onClose}
            className="px-[32px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

function DownloadViewModal({ onClose, onDownload }: { onClose: () => void; onDownload: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-[4px] bg-[rgba(16,24,40,0.6)] py-[40px]">
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[800px] max-h-full overflow-y-auto flex flex-col p-[32px] gap-[24px]">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-[#101828]">Set A - OS</h3>
          <button onClick={onClose} className="text-[#667085] hover:text-[#101828] cursor-pointer">
            <X size={24} />
          </button>
        </div>
        
        <div className="w-full border border-[#eaecf0] rounded-[8px] overflow-hidden bg-white px-[24px] py-[32px] flex flex-col items-center">
          <div className="flex gap-[24px] text-[12px] font-medium text-[#101828] mb-[16px]">
            <span className="border border-[#eaecf0] px-[12px] py-[8px] rounded-[6px]">Course Title : Data Analytics</span>
            <span className="border border-[#eaecf0] px-[12px] py-[8px] rounded-[6px]">Course Code : 20CS1010</span>
            <span className="border border-[#eaecf0] px-[12px] py-[8px] rounded-[6px]">Marks : 20</span>
          </div>
          <div className="flex gap-[24px] text-[12px] font-medium text-[#101828] mb-[32px]">
            <span className="border border-[#eaecf0] px-[12px] py-[8px] rounded-[6px]">Date : 12/07/26</span>
            <span className="border border-[#eaecf0] px-[12px] py-[8px] rounded-[6px]">Department : IT</span>
            <span className="border border-[#eaecf0] px-[12px] py-[8px] rounded-[6px]">Department : IT</span>
          </div>

          <h4 className="border border-[#eaecf0] px-[16px] py-[8px] rounded-[6px] text-[14px] font-bold text-[#101828] mb-[32px]">
            Internal Assessment - I
          </h4>

          <div className="w-full flex flex-col gap-[24px]">
            <div className="flex gap-[16px] text-[14px] text-[#475467] border border-[#eaecf0] p-[16px] rounded-[8px]">
              <span className="font-medium shrink-0">Q.1</span>
              <span>abcabcabcabcabcabcabcabcabcabc</span>
            </div>
            <div className="flex gap-[16px] text-[14px] text-[#475467] border border-[#eaecf0] p-[16px] rounded-[8px]">
              <span className="font-medium shrink-0">Q.2</span>
              <span>abcabcabcabcabcabcabcabcabcabc</span>
            </div>
            <div className="flex gap-[16px] text-[14px] text-[#475467] border border-[#eaecf0] p-[16px] rounded-[8px]">
              <span className="font-medium shrink-0">Q.3</span>
              <span>ababcabcabcabcabcabcabcabcabcc</span>
            </div>
            <div className="flex gap-[16px] text-[14px] text-[#475467] border border-[#eaecf0] p-[16px] rounded-[8px]">
              <span className="font-medium shrink-0">Q.4</span>
              <span>aabcabcabcabcabcabcabcabcabcbc</span>
            </div>
            <div className="flex gap-[16px] text-[14px] text-[#475467] border border-[#eaecf0] p-[16px] rounded-[8px]">
              <span className="font-medium shrink-0">Q.5</span>
              <span>aabcabcabcabcabcabcabcabcabcbc</span>
            </div>
            <div className="flex gap-[16px] text-[14px] text-[#475467] border border-[#eaecf0] p-[16px] rounded-[8px]">
              <span className="font-medium shrink-0">Q.6</span>
              <span>aabcabcabcabcabcabcabcabcabcbc</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-[16px]">
          <button 
            onClick={onDownload}
            className="px-[32px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Question Modal ──────────────────────────────────────

function EditQuestionModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-[4px] bg-[rgba(16,24,40,0.6)] py-[40px]">
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[800px] max-h-full overflow-y-auto flex flex-col p-[32px] gap-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <h3 className="text-[18px] font-semibold text-[#101828]">Edit Question</h3>
            <Edit2 size={18} className="text-[#687b96]" />
          </div>
          <button onClick={onClose} className="text-[#667085] hover:text-[#101828] cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* CO/PO Mapping Table */}
        <div className="w-full border border-[#eaecf0] rounded-[8px] overflow-hidden">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-r border-[#eaecf0] text-[#667085]">CO/PO</th>
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-r border-[#eaecf0] text-[#667085]">PO1</th>
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-r border-[#eaecf0] text-[#667085]">PO2</th>
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-r border-[#eaecf0] text-[#667085]">PO3</th>
                <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">PO4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              <tr>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">CO1</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">1</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">3</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">2</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">3</td>
              </tr>
              <tr>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">CO2</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">3</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">3</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">1</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">2</td>
              </tr>
              <tr>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">CO3</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">2</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">2</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467] border-r border-[#eaecf0]">3</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">1</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Add Questions Form Block */}
        <div className="flex flex-col gap-[16px]">
          <p className="text-[14px] font-medium text-[#344054]">Add Questions</p>
          <div className="bg-[#f8f9fc] rounded-[8px] p-[16px] flex flex-col gap-[16px]">
            <div className="flex gap-[16px]">
              <div className="flex-1 relative">
                <select className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]">
                  <option>1</option>
                </select>
                <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div className="flex-1 relative">
                <select className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]">
                  <option>a</option>
                </select>
                <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div className="flex-1">
                <input type="text" defaultValue="5" placeholder="Enter Marks" className="w-full border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]" />
              </div>
            </div>
            <div className="w-full">
              <input type="text" defaultValue="Explain Network Architecture in detail" placeholder="Explain Network Architecture in detail" className="w-full border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]" />
            </div>
            <div className="flex gap-[16px]">
              <div className="flex-1 relative">
                <select className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]">
                  <option>CO3</option>
                </select>
                <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div className="flex-1 relative">
                <select className="w-full appearance-none border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white text-[16px] text-[#687b96]">
                  <option>PO2</option>
                </select>
                <div className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-[16px]">
          <button
            onClick={onClose}
            className="flex items-center gap-[8px] px-[24px] py-[10px] border border-[#d0d5dd] bg-white text-[#344054] rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#f9fafb] transition-colors"
          >
            &larr; Back
          </button>
          <button 
            onClick={onClose}
            className="flex items-center gap-[8px] px-[24px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Add New Paper Set Modal ─────────────────────────────────

function AddNewPaperSetModal({ onClose }: { onClose: () => void }) {
  const [modalTab, setModalTab] = useState<ModalTabId>("set-details");
  const [paperSetName, setPaperSetName] = useState("Set A - Operating System");
  const [paperSetDescription, setPaperSetDescription] = useState("Description");
  const [duration, setDuration] = useState("3:00");
  const [paperStructure, setPaperStructure] = useState("CO mapping");
  const [difficulty, setDifficulty] = useState("High");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[4px] bg-[rgba(16,24,40,0.6)] py-[40px]">
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[800px] max-h-full overflow-y-auto flex flex-col p-[32px] gap-[24px]">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-[#101828]">
            Add New Paper Set
          </h3>
          <button
            onClick={onClose}
            className="text-[#667085] hover:text-[#101828] cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="bg-[#f2f3fd] border border-[#e5e7fb] inline-flex items-center p-[6px] rounded-[10px] gap-[8px] self-start">
          <button
            onClick={() => setModalTab("set-details")}
            className={`px-[14px] py-[10px] rounded-[6px] text-[14px] font-semibold whitespace-nowrap transition-colors ${
              modalTab === "set-details" ? "bg-[#0e1680] text-white" : "text-[#687b96] hover:bg-white/50"
            }`}
          >
            Add Set Details
          </button>
          <button
            onClick={() => setModalTab("add-questions")}
            className={`px-[14px] py-[10px] rounded-[6px] text-[14px] font-semibold whitespace-nowrap transition-colors ${
              modalTab === "add-questions" ? "bg-[#0e1680] text-white" : "text-[#687b96] hover:bg-white/50"
            }`}
          >
            Add Questions
          </button>
          <button
            onClick={() => setModalTab("preview-paper")}
            className={`px-[14px] py-[10px] rounded-[6px] text-[14px] font-semibold whitespace-nowrap transition-colors ${
              modalTab === "preview-paper" ? "bg-[#0e1680] text-white" : "text-[#687b96] hover:bg-white/50"
            }`}
          >
            Preview Paper
          </button>
        </div>

        {/* Modal Tab Content */}
        {modalTab === "set-details" && (
          <div className="flex flex-col gap-[24px] w-full">
            <SelectField
              label="Paper Set Name"
              value={paperSetName}
              options={["Set A - Operating System", "Set B - Operating System"]}
              onChange={setPaperSetName}
              fullWidth
            />
            <InputField
              label="Paper Set Description"
              value={paperSetDescription}
              onChange={setPaperSetDescription}
              fullWidth
            />
            <div className="flex gap-[20px] w-full">
              <div className="flex-1">
                <InputField
                  label="Duration"
                  value={duration}
                  onChange={setDuration}
                  fullWidth
                />
              </div>
              <div className="flex-1">
                <SelectField
                  label="Paper Structure"
                  value={paperStructure}
                  options={["CO mapping", "Standard"]}
                  onChange={setPaperStructure}
                  fullWidth
                />
              </div>
              <div className="flex-1">
                <SelectField
                  label="Questions Difficulty Level"
                  value={difficulty}
                  options={["High", "Medium", "Low"]}
                  onChange={setDifficulty}
                  fullWidth
                />
              </div>
            </div>

            <div className="flex justify-between items-center mt-[16px]">
              <button
                onClick={onClose}
                className="flex items-center gap-[8px] px-[24px] py-[10px] border border-[#d0d5dd] bg-white text-[#344054] rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#f9fafb] transition-colors"
              >
                &larr; Back to Course Details
              </button>
              <button 
                onClick={() => setModalTab("add-questions")}
                className="flex items-center gap-[8px] px-[24px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
              >
                Add Set Details &rarr;
              </button>
            </div>
          </div>
        )}

        {modalTab === "add-questions" && (
          <AddQuestionsInnerTab onBack={() => setModalTab("set-details")} onNext={() => setModalTab("preview-paper")} />
        )}

        {modalTab === "preview-paper" && (
          <PreviewPaperInnerTab 
            onBack={() => setModalTab("add-questions")}
            onSaveDraft={() => setSuccessMessage("Draft Saved successfully !!")}
            onFinalize={() => setSuccessMessage("Question Paper Set Generated successfully !!")}
          />
        )}
      </div>

      {successMessage && (
        <SuccessModal message={successMessage} onClose={() => {
          setSuccessMessage(null);
          if (successMessage.includes("Generated")) {
            onClose(); // Close the main modal entirely if finalized
          }
        }} />
      )}
    </div>
  );
}

// ─── Tabs Content ─────────────────────────────────────────────

function PaperSetsTab({ onView, onDelete }: { onView: () => void; onDelete: () => void }) {
  return (
    <div className="flex flex-col gap-[32px] w-full">
      {/* Search / Filter Row */}
      <div className="flex items-center justify-end gap-[12px] w-full">
        <div className="relative w-[211px]">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-[12px] pr-[36px] py-[8px] border border-[#d0d5dd] rounded-[8px] bg-white text-[16px] text-[#687b96] focus:outline-none focus:ring-2 focus:ring-[#0E1680]/10 focus:border-[#0E1680]"
          />
          <Search className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#687b96]" size={16} />
        </div>
        <button className="flex items-center gap-[8px] bg-white border border-[#d0d5dd] rounded-[8px] px-[16px] py-[10px] text-[14px] font-semibold text-[#344054] shadow-sm hover:bg-[#f9fafb] cursor-pointer">
          Semester No
          <Filter size={16} className="text-[#344054]" />
        </button>
        <button className="flex items-center gap-[8px] bg-white border border-[#d0d5dd] rounded-[8px] px-[16px] py-[10px] text-[14px] font-semibold text-[#344054] shadow-sm hover:bg-[#f9fafb] cursor-pointer">
          Course
          <Filter size={16} className="text-[#344054]" />
        </button>
        <button className="flex items-center gap-[8px] bg-white border border-[#d0d5dd] rounded-[8px] px-[16px] py-[10px] text-[14px] font-semibold text-[#344054] shadow-sm hover:bg-[#f9fafb] cursor-pointer">
          Marks
          <Filter size={16} className="text-[#344054]" />
        </button>
        <button className="flex items-center gap-[8px] bg-white border border-[#d0d5dd] rounded-[8px] px-[16px] py-[10px] text-[14px] font-semibold text-[#344054] shadow-sm hover:bg-[#f9fafb] cursor-pointer">
          Exam Type
          <Filter size={16} className="text-[#344054]" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-[#eaecf0] overflow-hidden flex flex-col">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Sr no.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Course Title</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Course Code</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Set Name</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Exam Type</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Marks</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">1</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Operating System</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">CO1919</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Set A - OS</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">IA</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">20</td>
              <td className="px-8 py-6 text-[15px] font-medium flex gap-[12px]">
                <button onClick={onView} className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Eye size={18} /></button>
                <button onClick={onDelete} className="text-[#667085] hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                <button className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Edit2 size={18} /></button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">2</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Networking</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">CO1918</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Set A - Networking</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">IA</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">20</td>
              <td className="px-8 py-6 text-[15px] font-medium flex gap-[12px]">
                <button onClick={onView} className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Eye size={18} /></button>
                <button onClick={onDelete} className="text-[#667085] hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                <button className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Edit2 size={18} /></button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">3</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Operating System</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">CO1919</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Set B - Operating System</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">End Semester</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">80</td>
              <td className="px-8 py-6 text-[15px] font-medium flex gap-[12px]">
                <button onClick={onView} className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Eye size={18} /></button>
                <button onClick={onDelete} className="text-[#667085] hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                <button className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Edit2 size={18} /></button>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Table Pagination */}
        <div className="px-[24px] py-[16px] flex items-center justify-between border-t border-[#eaecf0] bg-white">
          <button className="flex items-center gap-[8px] px-[14px] py-[8px] border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] text-[#344054] text-[14px] font-semibold rounded-[8px] cursor-pointer transition-colors">
            &larr; Previous
          </button>
          <div className="flex items-center gap-[2px]">
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] bg-[#f9fafb] text-[#101828]">1</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">2</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">3</button>
            <span className="px-[6px] text-[#475467]">...</span>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">8</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">9</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">10</button>
          </div>
          <button className="flex items-center gap-[8px] px-[14px] py-[8px] border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] text-[#344054] text-[14px] font-semibold rounded-[8px] cursor-pointer transition-colors">
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

function AddDetailsTab({ onNext }: { onNext: () => void }) {
  const [degree, setDegree] = useState("Bachelors of Engineering");
  const [branch, setBranch] = useState("Information Technology");
  const [academicYear, setAcademicYear] = useState("2026");
  const [scheme, setScheme] = useState("R 2019");
  const [semester, setSemester] = useState("6");
  const [facultyName, setFacultyName] = useState("xyzname");
  const [examSession, setExamSession] = useState("End Semester");
  const [courseTitle, setCourseTitle] = useState("Operating system");
  const [courseCode, setCourseCode] = useState("CO1919");

  return (
    <div className="flex flex-col gap-[20px] w-full max-w-[1053px]">
      <div className="flex gap-[20px] w-full">
        <InputField label="Enter Degree" value={degree} onChange={setDegree} />
        <SelectField label="Select Stream/Branch" value={branch} options={["Information Technology"]} onChange={setBranch} />
      </div>
      <div className="flex gap-[20px] w-full">
        <InputField label="Enter Academic year" value={academicYear} onChange={setAcademicYear} />
        <SelectField label="Select Scheme" value={scheme} options={["R 2019"]} onChange={setScheme} />
      </div>
      <div className="flex gap-[20px] w-full">
        <SelectField label="Select Semester" value={semester} options={["6"]} onChange={setSemester} />
        <InputField label="Enter Faculty Name" value={facultyName} onChange={setFacultyName} />
      </div>
      <div className="flex gap-[20px] w-full">
        <SelectField label="Select Exam Session" value={examSession} options={["End Semester"]} onChange={setExamSession} fullWidth />
      </div>
      <div className="flex gap-[20px] w-full">
        <SelectField label="Select Course Title" value={courseTitle} options={["Operating system"]} onChange={setCourseTitle} />
        <SelectField label="Select Course code" value={courseCode} options={["CO1919"]} onChange={setCourseCode} />
      </div>

      <div className="flex justify-end pt-[16px]">
        <button
          onClick={onNext}
          className="flex items-center gap-[8px] px-[24px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

// ─── Publish Tab ──────────────────────────────────────────────

function PublishTab({ onPublish, onView, onDelete }: { onPublish: () => void; onView: () => void; onDelete: () => void }) {
  const [branch, setBranch] = useState("Bachelors of Engineering");
  const [semester, setSemester] = useState("2nd");

  return (
    <div className="flex flex-col gap-[32px] w-full">
      <div className="flex gap-[20px] w-full max-w-[800px]">
        <SelectField label="Select Branch" value={branch} options={["Bachelors of Engineering"]} onChange={setBranch} />
        <SelectField label="Select Semester" value={semester} options={["2nd", "3rd"]} onChange={setSemester} />
      </div>

      <div className="bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-[#eaecf0] overflow-hidden flex flex-col">
        <table className="w-full text-left border-collapse text-center">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Sr no.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Branch</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Semester</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Course Title</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Set Name</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Exam Type</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Marks</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">1</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">IT</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">2nd</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Operating System</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Set A - OS</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">IA</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] text-[#344054]">20</td>
              <td className="px-8 py-6 text-[15px] font-medium flex justify-center gap-[12px]">
                <button onClick={onView} className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Eye size={18} /></button>
                <button onClick={onDelete} className="text-[#667085] hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                <button className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Edit2 size={18} /></button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">2</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">COMPS</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">1st</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Networking</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Set A - Networking</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">IA</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] text-[#344054]">20</td>
              <td className="px-8 py-6 text-[15px] font-medium flex justify-center gap-[12px]">
                <button onClick={onView} className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Eye size={18} /></button>
                <button onClick={onDelete} className="text-[#667085] hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                <button className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Edit2 size={18} /></button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">3</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">IT</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">2nd</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Operating System</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">Set B - Operating System</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">End Semester</td>
              <td className="px-8 py-6 text-[15px] font-medium text-[#475467] text-[#344054]">80</td>
              <td className="px-8 py-6 text-[15px] font-medium flex justify-center gap-[12px]">
                <button onClick={onView} className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Eye size={18} /></button>
                <button onClick={onDelete} className="text-[#667085] hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                <button className="text-[#667085] hover:text-[#0E1680] cursor-pointer"><Edit2 size={18} /></button>
              </td>
            </tr>
          </tbody>
        </table>
        
        {/* Table Pagination */}
        <div className="px-[24px] py-[16px] flex items-center justify-between border-t border-[#eaecf0] bg-white">
          <button className="flex items-center gap-[8px] px-[14px] py-[8px] border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] text-[#344054] text-[14px] font-semibold rounded-[8px] cursor-pointer transition-colors">
            &larr; Previous
          </button>
          <div className="flex items-center gap-[2px]">
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] bg-[#f9fafb] text-[#101828]">1</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">2</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">3</button>
            <span className="px-[6px] text-[#475467]">...</span>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">8</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">9</button>
            <button className="w-[40px] h-[40px] flex items-center justify-center text-[14px] font-semibold rounded-[8px] hover:bg-[#f9fafb] text-[#475467] cursor-pointer">10</button>
          </div>
          <button className="flex items-center gap-[8px] px-[14px] py-[8px] border border-[#d0d5dd] bg-white hover:bg-[#f9fafb] text-[#344054] text-[14px] font-semibold rounded-[8px] cursor-pointer transition-colors">
            Next &rarr;
          </button>
        </div>
      </div>
      <div className="flex justify-end">
        <button 
          onClick={onPublish}
          className="px-[24px] py-[10px] bg-[#0E1680] text-white rounded-[8px] text-[14px] font-semibold cursor-pointer hover:bg-[#0c1266] transition-colors"
        >
          Publish Question Paper Sets
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────

export function QuestionPaperPage() {
  const [activeTab, setActiveTab] = useState<TabId>("paper-sets");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ message: string; isError?: boolean } | null>(null);

  const handleDownload = () => {
    setShowViewModal(false);
    setSuccessMessage({ message: "Question Paper Set Download successfully !!" });
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setSuccessMessage({ message: "Set deleted successfully!", isError: true });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-140px)]">
      {/* Title */}
      <h1 className="text-[24px] font-semibold text-[#2c3e50] mb-[28px]">
        Question Paper Creation
      </h1>

      {/* Tabs */}
      <div className="bg-[#f2f3fd] border border-[#e5e7fb] inline-flex items-center p-[6px] rounded-[10px] gap-[8px] mb-[40px] self-start">
        <button
          onClick={() => setActiveTab("paper-sets")}
          className={`px-[14px] py-[10px] rounded-[6px] text-[16px] font-semibold whitespace-nowrap transition-colors ${
            activeTab === "paper-sets" ? "bg-[#0e1680] text-white" : "text-[#687b96] hover:bg-white/50"
          }`}
        >
          Paper Sets
        </button>
        <button
          onClick={() => setActiveTab("add-details")}
          className={`px-[14px] py-[10px] rounded-[6px] text-[16px] font-semibold whitespace-nowrap transition-colors ${
            activeTab === "add-details" ? "bg-[#0e1680] text-white" : "text-[#687b96] hover:bg-white/50"
          }`}
        >
          Add Question Paper Details
        </button>
        <button
          onClick={() => setActiveTab("publish")}
          className={`px-[14px] py-[10px] rounded-[6px] text-[16px] font-semibold whitespace-nowrap transition-colors ${
            activeTab === "publish" ? "bg-[#0e1680] text-white" : "text-[#687b96] hover:bg-white/50"
          }`}
        >
          Publish Question Paper Sets
        </button>
      </div>

      {/* Content */}
      <div className="w-full">
        {activeTab === "paper-sets" && (
          <PaperSetsTab 
            onView={() => setShowViewModal(true)}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        )}
        
        {activeTab === "add-details" && (
          <AddDetailsTab onNext={() => setShowAddModal(true)} />
        )}
        
        {activeTab === "publish" && (
          <PublishTab 
            onPublish={() => setSuccessMessage({ message: "Question Paper Set Published successfully !!" })} 
            onView={() => setShowViewModal(true)}
            onDelete={() => setShowDeleteConfirm(true)}
          />
        )}
      </div>

      {showAddModal && <AddNewPaperSetModal onClose={() => setShowAddModal(false)} />}
      
      {showViewModal && <DownloadViewModal onClose={() => setShowViewModal(false)} onDownload={handleDownload} />}

      {showDeleteConfirm && <DeleteConfirmationModal onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDeleteConfirm} />}

      {successMessage && (
        <SuccessModal 
          message={successMessage.message} 
          isError={successMessage.isError}
          onClose={() => setSuccessMessage(null)} 
        />
      )}
    </div>
  );
}
