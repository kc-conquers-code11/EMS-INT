import React, { useState } from 'react';
import { Eye, Edit3, Trash2, X, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface PoAttainmentTabProps {
  onNext: () => void;
}

export const PoAttainmentTab: React.FC<PoAttainmentTabProps> = ({ onNext }) => {
  // Add PO form fields
  const [poId, setPoId] = useState('PO1');
  const [description, setDescription] = useState('');
  const [courseTitle, setCourseTitle] = useState('abcabcabc');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Edit form fields
  const [editPoId, setEditPoId] = useState('PO1');
  const [editDescription, setEditDescription] = useState('description here...');
  const [editCourseTitle, setEditCourseTitle] = useState('abcabcabc');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditSuccessOpen, setIsEditSuccessOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

  // Table Data (matching Figma mockup)
  const [tableData, setTableData] = useState([
    { id: 'CO1', desc: '20%', course: '20%', category: 'Understand', categoryColor: 'text-green-700 bg-green-100', status: true },
    { id: 'CO2', desc: '10%', course: '10%', category: 'Apply', categoryColor: 'text-amber-700 bg-orange-100', status: true },
    { id: 'CO3', desc: '30%', course: '30%', category: 'Create', categoryColor: 'text-purple-700 bg-purple-100', status: true },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handleToggleStatus = (id: string) => {
    setTableData(prev => prev.map(item => item.id === id ? { ...item, status: !item.status } : item));
    toast.success('Status updated successfully!');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    setIsEditSuccessOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteConfirmOpen(false);
    setIsDeleteSuccessOpen(true);
  };

  const ChevronDown = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <div className="flex flex-col gap-6 w-full font-['Instrument_Sans'] select-none p-2 animate-in fade-in zoom-in-95 duration-200">
      
      {/* ── ADD PO FORM ── */}
      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">PO ID</label>
          <div className="relative">
            <select value={poId} onChange={(e) => setPoId(e.target.value)} className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
              <option value="PO1">PO1</option>
              <option value="PO2">PO2</option>
              <option value="PO3">PO3</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">PO Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description here..." className="w-full h-24 px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none resize-none" />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Course Title</label>
          <div className="relative">
            <select value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
              <option value="abcabcabc">abcabcabc</option>
              <option value="Operating System">Operating System</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button type="button" onClick={() => setIsSuccessOpen(true)} className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer min-w-[100px]">
            Add
          </button>
        </div>
      </div>

      {/* ── TABLE SECTION ── */}
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex items-center justify-end gap-3 w-full">
          <div className="relative">
            <input type="text" placeholder="Search" className="pl-3.5 pr-10 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] focus:outline-none shadow-sm w-[200px]" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
            Semester
            <Filter size={16} className="text-[#667085]" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
            Scheme
            <Filter size={16} className="text-[#667085]" />
          </button>
        </div>

        <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">PO ID</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">PO Description</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Course</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Category</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Status</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e7ec]">
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-4 text-[14px] text-[#475467]">{row.id}</td>
                    <td className="py-4 px-4 text-[14px] text-[#475467]">{row.desc}</td>
                    <td className="py-4 px-4 text-[14px] text-[#475467]">{row.course}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${row.categoryColor}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button onClick={() => handleToggleStatus(row.id)} className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${row.status ? 'bg-[#0E1680]' : 'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${row.status ? 'translate-x-5' : ''}`} />
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3 text-[#667085]">
                        <button onClick={() => setIsViewModalOpen(true)} className="hover:text-blue-600 transition-colors cursor-pointer p-1">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => setIsDeleteConfirmOpen(true)} className="hover:text-red-600 transition-colors cursor-pointer p-1">
                          <Trash2 size={18} />
                        </button>
                        <button onClick={() => setIsEditModalOpen(true)} className="hover:text-blue-600 transition-colors cursor-pointer p-1">
                          <Edit3 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="h-[68px] border-t border-[#e4e7ec] px-6 flex items-center justify-between bg-white">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M5 12L12 19M5 12L12 5"/></svg>
              <span>Previous</span>
            </button>
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 flex items-center justify-center text-[14px] font-bold text-[#0E1680] bg-[#f0f1fd] rounded-lg">1</button>
              <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold text-[#475467] hover:bg-gray-50 rounded-lg">2</button>
              <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold text-[#475467] hover:bg-gray-50 rounded-lg">3</button>
              <span className="w-10 h-10 flex items-center justify-center text-[14px] text-[#667085]">..</span>
              <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold text-[#475467] hover:bg-gray-50 rounded-lg">8</button>
              <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold text-[#475467] hover:bg-gray-50 rounded-lg">9</button>
              <button className="w-10 h-10 flex items-center justify-center text-[14px] font-semibold text-[#475467] hover:bg-gray-50 rounded-lg">10</button>
            </div>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50">
              <span>Next</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
            </button>
          </div>
        </div>

        {/* Global Next Button */}
        <div className="flex justify-end mt-4">
          <button onClick={onNext} className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer">
            <span>Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
          </button>
        </div>
      </div>


      {/* ── ADD PO SUCCESS MODAL ── */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-[510px] min-h-[424px] shadow-2xl flex flex-col items-center justify-center p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-[28px] items-center justify-center w-full">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="font-semibold text-[24px] text-black text-center">PO Added successfully !</p>
              <button type="button" onClick={() => setIsSuccessOpen(false)} className="mt-2 w-[100px] h-[44px] bg-[#0E1680] hover:bg-blue-900 flex items-center justify-center rounded-[8px] transition-colors cursor-pointer text-white font-semibold text-[16px]">Back</button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW PO MODAL ── */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-[#e4e7ec] shrink-0">
              <span className="text-[16px] font-bold text-[#101828]">View PO Attainment</span>
              <button onClick={() => setIsViewModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-[#667085] cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto pointer-events-none opacity-90">
              <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">PO ID</label>
                  <div className="relative">
                    <select value={editPoId} readOnly className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                      <option value="PO1">PO1</option>
                    </select>
                    <ChevronDown />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">PO Description</label>
                  <textarea value={editDescription} readOnly className="w-full h-24 px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none resize-none" />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">Course Title</label>
                  <div className="relative">
                    <select value={editCourseTitle} readOnly className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                      <option value="abcabcabc">abcabcabc</option>
                    </select>
                    <ChevronDown />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT PO MODAL ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-[#e4e7ec] shrink-0">
              <span className="text-[16px] font-bold text-[#101828]">Edit PO Attainment</span>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-[#667085] cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="editPoForm" onSubmit={handleSaveEdit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">PO ID</label>
                  <div className="relative">
                    <select value={editPoId} onChange={e => setEditPoId(e.target.value)} className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                      <option value="PO1">PO1</option>
                      <option value="PO2">PO2</option>
                    </select>
                    <ChevronDown />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">PO Description</label>
                  <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full h-24 px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none resize-none" />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">Course Title</label>
                  <div className="relative">
                    <select value={editCourseTitle} onChange={e => setEditCourseTitle(e.target.value)} className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                      <option value="abcabcabc">abcabcabc</option>
                    </select>
                    <ChevronDown />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 flex justify-end shrink-0">
              <button type="submit" form="editPoForm" className="px-8 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm transition-all cursor-pointer">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT SUCCESS MODAL ── */}
      {isEditSuccessOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px]">
          <div className="bg-white flex flex-col items-center justify-center rounded-[16px] shadow-[0px_4px_24px_rgba(0,0,0,0.08)] w-[510px] h-[360px]">
            <div className="flex flex-col items-center w-full px-8 gap-6 p-10 justify-center">
              <div className="flex flex-col items-center w-full gap-4">
                <div className="w-[120px] h-[120px] flex items-center justify-center">
                  <svg viewBox="0 0 104.667 104.667" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="text-[20px] font-bold mt-2 text-[#101828] text-center max-w-[444px] leading-snug">
                  PO Edited successfully !
                </h2>
              </div>
              <div className="flex gap-4 items-center justify-center">
                <button onClick={() => setIsEditSuccessOpen(false)} className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b126c] transition-colors cursor-pointer">
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px]">
          <div className="bg-white flex flex-col items-center justify-center rounded-[16px] shadow-[0px_4px_24px_rgba(0,0,0,0.08)] w-[510px] h-[442px]">
            <div className="flex flex-col items-center w-full px-8 gap-[40px]">
              <div className="flex flex-col items-center w-full gap-[10px]">
                <div className="w-[120px] h-[120px] flex items-center justify-center">
                  <svg width="100" height="100" viewBox="0 0 91.3333 91.3333" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45.6667 62.3333V45.6667M45.6667 29H45.7083M87.3333 45.6667C87.3333 68.6785 68.6785 87.3333 45.6667 87.3333C22.6548 87.3333 4 68.6785 4 45.6667C4 22.6548 22.6548 4 45.6667 4C68.6785 4 87.3333 22.6548 87.3333 45.6667Z" stroke="#FF4141" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="text-[24px] font-semibold text-[#101828] text-center max-w-[444px] leading-snug">
                  Do you really want to delete this PO Attainment?
                </h2>
              </div>
              <div className="flex gap-4 items-center justify-center">
                <button onClick={handleDelete} className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md cursor-pointer">
                  Delete
                </button>
                <button onClick={() => setIsDeleteConfirmOpen(false)} className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE SUCCESS MODAL ── */}
      {isDeleteSuccessOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px]">
          <div className="bg-white flex flex-col items-center justify-center rounded-[16px] shadow-[0px_4px_24px_rgba(0,0,0,0.08)] w-[510px] h-[360px]">
            <div className="flex flex-col items-center w-full px-8 gap-6 p-10 justify-center">
              <div className="flex flex-col items-center w-full gap-4">
                <div className="w-[120px] h-[120px] rounded-full border-[6px] border-[#ef4444] flex items-center justify-center">
                   <Trash2 size={60} className="text-[#ef4444]" />
                </div>
                <h2 className="text-[20px] font-bold mt-2 text-[#101828] text-center max-w-[444px] leading-snug">
                  PO Attainment deleted successfully!
                </h2>
              </div>
              <div className="flex gap-4 items-center justify-center">
                <button onClick={() => setIsDeleteSuccessOpen(false)} className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b126c] transition-colors cursor-pointer">
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
