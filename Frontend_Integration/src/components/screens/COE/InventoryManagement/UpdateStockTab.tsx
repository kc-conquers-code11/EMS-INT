import React from 'react';

const ChevDown = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
    <path d="M1 1.5L6 6.5L11 1.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface UpdateStockTabProps {
  uForm: { batch: string; examSession: string; item: string; quantity: string };
  setUForm: React.Dispatch<React.SetStateAction<{ batch: string; examSession: string; item: string; quantity: string }>>;
  handleNext: () => void;
}

export const UpdateStockTab: React.FC<UpdateStockTabProps> = ({ uForm, setUForm, handleNext }) => {
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
            <option>End-Sem Apr 2026</option>
            <option>Winter 2026</option>
            <option>Summer 2026</option>
            <option>Winter 2025</option>
            <option>Summer 2025</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
        </div>
      </div>

      {/* Item & Total Quantity */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#344054]">Item</label>
          <div className="relative">
            <select
              value={uForm.item}
              onChange={e => setUForm(p => ({ ...p, item: e.target.value }))}
              style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
              className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
            >
              <option>Supplements Sheet</option>
              <option>Answer Book</option>
              <option>Thread</option>
              <option>Drawing Sheet</option>
              <option>Graph Paper</option>
              <option>Ruled Sheet</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[14px] font-medium text-[#344054]">Total Quantity</label>
          <div className="relative">
            <select
              value={uForm.quantity}
              onChange={e => setUForm(p => ({ ...p, quantity: e.target.value }))}
              style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }}
              className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]"
            >
              {[100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 1000].map(q => (
                <option key={q}>{q}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
          </div>
        </div>
      </div>

      {/* Next */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          style={{ width: '112px', height: '48px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
          className="flex items-center justify-center gap-2 text-white cursor-pointer hover:bg-[#0c136f] transition-colors"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
