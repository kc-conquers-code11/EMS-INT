import React, { useState, useEffect } from 'react';
import { X, Pencil } from 'lucide-react';
import type { Student } from '../../../types/COE/student';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (updatedStudent: Student) => void;
}

interface FieldErrors { [key: string]: string; }

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, student, onSave }) => {
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [studentName, setStudentName] = useState('ABC');
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (student) {
      setFormData(student);
      setStudentName('ABC');
      setErrors({});
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!formData.studentId?.trim()) e.studentId = 'Student ID is required';
    if (!studentName.trim()) e.studentName = 'Student Name is required';
    else if (!/^[A-Za-z\s]+$/.test(studentName)) e.studentName = 'Only alphabets and spaces are allowed';
    if (!formData.yop?.trim()) e.yop = 'Year of Passing is required';
    else if (Number(formData.yop) < 2000 || Number(formData.yop) > 2100) e.yop = 'Enter a year between 2000 and 2100';
    if (!formData.semester?.trim() || formData.semester === '') e.semester = 'Current Semester is required';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    onSave({ ...student, ...formData } as Student);
    onClose();
  };

  const base = 'w-full px-3.5 py-2.5 bg-white border rounded-lg text-[#101828] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm';
  const fi = (f: string) => errors[f] ? `${base} border-red-400 bg-red-50` : `${base} border-[#d0d5dd]`;
  const ec = 'text-xs text-red-500 mt-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[866px] overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#2c3e50] font-sans">Edit Student Details</h2>
            <Pencil size={20} className="text-[#2c3e50]" />
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} className="text-[#667085]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#344054]">Student ID</label>
              <input
                type="text"
                value={formData.studentId || ''}
                onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                className={fi('studentId')}
              />
              {errors.studentId && <p className={ec}>{errors.studentId}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#344054]">Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                className={fi('studentName')}
              />
              {errors.studentName && <p className={ec}>{errors.studentName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#344054]">YOP</label>
              <input
                type="number"
                value={formData.yop || ''}
                onChange={e => setFormData({ ...formData, yop: e.target.value })}
                className={fi('yop')}
              />
              {errors.yop && <p className={ec}>{errors.yop}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#344054]">Current Semester</label>
              <select
                value={formData.semester || ''}
                onChange={e => setFormData({ ...formData, semester: e.target.value })}
                className={`${fi('semester')} appearance-none`}
              >
                <option value="">Select Semester</option>
                {['1st','2nd','3rd','4th','5th','6th','7th','8th'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.semester && <p className={ec}>{errors.semester}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2.5 bg-[#0e1680] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors shadow-sm">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
