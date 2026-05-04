import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  icon?: React.ReactNode;
  forceTheme?: 'light' | 'dark';
  position?: 'up' | 'down' | 'left' | 'right';
  variant?: 'list' | 'grid';
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Pilih opsi...',
  label,
  className = '',
  icon,
  forceTheme,
  position = 'down',
  variant = 'list',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    width: 0, 
    height: 0, 
    rectTop: 0, 
    rectRight: 0 
  });

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        bottom: window.innerHeight - (rect.top + window.scrollY),
        right: window.innerWidth - (rect.left + window.scrollX),
        rectTop: rect.top + window.scrollY,
        rectRight: rect.right + window.scrollX,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    }
    setIsOpen(!isOpen);
  };

  const dropdownList = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ 
            opacity: 0, 
            y: position === 'up' ? -15 : position === 'down' ? 15 : 0, 
            x: position === 'right' ? 15 : position === 'left' ? -15 : 0,
            scale: 0.95 
          }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ 
            opacity: 0, 
            y: position === 'up' ? -15 : position === 'down' ? 15 : 0, 
            x: position === 'right' ? 15 : position === 'left' ? -15 : 0,
            scale: 0.95 
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          style={{
            position: 'absolute',
            ...(position === 'up' && { bottom: coords.bottom + 10, left: coords.left }),
            ...(position === 'down' && { top: coords.top + 10, left: coords.left }),
            ...(position === 'right' && { top: coords.rectTop, left: coords.rectRight + 10 }),
            ...(position === 'left' && { top: coords.rectTop, right: coords.right + 10 }),
            width: variant === 'grid' ? 'auto' : (position === 'left' || position === 'right' ? 'auto' : coords.width),
            minWidth: coords.width,
            zIndex: 20000,
          }}
          className={`bg-surface-card/90 backdrop-blur-xl border border-border-subtle rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden ${
            forceTheme === 'light' 
              ? '!bg-white !border-slate-100 !shadow-slate-200/50 light' 
              : forceTheme === 'dark' 
                ? '!bg-slate-800 !border-slate-700 !shadow-none dark' 
                : ''
          }`}
        >
          <div 
            className={`p-2.5 custom-scrollbar ${variant === 'grid' ? 'grid grid-flow-col auto-cols-max gap-2' : 'overflow-y-auto space-y-1.5 scrollbar-hide'} ${options.length > 6 && variant === 'list' ? 'max-h-[320px]' : ''}`}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {options.length === 0 ? (
              <div className="px-4 py-8 text-center">
                 <p className="text-[10px] text-text-muted/30 font-black uppercase tracking-[0.2em]">Tidak ada opsi</p>
              </div>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value.toString());
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between gap-3 rounded-2xl text-[14px] font-bold transition-all duration-300 ${
                      variant === 'grid' ? 'px-4 py-2.5' : 'w-full px-5 py-3.5'
                    } ${
                      isSelected 
                        ? 'bg-primary text-slate-900 shadow-[0_8px_16_px_-4px_rgba(251,191,36,0.3)]' 
                        : 'text-text-muted hover:bg-slate-100 dark:hover:bg-white/5 hover:text-text-main'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && variant === 'list' && <Check size={16} strokeWidth={3} />}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`flex flex-col gap-2.5 ${className} ${forceTheme === 'light' ? 'light' : forceTheme === 'dark' ? 'dark' : ''}`} ref={containerRef}>
      {label && (
        <label className="text-sm font-bold text-text-muted transition-colors duration-300 group-focus-within:text-primary ml-1">
          {label}
        </label>
      )}
      <div className="relative group/select">
        <button
          type="button"
          onClick={toggleDropdown}
          className={`w-full flex items-center justify-between gap-3 ${icon ? 'pl-12' : 'pl-5'} pr-5 py-3.5 bg-surface-card border border-border-subtle/60 rounded-2xl text-[15px] font-bold text-text-main hover:border-primary/20 hover:bg-slate-50 dark:hover:bg-white/5 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 shadow-sm hover:shadow-md transition-all duration-300 text-left ${
            forceTheme === 'light' ? '!bg-white !border-slate-200 !text-slate-900 !shadow-xl !shadow-slate-200/20' : ''
          }`}
        >
          <div className={`absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none transition-all duration-300 ${
            forceTheme === 'light' ? '!text-slate-400 group-hover/select:!text-primary' : 'text-text-muted/30 group-hover/select:text-primary'
          }`}>
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 18, strokeWidth: 2.5 }) : icon}
          </div>
          
          <span className={`whitespace-nowrap ${selectedOption ? (forceTheme === 'light' ? '!text-slate-900' : 'text-text-main') : 'text-text-muted/20'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDown 
            size={16} 
            strokeWidth={3}
            className={`transition-all duration-300 ${
              isOpen ? 'rotate-180 text-primary scale-110' : (forceTheme === 'light' ? '!text-slate-400' : 'text-text-muted/30')
            }`} 
          />
        </button>

        {createPortal(dropdownList, document.body)}
      </div>
    </div>
  );
};
