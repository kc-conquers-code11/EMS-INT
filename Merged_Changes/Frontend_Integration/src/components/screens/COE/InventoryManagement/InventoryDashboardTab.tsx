import React from 'react';
import { Eye, Trash2, Pencil, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import type { InventoryItem } from '../../../../types/COE/inventory';

const IconTotalStock = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="6" width="24" height="22" rx="3" stroke="#0e1680" strokeWidth="2"/>
    <path d="M4 12h24" stroke="#0e1680" strokeWidth="2"/>
    <path d="M10 4v4M22 4v4" stroke="#0e1680" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 19l3 3 7-7" stroke="#0e1680" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconDistributed = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="5" width="26" height="18" rx="2" stroke="#0e1680" strokeWidth="2"/>
    <path d="M11 27h10" stroke="#0e1680" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 23v4" stroke="#0e1680" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 14l3-3 3 3 3-5 3 3" stroke="#0e1680" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconRemaining = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M17.5 4H9a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V11.5L17.5 4z" stroke="#0e1680" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 4v8h8" stroke="#0e1680" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="13" cy="20" r="1.5" fill="#0e1680"/>
    <path d="M13 16h6" stroke="#0e1680" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M13 19.5h4" stroke="#0e1680" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const FunnelIcon = () => (
  <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
    <path d="M1 1h12l-4.667 5.833V11.5l-2.666 1V6.833L1 1z" stroke="#667085" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface InventoryDashboardTabProps {
  totalStock: number;
  distStock: number;
  remStock: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filtered: InventoryItem[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setReportOpen: (open: boolean) => void;
  setActiveTab: (tab: any) => void;
  setEditItem: (item: InventoryItem | null) => void;
  setUForm: (form: any) => void;
  setViewItem: (item: InventoryItem | null) => void;
  setDeleteId: (id: string | null) => void;
  handleEditClick: (item: InventoryItem) => void;
}

export const InventoryDashboardTab: React.FC<InventoryDashboardTabProps> = ({
  totalStock, distStock, remStock, searchQuery, setSearchQuery, filtered,
  currentPage, setCurrentPage, setReportOpen, setActiveTab, setEditItem, setUForm,
  setViewItem, setDeleteId, handleEditClick
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Stock',       value: totalStock, Icon: IconTotalStock  },
          { label: 'Distributed Stock', value: distStock,  Icon: IconDistributed },
          { label: 'Remaining Stock',   value: remStock,   Icon: IconRemaining   },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="flex flex-col items-center justify-center gap-1 rounded-2xl py-7 px-6" style={{ background: '#eef0fc' }}>
            <Icon />
            <span className="text-[28px] font-bold leading-tight mt-1" style={{ color: '#0e1680' }}>{value}</span>
            <span className="text-[12px] font-normal" style={{ color: '#667085' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Generate Report + Update Stock */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setReportOpen(true)}
          className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all cursor-pointer hover:bg-[#0b1160]"
          style={{ background: '#0e1680' }}
        >
          Generate Report
        </button>
        <button
          onClick={() => { setEditItem(null); setUForm({ batch: 'SYIT 2025', examSession: 'End-Sem Apr 2026', item: 'Supplements Sheet', quantity: '400' }); setActiveTab('Update Stock'); }}
          className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all cursor-pointer hover:bg-[#0b1160]"
          style={{ background: '#0e1680' }}
        >
          Update Stock
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-end gap-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-3 pr-9 py-2 border border-[#d0d5dd] rounded-lg text-[13px] text-[#344054] w-44 focus:outline-none focus:border-[#0e1680] bg-white"
          />
          <Search size={14} className="absolute right-3 top-2.5 text-[#9eaab8]" />
        </div>
        {(['Batch', 'Exam Session', 'Item'] as const).map(label => (
          <button key={label} className="flex items-center gap-2 px-3 py-2 border border-[#d0d5dd] bg-white hover:bg-gray-50 rounded-lg text-[13px] font-medium text-[#344054] cursor-pointer transition-colors">
            <span>{label}</span>
            <FunnelIcon />
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-[#e4e7ec] rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {['Item', 'Batch', 'Exam Session', 'Quantity', 'Distributed', 'Remaining', 'Action'].map(h => (
                <th key={h} className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border-b border-[#e4e7ec] bg-white text-[#667085]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-8 py-6 text-[15px] font-medium text-center text-[#667085]">No inventory items found.</td></tr>
            ) : filtered.map(item => (
              <tr key={item.id} className="border-b border-[#e4e7ec] last:border-0 hover:bg-[#fafafa] transition-colors">
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{item.item}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{item.batch}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{item.examSession}</td>
                <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{item.quantity}</td>
                <td className="px-8 py-6 text-[15px] font-medium" style={{ color: '#0e1680' }}>{item.distributed}</td>
                <td className="px-8 py-6 text-[15px] font-medium" style={{ color: '#0e1680' }}>{item.remaining}</td>
                <td className="px-8 py-6 text-[15px] font-medium">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewItem(item)}    className="text-[#667085] hover:text-[#0e1680] cursor-pointer" title="View"><Eye size={16}/></button>
                    <button onClick={() => setDeleteId(item.id)} className="text-[#667085] hover:text-red-500 cursor-pointer" title="Delete"><Trash2 size={16}/></button>
                    <button onClick={() => handleEditClick(item)} className="text-[#667085] hover:text-[#0e1680] cursor-pointer" title="Edit"><Pencil size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#e4e7ec] bg-white">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#d0d5dd] rounded-lg text-[13px] font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, '...', 8, 9, 10].map((num, i) => (
              <button
                key={i}
                onClick={() => typeof num === 'number' && setCurrentPage(num)}
                disabled={typeof num === 'string'}
                className={`w-9 h-9 flex items-center justify-center text-[13px] rounded-lg transition-all ${currentPage === num ? 'bg-[#eef0fc] text-[#0e1680] font-bold' : 'text-[#475467] hover:bg-gray-50'} disabled:cursor-default`}
              >
                {num}
              </button>
            ))}
          </div>
          <button
            disabled={currentPage === 10}
            onClick={() => setCurrentPage(p => Math.min(10, p + 1))}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-[#d0d5dd] rounded-lg text-[13px] font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
