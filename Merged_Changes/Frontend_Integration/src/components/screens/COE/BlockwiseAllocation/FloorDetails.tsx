import React, { useState } from 'react';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { SuccessModal } from './SuccessModal';

export const FloorDetails: React.FC = () => {
  const [floor, setFloor] = useState('1');
  const [roomsCount, setRoomsCount] = useState(10);
  const [selectedRoom, setSelectedRoom] = useState('1');
  const [maxCapacity, setMaxCapacity] = useState('45');
  const [rowsInRoom, setRowsInRoom] = useState(3);
  const [benchesInRow, setBenchesInRow] = useState(7);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
  };

  // Helper to generate the benches grid
  const renderBenches = (rowCount: number, benchCount: number) => {
    const columns = [];
    for (let c = 1; c <= rowCount; c++) {
      const benches = [];
      for (let b = 1; b <= benchCount; b++) {
        benches.push(
          <div
            key={`bench-${c}-${b}`}
            className="w-10 h-7 bg-white border border-[#e4e7ec] rounded-md shadow-sm transition-all hover:scale-105 hover:border-[#0e1680]/30"
          />
        );
      }
      columns.push(
        <div key={`row-col-${c}`} className="flex flex-col items-center gap-2">
          <span className="text-[12px] font-semibold text-[#344054] whitespace-nowrap">
            Row {c}
          </span>
          <div className="flex items-center bg-[#f2f4f7] border border-[#e4e7ec] rounded px-1 py-0.5 gap-1 mb-1">
            <button className="text-[10px] text-[#667085] hover:text-[#0e1680] font-bold">+</button>
            <span className="text-[9px] text-[#667085] font-semibold">|</span>
            <button className="text-[10px] text-[#667085] hover:text-red-500 font-bold">-</button>
          </div>
          <div className="flex flex-col gap-2">
            {benches}
          </div>
        </div>
      );
    }
    return columns;
  };

  return (
    <div className="bg-white border border-[#e4e7ec] rounded-2xl p-8 shadow-sm flex flex-col gap-6 max-w-4xl font-['Instrument_Sans'] relative overflow-hidden">
      
      {/* ── Success Modal overlay ── */}
      <SuccessModal 
        isOpen={showSuccess} 
        title="Floor details updated successfully !!" 
        onClose={() => setShowSuccess(false)} 
      />

      {/* ── Select Floor Dropdown ── */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-[#344054]">
          Select floor
        </label>
        <div className="relative">
          <select
            value={floor}
            onChange={e => setFloor(e.target.value)}
            className="w-full appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all cursor-pointer"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
        </div>
      </div>

      {/* ── Rooms on a Floor Stepper ── */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-[#344054]">
          Rooms on a Floor
        </label>
        <div className="flex items-center justify-between border border-[#d0d5dd] rounded-lg px-4 py-3 bg-white">
          <span className="text-[14px] text-[#101828]">
            {roomsCount}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRoomsCount(prev => prev + 1)}
              className="w-8 h-8 rounded-full border border-[#d0d5dd] hover:border-[#0e1680] hover:bg-[#f0f1fd] text-[#344054] hover:text-[#0e1680] flex items-center justify-center transition-all focus:outline-none"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-px h-5 bg-[#d0d5dd]" />
            <button
              onClick={() => setRoomsCount(prev => Math.max(0, prev - 1))}
              className="w-8 h-8 rounded-full border border-[#d0d5dd] hover:border-[#d92d20] hover:bg-red-50 text-[#344054] hover:text-[#d92d20] flex items-center justify-center transition-all focus:outline-none"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Section Divider: Add Room ── */}
      <div className="border-t border-[#e4e7ec] pt-6 flex flex-col gap-5">
        <h3 className="text-[15px] font-bold text-[#101828]">Add room</h3>

        {/* Select Room */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Select room
          </label>
          <input
            type="text"
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
            className="w-full bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all"
          />
        </div>

        {/* Maximum Capacity */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Maximum capacity
          </label>
          <input
            type="number"
            value={maxCapacity}
            onChange={e => setMaxCapacity(e.target.value)}
            className="w-full bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all"
          />
        </div>

        {/* Rows in Room Stepper */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Rows in Room
          </label>
          <div className="flex items-center justify-between border border-[#d0d5dd] rounded-lg px-4 py-3 bg-white">
            <span className="text-[14px] text-[#101828]">
              {rowsInRoom}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setRowsInRoom(prev => prev + 1)}
                className="w-8 h-8 rounded-full border border-[#d0d5dd] hover:border-[#0e1680] hover:bg-[#f0f1fd] text-[#344054] hover:text-[#0e1680] flex items-center justify-center transition-all focus:outline-none"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
              <div className="w-px h-5 bg-[#d0d5dd]" />
              <button
                onClick={() => setRowsInRoom(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-full border border-[#d0d5dd] hover:border-[#d92d20] hover:bg-red-50 text-[#344054] hover:text-[#d92d20] flex items-center justify-center transition-all focus:outline-none"
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Benches in a Row Stepper */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#344054]">
            Benches in a row
          </label>
          <div className="flex items-center justify-between border border-[#d0d5dd] rounded-lg px-4 py-3 bg-white">
            <span className="text-[14px] text-[#101828]">
              {benchesInRow}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBenchesInRow(prev => prev + 1)}
                className="w-8 h-8 rounded-full border border-[#d0d5dd] hover:border-[#0e1680] hover:bg-[#f0f1fd] text-[#344054] hover:text-[#0e1680] flex items-center justify-center transition-all focus:outline-none"
              >
                <Plus size={16} strokeWidth={2.5} />
              </button>
              <div className="w-px h-5 bg-[#d0d5dd]" />
              <button
                onClick={() => setBenchesInRow(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-full border border-[#d0d5dd] hover:border-[#d92d20] hover:bg-red-50 text-[#344054] hover:text-[#d92d20] flex items-center justify-center transition-all focus:outline-none"
              >
                <Minus size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm focus:outline-none"
          >
            Save
          </button>
        </div>
      </div>

      {/* ── Floor Seating Layout Preview Canvas ── */}
      <div className="w-full bg-[#dbe0fa] rounded-2xl p-8 flex flex-col items-center border border-[#ced5fb] mt-2">
        <div className="bg-[#f0f2ff]/90 border border-white/60 rounded-xl px-10 py-8 shadow-sm flex flex-col items-center gap-6">
          <span className="text-[14px] font-bold text-[#0e1680]">
            Room 10{selectedRoom || '1'}
          </span>
          <div className="flex items-start gap-12 overflow-x-auto max-w-full pb-2">
            {renderBenches(rowsInRoom, benchesInRow)}
          </div>
        </div>
      </div>

    </div>
  );
};
