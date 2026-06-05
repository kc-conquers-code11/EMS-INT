//src/components/layout/super_admin_layout.tsx
import { Link, Outlet, useLocation } from "react-router-dom";
import { Settings, LogOut, LayoutGrid } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

// ─── NavItem Component ────────────────────────────────────────

const NavItem = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  return (
    <Link
      to={to}
      className={`flex items-center gap-[12px] px-[12px] py-[16px] rounded-[6px] transition-colors ${
        isActive
          ? "bg-gradient-to-r from-[rgba(204,208,248,0.6)] to-[rgba(204,208,248,0.2)] text-[#0e1680]"
          : "hover:bg-gray-50 text-[#687b96]"
      }`}
    >
      <div className={`w-[24px] h-[24px] flex items-center justify-center shrink-0 ${isActive ? "text-[#0e1680]" : "text-[#687b96]"}`}>
        {icon}
      </div>
      <span className="font-normal text-[16px] leading-[24px] whitespace-nowrap">{label}</span>
    </Link>
  );
};

export const SuperAdminLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-['Inter',sans-serif]">
      {/* Top Bar */}
      <header className="h-[63px] bg-[#02053d] flex items-center justify-end px-[24px] gap-[24px] fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-[10px]">
          <button className="p-[8px] bg-[#21234e] border border-[#3b44b2] rounded-[8px] hover:bg-[#2d2f60] transition-colors cursor-pointer">
            <svg className="w-[20px] h-[20px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button className="p-[8px] bg-[#21234e] border border-[#3b44b2] rounded-[8px] hover:bg-[#2d2f60] transition-colors cursor-pointer">
            <svg className="w-[20px] h-[20px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>
        </div>

        <div className="w-px h-[31px] bg-[#91fbacb1] opacity-20" />

        <div className="flex items-center gap-[16px]">
          <div className="flex items-center gap-[10px]">
            <div className="w-[32px] h-[32px] rounded-full bg-gray-300 overflow-hidden shrink-0">
              <img
                src="https://i.pravatar.cc/32?img=4"
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <p className="text-white text-[14px] font-semibold leading-[20px]">XYZ</p>
              <p className="text-[#f2f4f7] text-[12px] font-normal leading-[18px]">Super Admin</p>
            </div>
          </div>
          <button className="p-[8px] bg-[#21234e] border border-[#3b44b2] rounded-[8px] hover:bg-[#2d2f60] transition-colors cursor-pointer">
            <svg className="w-[20px] h-[20px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-[63px]">
        {/* Sidebar */}
        <aside className="w-[291px] bg-[#fcfcfd] fixed left-[24px] top-[96px] bottom-[24px] flex flex-col items-center py-[40px] px-[20px] rounded-[10px] shadow-[0px_12px_8px_rgba(16,24,40,0.08),0px_4px_3px_rgba(16,24,40,0.03)] overflow-y-auto">
          <div className="flex flex-col items-center w-full">
            {/* Logo */}
            <div className="flex flex-col items-center gap-[16px] mb-[23px]">
              <div className="w-[48px] h-[48px] bg-[#313893] rounded-[12px] flex items-center justify-center shrink-0">
                <svg className="w-[24px] h-[24px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-semibold text-[#1d2939] text-[28px] tracking-tight">
                Super Admin
              </p>
            </div>
            
            <div className="flex flex-col gap-[16px] w-full">
              <div className="w-full border-t border-[#eaecf0]" />

              <nav className="w-full flex flex-col gap-[4px]">
                <NavItem
                  to="/super-admin/add-institution"
                  icon={<LayoutGrid size={20} />}
                  label="Add Institution Details"
                />
              </nav>

              <div className="w-full border-t border-[#eaecf0]" />

              <nav className="w-full flex flex-col gap-[4px]">
                <NavItem
                  to="/super-admin/settings"
                  icon={<Settings size={20} />}
                  label="Settings"
                />
                <button
                  onClick={() => logout('/login')}
                  className="flex items-center gap-[12px] px-[12px] py-[16px] rounded-[6px] hover:bg-gray-50 text-[#687b96] transition-colors w-full text-left cursor-pointer"
                >
                  <div className="w-[24px] h-[24px] flex items-center justify-center shrink-0">
                    <LogOut size={20} />
                  </div>
                  <span className="font-normal text-[16px] leading-[24px] whitespace-nowrap">Log Out</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-[351px] flex-1 mt-[33px] p-[0px] pb-[40px] overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
