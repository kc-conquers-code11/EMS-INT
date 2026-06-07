import React from 'react';
import type { InventoryItem } from '../../../../types/COE/inventory';

const ChevDown = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
    <path d="M1 1.5L6 6.5L11 1.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface DistributeStockTabProps {
  dForm: { selectedId: string; qty: string };
  setDForm: React.Dispatch<React.SetStateAction<{ selectedId: string; qty: string }>>;
  inventory: InventoryItem[];
  uForm: { batch: string; examSession: string; item: string; quantity: string };
  setUForm: React.Dispatch<React.SetStateAction<{ batch: string; examSession: string; item: string; quantity: string }>>;
  handleDistribute: (e: React.FormEvent) => void;
}

export const DistributeStockTab: React.FC<DistributeStockTabProps> = ({ dForm, setDForm, inventory, uForm, setUForm, handleDistribute }) => {
  return (
    <div className="flex flex-col" style={{ gap: '22px' }}>
      {/* Batch */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#344054]">Batch</label>
        <div className="relative">
          <select
            value={uForm.batch}
            onChange={e => setUForm(p => ({ ...p, batch: e.target.value }))}
            style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
            className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
          >
            <option>SYIT 2025</option>
            <option>TYIT</option>
            <option>BEIT</option>
            <option>FECOMPS</option>
            <option>SECOMPS</option>
            <option>TECOMPS</option>
            <option>BECOMPS</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
        </div>
      </div>

      {/* Exam Session */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#344054]">Exam Session</label>
        <div className="relative">
          <select
            value={uForm.examSession}
            onChange={e => setUForm(p => ({ ...p, examSession: e.target.value }))}
            style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
            className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
          >
            <option>Winter 2026</option>
            <option>End-Sem Apr 2026</option>
            <option>Summer 2026</option>
            <option>Winter 2025</option>
            <option>Summer 2025</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
        </div>
      </div>

      {/* Exam Type */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#344054]">Exam Type</label>
        <div className="relative">
          <select
            style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
            className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
          >
            <option>Internal Assessment</option>
            <option>Semester End Exam</option>
            <option>Practical Exam</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
        </div>
      </div>

      {/* Select Item & Distribution Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#344054]">Select Item</label>
          <div className="relative">
            <select
              value={dForm.selectedId}
              onChange={e => setDForm(p => ({ ...p, selectedId: e.target.value }))}
              style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
              className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
            >
              <option value="">Supplements Sheet</option>
              {inventory.map(i => (
                <option key={i.id} value={i.id}>{i.item} ({i.batch})</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#344054]">Distribution Quantity</label>
          <input
            type="number"
            placeholder="400"
            value={dForm.qty}
            onChange={e => setDForm(p => ({ ...p, qty: e.target.value }))}
            style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '16px' }}
            className="w-full border bg-white focus:outline-none focus:border-[#0e1680]"
          />
        </div>
      </div>

      {/* Wing & Floor */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#344054]">Wing</label>
          <div className="relative">
            <select
              style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
              className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
            >
              <option>Wing A</option>
              <option>Wing B</option>
              <option>Wing C</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#344054]">Floor</label>
          <div className="relative">
            <select
              style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
              className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
            >
              <option>2nd</option>
              <option>1st</option>
              <option>3rd</option>
              <option>Ground</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
          </div>
        </div>
      </div>

      {/* Room no */}
      <div className="flex flex-col gap-2">
        <label className="text-[14px] font-medium text-[#344054]">Room no</label>
        <div className="relative">
          <select
            style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
            className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
          >
            <option>204</option>
            <option>205</option>
            <option>301</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
        </div>
      </div>

      {/* Time & Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#344054]">Time</label>
          <input
            type="text"
            placeholder="11:00"
            style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '16px' }}
            className="w-full border bg-white focus:outline-none focus:border-[#0e1680]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#344054]">Date</label>
          <input
            type="text"
            placeholder="20/05/26"
            style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '16px' }}
            className="w-full border bg-white focus:outline-none focus:border-[#0e1680]"
          />
        </div>
      </div>

      {/* Distribute Stock Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleDistribute}
          style={{ width: '171px', height: '48px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
          className="flex items-center justify-center gap-2 text-white cursor-pointer hover:bg-[#0c136f] transition-colors"
        >
          Distribute Stock
        </button>
      </div>
    </div>
  );
};
