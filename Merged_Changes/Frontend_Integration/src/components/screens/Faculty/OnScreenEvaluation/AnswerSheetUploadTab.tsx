import React, { useState } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, X, CheckCircle } from 'lucide-react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import samplePdf from '../../../../assets/Sample_Pdfs/Sample_Ans_Sheet.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface AnswerSheetRecord {
  id: string;
  seatNo: string;
  studentName: string;
  semester: number;
  status: 'Not Uploaded' | 'Uploaded';
}

const initialMockData: AnswerSheetRecord[] = [
  { id: '1', seatNo: '499303', studentName: 'Abc', semester: 8, status: 'Not Uploaded' },
  { id: '2', seatNo: '499304', studentName: 'Xyz', semester: 7, status: 'Uploaded' },
  { id: '3', seatNo: '499305', studentName: 'Lmn', semester: 8, status: 'Not Uploaded' },
  { id: '4', seatNo: '499306', studentName: 'Pqr', semester: 7, status: 'Not Uploaded' },
  { id: '5', seatNo: '499307', studentName: 'Def', semester: 8, status: 'Uploaded' },
  { id: '6', seatNo: '499308', studentName: 'Ghi', semester: 7, status: 'Not Uploaded' },
  { id: '7', seatNo: '499309', studentName: 'Jkl', semester: 8, status: 'Not Uploaded' },
];

export const AnswerSheetUploadTab: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseTitle, setCourseTitle] = useState('Operating System');
  const [records, setRecords] = useState<AnswerSheetRecord[]>(initialMockData);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<AnswerSheetRecord | null>(null);
  const [successRecord, setSuccessRecord] = useState<AnswerSheetRecord | null>(null);
  const [isReuploading, setIsReuploading] = useState(false);
  const [isFinalSubmitSuccessOpen, setIsFinalSubmitSuccessOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  const PAGE_SIZE = 5;
  const filteredRecords = records.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.seatNo.includes(searchTerm)
  );
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const displayedRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleUploadClick = (id: string, reupload = false) => {
    setActiveUploadId(id);
    setIsReuploading(reupload);
    document.getElementById('file-upload-answersheet')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && activeUploadId) {
      const recordToUpdate = records.find(r => r.id === activeUploadId);
      
      setRecords(prev => prev.map(record => 
        record.id === activeUploadId ? { ...record, status: 'Uploaded' } : record
      ));
      
      if (recordToUpdate) {
        setSuccessRecord(recordToUpdate);
      }
      
      setActiveUploadId(null);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden file input for uploads */}
      <input 
        type="file" 
        id="file-upload-answersheet" 
        className="hidden" 
        accept=".pdf,.xlsx,.xls" 
        onChange={handleFileChange} 
      />
      {/* Course Title Selection */}
      <div className="flex flex-col gap-1.5 w-full md:w-1/2 lg:w-1/3">
        <label className="text-[14px] font-medium text-[#344054]">Select Course Title</label>
        <div className="relative">
          <select 
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none outline-none focus:border-[#0E1680] focus:ring-1 focus:ring-[#0E1680]"
          >
            <option value="Operating System">Operating System</option>
            <option value="Networking">Networking</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Download Template Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0E1680] text-white rounded-lg text-sm font-medium hover:bg-[#0E1680]/90 transition-colors shadow-sm">
          Download Template For Bulk Entry <Download size={16} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-end gap-3 mt-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
          <input 
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-9 pr-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm outline-none focus:border-[#0e1680] focus:ring-1 focus:ring-[#0e1680] w-[240px]"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
          Semester <Filter size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
          Course <Filter size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
          Year <Filter size={16} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50 transition-colors">
          Status <Filter size={16} />
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <p className="text-[13px] font-medium text-[#475467]">File Format : .pdf & .excel</p>
        </div>
        
        <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb]">
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Sr no.</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Seat No</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Student Name</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Semester</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Status</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Upload Answer Sheets</th>
                </tr>
              </thead>
              <tbody>
                {displayedRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors border-b border-[#eaecf0]">
                    <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                    <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.seatNo}</td>
                    <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.studentName}</td>
                    <td className="px-6 py-4 text-[14px] text-[#0E1680] font-medium text-center">{record.semester}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                        record.status === 'Not Uploaded' 
                          ? 'bg-[#FEF3F2] text-[#B42318]' 
                          : 'bg-[#DCFCE7] text-[#15803D]'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center">
                      {record.status === 'Not Uploaded' ? (
                        <button 
                          onClick={() => handleUploadClick(record.id)}
                          className="w-[120px] px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm text-center"
                        >
                          Upload
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUploadClick(record.id)}
                          className="w-[120px] px-4 py-2 bg-[#A5B4FC] text-white text-[13px] font-medium rounded-lg shadow-sm text-center transition-colors hover:bg-[#A5B4FC]/90"
                        >
                          Upload
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {displayedRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#667085] font-medium">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#eaecf0]">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    page === currentPage 
                      ? 'bg-[#f9fafb] text-[#1d2939]' 
                      : 'text-[#475467] hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button 
          onClick={() => setIsReviewModalOpen(true)}
          className="px-6 py-2.5 bg-[#0E1680] text-white text-[14px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
        >
          Submit
        </button>
      </div>

      {/* Review Before Final Submit Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[900px] max-w-[95vw] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#eaecf0]">
              <h2 className="text-[18px] font-bold text-[#101828]">Review Before Final Submit</h2>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-[#667085] hover:text-[#101828] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body / Table */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f9fafb]">
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Sr no.</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Seat No</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Student Name</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Semester</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">View Answer Sheets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, index) => (
                        <tr key={record.id} className="hover:bg-gray-50 transition-colors border-b border-[#eaecf0]">
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{index + 1}</td>
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.seatNo}</td>
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.studentName}</td>
                          <td className="px-6 py-4 text-[14px] text-[#0E1680] font-medium text-center">{record.semester}</td>
                          <td className="px-6 py-4 flex items-center justify-center gap-3">
                            <button 
                              onClick={() => setViewingRecord(record)}
                              className="w-[120px] px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm text-center"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleUploadClick(record.id, true)}
                              className="w-[120px] px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm text-center"
                            >
                              Re-Upload
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-[#eaecf0]">
                  <button 
                    disabled
                    className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] transition-colors shadow-sm disabled:opacity-50 cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, '...', 8, 9, 10].map((page, idx) => (
                      <button
                        key={idx}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          page === 1 
                            ? 'bg-[#f9fafb] text-[#1d2939]' 
                            : 'text-[#475467] hover:bg-gray-50'
                        } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button 
                    className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Submit Button */}
              <div className="flex justify-end mt-6">
                <button 
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setIsFinalSubmitSuccessOpen(true);
                  }}
                  className="px-6 py-2.5 bg-[#0E1680] text-white text-[14px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
                >
                  Final Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Answer Sheet Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[900px] max-w-[95vw] h-[85vh] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex flex-col border-b border-[#eaecf0]">
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-[18px] font-bold text-[#101828]">View Answer Sheet</h2>
                <button 
                  onClick={() => setViewingRecord(null)}
                  className="text-[#667085] hover:text-[#101828] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="px-6 pb-4">
                <span className="text-[14px] font-bold text-[#101828]">Seat_no - Student_name :</span>
                <span className="text-[14px] font-medium text-[#475467] ml-2">{viewingRecord.seatNo} - {viewingRecord.studentName}</span>
              </div>
            </div>

            {/* Modal Body / PDF Viewer */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <Document
                file={samplePdf}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-col items-center"
              >
                <div className="grid grid-cols-2 gap-4 w-full max-w-[800px] mx-auto">
                  {Array.from(new Array(Math.min(numPages || 4, 4)), (el, index) => (
                    <div key={`page_${index + 1}`} className="rounded-xl shadow-sm border border-[#eaecf0] bg-white overflow-hidden flex items-center justify-center">
                      <Page
                        pageNumber={index + 1}
                        width={380}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </Document>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end px-6 py-4 border-t border-[#eaecf0] bg-white">
              <button 
                onClick={() => setViewingRecord(null)}
                className="px-6 py-2.5 bg-[#0E1680] text-white text-[14px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successRecord && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[400px] shadow-xl flex flex-col items-center p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6">
              <CheckCircle size={64} className="text-[#22C55E]" strokeWidth={2} />
            </div>
            
            <h2 className="text-[18px] font-bold text-[#101828] mb-6 text-center leading-tight">
              Answer Sheet {isReuploading ? 'Re-Uploaded' : 'Uploaded'}<br/>sucessfully!
            </h2>
            
            <div className="flex flex-col items-center gap-1.5 mb-8">
              <p className="text-[14px] font-medium text-[#344054]">Seat no : {successRecord.seatNo}</p>
              <p className="text-[14px] font-medium text-[#344054]">Student Name : {successRecord.studentName}</p>
              <p className="text-[14px] font-medium text-[#344054]">Course ID: CO1919</p>
              <p className="text-[14px] font-medium text-[#344054]">Semester : {successRecord.semester === 8 ? 'VIII' : (successRecord.semester === 7 ? 'VII' : successRecord.semester)}</p>
              <p className="text-[14px] font-medium text-[#344054]">Course : {courseTitle}</p>
            </div>
            
            <button 
              onClick={() => setSuccessRecord(null)}
              className="px-8 py-2.5 bg-[#0E1680] text-white text-[14px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Final Submit Success Modal */}
      {isFinalSubmitSuccessOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-[400px] shadow-xl flex flex-col items-center p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="mb-6">
              <CheckCircle size={64} className="text-[#22C55E]" strokeWidth={2} />
            </div>
            
            <h2 className="text-[18px] font-bold text-[#101828] mb-6 text-center leading-tight">
              Final Submission of All the<br/>Answer Sheet performed<br/>successfully!
            </h2>
            
            <div className="flex flex-col items-center gap-1.5 mb-8">
              <p className="text-[14px] font-medium text-[#344054]">Seat no : 494001 - 494025</p>
              <p className="text-[14px] font-medium text-[#344054]">Course ID: CO1919</p>
              <p className="text-[14px] font-medium text-[#344054]">Semester : VIII</p>
              <p className="text-[14px] font-medium text-[#344054]">Course : {courseTitle}</p>
            </div>
            
            <button 
              onClick={() => setIsFinalSubmitSuccessOpen(false)}
              className="px-8 py-2.5 bg-[#0E1680] text-white text-[14px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
