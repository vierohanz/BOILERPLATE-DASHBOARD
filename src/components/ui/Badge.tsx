import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'yellow' | 'blue' | 'green' | 'red';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'yellow', className = '' }) => {
  const variants = {
    yellow: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
    blue: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    green: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    red: "bg-rose-400/10 text-rose-400 border-rose-400/20"
  };

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
