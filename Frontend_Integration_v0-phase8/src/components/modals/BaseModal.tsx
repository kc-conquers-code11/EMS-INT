import { X, type LucideIcon } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  maxWidth?: string;
}

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  maxWidth = "max-w-[580px]"
}: BaseModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[110] flex items-center justify-center p-4">
      <div className={`bg-white w-full ${maxWidth} rounded-[24px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] overflow-hidden animate-in fade-in zoom-in duration-300`}>
        <div className="px-10 py-8 border-b border-[#eaecf0] flex items-center justify-between bg-[#f9fafb]">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="p-3 bg-white rounded-xl border border-[#eaecf0] shadow-sm text-[#0e1680]">
                <Icon size={24} />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-[#101828] tracking-tight">{title}</h2>
              {subtitle && <p className="text-[14px] text-[#667085]">{subtitle}</p>}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 text-[#667085] hover:bg-white hover:shadow-sm rounded-full transition-all border border-transparent hover:border-[#eaecf0]"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-10">
          {children}
        </div>
      </div>
    </div>
  );
};
