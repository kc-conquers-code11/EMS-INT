import React from 'react';
import { AbsentReportingScreen } from '../../../components/screens/Faculty/AbsentReporting/AbsentReportingScreen';

export const AbsentReportingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full p-8 gap-6 font-['Instrument_Sans']">
      <h1 className="text-[24px] font-semibold text-[#101828]">Absent Reporting</h1>
      <AbsentReportingScreen />
    </div>
  );
};
