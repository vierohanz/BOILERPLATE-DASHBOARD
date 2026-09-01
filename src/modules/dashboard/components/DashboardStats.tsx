import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2 } from 'lucide-react';

const stats = [
  {
    label: 'Total Users',
    value: '1,250',
    sub: 'Active users this month',
    color: '#6056e7',
    icon: <Users size={20} />,
    path: 'M0 30 Q10 25 20 28 T40 15 T60 25 T80 20 T100 25',
  },
  {
    label: 'Total Revenue',
    value: '$12,450',
    sub: 'Year to date',
    color: '#60a5fa',
    icon: <TrendingUp size={20} />,
    path: 'M0 35 Q10 38 20 30 T40 32 T60 15 T80 28 T100 20',
  },
  {
    label: 'Active Projects',
    value: '24',
    sub: 'Ongoing tasks',
    color: '#34d399', // emerald-400
    icon: <Building2 size={20} />,
    path: 'M0 25 Q10 28 20 22 T40 25 T60 20 T80 22 T100 15',
  },
];

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface-card rounded-4xl p-8 border border-border-subtle relative overflow-hidden group hover:border-primary/20 transition-all duration-300 shadow-sm dark:shadow-2xl"
        >
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                {stat.label}
              </p>
              <h3 className="text-4xl font-black text-text-main tracking-tight">{stat.value}</h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-primary transition-colors border border-border-subtle">
              {stat.icon}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-text-muted mb-6 group-hover:text-text-main transition-colors relative z-10">
            <span className="opacity-80 uppercase tracking-wide">{stat.sub}</span>
            <TrendingUp size={14} className="text-emerald-500" />
          </div>

          {/* Sparkline simulation */}
          <div className="h-12 w-full mt-auto relative z-10">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                d={stat.path}
                fill="none"
                stroke={stat.color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={`${stat.path} L100 40 L0 40 Z`}
                fill={`url(#gradient-${i})`}
                className="opacity-10 dark:opacity-20 transition-opacity"
              />
              <defs>
                <linearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={stat.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={stat.color} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Background Decorative Accent */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
