import * as React from 'react';
import { Search, Eye, Trash2, Pencil, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { SuccessModal, ExamFeeViewModal, ExamFeeEditModal, ExamFeeDeleteModal } from '../../../modals/Exam/ExamModals';

interface FeeRecord {
  id: number;
  examType: string;
  feesAmount: number;
}

export const FeesSetting: React.FC = () => {
  const [examType, setExamType] = React.useState('Backlog');
  const [fees, setFees] = React.useState('388');
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Stateful list of configured fee records
  const [feeRecords, setFeeRecords] = React.useState<FeeRecord[]>([
    { id: 1, examType: 'Backlog', feesAmount: 388 },
    { id: 2, examType: 'Ex-Student', feesAmount: 450 },
    { id: 3, examType: 'Regular', feesAmount: 0 },
  ]);

  // Search & filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState('All');
  const [isEditMode, setIsEditMode] = React.useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilter, feeRecords]);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [selectedViewRecord, setSelectedViewRecord] = React.useState<FeeRecord | null>(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedEditRecord, setSelectedEditRecord] = React.useState<FeeRecord | null>(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedDeleteRecord, setSelectedDeleteRecord] = React.useState<FeeRecord | null>(null);

  const labelClass = 'block text-sm font-medium text-[#344054] mb-1.5';
  const inputClass =
    'w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] ' +
    'placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30 focus:border-[#0e1680] ' +
    'transition-all shadow-sm appearance-none cursor-pointer';

  const ChevronDown = () => (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="#667085" strokeWidth="2" strokeLinecap="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);

    const amount = Number(fees) || 0;

    // Check if we are updating an existing type or adding a new one
    setFeeRecords((prev) => {
      const existsIndex = prev.findIndex(
        (r) => r.examType.toLowerCase() === examType.toLowerCase()
      );

      if (existsIndex >= 0) {
        // Update existing record
        const next = [...prev];
        next[existsIndex] = { ...next[existsIndex], feesAmount: amount };
        return next;
      } else {
        // Create new record
        return [...prev, { id: Date.now(), examType, feesAmount: amount }];
      }
    });

    setIsSuccessOpen(true);
    setIsEditMode(false);
  };

  const handleEditClick = (record: FeeRecord) => {
    setSelectedEditRecord(record);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (id: number, updatedType: string, updatedAmount: number) => {
    setFeeRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, examType: updatedType, feesAmount: updatedAmount } : r))
    );
    setIsEditModalOpen(false);
    setIsEditMode(true);
    setIsSuccessOpen(true);
    setTimeout(() => setIsEditMode(false), 500);
  };

  const handleDeleteClick = (record: FeeRecord) => {
    setSelectedDeleteRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (id: number) => {
    setFeeRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleViewClick = (record: FeeRecord) => {
    setSelectedViewRecord(record);
    setIsViewModalOpen(true);
  };

  // Filtered rows based on search and filter dropdown
  const filteredRecords = feeRecords.filter((record) => {
    const matchesSearch = record.examType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || record.examType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    if (totalPages === 0) return [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();
  const isEmpty = paginatedRecords.length === 0;

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500 font-sans">

      {/* ── Form Section ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        {/* Select Exam Type */}
        <div>
          <label className={labelClass}>Select Exam Type</label>
          <div className="relative">
            <select
              className={inputClass}
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option>Backlog</option>
              <option>Ex-Student</option>
              <option>Regular</option>
              <option>Semester End Exam</option>
              <option>Internal Assessment</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Enter Fees */}
        <div>
          <label className={labelClass}>Enter Fees</label>
          <input
            type="number"
            className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30 focus:border-[#0e1680] transition-all shadow-sm"
            placeholder="e.g. 388"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            required
          />
        </div>

        {/* Submit button row */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] active:scale-[0.97] transition-all shadow-md flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting && (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
            {isSubmitting ? 'Submitting…' : isEditMode ? 'Update Fees' : 'Submit'}
          </button>
        </div>
      </form>

      {/* ── Search & Filter Controls ── */}
      <div className="flex items-center justify-end gap-3 w-full mt-2">
        {/* Search Input */}
        <div className="relative w-full max-w-[220px]">
          <input
            type="text"
            className="w-full pl-3.5 pr-9 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] placeholder-[#98a2b3] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98a2b3]" />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            className="pl-3.5 pr-8 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30 shadow-sm"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="All">Exam Type</option>
            <option>Backlog</option>
            <option>Ex-Student</option>
            <option>Regular</option>
            <option>Semester End Exam</option>
            <option>Internal Assessment</option>
          </select>
          <SlidersHorizontal size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#344054]" />
        </div>
      </div>

      {/* ── Table Section ── */}
      <div className="border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] uppercase tracking-wider">
                Exam Type
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] uppercase tracking-wider text-center">
                Fees Amount
              </th>
              <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] uppercase tracking-wider text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            {!isEmpty ? (
              paginatedRecords.map((record) => (
                <tr key={record.id} className="hover:bg-[#f9fafb]/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#101828]">
                    {record.examType}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#475467] text-center font-medium">
                    {record.feesAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex items-center justify-end gap-3 text-[#475467]">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() => handleViewClick(record)}
                        className="p-1 hover:text-[#0e1680] hover:bg-[#eef0fd] rounded transition-all"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(record)}
                        className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleEditClick(record)}
                        className="p-1 hover:text-[#0e1680] hover:bg-[#eef0fd] rounded transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-[#98a2b3]">
                  No configured fees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between border-t border-[#eaecf0] pt-4 mt-2">
        <button
          type="button"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={isEmpty || currentPage === 1}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-[#f9fafb] active:scale-[0.97] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <div className="flex items-center gap-1.5">
          {pages.map((page, i) => (
            <button
              key={i}
              type="button"
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={isEmpty || page === '...'}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                page === currentPage
                  ? 'bg-[#eef0fd] text-[#0e1680] shadow-sm'
                  : 'text-[#475467] hover:bg-[#f9fafb]'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={isEmpty || currentPage === totalPages}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-[#f9fafb] active:scale-[0.97] transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={isEditMode ? "Exams Fees Setting Edited successfully!" : "Exam Fee configured successfully!"}
      />

      {/* View Modal */}
      <ExamFeeViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        record={selectedViewRecord}
      />

      {/* Edit Modal */}
      <ExamFeeEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        record={selectedEditRecord}
        onSave={handleSaveEdit}
      />

      {/* Delete Modal */}
      <ExamFeeDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        record={selectedDeleteRecord}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
