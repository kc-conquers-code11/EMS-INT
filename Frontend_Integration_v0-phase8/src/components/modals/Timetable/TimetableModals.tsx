import React from 'react';
import { X, Calendar, Printer, Pencil, AlertCircle, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SuccessIcon, DeleteSuccessIcon } from '../../shared/ModalIcons';
import type { Timetable } from '../../../types/COE/timetable';
import { TIME_SLOTS } from '../../screens/COE/Timetable/mockData';

/* ─── 1. TIMETABLE DELETE MODAL ─── */
interface TimetableDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: Timetable | null;
  onConfirm: () => void;
}

export const TimetableDeleteModal: React.FC<TimetableDeleteModalProps> = ({
  isOpen,
  onClose,
  timetable,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) setIsDeleting(false);
  }, [isOpen]);

  if (!isOpen || !timetable) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsDeleting(false);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(2, 5, 61, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[510px] min-h-[424px] rounded-2xl shadow-2xl px-6 py-8 flex flex-col items-center text-center gap-5"
        style={{ animation: 'timetableModalIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <DeleteSuccessIcon size={120} />

        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-semibold text-[#101828]">Delete Timetable?</p>
          <p className="text-xs text-[#667085] leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-[#0e1680]">{timetable.timetableNo}</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full mt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2 bg-[#d92d20] hover:bg-[#b01b0f] text-white text-sm font-semibold rounded-lg active:scale-[0.97] transition-all shadow-sm disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDeleting ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : "Delete"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2 border border-[#d0d5dd] text-sm font-semibold text-[#344054] rounded-lg bg-white hover:bg-gray-50 active:scale-[0.97] transition-all shadow-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


/* ─── 2. TIMETABLE SUCCESS MODAL ─── */
interface TimetableSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  buttonText?: string;
  type?: 'save' | 'delete';
}

export const TimetableSuccessModal: React.FC<TimetableSuccessModalProps> = ({
  isOpen,
  onClose,
  message,
  buttonText = "Done",
  type = 'save'
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[230] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      style={{ animation: 'timetableFadeIn 0.25s ease-out both' }}
    >
      <div
        className="bg-white w-full max-w-[510px] min-h-[424px] rounded-2xl shadow-2xl px-6 py-10 flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        <div className="mb-6">
          {type === 'delete' ? <DeleteSuccessIcon size={120} /> : <SuccessIcon size={120} />}
        </div>

        <h3 className="text-[24px] font-semibold text-[#101828] mb-8 leading-snug">
          {message}
        </h3>

        <button
          onClick={onClose}
          className="px-10 py-3 bg-[#0e1680] text-white text-base font-semibold rounded-lg hover:bg-blue-900 active:scale-[0.97] transition-all shadow-md cursor-pointer min-w-[120px]"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};


/* ─── 3. TIMETABLE VIEW MODAL (GRID CALENDAR) ─── */
interface TimetableViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: Timetable | null;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

// Subject background color decors to make cells look vibrant & beautiful
const SUBJECT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  // IT
  'IT201': { bg: 'bg-blue-50/70', border: 'border-blue-150', text: 'text-blue-800' },
  'IT202': { bg: 'bg-emerald-50/70', border: 'border-emerald-150', text: 'text-emerald-800' },
  'IT203': { bg: 'bg-violet-50/70', border: 'border-violet-150', text: 'text-violet-800' },
  'IT204': { bg: 'bg-amber-50/70', border: 'border-amber-150', text: 'text-amber-800' },
  'IT205': { bg: 'bg-rose-50/70', border: 'border-rose-150', text: 'text-rose-800' },
  // CS
  'CS201': { bg: 'bg-purple-50/70', border: 'border-purple-150', text: 'text-purple-800' },
  'CS202': { bg: 'bg-teal-50/70', border: 'border-teal-150', text: 'text-teal-800' },
  'CS203': { bg: 'bg-sky-50/70', border: 'border-sky-150', text: 'text-sky-800' },
  'CS204': { bg: 'bg-indigo-50/70', border: 'border-indigo-150', text: 'text-indigo-800' },
  'CS205': { bg: 'bg-orange-50/70', border: 'border-orange-150', text: 'text-orange-800' },
  // Fallbacks
  'DEFAULT': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' }
};

export const TimetableViewModal: React.FC<TimetableViewModalProps> = ({
  isOpen,
  onClose,
  timetable,
}) => {
  if (!isOpen || !timetable) return null;

  const getSlot = (day: string, time: string) => {
    return timetable.slots.find(s => s.day === day && s.timeSlot === time);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
      style={{ backgroundColor: 'rgba(2, 5, 61, 0.45)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[1000px] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] print:max-h-full print:shadow-none print:w-full print:p-0"
        style={{ animation: 'timetableModalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* Header (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eaecf0] bg-white shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#eef0fd] flex items-center justify-center text-[#0e1680]">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#101828] tracking-tight">
                Timetable Details
              </h2>
              <p className="text-[11px] font-semibold text-[#687b96] uppercase tracking-wider">
                {timetable.timetableNo}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Printer size={14} />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f2f4f7] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable/Scrollable Area */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto print:overflow-visible print:p-0">

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-[#f8f9fc] rounded-xl border border-[#eaecf0] mb-6 print:border-none print:bg-white print:px-0">
            <div>
              <span className="block text-[10px] font-bold text-[#687b96] uppercase tracking-wider mb-1">Branch</span>
              <span className="text-sm font-semibold text-[#101828]">{timetable.branch}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#687b96] uppercase tracking-wider mb-1">Semester</span>
              <span className="text-sm font-semibold text-[#101828]">{timetable.semester} Semester</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#687b96] uppercase tracking-wider mb-1">Academic Year</span>
              <span className="text-sm font-semibold text-[#101828]">{timetable.year}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-[#687b96] uppercase tracking-wider mb-1">Regulation Scheme</span>
              <span className="text-sm font-semibold text-[#101828]">{timetable.scheme}</span>
            </div>
          </div>

          {/* Timetable visual schedule grid */}
          <div className="border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm bg-white print:border-collapse print:rounded-none">
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full border-collapse text-left min-w-[700px] table-fixed">
                <thead>
                  <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                    <th className="w-[120px] px-4 py-3 text-[11px] font-semibold text-[#475467] uppercase tracking-wider border-r border-[#eaecf0]">
                      Day \ Time
                    </th>
                    {TIME_SLOTS.map((slot) => (
                      <th
                        key={slot}
                        className="px-4 py-3 text-[10px] font-bold text-[#475467] uppercase tracking-wider text-center border-r border-[#eaecf0] last:border-r-0"
                      >
                        {slot}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaecf0]">
                  {DAYS.map((day) => (
                    <tr key={day} className="hover:bg-gray-50/20 transition-colors">
                      {/* Day Header */}
                      <td className="px-4 py-4 text-sm font-bold text-[#101828] bg-[#f9fafb]/50 border-r border-[#eaecf0] font-sans">
                        {day}
                      </td>

                      {/* Time Slots */}
                      {TIME_SLOTS.map((slot) => {
                        const cell = getSlot(day, slot);
                        const colors = cell ? (SUBJECT_COLORS[cell.subjectCode] || SUBJECT_COLORS.DEFAULT) : null;

                        return (
                          <td
                            key={slot}
                            className="p-2 border-r border-[#eaecf0] last:border-r-0 h-[100px] align-top relative"
                          >
                            {cell ? (
                              <div
                                className={`w-full h-full p-2.5 rounded-lg border flex flex-col justify-between text-left transition-all ${colors?.bg} ${colors?.border} shadow-sm animate-in fade-in duration-300`}
                              >
                                <div>
                                  <span className={`block font-extrabold text-[12px] leading-tight truncate ${colors?.text}`}>
                                    {cell.subjectName}
                                  </span>
                                  <span className="block text-[10px] font-semibold text-[#475467] mt-0.5">
                                    {cell.subjectCode}
                                  </span>
                                </div>
                                <div className="mt-2 pt-1 border-t border-black/5 flex items-center justify-between text-[10px] text-[#667085] font-medium">
                                  <span className="truncate max-w-[70%]">{cell.facultyName}</span>
                                  <span className="bg-black/5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">{cell.roomNo}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full border border-dashed border-[#eaecf0] rounded-lg flex items-center justify-center bg-gray-50/30">
                                <span className="text-[10px] text-[#98a2b3] italic font-medium">Free</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer (hidden in print) */}
        <div className="px-6 py-4 border-t border-[#eaecf0] bg-[#f9fafb] flex justify-end shrink-0 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes timetableModalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes timetableFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, .print\\:block, [className*="print:"] {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};


/* ─── 4. TIMETABLE BULK UPLOAD MODAL ─── */
interface TimetableBulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (filename: string) => void;
}

export const TimetableBulkUploadModal: React.FC<TimetableBulkUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        setSelectedFile(file);
      } else {
        alert("Only CSV or Excel files are allowed!");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsUploading(false);
    onUploadSuccess(selectedFile.name);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[540px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <h2 className="text-base font-bold text-[#101828]">Upload Bulk Timetable</h2>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f2f4f7] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          {/* Dropzone Border box */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer h-[180px] ${dragActive
              ? 'border-[#0e1680] bg-[#f2f4fd]/50'
              : selectedFile
                ? 'border-emerald-400 bg-emerald-50/10'
                : 'border-[#eaecf0] hover:border-gray-300'
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv, .xlsx, .xls"
              onChange={handleChange}
            />

            {/* Cloud Icon */}
            <div className="w-10 h-10 rounded-full bg-[#f2f4fd] flex items-center justify-center text-[#0e1680]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            {selectedFile ? (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[#0e1680]">{selectedFile.name}</span>
                <span className="text-xs text-[#667085]">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">
                  <span className="text-[#0e1680] hover:underline">Click to upload</span>
                  <span className="text-[#667085]"> or drag and drop</span>
                </p>
                <span className="text-xs text-[#98a2b3]">CSV or excel</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#eaecf0] bg-[#f9fafb] flex items-center justify-center gap-3">
          <button
            onClick={handleUploadSubmit}
            disabled={!selectedFile || isUploading}
            className="w-full max-w-[140px] py-2 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : "Upload"}
          </button>

          <button
            onClick={onClose}
            disabled={isUploading}
            className="w-full max-w-[140px] py-2 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-md active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


/* ─── 5. TIME SLOT EDIT MODAL ─── */
interface EditTimeSlotData {
  id: string;
  semester: string;
  startTime: string;
  endTime: string;
}

interface TimeSlotEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: EditTimeSlotData | null;
  onSave: (id: string, startTime: string, endTime: string) => void;
}

export const TimeSlotEditModal: React.FC<TimeSlotEditModalProps> = ({
  isOpen,
  onClose,
  slot,
  onSave,
}) => {
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('10:00');

  // Convert 12h formatted time to 24h
  const parseTo24h = (time12h: string): string => {
    const [time, modifier] = time12h.split(' ');
    const [hoursStr, minutesStr] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    return `${hours.toString().padStart(2, '0')}:${minutesStr}`;
  };

  // Convert 24h to 12h formatted time
  const formatTime12h = (time24h: string): string => {
    const [hoursStr, minutesStr] = time24h.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
  };

  React.useEffect(() => {
    if (isOpen && slot) {
      setStartTime(parseTo24h(slot.startTime));
      setEndTime(parseTo24h(slot.endTime));
    }
  }, [isOpen, slot]);

  if (!isOpen || !slot) return null;

  const handleSave = () => {
    onSave(slot.id, formatTime12h(startTime), formatTime12h(endTime));
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#101828]">Time Slot</span>
            <Pencil size={14} className="text-[#687b96]" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f2f4f7] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">

            {/* Start Time (Labeled 'Date' in Figma screenshot due to a template typo) */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-[#475467]">Date</label>
              <div className="relative">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-xs text-[#101828] focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#687b96]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
              </div>
            </div>

            {/* End Time (Labeled 'Time Slot' in Figma screenshot) */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-semibold text-[#475467]">Time Slot</label>
              <div className="relative">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-xs text-[#101828] focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm pr-10"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#687b96]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ─── 6. SUBJECT ALLOCATION DELETE MODAL ─── */
interface SubjectAllocationDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: { courseTitle: string; courseCode: string } | null;
  onConfirm: () => void;
}

export const SubjectAllocationDeleteModal: React.FC<SubjectAllocationDeleteModalProps> = ({
  isOpen,
  onClose,
  allocation,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) setIsDeleting(false);
  }, [isOpen]);

  if (!isOpen || !allocation) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsDeleting(false);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[510px] min-h-[424px] rounded-2xl shadow-2xl px-6 py-8 flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-200"
      >
        <DeleteSuccessIcon size={120} />

        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-semibold text-[#101828]">Delete Allocation?</p>
          <p className="text-xs text-[#667085] leading-relaxed">
            Are you sure you want to delete the exam allocation for <span className="font-semibold text-[#0e1680]">{allocation.courseTitle} ({allocation.courseCode})</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full mt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2 bg-[#d92d20] hover:bg-[#b01b0f] text-white text-sm font-semibold rounded-lg active:scale-[0.97] transition-all shadow-sm disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2 border border-[#d0d5dd] text-sm font-semibold text-[#344054] rounded-lg bg-white hover:bg-gray-50 active:scale-[0.97] transition-all shadow-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


/* ─── 7. SUBJECT ALLOCATION VIEW MODAL ─── */
interface SubjectAllocationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: {
    startTime: string;
    endTime: string;
    courseTitle: string;
    courseCode: string;
    dateDay: string;
    shift?: string;
  } | null;
}

export const SubjectAllocationViewModal: React.FC<SubjectAllocationViewModalProps> = ({
  isOpen,
  onClose,
  allocation,
}) => {
  if (!isOpen || !allocation) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <span className="text-sm font-bold text-[#101828]">Allocation Details</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f2f4f7] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#687b96] uppercase tracking-wider">Course Title</span>
            <span className="text-sm font-bold text-[#101828]">{allocation.courseTitle}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#687b96] uppercase tracking-wider">Course Code</span>
              <span className="text-xs font-semibold text-[#475467]">{allocation.courseCode}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#687b96] uppercase tracking-wider">Exam Shift</span>
              <span className="text-xs font-semibold text-[#475467]">{allocation.shift || 'Morning'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#687b96] uppercase tracking-wider">Date</span>
              <span className="text-xs font-semibold text-[#475467]">{allocation.dateDay}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-[#687b96] uppercase tracking-wider">Time Slot</span>
              <span className="text-xs font-bold text-[#0e1680]">{allocation.startTime} - {allocation.endTime}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#eaecf0] bg-[#f9fafb] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0e1680] text-white text-xs font-semibold rounded-lg hover:bg-blue-900 shadow transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


/* ─── 8. SUBJECT ALLOCATION EDIT MODAL ─── */
interface SubjectAllocationEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocation: {
    startTime: string;
    endTime: string;
    courseTitle: string;
    courseCode: string;
    dateDay: string;
    shift?: string;
  } | null;
  availableDates: string[];
  onSave: (
    oldAlloc: any,
    newAlloc: {
      startTime: string;
      endTime: string;
      courseTitle: string;
      courseCode: string;
      dateDay: string;
    }
  ) => void;
}

export const SubjectAllocationEditModal: React.FC<SubjectAllocationEditModalProps> = ({
  isOpen,
  onClose,
  allocation,
  availableDates,
  onSave,
}) => {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [code, setCode] = React.useState('');

  React.useEffect(() => {
    if (isOpen && allocation) {
      setDate(allocation.dateDay);
      setTime(`${allocation.startTime} to ${allocation.endTime}`);
      setTitle(allocation.courseTitle);
      setCode(allocation.courseCode);
    }
  }, [isOpen, allocation]);

  if (!isOpen || !allocation) return null;

  const handleSave = () => {
    if (!date || !time || !title || !code) {
      alert("Please select all details!");
      return;
    }

    const parts = time.split(' to ');
    const start = parts[0] || '10:00 AM';
    const end = parts[1] || '11:00 AM';

    onSave(allocation, {
      startTime: start,
      endTime: end,
      courseTitle: title,
      courseCode: code,
      dateDay: date,
    });
    onClose();
  };

  const inputClass = "w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-xs text-[#101828] focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#101828]">Edit Subject Exam Allocation</span>
            <Pencil size={14} className="text-[#687b96]" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#667085] hover:bg-[#f2f4f7] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">Select Date</label>
            <select value={date} onChange={(e) => setDate(e.target.value)} className={inputClass}>
              <option value="" disabled hidden>Select Date</option>
              {availableDates.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475467]">Select Time Slot</label>
            <select value={time} onChange={(e) => setTime(e.target.value)} className={inputClass}>
              <option value="" disabled hidden>Select Time Slot</option>
              <option value="09:00 AM to 10:00 AM">09:00 AM to 10:00 AM</option>
              <option value="10:00 AM to 11:00 AM">10:00 AM to 11:00 AM</option>
              <option value="11:15 AM to 12:15 PM">11:15 AM to 12:15 PM</option>
              <option value="12:00 AM to 01:00 PM">12:00 AM to 01:00 PM</option>
              <option value="01:00 PM to 02:00 PM">01:00 PM to 02:00 PM</option>
              <option value="02:00 PM to 03:00 PM">02:00 PM to 03:00 PM</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#475467]">Select Course Title</label>
              <select value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass}>
                <option value="" disabled hidden>Select Course Title</option>
                <option value="Operating System">Operating System</option>
                <option value="Automata Theory">Automata Theory</option>
                <option value="Communication">Communication</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#475467]">Select Course Code</label>
              <select value={code} onChange={(e) => setCode(e.target.value)} className={inputClass}>
                <option value="" disabled hidden>Select Course Code</option>
                <option value="CO1919">CO1919</option>
                <option value="CO1920">CO1920</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-[#0e1680] hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ─── 9. TIME SLOT DELETE MODAL ─── */
interface TimeSlotDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: { semester: string; startTime: string; endTime: string } | null;
  onConfirm: () => void;
}

export const TimeSlotDeleteModal: React.FC<TimeSlotDeleteModalProps> = ({
  isOpen,
  onClose,
  slot,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) setIsDeleting(false);
  }, [isOpen]);

  if (!isOpen || !slot) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 500));
    setIsDeleting(false);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[510px] min-h-[424px] rounded-2xl shadow-2xl px-6 py-8 flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-200">
        <DeleteSuccessIcon size={120} />

        <div className="flex flex-col gap-2">
          <p className="text-[24px] font-semibold text-[#101828]">Delete Time Slot?</p>
          <p className="text-xs text-[#667085] leading-relaxed">
            Are you sure you want to delete the time slot{' '}
            <span className="font-semibold text-[#0e1680]">{slot.startTime} – {slot.endTime}</span>{' '}
            for Semester <span className="font-semibold text-[#0e1680]">{slot.semester}</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full mt-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-2 bg-[#d92d20] hover:bg-[#b01b0f] text-white text-sm font-semibold rounded-lg active:scale-[0.97] transition-all shadow-sm disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2 border border-[#d0d5dd] text-sm font-semibold text-[#344054] rounded-lg bg-white hover:bg-gray-50 active:scale-[0.97] transition-all shadow-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── 8. TIMETABLE EDIT MODAL (View Timetables Tab) ─── */
interface TimetableEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  timetableData: any; // We use any for the mock data for now
}

export const TimetableEditModal: React.FC<TimetableEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  timetableData
}) => {
  if (!isOpen || !timetableData) return null;

  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm";
  const labelClass = "text-xs font-semibold text-[#344054]";

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-bold text-[#101828]">Edit Timetable Details</h3>
            <Pencil size={18} className="text-[#667085]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#667085] hover:text-[#101828] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Select Academic Year</label>
              <select className={inputClass} defaultValue={timetableData.year}>
                <option value="FE">FE</option>
                <option value="SE">SE</option>
                <option value="TE">TE</option>
                <option value="BE">BE</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Select Semester</label>
              <select className={inputClass} defaultValue={timetableData.semester}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Select Branch</label>
              <select className={inputClass} defaultValue="Information Technology">
                <option value="Information Technology">Information Technology</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>No of Courses</label>
              <select className={inputClass} defaultValue="4">
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Examination Type</label>
            <select className={inputClass} defaultValue="Internal Assessment 1">
              <option value="Internal Assessment 1">Internal Assessment 1</option>
              <option value="Internal Assessment 2">Internal Assessment 2</option>
              <option value="End Semester">End Semester</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Start Date</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="10-05-2025"
                  className={inputClass}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#687b96]">
                  <Calendar size={18} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>End Date</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue="14-05-2025"
                  className={inputClass}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#687b96]">
                  <Calendar size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Add Subject - Slot List */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className={labelClass}>Add Subject - Slot</label>
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-[#f2f4fd] border border-[#e5e7fb] rounded-xl grid grid-cols-4 gap-3">
                  <select className={inputClass} defaultValue="10-05-2025">
                    <option value="10-05-2025">10-05-2025</option>
                    <option value="11-05-2025">11-05-2025</option>
                  </select>
                  <select className={inputClass} defaultValue="10:00 AM - 11:00 AM">
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:15 AM - 12:15 PM">11:15 AM - 12:15 PM</option>
                  </select>
                  <select className={inputClass} defaultValue="Operating System">
                    <option value="Operating System">Operating System</option>
                    <option value="Automata Theory">Automata Theory</option>
                  </select>
                  <select className={inputClass} defaultValue="CO1919">
                    <option value="CO1919">CO1919</option>
                    <option value="CO1920">CO1920</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#eaecf0] flex justify-end bg-[#f9fafb] rounded-b-2xl">
          <button
            type="button"
            onClick={onSave}
            className="px-8 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 shadow-md cursor-pointer transition-all active:scale-95"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
};

/* ─── 9. TIMETABLE VIEW DETAILS MODAL (View Timetables Tab) ─── */
interface TimetableViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableData: any; // We use any for the mock data for now
}

export const TimetableViewDetailsModal: React.FC<TimetableViewDetailsModalProps> = ({
  isOpen,
  onClose,
  timetableData
}) => {
  if (!isOpen || !timetableData) return null;

  const inputClass = "w-full px-3.5 py-2.5 bg-[#f9fafb] border border-[#eaecf0] rounded-lg text-sm text-[#101828] opacity-80 cursor-default";
  const labelClass = "text-xs font-semibold text-[#344054]";

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <h3 className="text-[18px] font-bold text-[#101828]">View Timetable Details</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#667085] hover:text-[#101828] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 pb-8">
          
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Select Academic Year</label>
              <div className={inputClass}>{timetableData.year}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Select Semester</label>
              <div className={inputClass}>{timetableData.semester}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Select Branch</label>
              <div className={inputClass}>Information Technology</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>No of Courses</label>
              <div className={inputClass}>4</div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Examination Type</label>
            <div className={inputClass}>Internal Assessment 1</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Start Date</label>
              <div className={inputClass}>10-05-2025</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>End Date</label>
              <div className={inputClass}>14-05-2025</div>
            </div>
          </div>

          {/* View Subject - Slot List */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className={labelClass}>View Subject - Slot</label>
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-white border border-[#eaecf0] rounded-xl grid grid-cols-4 gap-3 shadow-sm">
                  <div className={inputClass}>10-05-2025</div>
                  <div className={inputClass}>10:00 AM - 11:00 AM</div>
                  <div className={inputClass}>Operating System</div>
                  <div className={inputClass}>CO1919</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ─── 10. TIMETABLE VIEW DELETE MODAL (View Timetables Tab) ─── */
interface TimetableViewDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TimetableViewDeleteModal: React.FC<TimetableViewDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) setIsDeleting(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsDeleting(false);
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center text-center gap-6 animate-in zoom-in-95 duration-200">
        
        {/* Red Alert Icon matching Figma */}
        <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full border-[3px] border-[#d92d20] text-[#d92d20] mb-2">
          <AlertCircle size={40} strokeWidth={2.5} />
        </div>

        <h3 className="text-[18px] font-bold text-[#101828] leading-snug px-4">
          Do you really want to delete this<br/>Timetable details ?
        </h3>

        <div className="flex items-center gap-4 w-full mt-4 justify-center">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-8 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-75 flex items-center justify-center min-w-[120px]"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-8 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-75 min-w-[120px]"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

/* ─── 11. MERGED TIMETABLE VIEW MODAL (Merge Tab) ─── */
interface MergedTimetableViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MergedTimetableViewModal: React.FC<MergedTimetableViewModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const mockData = [
    { date: "25/05/2026\nThursday", s4a: "ABC", s4b: "ABC", s6a: "ABC", s6b: "ABC", s8a: "ABC", s8b: "ABC" },
    { date: "26/05/2026\nFriday", s4a: "XYZ", s4b: "XYZ", s6a: "XYZ", s6b: "XYZ", s8a: "XYZ", s8b: "XYZ" },
    { date: "29/05/2026\nMonday", s4a: "ABC", s4b: "ABC", s6a: "ABC", s6b: "ABC", s8a: "ABC", s8b: "ABC" },
  ];

  const handleDownload = () => {
    const doc = new jsPDF('landscape');
    
    doc.setFontSize(14);
    doc.text("Timetable - Information Technology", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [
        [
          { content: 'Date', rowSpan: 3, styles: { halign: 'center', valign: 'middle', fillColor: [248, 249, 252] } },
          { content: 'Information Technology', colSpan: 6, styles: { halign: 'center', fillColor: [248, 249, 252] } }
        ],
        [
          { content: 'SEM 4', colSpan: 2, styles: { halign: 'center', fillColor: [248, 249, 252] } },
          { content: 'SEM 6', colSpan: 2, styles: { halign: 'center', fillColor: [248, 249, 252] } },
          { content: 'SEM 8', colSpan: 2, styles: { halign: 'center', fillColor: [248, 249, 252] } }
        ],
        [
          { content: '10:00 - 11:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
          { content: '3:00 - 4:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
          { content: '10:00 - 11:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
          { content: '3:00 - 4:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
          { content: '10:00 - 11:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
          { content: '3:00 - 4:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } }
        ]
      ],
      body: mockData.map(row => [
        row.date, row.s4a, row.s4b, row.s6a, row.s6b, row.s8a, row.s8b
      ]),
      styles: { halign: 'center', valign: 'middle', textColor: [71, 84, 103] },
      headStyles: { textColor: [16, 24, 40], lineColor: [234, 236, 240], lineWidth: 0.1 },
      theme: 'grid'
    });

    doc.save("Merged_Timetable_IT.pdf");
  };

  const thClass = "border border-gray-300 px-4 py-6 text-center text-[13px] font-medium text-gray-800 bg-white";
  const tdClass = "border border-gray-300 px-4 py-8 text-center text-[13px] text-gray-700 bg-white";

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-[1000px] max-h-[90vh] flex flex-col rounded-xl shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <h3 className="text-[16px] font-bold text-[#101828]">Timetable - Information Technology</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#667085] hover:text-[#101828] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-8 bg-white">
          <table className="w-full border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr>
                <th rowSpan={3} className={thClass + " w-[140px]"}>Date</th>
                <th colSpan={6} className={thClass}>Information Technology</th>
              </tr>
              <tr>
                <th colSpan={2} className={thClass}>SEM 4</th>
                <th colSpan={2} className={thClass}>SEM 6</th>
                <th colSpan={2} className={thClass}>SEM 8</th>
              </tr>
              <tr>
                <th className={thClass}>10:00 - 11:00 AM</th>
                <th className={thClass}>3:00 - 4:00 AM</th>
                <th className={thClass}>10:00 - 11:00 AM</th>
                <th className={thClass}>3:00 - 4:00 AM</th>
                <th className={thClass}>10:00 - 11:00 AM</th>
                <th className={thClass}>3:00 - 4:00 AM</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className={tdClass + " whitespace-pre-line leading-relaxed"}>{row.date}</td>
                  <td className={tdClass}>{row.s4a}</td>
                  <td className={tdClass}>{row.s4b}</td>
                  <td className={tdClass}>{row.s6a}</td>
                  <td className={tdClass}>{row.s6b}</td>
                  <td className={tdClass}>{row.s8a}</td>
                  <td className={tdClass}>{row.s8b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-6 bg-white rounded-b-xl border-t border-[#eaecf0]">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Download <Download size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Back
          </button>
        </div>

      </div>
    </div>
  );
};
