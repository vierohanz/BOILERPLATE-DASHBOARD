import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-card p-6 flex items-start justify-between group cursor-default hover:bg-white/[0.07] transition-colors"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
        <p className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend} <span className="text-text-muted font-normal">dari bulan lalu</span>
        </p>
      </div>
      <div className="p-3 rounded-2xl bg-white/5 text-indigo-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </motion.div>
  );
};

export default StatCard;
