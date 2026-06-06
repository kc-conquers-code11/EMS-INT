import React, { useState, useRef } from 'react';
import { Search, Filter, Eye, User, FileText, FileQuestion, Files, ChevronLeft, ChevronRight, X, CheckCircle } from 'lucide-react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import samplePdf from '../../../../assets/Sample_Pdfs/Sample_Ans_Sheet.pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface EvaluationRecord {
  id: string;
  courseTitle: string;
  courseCode: string;
  semester: number;
  noOfStudents: number;
  status: 'Pending' | 'Complete';
}

const initialMockData: EvaluationRecord[] = [
  { id: '1', courseTitle: 'Operating System', courseCode: 'CO1919', semester: 8, noOfStudents: 120, status: 'Pending' },
  { id: '2', courseTitle: 'Networking', courseCode: 'CO1918', semester: 7, noOfStudents: 120, status: 'Complete' },
  { id: '3', courseTitle: 'Database Systems', courseCode: 'CO1920', semester: 8, noOfStudents: 70, status: 'Pending' },
  { id: '4', courseTitle: 'Machine Learning', courseCode: 'CO1921', semester: 8, noOfStudents: 60, status: 'Pending' },
  { id: '5', courseTitle: 'Data Structures', courseCode: 'CO1915', semester: 6, noOfStudents: 150, status: 'Complete' },
  { id: '6', courseTitle: 'Algorithms', courseCode: 'CO1916', semester: 6, noOfStudents: 150, status: 'Pending' },
];

const mockUploadedData = [
  { id: '1', seatNo: '499303', studentName: 'Abc', semester: 8 },
  { id: '2', seatNo: '499304', studentName: 'Xyz', semester: 7 },
  { id: '3', seatNo: '499305', studentName: 'Lmn', semester: 8 },
  { id: '4', seatNo: '499306', studentName: 'Pqr', semester: 8 },
  { id: '5', seatNo: '499307', studentName: 'Def', semester: 7 },
  { id: '6', seatNo: '499308', studentName: 'Ghi', semester: 8 },
];

export interface OnScreenEvaluationDashboardProps {
  onNavigateToUpload?: () => void;
  onNavigateToEvaluate?: () => void;
}

export const OnScreenEvaluationDashboard: React.FC<OnScreenEvaluationDashboardProps> = ({ onNavigateToUpload, onNavigateToEvaluate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<EvaluationRecord[]>(initialMockData);
  
  // Inner Modals Pagination
  const [viewUploadedPage, setViewUploadedPage] = useState(1);
  const [reUploadPage, setReUploadPage] = useState(1);

  const [viewUploadedCourseId, setViewUploadedCourseId] = useState<string | null>(null);
  const [reUploadCourseId, setReUploadCourseId] = useState<string | null>(null);
  const [viewingRecord, setViewingRecord] = useState<{ seatNo: string; studentName: string } | null>(null);
  const [successRecord, setSuccessRecord] = useState<any | null>(null);
  const [isBulkSuccessOpen, setIsBulkSuccessOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PAGE_SIZE = 5;

  // Main table processing
  const filteredRecords = records.filter(r => 
    r.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
  const displayedRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Modals table processing
  const MODAL_PAGE_SIZE = 4;
  const viewUploadedTotalPages = Math.max(1, Math.ceil(mockUploadedData.length / MODAL_PAGE_SIZE));
  const viewUploadedDisplayed = mockUploadedData.slice((viewUploadedPage - 1) * MODAL_PAGE_SIZE, viewUploadedPage * MODAL_PAGE_SIZE);

  const reUploadTotalPages = Math.max(1, Math.ceil(mockUploadedData.length / MODAL_PAGE_SIZE));
  const reUploadDisplayed = mockUploadedData.slice((reUploadPage - 1) * MODAL_PAGE_SIZE, reUploadPage * MODAL_PAGE_SIZE);

  const handleSingleReUpload = (record: any) => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
          setSuccessRecord(record);
          e.target.value = '';
        }
      };
      fileInputRef.current.click();
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#f8f9fc] rounded-xl p-6 flex flex-col items-center justify-center text-center border border-[#eaecf0]">
          <User className="text-[#344054] mb-3" size={24} />
          <h3 className="text-[28px] font-bold text-[#101828] mb-1">2000</h3>
          <p className="text-[12px] font-medium text-[#475467]">Total Students Enrolled</p>
        </div>
        <div className="bg-[#f8f9fc] rounded-xl p-6 flex flex-col items-center justify-center text-center border border-[#eaecf0]">
          <FileText className="text-[#344054] mb-3" size={24} />
          <h3 className="text-[28px] font-bold text-[#101828] mb-1">100</h3>
          <p className="text-[12px] font-medium text-[#475467]">Answer Sheets Uploaded</p>
        </div>
        <div className="bg-[#f8f9fc] rounded-xl p-6 flex flex-col items-center justify-center text-center border border-[#eaecf0]">
          <FileQuestion className="text-[#344054] mb-3" size={24} />
          <h3 className="text-[28px] font-bold text-[#101828] mb-1">102</h3>
          <p className="text-[12px] font-medium text-[#475467]">Answer Sheets Pending Upload</p>
        </div>
        <div className="bg-[#f8f9fc] rounded-xl p-6 flex flex-col items-center justify-center text-center border border-[#eaecf0]">
          <Files className="text-[#344054] mb-3" size={24} />
          <h3 className="text-[28px] font-bold text-[#101828] mb-1">3000</h3>
          <p className="text-[12px] font-medium text-[#475467]">Total Documents Uploaded</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <div className="w-full h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
          <div className="h-full bg-[#0E1680]" style={{ width: '60%' }}></div>
        </div>
        <div className="flex justify-end">
          <span className="text-[13px] font-semibold text-[#344054]">Progress : 60%</span>
        </div>
      </div>

      {/* Filters & Table Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end gap-3">
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
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50">
            Semester <Filter size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50">
            Year <Filter size={16} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] hover:bg-gray-50">
            Status <Filter size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[13px] font-medium text-[#475467]">File Format : .pdf & .excel</p>
          
          <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0]">Sr no.</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0]">Course Title</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0]">Course Code</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Semester</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">No of Students</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Status</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Action</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider border-b border-[#eaecf0] text-center">Upload Answer Sheets</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRecords.map((record, index) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors border-b border-[#eaecf0]">
                      <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{record.courseTitle}</td>
                      <td className="px-6 py-4 text-[14px] text-[#0E1680] font-medium">{record.courseCode}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.semester}</td>
                      <td className="px-6 py-4 text-[14px] text-[#475467] font-medium text-center">{record.noOfStudents}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                          record.status === 'Pending' 
                            ? 'bg-[#FFEDD5] text-[#C2410C]' 
                            : 'bg-[#DCFCE7] text-[#15803D]'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => setViewUploadedCourseId(record.id)} className="text-[#98A2B3] hover:text-[#475467] transition-colors">
                          <Eye size={20} />
                        </button>
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center">
                        {record.status === 'Pending' ? (
                          <button 
                            onClick={onNavigateToUpload}
                            className="w-[170px] px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
                          >
                            Upload Answer Sheets
                          </button>
                        ) : (
                          <button 
                            onClick={() => setReUploadCourseId(record.id)}
                            className="w-[170px] px-4 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
                          >
                            Re-Upload
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-[#eaecf0]">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                    onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Uploaded Answer Sheets Modal */}
      {viewUploadedCourseId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[800px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex flex-col border-b border-[#eaecf0]">
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-[16px] font-bold text-[#101828]">View Uploaded Answer Sheets</h2>
                <button onClick={() => setViewUploadedCourseId(null)} className="text-[#667085] hover:text-[#101828] transition-colors"><X size={20} /></button>
              </div>
              <div className="px-6 pb-4">
                <span className="text-[14px] font-bold text-[#344054]">
                  ID: {records.find(r => r.id === viewUploadedCourseId)?.courseCode || 'CO1919'}
                </span>
                <span className="text-[14px] font-bold text-[#344054] ml-2">
                  Course Name : {records.find(r => r.id === viewUploadedCourseId)?.courseTitle || 'Operating System'}
                </span>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
              <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">Sr no.</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">Seat No</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">Student Name</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">Semester</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">View Answer Sheets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewUploadedDisplayed.map((record, index) => (
                        <tr key={record.id} className="border-b border-[#eaecf0] hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{(viewUploadedPage - 1) * MODAL_PAGE_SIZE + index + 1}</td>
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{record.seatNo}</td>
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{record.studentName}</td>
                          <td className="px-6 py-4 text-[14px] text-[#0E1680] font-medium">{record.semester}</td>
                          <td className="px-6 py-4">
                            <button 
                              onClick={() => {
                                setViewUploadedCourseId(null);
                                setViewingRecord(record);
                              }}
                              className="px-6 py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-6 py-3 border-t border-[#eaecf0]">
                  <button 
                    onClick={() => setViewUploadedPage(p => Math.max(1, p - 1))}
                    disabled={viewUploadedPage === 1}
                    className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: viewUploadedTotalPages }, (_, i) => i + 1).map((p) => (
                      <button 
                        key={p} 
                        onClick={() => setViewUploadedPage(p)}
                        className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-[14px] font-medium transition-colors ${p === viewUploadedPage ? 'bg-[#f0f1ff] text-[#0e1680]' : 'text-[#667085] hover:bg-gray-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setViewUploadedPage(p => Math.min(viewUploadedTotalPages, p + 1))}
                    disabled={viewUploadedPage >= viewUploadedTotalPages}
                    className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#eaecf0] flex justify-end bg-white">
              <button onClick={() => setViewUploadedCourseId(null)} className="px-8 py-2.5 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Answer Sheet Modal */}
      {viewingRecord && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[900px] h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col border-b border-[#eaecf0]">
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-[16px] font-bold text-[#101828]">View Answer Sheet</h2>
                <button onClick={() => setViewingRecord(null)} className="text-[#667085] hover:text-[#101828] transition-colors"><X size={20} /></button>
              </div>
              <div className="px-6 pb-4">
                <span className="text-[14px] font-bold text-[#101828]">Seat_no - Student_name :</span>
                <span className="text-[14px] font-medium text-[#475467] ml-2">{viewingRecord.seatNo} - {viewingRecord.studentName}</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              <Document
                file={samplePdf}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex flex-col items-center"
              >
                <div className="grid grid-cols-2 gap-4 w-full max-w-[800px] mx-auto">
                  {Array.from(new Array(Math.min(numPages || 4, 4)), (el, index) => (
                    <div key={`page_${index + 1}`} className="rounded-xl shadow-sm border border-[#eaecf0] bg-white overflow-hidden flex items-center justify-center p-2">
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

            <div className="flex items-center justify-end px-6 py-4 border-t border-[#eaecf0] bg-white">
              <button onClick={() => setViewingRecord(null)} className="px-8 py-2.5 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm">
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input for Single Re-Upload */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" />

      {/* Re-Upload Answer Sheets Modal */}
      {reUploadCourseId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[900px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex flex-col border-b border-[#eaecf0]">
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-[18px] font-bold text-[#101828]">Re-Upload Answer Sheets</h2>
                <button onClick={() => setReUploadCourseId(null)} className="text-[#667085] hover:text-[#101828] transition-colors"><X size={24} /></button>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
              <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">Sr no.</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">Seat No</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">Student Name</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">Semester</th>
                        <th className="px-6 py-4 text-[12px] font-bold text-[#667085]">View Answer Sheets</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reUploadDisplayed.map((record, index) => (
                        <tr key={record.id} className="border-b border-[#eaecf0] hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{(reUploadPage - 1) * MODAL_PAGE_SIZE + index + 1}</td>
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{record.seatNo}</td>
                          <td className="px-6 py-4 text-[14px] text-[#475467] font-medium">{record.studentName}</td>
                          <td className="px-6 py-4 text-[14px] text-[#0E1680] font-medium">{record.semester}</td>
                          <td className="px-6 py-4 flex justify-center gap-3">
                            <button 
                              onClick={() => setViewingRecord(record)}
                              className="w-[100px] py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleSingleReUpload(record)}
                              className="w-[100px] py-2 bg-[#0E1680] text-white text-[13px] font-medium rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
                            >
                              Re-Upload
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-6 py-3 border-t border-[#eaecf0]">
                  <button 
                    onClick={() => setReUploadPage(p => Math.max(1, p - 1))}
                    disabled={reUploadPage === 1}
                    className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: reUploadTotalPages }, (_, i) => i + 1).map((p) => (
                      <button 
                        key={p} 
                        onClick={() => setReUploadPage(p)}
                        className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-[14px] font-medium transition-colors ${p === reUploadPage ? 'bg-[#f0f1ff] text-[#0e1680]' : 'text-[#667085] hover:bg-gray-50'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setReUploadPage(p => Math.min(reUploadTotalPages, p + 1))}
                    disabled={reUploadPage >= reUploadTotalPages}
                    className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#eaecf0] flex justify-end bg-white">
              <button 
                onClick={() => {
                  setReUploadCourseId(null);
                  setIsBulkSuccessOpen(true);
                }} 
                className="px-8 py-2.5 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Success Modal */}
      {successRecord && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[360px] shadow-xl flex flex-col items-center p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle size={64} className="text-[#22C55E] mb-5" strokeWidth={2} />
            <h2 className="text-[18px] font-bold text-[#101828] mb-6 leading-snug">
              Answer Sheet Re-Uploaded<br/>sucessfully!
            </h2>
            <div className="text-[13px] font-bold text-[#344054] mb-8 leading-relaxed flex flex-col gap-1 w-full text-center">
              <p>Seat no : <span className="font-medium text-[#475467]">{successRecord.seatNo}</span></p>
              <p>Student Name : <span className="font-medium text-[#475467]">{successRecord.studentName}</span></p>
              <p>Course ID: <span className="font-medium text-[#475467]">CO1919</span></p>
              <p>Semester : <span className="font-medium text-[#475467]">{successRecord.semester}</span></p>
              <p>Course : <span className="font-medium text-[#475467]">Operating System</span></p>
            </div>
            <button 
              onClick={() => setSuccessRecord(null)}
              className="px-10 py-2 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Bulk Success Modal */}
      {isBulkSuccessOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[360px] shadow-xl flex flex-col items-center p-8 text-center animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle size={64} className="text-[#22C55E] mb-5" strokeWidth={2} />
            <h2 className="text-[18px] font-bold text-[#101828] mb-6 leading-snug">
              Answer Sheets Re-Uploaded<br/>sucessfully!
            </h2>
            <div className="text-[13px] font-bold text-[#344054] mb-8 leading-relaxed flex flex-col gap-1 w-full text-center">
              <p>Seat no : <span className="font-medium text-[#475467]">494001 - 494025</span></p>
              <p>Course ID: <span className="font-medium text-[#475467]">CO1919</span></p>
              <p>Semester : <span className="font-medium text-[#475467]">VIII</span></p>
              <p>Course : <span className="font-medium text-[#475467]">Operating System</span></p>
            </div>
            <button 
              onClick={() => setIsBulkSuccessOpen(false)}
              className="px-10 py-2 bg-[#0E1680] text-white text-[14px] font-bold rounded-lg hover:bg-[#0E1680]/90 transition-colors shadow-sm"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
