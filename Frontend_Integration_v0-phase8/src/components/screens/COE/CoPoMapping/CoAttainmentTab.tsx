import React, { useState } from 'react';
import { Eye, Edit3, Trash2, X, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface CoAttainmentTabProps {
  onNext: () => void;
}

export const CoAttainmentTab: React.FC<CoAttainmentTabProps> = ({ onNext }) => {
  // Form fields
  const [coId, setCoId] = useState('CO1');
  const [description, setDescription] = useState('');
  const [bloomLevel, setBloomLevel] = useState('Understand');
  const [weightage, setWeightage] = useState('10');
  const [status, setStatus] = useState('Active');

  // Edit Modal form fields
  const [editProgram, setEditProgram] = useState('Bachleor of Engineering');
  const [editDepartment, setEditDepartment] = useState('Informtaion Technology');
  const [editAcademicYear, setEditAcademicYear] = useState('2nd');
  const [editSemester, setEditSemester] = useState('3');
  const [editCourseTitle, setEditCourseTitle] = useState('Operating System');
  const [editCourseCode, setEditCourseCode] = useState('CO1919');
  const [editFacultyName, setEditFacultyName] = useState('abc');
  const [editRegulation, setEditRegulation] = useState('R-2020');

  const [editCoId, setEditCoId] = useState('CO1');
  const [editDescription, setEditDescription] = useState('description here...');
  const [editBloomLevel, setEditBloomLevel] = useState('Understand');
  const [editWeightage, setEditWeightage] = useState('10');
  const [editStatus, setEditStatus] = useState(true); // Toggle

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

  // Table Data matches Figma
  const [tableData, setTableData] = useState([
    { id: 'CO1', title: 'abc', desc: 'abc', weightage: '20%', bloom: 'Understand', bloomColor: 'text-green-700 bg-green-100', status: true },
    { id: 'CO2', title: 'xyz', desc: 'xyz', weightage: '10%', bloom: 'Apply', bloomColor: 'text-amber-700 bg-orange-100', status: true },
    { id: 'CO3', title: 'abc', desc: 'abc', weightage: '30%', bloom: 'Create', bloomColor: 'text-purple-700 bg-purple-100', status: true },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handleToggleStatus = (id: string) => {
    setTableData(prev => prev.map(item => item.id === id ? { ...item, status: !item.status } : item));
    toast.success('Status updated successfully!');
  };

  const handleAdd = () => {
    setIsSuccessOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    toast.success('CO updated successfully!');
  };

  const ChevronDown = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <div className="flex flex-col gap-6 w-full font-['Instrument_Sans'] select-none p-2">
      
      {/* ── ADD CO FORM ── */}
      <div className="flex flex-col gap-5 w-full">
        {/* CO ID */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">CO ID</label>
          <div className="relative">
            <select
              value={coId}
              onChange={(e) => setCoId(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
            >
              <option value="CO1">CO1</option>
              <option value="CO2">CO2</option>
              <option value="CO3">CO3</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* CO Description */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">CO Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="description here..."
            className="w-full h-24 px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm resize-none"
          />
        </div>

        {/* Bloom's Taxonomy Level & Weightage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[14px] font-medium text-[#344054]">Bloom's Taxonomy Level</label>
            <div className="relative">
              <select
                value={bloomLevel}
                onChange={(e) => setBloomLevel(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
              >
                <option value="Understand">Understand</option>
                <option value="Apply">Apply</option>
                <option value="Create">Create</option>
              </select>
              <ChevronDown />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[14px] font-medium text-[#344054]">Weightage ( % )</label>
            <div className="relative">
              <select
                value={weightage}
                onChange={(e) => setWeightage(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
              <ChevronDown />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Status</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all cursor-pointer min-w-[100px]"
          >
            Add
          </button>
        </div>
      </div>

      {/* ── CO TABLE SECTION ── */}
      <div className="flex flex-col gap-4 mt-6">
        
        {/* Toolbar */}
        <div className="flex items-center justify-end gap-3 w-full">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-3.5 pr-10 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] focus:outline-none shadow-sm w-[200px]"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]" size={16} />
          </div>

          {/* Semester Filter */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
            Semester
            <Filter size={16} className="text-[#667085]" />
          </button>

          {/* Scheme Filter */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] font-medium text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
            Scheme
            <Filter size={16} className="text-[#667085]" />
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#e4e7ec] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e4e7ec]">
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">CO ID</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Course Title</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Description</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Weightage</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Bloom's Taxonomy Level</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Status</th>
                  <th className="py-4 px-4 text-[12px] font-semibold text-[#667085]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e7ec]">
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50">
                    <td className="py-4 px-4 text-[14px] text-[#475467]">{row.id}</td>
                    <td className="py-4 px-4 text-[14px] text-[#475467]">{row.title}</td>
                    <td className="py-4 px-4 text-[14px] text-[#475467]">{row.desc}</td>
                    <td className="py-4 px-4 text-[14px] text-[#101828]">{row.weightage}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${row.bloomColor}`}>
                        {row.bloom}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {/* Toggle Switch */}
                      <button
                        onClick={() => handleToggleStatus(row.id)}
                        className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${row.status ? 'bg-[#0E1680]' : 'bg-gray-200'}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${row.status ? 'translate-x-5' : ''}`}
                        />
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3 text-[#667085]">
                        <button 
                          onClick={() => setIsViewModalOpen(true)}
                          className="hover:text-blue-600 transition-colors cursor-pointer p-1"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => setIsDeleteConfirmOpen(true)}
                          className="hover:text-red-600 transition-colors cursor-pointer p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button 
                          onClick={() => setIsEditModalOpen(true)}
                          className="hover:text-blue-600 transition-colors cursor-pointer p-1"
                        >
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
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
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
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-[14px] font-semibold text-[#344054] hover:bg-gray-50 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <span>Next</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
            </button>
          </div>
        </div>

        {/* Global Next Button */}
        <div className="flex justify-end mt-4">
          <button 
            onClick={onNext}
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all cursor-pointer"
          >
            <span>Next</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19M19 12L12 5M19 12L12 19"/></svg>
          </button>
        </div>
      </div>


      {/* ── EDIT CO ATTAINMENT MODAL ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-[#e4e7ec] shrink-0">
              <span className="text-[16px] font-bold text-[#101828]">Edit CO Attainment</span>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-[#667085] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <form id="editCoForm" onSubmit={handleSaveEdit} className="flex flex-col gap-5">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Program</label>
                    <div className="relative">
                      <select value={editProgram} onChange={e => setEditProgram(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                        <option value="Bachleor of Engineering">Bachleor of Engineering</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Department</label>
                    <div className="relative">
                      <select value={editDepartment} onChange={e => setEditDepartment(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                        <option value="Informtaion Technology">Informtaion Technology</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Academic Year</label>
                    <div className="relative">
                      <select value={editAcademicYear} onChange={e => setEditAcademicYear(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                        <option value="2nd">2nd</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Semester</label>
                    <div className="relative">
                      <select value={editSemester} onChange={e => setEditSemester(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                        <option value="3">3</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Course Title</label>
                    <div className="relative">
                      <select value={editCourseTitle} onChange={e => setEditCourseTitle(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                        <option value="Operating System">Operating System</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Course Code</label>
                    <input type="text" value={editCourseCode} onChange={e => setEditCourseCode(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none transition-all" />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Faculty Name</label>
                    <input type="text" value={editFacultyName} onChange={e => setEditFacultyName(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Regulation</label>
                    <input type="text" value={editRegulation} onChange={e => setEditRegulation(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none transition-all" />
                  </div>
                </div>

                {/* CO ID */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">CO ID</label>
                  <div className="relative">
                    <select value={editCoId} onChange={e => setEditCoId(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                      <option value="CO1">CO1</option>
                    </select>
                    <ChevronDown />
                  </div>
                </div>

                {/* CO Description */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">CO Description</label>
                  <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} className="w-full h-[80px] px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none resize-none" />
                </div>

                {/* Bloom's Level & Weightage */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Bloom's Taxonomy Level</label>
                    <div className="relative">
                      <select value={editBloomLevel} onChange={e => setEditBloomLevel(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                        <option value="Understand">Understand</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Weightage ( % )</label>
                    <div className="relative">
                      <select value={editWeightage} onChange={e => setEditWeightage(e.target.value)} className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none cursor-pointer">
                        <option value="10">10</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-medium text-[#344054]">Status</span>
                  <button
                    type="button"
                    onClick={() => setEditStatus(!editStatus)}
                    className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${editStatus ? 'bg-[#0E1680]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${editStatus ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-6 flex justify-end shrink-0">
              <button
                type="submit"
                form="editCoForm"
                className="px-6 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all cursor-pointer"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ── */}
      {isSuccessOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-[510px] min-h-[424px] shadow-2xl flex flex-col items-center justify-center p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-[28px] items-center justify-center w-full">
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-semibold text-[24px] text-black text-center">
                CO Added successfully !
              </p>
              <button
                type="button"
                onClick={() => setIsSuccessOpen(false)}
                className="mt-2 w-[100px] h-[44px] bg-[#0E1680] hover:bg-blue-900 flex items-center justify-center rounded-[8px] transition-colors cursor-pointer"
              >
                <span className="font-semibold text-[16px] text-white">Back</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW CO ATTAINMENT MODAL ── */}
      {isViewModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[800px] shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-[#e4e7ec] shrink-0">
              <span className="text-[16px] font-bold text-[#101828]">View CO Attainment</span>
              <button onClick={() => setIsViewModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg text-[#667085] cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto pointer-events-none opacity-90">
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Program</label>
                    <div className="relative">
                      <select value={editProgram} disabled className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                        <option value="Bachleor of Engineering">Bachleor of Engineering</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Department</label>
                    <div className="relative">
                      <select value={editDepartment} disabled className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                        <option value="Informtaion Technology">Informtaion Technology</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Academic Year</label>
                    <div className="relative">
                      <select value={editAcademicYear} disabled className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                        <option value="2nd">2nd</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Semester</label>
                    <div className="relative">
                      <select value={editSemester} disabled className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                        <option value="3">3</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Course Title</label>
                    <div className="relative">
                      <select value={editCourseTitle} disabled className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                        <option value="Operating System">Operating System</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Course Code</label>
                    <input type="text" value={editCourseCode} readOnly className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Faculty Name</label>
                    <input type="text" value={editFacultyName} readOnly className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Regulation</label>
                    <input type="text" value={editRegulation} readOnly className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">CO ID</label>
                  <div className="relative">
                    <select value={editCoId} disabled className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                      <option value="CO1">CO1</option>
                    </select>
                    <ChevronDown />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-medium text-[#344054]">CO Description</label>
                  <textarea value={editDescription} readOnly className="w-full h-[80px] px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] outline-none resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Bloom's Taxonomy Level</label>
                    <div className="relative">
                      <select value={editBloomLevel} disabled className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                        <option value="Understand">Understand</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-[14px] font-medium text-[#344054]">Weightage ( % )</label>
                    <div className="relative">
                      <select value={editWeightage} disabled className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] appearance-none">
                        <option value="10">10</option>
                      </select>
                      <ChevronDown />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-medium text-[#344054]">Status</span>
                  <button
                    type="button"
                    className={`w-11 h-6 rounded-full relative transition-colors ${editStatus ? 'bg-[#0E1680]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${editStatus ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </form>
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
                  <svg width="100" height="100" viewBox="0 0 91.3333 91.3333" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45.6667 62.3333V45.6667M45.6667 29H45.7083M87.3333 45.6667C87.3333 68.6785 68.6785 87.3333 45.6667 87.3333C22.6548 87.3333 4 68.6785 4 45.6667C4 22.6548 22.6548 4 45.6667 4C68.6785 4 87.3333 22.6548 87.3333 45.6667Z" stroke="#FF4141" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-[24px] font-semibold text-[#101828] text-center max-w-[444px] leading-snug">
                  Do you really want to delete this COPO Mapping?
                </h2>
              </div>
              <div className="flex gap-4 items-center justify-center">
                <button 
                  onClick={() => {
                    setIsDeleteConfirmOpen(false);
                    setIsDeleteSuccessOpen(true);
                  }}
                  className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md cursor-pointer"
                >
                  Delete
                </button>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md cursor-pointer"
                >
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
                  Exam Pattern deleted successfully!
                </h2>
              </div>
              <div className="flex gap-4 items-center justify-center">
                <button 
                  onClick={() => setIsDeleteSuccessOpen(false)}
                  className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b126c] transition-colors cursor-pointer"
                >
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
