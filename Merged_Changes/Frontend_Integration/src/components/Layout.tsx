import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, activePage, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#fcfcfd]">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-[#fcfcfd] pt-6 pb-[25px] px-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

