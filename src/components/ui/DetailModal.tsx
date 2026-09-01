import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-2xl',
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, mass: 0.8 }}
            className={`relative w-full ${maxWidth} bg-surface-card border border-white/10 dark:border-white/5 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]`}
          >
            {/* Header with Premium Gradient Accent */}
            <div className="relative px-8 py-7 flex items-center justify-between overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-50" />

              <div className="relative">
                <h3 className="text-xl font-black text-text-main tracking-tight uppercase flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  {title}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="relative group w-11 h-11 rounded-2xl flex items-center justify-center text-text-muted hover:text-text-main bg-slate-100/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300"
              >
                <X
                  size={18}
                  strokeWidth={2.5}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>

            <div className="h-px w-full bg-linear-to-r from-transparent via-border-subtle to-transparent" />

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">{children}</div>

            {/* Footer */}
            <div className="px-8 py-7 flex flex-col sm:flex-row justify-end gap-4">
              {footer ? (
                footer
              ) : (
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-slate-200 dark:bg-white/10 text-text-muted font-bold text-xs rounded-2xl hover:text-text-main hover:bg-slate-300 dark:hover:bg-white/20 transition-all duration-300"
                >
                  Close
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value, icon }) => (
  <div className="group relative flex items-center gap-5 p-5 rounded-3xl border border-border-subtle/40 bg-white/40 dark:bg-white/2 hover:bg-white/60 dark:hover:bg-white/5 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-border-subtle/50 flex items-center justify-center text-text-muted/40 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { size: 20, strokeWidth: 2.5 })
        : icon}
    </div>
    <div className="flex-1">
      <p className="text-xs font-bold text-text-muted/60 mb-1 group-hover:text-primary transition-colors">
        {label}
      </p>
      <div className="text-[15px] font-bold text-text-main tracking-tight leading-tight">
        {value || <span className="text-text-muted/20 italic">Empty</span>}
      </div>
    </div>
  </div>
);
