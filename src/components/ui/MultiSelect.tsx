import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  icon,
  className = '',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-surface-card border border-border-subtle hover:border-primary/30 transition-all duration-300 ${
          compact 
            ? 'w-12 h-12 justify-center rounded-2xl' 
            : 'px-4 py-3 rounded-2xl min-h-[48px]'
        } cursor-pointer shadow-sm`}
      >
        <div className={`text-text-muted/40 shrink-0 ${compact && value.length > 0 ? 'text-primary' : ''}`}>
          {icon}
        </div>
        
        {!compact && (
          <>
            <div className="flex-1 flex flex-wrap gap-1.5 overflow-hidden">
              {value.length === 0 ? (
                <span className="text-sm font-bold text-text-muted/40">{placeholder}</span>
              ) : (
                value.slice(0, 1).map((val) => {
                  const label = options.find((o) => o.value === val)?.label;
                  return (
                    <span key={val} className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-xs font-black flex items-center gap-1">
                      {label}
                      <X size={10} onClick={(e) => { e.stopPropagation(); toggleOption(val); }} className="hover:text-primary/70 transition-colors" />
                    </span>
                  );
                })
              )}
              {value.length > 1 && (
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 text-text-muted rounded-lg text-xs font-black">
                  +{value.length - 1} lainnya
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {value.length > 0 && (
                <button onClick={clearAll} className="p-1 text-text-muted/30 hover:text-rose-400 transition-colors">
                  <X size={14} />
                </button>
              )}
              <ChevronDown 
                size={16} 
                className={`text-text-muted/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          </>
        )}

        {compact && value.length > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-slate-900 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-surface-card">
            {value.length}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute z-100 top-full left-0 mt-2 bg-surface-card border border-border-subtle rounded-2xl shadow-2xl shadow-black/10 overflow-hidden ${
              compact ? 'min-w-[240px]' : 'right-0'
            }`}
          >
            <div className="max-h-[280px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
              <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted/40 border-b border-border-subtle/50 mb-1">
                Pilih Opsi
              </div>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-primary/10 text-primary font-bold' 
                        : 'text-text-muted hover:bg-slate-50 dark:hover:bg-white/5 hover:text-text-main'
                    }`}
                  >
                    <span className="text-sm">{option.label}</span>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
