import React, { useRef, useState } from 'react';
import { Upload, Download, FileSpreadsheet, Trash2, Loader2 } from 'lucide-react';
import type { FacultyForm } from '../../../../types/COE/departmentSetup';
import {
  FACULTY_BULK_COLUMNS,
  downloadFacultyBulkTemplate,
  parseFacultyExcelFile,
} from '../../../../utils/facultyBulkUpload';

interface FacultyBulkUploadSectionProps {
  facultyList: FacultyForm[];
  onFacultyListChange: (list: FacultyForm[]) => void;
  disabled?: boolean;
}

export const FacultyBulkUploadSection: React.FC<FacultyBulkUploadSectionProps> = ({
  facultyList,
  onFacultyListChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setParsing(true);
    try {
      const parsed = await parseFacultyExcelFile(file);
      onFacultyListChange(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse Excel file');
      onFacultyListChange([]);
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeRow = (index: number) => {
    onFacultyListChange(facultyList.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    onFacultyListChange([]);
    setError(null);
  };

  return (
    <div className="mb-8 p-5 rounded-xl border border-[#e5e7fb] bg-[#f9fafb] space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#171822]">Bulk Upload Faculty</h3>
          <p className="text-sm text-[#667085] mt-1">
            Upload an Excel file to add multiple faculty members at once. They will be created on
            submit together with the department and HOD.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadFacultyBulkTemplate}
          disabled={disabled || parsing}
          className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#0e1680] border border-[#d0d5dd] rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <Download size={16} />
          Download Template
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FACULTY_BULK_COLUMNS.map((col) => (
          <span
            key={col}
            className="px-2 py-0.5 bg-white text-[#475467] text-xs font-medium rounded border border-[#eaecf0]"
          >
            {col}
          </span>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        disabled={disabled || parsing}
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !parsing) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (disabled || parsing) return;
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors ${
          isDragging
            ? 'border-[#0e1680] bg-[#f2f3fd]'
            : error
              ? 'border-red-300 bg-red-50'
              : facultyList.length
                ? 'border-green-300 bg-green-50'
                : 'border-[#d0d5dd] bg-white'
        }`}
      >
        {parsing ? (
          <>
            <Loader2 className="animate-spin text-[#0e1680]" size={32} />
            <span className="text-sm text-[#667085]">Parsing Excel file...</span>
          </>
        ) : (
          <>
            <FileSpreadsheet size={36} className="text-[#0e1680]" />
            <p className="text-sm text-[#344054] text-center">
              Drag & drop Excel here, or{' '}
              <button
                type="button"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
                className="text-[#0e1680] font-semibold underline disabled:opacity-50"
              >
                browse file
              </button>
            </p>
            <p className="text-xs text-[#98a2b3]">.xlsx or .xls, max 10 MB</p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {facultyList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#344054]">
              {facultyList.length} faculty record(s) ready to submit
            </span>
            <button
              type="button"
              onClick={clearAll}
              disabled={disabled}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Clear all
            </button>
          </div>
          <div className="max-h-48 overflow-auto rounded-lg border border-[#eaecf0] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f9fafb] sticky top-0">
                <tr>
                  <th className="px-3 py-2 font-medium text-[#475467]">Name</th>
                  <th className="px-3 py-2 font-medium text-[#475467]">Email</th>
                  <th className="px-3 py-2 font-medium text-[#475467]">Mobile</th>
                  <th className="px-3 py-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {facultyList.map((f, i) => (
                  <tr key={`${f.collegeEmailId}-${i}`} className="border-t border-[#eaecf0]">
                    <td className="px-3 py-2 text-[#344054]">{f.facultyName}</td>
                    <td className="px-3 py-2 text-[#667085]">{f.collegeEmailId}</td>
                    <td className="px-3 py-2 text-[#667085]">{f.mobileNumber}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        disabled={disabled}
                        className="p-1 text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                        title="Remove row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-[#667085] flex items-center gap-1">
        <Upload size={12} />
        Optional: you can still add one faculty manually below; bulk rows take priority on duplicate
        emails.
      </p>
    </div>
  );
};
