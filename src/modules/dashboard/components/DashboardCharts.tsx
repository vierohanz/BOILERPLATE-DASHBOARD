import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, BarChart3, PieChart } from 'lucide-react';

// Data trend per year
const yearlyData = [
  { year: '2019', rate: 27.7 },
  { year: '2020', rate: 24.4 },
  { year: '2021', rate: 21.6 },
  { year: '2022', rate: 17.7 },
  { year: '2023', rate: 15.3 },
];

// Data distribution
const distributionData = [
  { label: 'Category A', value: 62, color: '#22c55e' },
  { label: 'Category B', value: 18, color: '#f59e0b' },
  { label: 'Category C', value: 12, color: '#ef4444' },
  { label: 'Category D', value: 8, color: '#6366f1' },
];

const maxYearly = Math.max(...yearlyData.map((d) => d.rate));
const totalDistribution = distributionData.reduce((a, b) => a + b.value, 0);

const DashboardCharts: React.FC = () => {
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  // Build donut paths
  const buildDonut = () => {
    const cx = 80,
      cy = 80,
      r = 60,
      strokeWidth = 24;
    const circumference = 2 * Math.PI * r;
    let offset = 0;
    return distributionData.map((item, i) => {
      const segLength = (item.value / totalDistribution) * circumference;
      const dashArray = `${segLength} ${circumference - segLength}`;
      const dashOffset = -offset;
      offset += segLength;
      return (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={item.color}
          strokeWidth={activeSlice === i ? strokeWidth + 6 : strokeWidth}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          className="transition-all duration-300 cursor-pointer"
          style={{ opacity: activeSlice !== null && activeSlice !== i ? 0.3 : 1 }}
          onMouseEnter={() => setActiveSlice(i)}
          onMouseLeave={() => setActiveSlice(null)}
        />
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Bar Chart - Tren Stunting Tahunan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-card border border-border-subtle rounded-3xl p-6 shadow-sm dark:shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={16} className="text-primary" />
              <h3 className="text-xs font-black text-text-main uppercase tracking-widest">
                Yearly Performance
              </h3>
            </div>
            <p className="text-[10px] text-text-muted font-medium">
              Data overview for the last 5 years
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 rounded-xl">
            <TrendingDown size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500">+15.4%</span>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end gap-3 h-48 px-2">
          {yearlyData.map((item, i) => {
            const heightPercent = (item.rate / maxYearly) * 100;
            const isActive = activeBar === i;
            const isLatest = i === yearlyData.length - 1;
            return (
              <div
                key={item.year}
                className="flex-1 flex flex-col items-center gap-2 cursor-pointer"
                onMouseEnter={() => setActiveBar(i)}
                onMouseLeave={() => setActiveBar(null)}
              >
                {/* Value label */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  className="text-[10px] font-black text-text-main"
                >
                  {item.rate}
                </motion.span>

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                  className={`w-full rounded-xl transition-all duration-300 ${
                    isLatest
                      ? 'bg-primary shadow-lg shadow-primary/20'
                      : isActive
                        ? 'bg-primary/60'
                        : 'bg-slate-100 dark:bg-white/5'
                  }`}
                  style={{ minHeight: 8 }}
                />

                {/* Year label */}
                <span
                  className={`text-[10px] font-bold transition-colors ${
                    isLatest || isActive ? 'text-text-main' : 'text-text-muted/50'
                  }`}
                >
                  {item.year}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Chart 2: Donut + Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-card border border-border-subtle rounded-3xl p-6 shadow-sm dark:shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChart size={16} className="text-primary" />
              <h3 className="text-xs font-black text-text-main uppercase tracking-widest">
                Market Share Distribution
              </h3>
            </div>
            <p className="text-[10px] text-text-muted font-medium">
              Composition of data across categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Donut Chart */}
          <div className="relative shrink-0">
            <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
              {buildDonut()}
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-text-main">
                {activeSlice !== null
                  ? `${distributionData[activeSlice].value}%`
                  : `${distributionData[0].value}%`}
              </span>
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                {activeSlice !== null
                  ? distributionData[activeSlice].label
                  : distributionData[0].label}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {distributionData.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                  activeSlice === i ? 'bg-slate-50 dark:bg-white/5' : ''
                }`}
                onMouseEnter={() => setActiveSlice(i)}
                onMouseLeave={() => setActiveSlice(null)}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-text-main">{item.label}</span>
                  <span className="text-[11px] font-black text-text-muted">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
