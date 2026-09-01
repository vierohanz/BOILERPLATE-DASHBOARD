import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'blue' | 'green' | 'red';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    blue: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    green: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    red: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
