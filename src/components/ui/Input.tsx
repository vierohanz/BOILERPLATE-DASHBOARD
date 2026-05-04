import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2.5 w-full group/field">
      {label && (
        <label className="text-sm font-bold text-text-muted transition-colors duration-300 group-focus-within/field:text-primary ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-text-muted/30 group-focus-within/field:text-primary transition-all duration-300">
            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 18, strokeWidth: 2.5 }) : icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-12' : 'pl-5'} pr-5 py-3.5 bg-white dark:bg-white/2 border border-border-subtle/60 rounded-2xl text-[15px] font-bold text-text-main placeholder:text-text-muted/20 hover:border-primary/20 focus:outline-none focus:border-primary/40 focus:bg-white dark:focus:bg-white/5 focus:ring-4 focus:ring-primary/5 shadow-sm focus:shadow-md transition-all duration-300 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};
