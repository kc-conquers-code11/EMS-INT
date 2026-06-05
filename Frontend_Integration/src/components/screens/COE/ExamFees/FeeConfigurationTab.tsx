import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

export const FeeConfigurationTab: React.FC = () => {
  // Main states
  const [regularFee, setRegularFee] = useState('300');
  const [perSubjectFee, setPerSubjectFee] = useState('300');
  const [backlogFee, setBacklogFee] = useState('500');
  const [lateFine, setLateFine] = useState('200');
  const [revaluationFee, setRevaluationFee] = useState('800');

  // Modal visibility states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Temporary form states inside modal
  const [tempRegularFee, setTempRegularFee] = useState('300');
  const [tempPerSubjectFee, setTempPerSubjectFee] = useState('300');
  const [tempBacklogFee, setTempBacklogFee] = useState('500');
  const [tempLateFine, setTempLateFine] = useState('200');
  const [tempRevaluationFee, setTempRevaluationFee] = useState('800');
  
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = () => {
    // Sync current values to temp state
    setTempRegularFee(regularFee);
    setTempPerSubjectFee(perSubjectFee);
    setTempBacklogFee(backlogFee);
    setTempLateFine(lateFine);
    setTempRevaluationFee(revaluationFee);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      // Commit changes to main states
      setRegularFee(tempRegularFee);
      setPerSubjectFee(tempPerSubjectFee);
      setBacklogFee(tempBacklogFee);
      setLateFine(tempLateFine);
      setRevaluationFee(tempRevaluationFee);
      
      setIsSaving(false);
      setIsEditModalOpen(false);
      setIsSuccessModalOpen(true);
    }, 800);
  };

  return (
    <div className="w-full flex flex-col gap-6 font-['Instrument_Sans'] select-none">
      
      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <h3 className="text-[20px] font-semibold text-[#1d2939]">Fee type</h3>
      </div>

      {/* ── Fee configuration form (EXACT alignment with Figma) ── */}
      <div className="flex flex-col gap-5 bg-white border border-[#e4e7ec] rounded-2xl p-8 shadow-xs">
        
        {/* 1. Regular Exam Fee */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Regular Exam Fee</label>
          <input
            type="text"
            readOnly
            value={regularFee}
            className="w-full px-3.5 py-3 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none shadow-xs"
          />
        </div>

        {/* 2. Per Subject Fee */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Per Subject Fee</label>
          <input
            type="text"
            readOnly
            value={perSubjectFee}
            className="w-full px-3.5 py-3 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none shadow-xs"
          />
        </div>

        {/* 3. Backlog fee */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Backlog fee</label>
          <input
            type="text"
            readOnly
            value={backlogFee}
            className="w-full px-3.5 py-3 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none shadow-xs"
          />
        </div>

        {/* 4. Late Fine */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Late Fine</label>
          <input
            type="text"
            readOnly
            value={lateFine}
            className="w-full px-3.5 py-3 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none shadow-xs"
          />
        </div>

        {/* 5. Revaluation fee */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-semibold text-[#344054]">Revaluation fee</label>
          <input
            type="text"
            readOnly
            value={revaluationFee}
            className="w-full px-3.5 py-3 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none shadow-xs"
          />
        </div>

        {/* Action button aligned right */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all h-[44px] cursor-pointer animate-in duration-200"
          >
            <span>Edit Fee Structure</span>
          </button>
        </div>
      </div>

      {/* ── Edit Fee Configuration Pop-up Overlay (EXACT alignment with Figma node-id 15695:150815) ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-[600px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-[#e4e7ec]">
              <span className="text-[16px] font-bold text-[#101828] tracking-tight">
                Edit Fee Configuration
              </span>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-[#667085]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Inputs */}
            <form onSubmit={handleSaveChanges}>
              <div className="p-6 flex flex-col gap-4">
                
                {/* 1. Regular Exam Fee */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-semibold text-[#344054]">Regular Exam Fee</label>
                  <input
                    type="text"
                    value={tempRegularFee}
                    onChange={(e) => setTempRegularFee(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
                  />
                </div>

                {/* 2. Per Subject Fee */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-semibold text-[#344054]">Per Subject Fee</label>
                  <input
                    type="text"
                    value={tempPerSubjectFee}
                    onChange={(e) => setTempPerSubjectFee(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
                  />
                </div>

                {/* 3. Backlog fee */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-semibold text-[#344054]">Backlog fee</label>
                  <input
                    type="text"
                    value={tempBacklogFee}
                    onChange={(e) => setTempBacklogFee(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
                  />
                </div>

                {/* 4. Late Fine */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-semibold text-[#344054]">Late Fine</label>
                  <input
                    type="text"
                    value={tempLateFine}
                    onChange={(e) => setTempLateFine(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
                  />
                </div>

                {/* 5. Revaluation fee */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[14px] font-semibold text-[#344054]">Revaluation fee</label>
                  <input
                    type="text"
                    value={tempRevaluationFee}
                    onChange={(e) => setTempRevaluationFee(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#101828] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] shadow-xs transition-all"
                  />
                </div>

              </div>

              {/* Modal Footer */}
              <div className="h-[84px] px-6 border-t border-[#e4e7ec] flex items-center justify-end bg-[#f9fafb]">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all min-w-[161px] h-[44px] cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : null}
                  <span>Save changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Success Pop Up Overlay (EXACT alignment with Figma node-id 15695:150913) ── */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-[510px] min-h-[424px] shadow-[0px_12px_8px_rgba(16,24,40,0.08),0px_4px_3px_rgba(16,24,40,0.03)] flex flex-col items-center p-[20px] py-[45px] animate-in zoom-in-95 duration-200">
            <div className="flex flex-col gap-[28px] h-[334px] items-center justify-center w-full">
              {/* Exact Green Tickmark Check Circle from Figma SVG */}
              <div className="flex items-center justify-center p-[10px] rounded-[8px] w-[136px] h-[136px]">
                <svg viewBox="0 0 104.667 104.667" className="w-[104px] h-[104px]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483"
                    stroke="#81D66A"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Exact string match including literal typo from Figma: "Fess Configuration" */}
              <p className="font-semibold leading-[32px] text-[24px] text-black text-center w-[425px]">
                Fess Configuration Edited successfully!!
              </p>

              <div className="flex h-[44px] items-center justify-center w-full">
                <button
                  type="button"
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-[86px] cursor-pointer flex flex-col items-start"
                >
                  <div className="bg-[#0e1680] hover:bg-blue-950 flex gap-[8px] items-center justify-center px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full h-[44px] transition-colors">
                    <span className="font-semibold leading-[24px] text-[16px] text-center text-white">
                      Back
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
