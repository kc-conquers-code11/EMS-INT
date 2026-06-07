import React, { useState } from 'react';
import { HallTicketSettingsTab } from '../../../components/screens/COE/HallTicket/HallTicketSettingsTab';
import { StudentsEligibilityTab } from '../../../components/screens/COE/HallTicket/StudentsEligibilityTab';
import { GenerateHallTicketTab } from '../../../components/screens/COE/HallTicket/GenerateHallTicketTab'; // refresh
import { PublishHallTicketTab } from '../../../components/screens/COE/HallTicket/PublishHallTicketTab'; // refresh

type HallTicketTab = 'Hall ticket settings' | 'Students eligibility' | 'Generate Hall Ticket' | 'Publish Hall Ticket';

export const COEHallTicketPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HallTicketTab>('Hall ticket settings');

  const tabs: HallTicketTab[] = [
    'Hall ticket settings',
    'Students eligibility',
    'Generate Hall Ticket',
    'Publish Hall Ticket',
  ];

  return (
    <div className="flex flex-col min-h-full gap-6 font-['Instrument_Sans']">

      {/* ── Page Header ── */}
      <h1 className="text-[24px] font-semibold text-[#101828] leading-[32px]">
        Hall Ticket Generation Control
      </h1>

      {/* ── Horizontal Tabs (Pill-box style) ── */}
      <div className="flex items-center bg-[#f2f3fd] border border-[#e5e7fb] rounded-[10px] p-[6px] gap-[8px] w-fit overflow-x-auto max-w-full">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-[6px] text-[16px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#0e1680] text-white shadow-sm'
                : 'text-[#98a2b3] hover:text-[#7a828f]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Active Tab Content ── */}
      <div className="flex flex-col gap-6">
        {activeTab === 'Hall ticket settings' && <HallTicketSettingsTab />}
        {activeTab === 'Students eligibility' && <StudentsEligibilityTab />}
        {activeTab === 'Generate Hall Ticket' && <GenerateHallTicketTab />}
        {activeTab === 'Publish Hall Ticket' && <PublishHallTicketTab />}
      </div>
    </div>
  );
};
