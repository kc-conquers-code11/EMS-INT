import React from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import type { ExamEvent } from '../../../../types/COE/exam';

interface ExamTableProps {
  events: ExamEvent[];
  onViewClick: (event: ExamEvent) => void;
  onEditClick: (event: ExamEvent) => void;
  onDeleteClick: (event: ExamEvent) => void;
  onRescheduleClick: (event: ExamEvent) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ExamTable: React.FC<ExamTableProps> = ({
  events,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onRescheduleClick,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const isEmpty = events.length === 0;

  const getPageNumbers = () => {
    if (totalPages === 0) return [];
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col w-full font-sans animate-in fade-in duration-500">
      <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
        {/* Table Header Section */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#eaecf0]">
          <div className="flex items-center gap-2.5">
            <h3 className="text-[18px] font-bold text-[#101828]">Exam Event Scheduler List</h3>
            <span className="flex items-center justify-center min-w-[24px] h-[24px] rounded-full bg-[#f2f4fe] text-[#0e1680] text-xs font-bold px-1.5">
              {events.length}
            </span>
          </div>
          <button className="text-[#98a2b3] hover:text-[#475467]">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] tracking-wider">Course Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] tracking-wider">Course Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] tracking-wider">Time Slot</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] tracking-wider">Total Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] tracking-wider">Reschedule</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#475467] tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaecf0]">
              {isEmpty ? (
                <tr>
                  <td colSpan={8} className="h-[260px] text-center">
                    <span className="text-[20px] font-medium text-[#98a2b3]">No Data Found</span>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.event_id} className="hover:bg-gray-50 transition-colors h-[72px]">
                    {/* Course Title */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#475467]">
                      {event.event_name}
                    </td>
                    {/* Course Code */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467]">
                      {event.course_code || 'CO1919'}
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467]">
                      {event.date || '—'}
                    </td>
                    {/* Time Slot */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467]">
                      {event.time_slot || '—'}
                    </td>
                    {/* Total Student */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#475467]">
                      {event.total_students ?? 0}
                    </td>
                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewClick(event)}
                          className="p-1 text-gray-500 hover:text-[#0e1680] transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEditClick(event)}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => onDeleteClick(event)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                    {/* Reschedule */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onRescheduleClick(event)}
                        className="text-[#0e1680] font-semibold text-sm hover:underline cursor-pointer"
                      >
                        Reschedule
                      </button>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          event.status === 'scheduled' || event.status === 'published'
                            ? 'bg-[#effbe7] text-[#095512]'
                            : 'bg-[#fff9e6] text-[#b47e00]'
                        }`}
                      >
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-[#eaecf0]">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isEmpty || currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft size={20} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {pages.map((page, i) => (
              <button
                key={i}
                type="button"
                onClick={() => typeof page === 'number' && onPageChange(page)}
                disabled={isEmpty || page === '...'}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? 'bg-[#f9fafb] text-[#101828] font-semibold border border-[#eaecf0]'
                    : 'text-[#667085] hover:bg-gray-50'
                } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isEmpty || currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
