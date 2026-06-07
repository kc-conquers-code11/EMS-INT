// src/components/modals/FeedbackModal.tsx
import { CheckCircle2, Info } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "delete-confirm" | "warning-confirm" | "error";
  title: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  backLabel?: string;
}

export const FeedbackModal = ({
  isOpen,
  onClose,
  type,
  title,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  backLabel = "Back"
}: FeedbackModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4">
      {type === "success" ? (
        <div 
          className="bg-white relative rounded-[20px] w-full max-w-[510px] h-[442px] flex items-center justify-center shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] animate-in fade-in zoom-in duration-300"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          <div className="flex flex-col h-[254px] items-center justify-between w-full max-w-[470px] px-[15px]">
            <div className="relative shrink-0 size-[120px] flex items-center justify-center">
              <CheckCircle2 className="w-[100px] h-[100px] text-[#81D66A]" strokeWidth={1.5} />
            </div>
            
            <div className="h-[90px] relative shrink-0 w-full flex items-center justify-center">
              <p className="font-semibold leading-[32px] text-[24px] text-black text-center [word-break:break-word]">
                {title}
              </p>
            </div>
            
            <div className="flex items-center justify-center w-full">
              <button 
                onClick={onClose}
                className="bg-[#0e1680] flex gap-[8px] items-center justify-center px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-[86px] h-[44px] hover:bg-[#0a1060] transition-colors cursor-pointer"
              >
                <span className="font-semibold leading-[24px] text-[16px] text-white whitespace-nowrap">
                  {backLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="bg-white flex flex-col items-center justify-center px-[20px] py-[16px] relative rounded-[20px] w-full max-w-[510px] h-[442px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] animate-in fade-in zoom-in duration-300"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          <div className="flex flex-col gap-[40px] items-center justify-center w-full max-w-[444px]">
            <div className="flex flex-col gap-[10px] items-center justify-center w-full">
              <div className="relative shrink-0 size-[120px] flex items-center justify-center">
                <Info className={`w-[100px] h-[100px] ${type === 'delete-confirm' ? 'text-[#D92D20]' : 'text-[#F79009]'}`} strokeWidth={1.5} />
              </div>
              
              <p className="font-semibold leading-[32px] text-[24px] text-black text-center w-full [word-break:break-word]">
                {title}
              </p>
            </div>
            
            <div className="flex gap-[40px] items-start justify-center w-[212px]">
              <button 
                onClick={onConfirm}
                className="bg-[#0e1680] flex gap-[8px] items-center justify-center px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-[86px] h-[44px] hover:bg-[#0a1060] transition-colors cursor-pointer"
              >
                <span className="font-semibold leading-[24px] text-[16px] text-white whitespace-nowrap">
                  {confirmLabel}
                </span>
              </button>
              
              <button 
                onClick={onClose}
                className="bg-[#0e1680] flex gap-[8px] items-center justify-center px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-[86px] h-[44px] hover:bg-[#0a1060] transition-colors cursor-pointer"
              >
                <span className="font-semibold leading-[24px] text-[16px] text-white whitespace-nowrap">
                  {cancelLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
