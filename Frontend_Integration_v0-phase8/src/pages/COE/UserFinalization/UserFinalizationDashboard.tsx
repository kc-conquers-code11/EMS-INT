import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Pencil, Search, SlidersHorizontal, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import { ViewCourseInfoModal } from '../../../components/screens/COE/UserFinalization/modals/ViewCourseInfoModal';
import { EditCourseInfoModal } from '../../../components/screens/COE/UserFinalization/modals/EditCourseInfoModal';
import { FeedbackModal } from '../../../components/modals/FeedbackModal';
import type { UserFinalization, UserFinalizationModalType } from '../../../types/COE/userFinalization';

// ── Mock data (will be replaced by API calls) ──────────────────
const MOCK_USERS: UserFinalization[] = [
  { id: 1, uid: 101, faculty_name: 'XYZ', email: 'xyz@univ.edu', role: 'Paper Setter',       subject_name: 'SA',  exam_session: 'Summer 2026', privilege: 'Write' },
  { id: 2, uid: 102, faculty_name: 'PQR', email: 'pqr@univ.edu', role: 'Evaluator',          subject_name: 'MAD', exam_session: 'Summer 2026', privilege: 'Write' },
  { id: 3, uid: 103, faculty_name: 'ABC', email: 'abc@univ.edu', role: 'Scanning Operator',   subject_name: 'WT',  exam_session: 'Summer 2026', privilege: 'Write' },
  { id: 4, uid: 104, faculty_name: 'abc', email: 'abc2@univ.edu', role: 'Moderator',          subject_name: 'MJ',  exam_session: 'Summer 2026', privilege: 'Write' },
];

export const UserFinalizationDashboard = () => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<UserFinalizationModalType>(null);
  const [selectedUser, setSelectedUser] = useState<UserFinalization | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  // ── Modal helpers ────────────────────────────────────────────
  const closeModal = () => { setModalType(null); setSelectedUser(null); };

  const openView   = (u: UserFinalization) => { setSelectedUser(u); setModalType('view'); };
  const openEdit   = (u: UserFinalization) => { navigate(`/user-finalization/edit/${u.id}`); };
  const openDelete = (u: UserFinalization) => { setSelectedUser(u); setModalType('delete-confirm'); };
  const openRevoke = (u: UserFinalization) => { setSelectedUser(u); setModalType('revoke-confirm'); };

  const confirmDelete = () => setModalType('delete-success');
  const confirmRevoke = () => setModalType('revoke-success');
  const confirmEdit   = () => setModalType('edit-success');

  // ── Pagination ───────────────────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push('...');
      if (currentPage > 3 && currentPage < totalPages - 2) pages.push(currentPage);
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages - 2, totalPages - 1, totalPages);
      const seen = new Set<string>();
      return pages.filter(p => { const k = String(p); if (seen.has(k)) return false; seen.add(k); return true; });
    }
    return pages;
  };

  return (
    <div className="flex flex-col w-full" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Title */}
      <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px] mb-6">
        User Finalization
      </h1>

      {/* Filters row */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-[211px] h-[40px] pl-3 pr-10 border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#687b96] bg-white focus:outline-none focus:border-[#0e1680] transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[#667085]" />
        </div>

        <button className="flex items-center justify-center gap-[8px] h-[40px] px-[16px] border border-[#d0d5dd] rounded-[8px] text-[14px] font-semibold text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
          Role
          <SlidersHorizontal className="w-[20px] h-[20px] text-[#344054]" />
        </button>

        <button className="flex items-center justify-center gap-[8px] h-[40px] px-[16px] border border-[#d0d5dd] rounded-[8px] text-[14px] font-semibold text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]">
          Subject
          <SlidersHorizontal className="w-[20px] h-[20px] text-[#344054]" />
        </button>
      </div>

      <div className="flex flex-col gap-[28px] items-end w-full">
        {/* Add User Button */}
        <div className="flex flex-col items-end justify-center w-[181px]">
          <button 
            onClick={() => navigate('/user-finalization/add')}
            className="w-full bg-[#0e1680] flex gap-[8px] items-center justify-center overflow-clip px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-[16px] text-white font-semibold cursor-pointer hover:bg-[#0a1060] transition-colors"
          >
            Add User
          </button>
        </div>

        {/* Table Card */}
        <div className="w-full bg-white border border-[#eaecf0] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Card Header */}
          <div className="bg-white flex flex-col gap-[20px] items-start w-full">
            <div className="flex gap-[16px] items-start pt-[20px] px-[24px] w-full justify-between">
              <div className="flex items-center gap-[8px]">
                <h2 className="text-[18px] font-semibold text-[#101828] leading-[28px]">User List</h2>
                <div className="bg-[#e5e7fb] px-[8px] py-[2px] rounded-[16px] flex items-center justify-center mix-blend-multiply">
                  <span className="text-[12px] font-medium text-[#070b5c] leading-[18px]">{MOCK_USERS.length}</span>
                </div>
              </div>
              <button className="cursor-pointer text-[#667085] hover:text-[#101828] transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
            <div className="w-full h-px bg-[#eaecf0]" />
          </div>

          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#eaecf0] bg-[#f9fafb]">
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Sr no.</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Faculty Name</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Role</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Subject</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Actions</th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Privilege</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_USERS.map((user, idx) => (
              <tr key={user.id} className="border-b border-[#eaecf0] hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{idx + 1}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{user.faculty_name}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{user.role}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{user.subject_name}</td>
                <td className="px-8 py-6 text-[15px] font-medium">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openView(user)}   className="text-[#667085] hover:text-[#0e1680] transition-colors cursor-pointer" title="View">
                      <Eye className="w-[20px] h-[20px]" />
                    </button>
                    <button onClick={() => openDelete(user)} className="text-[#667085] hover:text-red-500 transition-colors cursor-pointer" title="Delete">
                      <Trash2 className="w-[20px] h-[20px]" />
                    </button>
                    <button onClick={() => openEdit(user)}   className="text-[#667085] hover:text-[#0e1680] transition-colors cursor-pointer" title="Edit">
                      <Pencil className="w-[20px] h-[20px]" />
                    </button>
                  </div>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium">
                  <button
                    onClick={() => openRevoke(user)}
                    className="px-4 py-1.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-[6px] hover:bg-[#0a1060] transition-colors cursor-pointer"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#eaecf0]">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-[16px] h-[16px]" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, idx) =>
              typeof page === 'string' ? (
                <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-[14px] text-[#667085]">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 flex items-center justify-center rounded-[8px] text-[14px] font-medium transition-colors cursor-pointer ${
                    currentPage === page ? 'bg-[#f0f1ff] text-[#0e1680]' : 'text-[#667085] hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
            <ChevronRight className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>
      </div>

      {/* Print button */}
      <div className="flex justify-end mt-4">
        <button className="px-6 py-2.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-[8px] hover:bg-[#0a1060] transition-colors cursor-pointer shadow-sm">
          Print
        </button>
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}

      {/* View (read-only) */}
      {modalType === 'view' && selectedUser && (
        <ViewCourseInfoModal 
          isOpen 
          onClose={closeModal} 
          user={selectedUser} 
          onEdit={() => {
            closeModal();
            navigate(`/user-finalization/edit/${selectedUser.id}`);
          }}
        />
      )}

      {/* Edit (Now redirecting to new page, keeping this null check just in case modal logic was left over) */}
      {modalType === 'edit' && selectedUser && (
        <EditCourseInfoModal isOpen onClose={closeModal} user={selectedUser} onSubmit={confirmEdit} />
      )}

      {/* Delete confirm */}
      <FeedbackModal
        isOpen={modalType === 'delete-confirm'}
        onClose={closeModal}
        type="delete-confirm"
        title="Do you really want to delete this assigned user?"
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />

      {/* Delete success */}
      <FeedbackModal
        isOpen={modalType === 'delete-success'}
        onClose={closeModal}
        type="success"
        title="Assigned role data deleted successfully !!"
        backLabel="Back"
      />

      {/* Revoke confirm */}
      <FeedbackModal
        isOpen={modalType === 'revoke-confirm'}
        onClose={closeModal}
        type="delete-confirm"
        title="Do you really want to revoke privileges from this user?"
        onConfirm={confirmRevoke}
        confirmLabel="Revoke"
        cancelLabel="Cancel"
      />

      {/* Revoke success */}
      <FeedbackModal
        isOpen={modalType === 'revoke-success'}
        onClose={closeModal}
        type="success"
        title="Privileges revoked successfully !!"
        backLabel="Back"
      />

      {/* Edit success */}
      <FeedbackModal
        isOpen={modalType === 'edit-success'}
        onClose={closeModal}
        type="success"
        title="User Role changed successfully !!"
        backLabel="Back"
      />
    </div>
  );
};
