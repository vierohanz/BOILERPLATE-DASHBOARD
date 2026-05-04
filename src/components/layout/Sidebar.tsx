import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface SidebarLinkProps {
  icon: React.ReactNode;
  title: string;
  path: string;
  end?: boolean;
  isCollapsed: boolean;
}

const SidebarLink = ({ icon, title, path, end, isCollapsed }: SidebarLinkProps) => (
  <NavLink to={path} end={end} className="block outline-none relative group/link">
    {({ isActive }) => (
      <>
        <div className={`flex items-center relative ${isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'w-full gap-4 px-6 h-12'}`}>
          <span className={`${isActive ? 'text-primary' : 'text-text-muted/60 group-hover/link:text-text-main'} transition-colors duration-300 shrink-0`}>
            {icon}
          </span>
          {!isCollapsed && (
            <span className={`text-[11px] font-bold uppercase tracking-wide whitespace-nowrap transition-colors duration-300 ${isActive ? 'text-primary' : 'text-text-muted group-hover/link:text-text-main'}`}>
              {title}
            </span>
          )}
          
          {isActive && (
            <motion.div
              layoutId="active-pill"
              className="absolute bg-primary/10 rounded-2xl border border-primary/20 z-[-1] inset-0"
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            />
          )}
        </div>

        {/* CSS-only tooltip: positioned relative to NavLink, always perfectly centered */}
        {isCollapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap pointer-events-none opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 shadow-lg z-[99999]">
            {title}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
          </div>
        )}
      </>
    )}
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {

  const menuGroups = [
    {
      title: "Main",
      items: [
        { title: "Users", icon: <Users size={20} />, path: "/dashboard/users" },
      ]
    }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 100 : 300 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="h-full bg-surface-sidebar border-r border-border-subtle flex flex-col z-50 relative transition-colors duration-200 overflow-visible"
    >
      {/* Premium Toggle Button */}
      <button 
        onClick={onToggle}
        className="absolute -right-4 top-7 w-8 h-8 bg-primary text-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 hover:brightness-110 active:scale-90 transition-all z-50"
      >
        {isCollapsed ? <ChevronRight size={14} strokeWidth={2.5} /> : <ChevronLeft size={14} strokeWidth={2.5} />}
      </button>

      <div 
        className="flex-1 w-full space-y-8 py-8 px-5 overflow-visible"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <LayoutGroup>
          {/* Dashboard Link */}
          <div className="mb-6">
            <SidebarLink icon={<LayoutDashboard size={20} />} title="Dashboard" path="/dashboard" end isCollapsed={isCollapsed} />
          </div>

          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4 mb-8">
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 text-[10px] font-black uppercase tracking-[0.25em] text-text-muted/40 mb-2 overflow-hidden"
                  >
                    {group.title}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarLink key={item.path} icon={item.icon} title={item.title} path={item.path} isCollapsed={isCollapsed} />
                ))}
              </div>
            </div>
          ))}
        </LayoutGroup>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
