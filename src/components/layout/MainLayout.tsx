import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSidebarStore } from '@/stores';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-text-main antialiased transition-colors duration-300">
      {/* Header is full-width at the top */}
      <Header />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar is below header */}
        <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth bg-background dark:bg-background transition-colors duration-300">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
