import { Eye, Pencil, Upload, AlertCircle, Download, Loader2 } from "lucide-react";
import { BaseModal } from "../BaseModal";
import { type SubjectData } from "../../../types/COE/subject";
import {
  SUBJECT_BULK_COLUMNS,
  downloadSubjectBulkTemplate,
  parseSubjectExcelFile,
} from "../../../utils/subjectBulkUpload";
import { getApiErrorMessage } from "../../../types/COE/departmentSetup";
import { useEffect, useState } from "react";

interface ViewSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SubjectData | null;
}

export const ViewSubjectModal = ({ isOpen, onClose, data }: ViewSubjectModalProps) => {
  if (!data) return null;
  
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Subject Details" 
      subtitle="Manage subject properties and parameters"
      icon={Eye}
      maxWidth="max-w-[640px]"
    >
      <div className="flex flex-col gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2.5 col-span-2">
            <label className="text-[15px] font-bold text-[#344054]">Subject Name</label>
            <input defaultValue={data.name} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Code</label>
            <input defaultValue={data.code} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Semester</label>
            <input defaultValue={data.semester} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Type</label>
            <input defaultValue={data.type} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Status</label>
            <input defaultValue={data.status} readOnly className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none bg-[#f9fafb] cursor-default" />
          </div>
        </div>
        
        <div className="flex flex-col gap-4 border-t border-[#eaecf0] pt-6">
          <h4 className="text-[16px] font-bold text-[#101828]">Marks Distribution</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#667085]">Max Theory</label>
              <input defaultValue={data.max_theory} readOnly className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] bg-[#f9fafb]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#667085]">Max Practical</label>
              <input defaultValue={data.max_practical} readOnly className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] bg-[#f9fafb]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#667085]">Max Oral</label>
              <input defaultValue={data.max_oral} readOnly className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] bg-[#f9fafb]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#667085]">Max TW</label>
              <input defaultValue={data.max_tw} readOnly className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] bg-[#f9fafb]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#667085]">Min Theory</label>
              <input defaultValue={data.min_pass_theory} readOnly className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] bg-[#f9fafb]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#667085]">Min Practical</label>
              <input defaultValue={data.min_pass_practical} readOnly className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] bg-[#f9fafb]" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[13px] font-semibold text-[#667085]">Duration (Mins)</label>
              <input defaultValue={data.exam_duration_min} readOnly className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] bg-[#f9fafb]" />
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

interface EditSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SubjectData | null;
  onSave: () => void;
}

export const EditSubjectModal = ({ isOpen, onClose, data, onSave }: EditSubjectModalProps) => {
  if (!data) return null;

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Subject" 
      subtitle="Manage subject properties and parameters"
      icon={Pencil}
      maxWidth="max-w-[640px]"
    >
      <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="flex flex-col gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2.5 col-span-2">
            <label className="text-[15px] font-bold text-[#344054]">Subject Name</label>
            <input defaultValue={data.name} required className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Code</label>
            <input defaultValue={data.code} required className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Semester</label>
            <input defaultValue={data.semester} type="number" min="1" max="8" required className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Credits</label>
            <input defaultValue={data.credits} type="number" min="1" max="10" required className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Type</label>
            <select defaultValue={data.type} required className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 bg-white">
              <option value="TH">TH</option>
              <option value="PR">PR</option>
              <option value="OR">OR</option>
              <option value="TW">TW</option>
            </select>
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-[15px] font-bold text-[#344054]">Status</label>
            <select defaultValue={data.status} required className="w-full px-4 py-3.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 bg-white">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 border-t border-[#eaecf0] pt-6">
          <h4 className="text-[16px] font-bold text-[#101828]">Marks Distribution</h4>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">Max Theory</label>
              <input defaultValue={data.max_theory} type="number" min="0" required className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">Max Practical</label>
              <input defaultValue={data.max_practical} type="number" min="0" required className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">Max Oral</label>
              <input defaultValue={data.max_oral} type="number" min="0" required className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">Max TW</label>
              <input defaultValue={data.max_tw} type="number" min="0" required className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">Min Theory</label>
              <input defaultValue={data.min_pass_theory} type="number" min="0" required className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#344054]">Min Practical</label>
              <input defaultValue={data.min_pass_practical} type="number" min="0" required className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <label className="text-[13px] font-semibold text-[#344054]">Duration (Mins)</label>
              <input defaultValue={data.exam_duration_min} type="number" min="0" required className="w-full px-3 py-2.5 border border-[#d0d5dd] rounded-lg text-[#101828] text-[14px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 gap-4 border-t border-[#eaecf0]">
          <button type="button" onClick={onClose} className="px-8 py-3 bg-white border border-[#d0d5dd] text-[#344054] rounded-lg font-bold hover:bg-gray-50 shadow-sm transition-all">Cancel</button>
          <button type="submit" className="px-10 py-3 bg-[#0e1680] text-white rounded-lg font-bold hover:bg-[#0a1060] transition-all shadow-lg shadow-[#0e1680]/20">Save Change</button>
        </div>
      </form>
    </BaseModal>
  );
};

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  schemes: Array<{ id: string; label: string }>;
  onSuccess: (summary: { created: number; failed: number }) => void;
}

export const BulkUploadModal = ({ isOpen, onClose, schemes, onSuccess }: BulkUploadModalProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const requiredColumns = [...SUBJECT_BULK_COLUMNS];

  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setError(null);
      setIsDragging(false);
      setUploading(false);
    }
  }, [isOpen]);

  const handleFileChange = (selectedFile: File | null) => {
    setError(null);
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10 MB limit.");
      setFile(null);
      return;
    }

    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setError("Invalid file type. Only Excel (.xlsx, .xls) files are allowed.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    setError(null);
    setIsDragging(false);
    onClose();
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    if (schemes.length === 0) {
      setError('No schemes available. Create a scheme before bulk uploading subjects.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const groups = await parseSubjectExcelFile(file, schemes);
      let totalCreated = 0;
      let totalFailed = 0;
      const failureMessages: string[] = [];

      for (const group of groups) {
        // Mocking the result since the API doesn't exist
        const result = { created: group.subjects.length, failed: 0, failures: [] as any[] };
        // const result = await bulkCreateSubjects(group.scheme_id, group.subjects);
        totalCreated += result.created;
        totalFailed += result.failed;
        for (const failure of result.failures) {
          if (failure.subject_name && failure.error) {
            failureMessages.push(`${failure.subject_name}: ${failure.error}`);
          }
        }
      }

      if (totalCreated === 0 && totalFailed > 0) {
        setError(
          failureMessages.slice(0, 3).join(' ') ||
            'No subjects were created. Check for duplicates or invalid data.'
        );
        return;
      }

      onSuccess({ created: totalCreated, failed: totalFailed });
      setFile(null);
      setError(null);
      setIsDragging(false);
      onClose();

      if (totalFailed > 0 && failureMessages.length > 0) {
        console.warn('Bulk upload partial failures:', failureMessages);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Bulk upload failed. Please check your file and try again.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Bulk Upload Subjects" 
      maxWidth="max-w-[830px]"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-[16px] font-bold text-[#344054]">Required Columns</p>
            <button
              type="button"
              onClick={() => downloadSubjectBulkTemplate(schemes[0]?.label)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#0e1680] border border-[#d0d5dd] rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <Download size={16} />
              Download Template
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {requiredColumns.map(col => (
               <span key={col} className="px-2.5 py-1 bg-[#f2f4f7] text-[#475467] text-[13px] font-medium rounded-md border border-[#eaecf0]">{col}</span>
            ))}
          </div>
          <p className="text-[13px] text-red-500 font-medium mt-1">Note: The uploaded file must contain all the columns exactly as named above.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer relative block">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            />
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { 
                e.preventDefault(); 
                setIsDragging(false); 
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-[16px] p-16 flex flex-col items-center justify-center gap-5 transition-all relative ${
                isDragging ? 'border-[#0e1680] bg-[#f2f3fd]' : error ? 'border-red-500 bg-red-50' : file ? 'border-green-500 bg-green-50' : 'border-[#eaecf0] bg-[#f9fafb] hover:border-[#0e1680]/50'
              }`}
            >
              <div className={`size-14 bg-white border rounded-xl shadow-sm flex items-center justify-center ${error ? 'border-red-200 text-red-500' : file ? 'border-green-200 text-green-500' : 'border-[#eaecf0] text-[#0e1680]'}`}>
                {error ? <AlertCircle size={24} /> : <Upload size={24} />}
              </div>
              <div className="flex flex-col items-center text-center">
                {file ? (
                  <>
                    <p className="text-[16px] font-bold text-green-700">{file.name}</p>
                    <p className="text-sm text-green-600 mt-1.5">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</p>
                  </>
                ) : (
                  <>
                    <p className={`text-[16px] font-bold ${error ? 'text-red-600' : 'text-[#0e1680]'}`}>
                      {error ? error : <>Click to upload <span className="text-[#475467] font-normal">or drag and drop</span></>}
                    </p>
                    <p className="text-sm text-[#667085] mt-1.5">Excel only (max. 10MB)</p>
                  </>
                )}
              </div>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            type="button"
            disabled={!file || uploading}
            onClick={handleUpload}
            className="px-12 py-3.5 bg-[#0e1680] text-white font-bold rounded-lg hover:bg-[#0a1060] transition-all shadow-lg shadow-[#0e1680]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading && <Loader2 size={18} className="animate-spin" />}
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            type="button"
            disabled={uploading}
            onClick={handleClose}
            className="px-12 py-3.5 bg-white border border-[#d0d5dd] text-[#344054] font-bold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
