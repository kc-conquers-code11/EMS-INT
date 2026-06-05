import React, { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  return (
    <div className="flex flex-col h-screen bg-[#fcfcfd] overflow-hidden font-sans">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1068px] mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
