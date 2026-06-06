import React from 'react';
import { Trash2 } from 'lucide-react';
import type { StudentFeedbackType } from '../../../../types/COE/student';

export interface StudentFeedbackModalProps {
  isOpen: boolean;
  type: StudentFeedbackType;
  message?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export const StudentFeedbackModal: React.FC<StudentFeedbackModalProps> = ({ isOpen, type, message, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const isSuccess = type === 'add_success' || type === 'edit_success' || type === 'delete_success';

  const getConfig = () => {
    switch (type) {
      case 'add_success':
      case 'edit_success':
        return { 
          icon: (
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <svg viewBox="0 0 104.667 104.667" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ), 
          title: message || (type === 'add_success' ? 'Student added successfully !!' : 'Student edited successfully !!'), 
          primaryBtn: 'Back', 
          secondaryBtn: 'Cancel',
          showSecondary: false 
        };
      case 'delete_confirm':
        return { 
          icon: (
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <svg width="100" height="100" viewBox="0 0 91.3333 91.3333" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M45.6667 62.3333V45.6667M45.6667 29H45.7083M87.3333 45.6667C87.3333 68.6785 68.6785 87.3333 45.6667 87.3333C22.6548 87.3333 4 68.6785 4 45.6667C4 22.6548 22.6548 4 45.6667 4C68.6785 4 87.3333 22.6548 87.3333 45.6667Z" stroke="#FF4141" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ), 
          title: message || 'Do you really want to delete this Student?', 
          primaryBtn: 'Delete', 
          secondaryBtn: 'Cancel', 
          showSecondary: true 
        };
      case 'delete_success':
        return { 
          icon: (
            <div className="w-[120px] h-[120px] rounded-full border-[6px] border-[#ef4444] flex items-center justify-center">
               <Trash2 size={60} className="text-[#ef4444]" />
            </div>
          ), 
          title: message || 'Student deleted successfully !!', 
          primaryBtn: 'Back', 
          secondaryBtn: 'Cancel',
          showSecondary: false 
        };
      default:
        return {
          icon: null,
          title: '',
          primaryBtn: 'Back',
          secondaryBtn: 'Cancel',
          showSecondary: false
        };
    }
  };

  const config = getConfig();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center font-sans bg-black/55 backdrop-blur-[4px]">
      <div 
        className="bg-white flex flex-col items-center justify-center rounded-[16px] shadow-[0px_4px_24px_rgba(0,0,0,0.08)] max-w-full" 
        style={{ width: '510px', height: isSuccess ? '360px' : '442px' }}
      >
        <div className={`flex flex-col items-center w-full px-8 ${isSuccess ? 'gap-6 p-10 justify-center' : 'gap-[40px]'}`}>
          <div className={`flex flex-col items-center w-full ${isSuccess ? 'gap-4' : 'gap-[10px]'}`}>
            {config.icon}
            <h2 className={`${isSuccess ? 'text-[20px] font-bold mt-2' : 'text-[24px] font-semibold'} text-[#101828] text-center max-w-[444px] leading-snug`}>
              {config.title}
            </h2>
          </div>
          <div className="flex gap-4 items-center justify-center">
            {type === 'delete_confirm' ? (
              <>
                <button 
                  onClick={onConfirm} 
                  className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md cursor-pointer"
                >
                  {config.primaryBtn}
                </button>
                <button 
                  onClick={onClose} 
                  className="bg-[#0e1680] flex items-center justify-center h-[44px] w-[86px] text-white text-[16px] font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md cursor-pointer"
                >
                  {config.secondaryBtn}
                </button>
              </>
            ) : (
              <button 
                onClick={onClose} 
                style={{ width: '86px', height: '44px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
                className="text-white flex items-center justify-center cursor-pointer hover:bg-[#0b126c] transition-colors"
              >
                {config.primaryBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
