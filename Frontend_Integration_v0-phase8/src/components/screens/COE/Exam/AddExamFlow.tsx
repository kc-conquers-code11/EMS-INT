import * as React from 'react';
import { AddExamDetail } from './AddExamDetail';
import { AddTimeSlot } from './AddTimeSlot';
import { AddExamEvent } from './AddExamEvent';
import { DownloadExamSchedule } from './DownloadExamSchedule';
import { FeesSetting } from './FeesSetting';

type AddStep = 'detail' | 'timeslot' | 'event' | 'schedule' | 'fees';

interface AddExamFlowProps {
  onCancel?: () => void;
  onPublish?: () => void;
}

export const AddExamFlow: React.FC<AddExamFlowProps> = ({ onCancel: _onCancel, onPublish: _onPublish }) => {
  const [currentStep, setCurrentStep] = React.useState<AddStep>('detail');

  const tabs: { id: AddStep; label: string }[] = [
    { id: 'detail', label: 'Add Exam Detail' },
    { id: 'timeslot', label: 'Add Time Slot' },
    { id: 'event', label: 'Add Exam Event' },
    { id: 'schedule', label: 'Download Exam Schedule' },
    { id: 'fees', label: 'Fees Setting' },
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex((t) => t.id === currentStep);
    if (currentIndex < tabs.length - 1) {
      setCurrentStep(tabs[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full font-sans">
      {/* Tabs */}
      <div className="flex bg-[#f2f4fd] p-1.5 rounded-xl border border-[#e5e7fb] overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentStep(tab.id)}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${currentStep === tab.id
                ? 'bg-[#0e1680] text-white'
                : 'text-[#98a2b3] hover:text-[#475467]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="w-full">
        {currentStep === 'detail' && <AddExamDetail onNext={handleNext} />}
        {currentStep === 'timeslot' && <AddTimeSlot onNext={handleNext} />}
        {currentStep === 'event' && <AddExamEvent />}
        {currentStep === 'schedule' && <DownloadExamSchedule />}
        {currentStep === 'fees' && <FeesSetting />}
      </div>
    </div>
  );
};
