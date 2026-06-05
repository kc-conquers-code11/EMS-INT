import React from 'react';
import { CopyCaseScreen } from '../../../components/screens/Faculty/CopyCase/CopyCaseScreen';

export const CopyCasePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-full p-8 gap-6 font-['Instrument_Sans']">
      <h1 className="text-[24px] font-semibold text-[#101828]">Copy Case Process Record</h1>
      <CopyCaseScreen />
    </div>
  );
};
