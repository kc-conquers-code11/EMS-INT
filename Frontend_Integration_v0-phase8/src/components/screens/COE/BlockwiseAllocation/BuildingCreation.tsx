import React, { useState } from 'react';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { SuccessModal } from './SuccessModal';

export const BuildingCreation: React.FC = () => {
  const [buildingName, setBuildingName] = useState('vpp -1');
  const [floorsCount, setFloorsCount]   = useState(5);
  const [showSuccess, setShowSuccess]   = useState(false);

  const handleIncrement = () => {
    setFloorsCount(prev => prev + 1);
  };

  const handleDecrement = () => {
    setFloorsCount(prev => Math.max(0, prev - 1));
  };

  const handleSave = () => {
    setShowSuccess(true);
  };

  return (
    <div className="bg-white border border-[#e4e7ec] rounded-2xl p-8 shadow-sm flex flex-col gap-6 max-w-4xl font-['Instrument_Sans'] relative overflow-hidden">
      
      {/* ── Success Modal overlay ── */}
      <SuccessModal 
        isOpen={showSuccess} 
        title="Building created successfully !!" 
        onClose={() => setShowSuccess(false)} 
      />

      {/* ── Building Name Dropdown ── */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-[#344054]">
          Building name
        </label>
        <div className="relative">
          <select
            value={buildingName}
            onChange={e => setBuildingName(e.target.value)}
            className="w-full appearance-none bg-white border border-[#d0d5dd] rounded-lg px-4 py-3 text-[14px] text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 focus:border-[#0e1680] transition-all cursor-pointer"
          >
            <option value="vpp -1">vpp -1</option>
            <option value="vpp -2">vpp -2</option>
            <option value="Main Building">Main Building</option>
            <option value="Engineering Block">Engineering Block</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" />
        </div>
      </div>

      {/* ── Floors Stepper ── */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-[#344054]">
          Floors
        </label>
        <div className="flex items-center justify-between border border-[#d0d5dd] rounded-lg px-4 py-3 bg-white">
          <span className="text-[14px] text-[#101828]">
            Ground+ <span className="font-semibold text-[#0e1680]">{floorsCount}</span>
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleIncrement}
              className="w-8 h-8 rounded-full border border-[#d0d5dd] hover:border-[#0e1680] hover:bg-[#f0f1fd] text-[#344054] hover:text-[#0e1680] flex items-center justify-center transition-all focus:outline-none"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
            <div className="w-px h-5 bg-[#d0d5dd]" />
            <button
              onClick={handleDecrement}
              className="w-8 h-8 rounded-full border border-[#d0d5dd] hover:border-[#d92d20] hover:bg-red-50 text-[#344054] hover:text-[#d92d20] flex items-center justify-center transition-all focus:outline-none"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm focus:outline-none"
        >
          Save
        </button>
      </div>

    </div>
  );
};
