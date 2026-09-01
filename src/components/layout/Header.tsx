import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Shield,
  Moon,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { useThemeStore, useAuthStore } from '@/stores';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.png';

const notifications = [
  {
    id: 1,
    type: 'info',
    time: '5 mins ago',
    title: 'Welcome to Boilerplate',
    desc: 'This is a clean admin dashboard boilerplate.',
  },
  {
    id: 2,
    type: 'success',
    time: '1 hour ago',
    title: 'System Online',
    desc: 'All systems are running smoothly.',
  },
];

const typeConfig = {
  warning: { icon: <AlertTriangle size={16} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  success: { icon: <CheckCircle2 size={16} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  info: { icon: <Info size={16} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 shrink-0 bg-surface-topbar border-b border-border-subtle flex items-center justify-between px-10 sticky top-0 z-500 transition-colors duration-200">
      {/* Brand Logo */}
      <div className="flex items-center">
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <img
            src={logo}
            alt="Admin Logo"
            title="Admin Dashboard Panel"
            loading="eager"
            width="120"
            height="32"
            className="h-7 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={(e) =>
            toggleTheme((e.currentTarget as HTMLButtonElement).getBoundingClientRect())
          }
          aria-label="Toggle theme"
          className="relative w-12 h-12 flex items-center justify-center rounded-2xl text-text-muted hover:text-primary hover:bg-slate-50 dark:hover:bg-white/5 transition-all outline-none overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'light' ? (
              <motion.span
                key="sun"
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sun size={22} className="text-primary" />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Moon size={22} className="text-primary" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="w-12 h-12 flex items-center justify-center rounded-2xl text-text-muted hover:text-text-main hover:bg-slate-50 dark:hover:bg-white/5 transition-all relative outline-none"
          >
            <Bell size={22} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-surface-topbar animate-pulse" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 mt-3 w-96 bg-surface-card border border-border-subtle rounded-3xl shadow-2xl z-9999 backdrop-blur-xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                  <div>
                    <p className="text-sm font-black text-text-main">Notifications</p>
                    <p className="text-[10px] text-text-muted font-medium mt-0.5">
                      {notifications.length} new
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl text-text-muted hover:text-text-main hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Notification Items */}
                <div className="max-h-80 overflow-y-auto p-2" style={{ scrollbarWidth: 'none' }}>
                  {notifications.map((notif) => {
                    const config = typeConfig[notif.type as keyof typeof typeConfig];
                    return (
                      <button
                        key={notif.id}
                        className="w-full flex items-start gap-3.5 p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left group"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl ${config.bg} ${config.color} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}
                        >
                          {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text-main leading-tight">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-text-muted mt-1 leading-relaxed line-clamp-2">
                            {notif.desc}
                          </p>
                          <p className="text-[9px] text-text-muted/60 mt-1.5 font-bold uppercase tracking-wider">
                            {notif.time}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-border-subtle">
                  <button className="w-full py-3 rounded-2xl text-[11px] font-bold text-primary hover:bg-primary/5 transition-all uppercase tracking-widest">
                    View All Notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-border-subtle mx-2" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all outline-none group"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-border-subtle group-hover:border-primary/30 transition-all overflow-hidden shadow-inner">
              <User
                size={20}
                className="text-text-muted group-hover:text-primary transition-colors"
              />
            </div>
            <div className="hidden lg:block text-left mr-1">
              <p className="text-[11px] font-black text-text-main uppercase leading-tight">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-wide">
                {user?.role || 'Super Administrator'}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-text-muted transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 mt-3 w-72 bg-surface-card border border-border-subtle rounded-3xl shadow-2xl p-3 z-9999 backdrop-blur-xl"
              >
                <div className="p-4 border-b border-border-subtle mb-2">
                  <p className="text-xs font-black text-text-main uppercase tracking-widest leading-none">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-[10px] text-text-muted mt-2 font-medium">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>

                <div className="space-y-1">
                  <button className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-text-main hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield size={18} />
                    </div>
                    <span>Security</span>
                  </button>
                  <button className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-text-main hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold group">
                    <div className="w-10 h-10 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings size={18} />
                    </div>
                    <span>Settings</span>
                  </button>
                  <div className="pt-2 mt-2 border-t border-border-subtle">
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-4 p-3.5 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all text-sm font-black group uppercase tracking-widest"
                    >
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <LogOut size={18} />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
