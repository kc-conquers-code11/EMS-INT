import { Info, MessageSquare, MoreHorizontal } from "lucide-react";

export default function Topbar() {
  return (
    <div className="bg-[#02053d] flex h-[72px] w-full items-center justify-end px-10">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <button className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#3b44b2] bg-[#21234e] text-white hover:bg-[#3b44b2] transition-all duration-300 shadow-sm">
            <Info size={20} />
          </button>
          <button className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#3b44b2] bg-[#21234e] text-white hover:bg-[#3b44b2] transition-all duration-300 shadow-sm">
            <MessageSquare size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-[#3b44b2]"></div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#21234e]/50 px-3 py-1.5 rounded-xl border border-[#3b44b2]/30">
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#3b44b2] shadow-md">
              <img src="https://ui-avatars.com/api/?name=ABC+Faculty&background=E5E7FB&color=0E1680&bold=true" alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-white leading-none mb-0.5">
                ABC
              </span>
              <span className="text-[12px] text-[#f2f4f7] leading-none opacity-80">
                Faculty
              </span>
            </div>
          </div>
          <button className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#3b44b2] bg-[#21234e] text-white hover:bg-[#3b44b2] transition-all duration-300 shadow-sm">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
