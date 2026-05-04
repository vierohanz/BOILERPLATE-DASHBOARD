import React from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '../components/DashboardStats';
import DashboardCharts from '../components/DashboardCharts';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-text-main tracking-tight uppercase">Dashboard</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-10"
      >
        <DashboardStats />
        <DashboardCharts />
      </motion.div>
    </div>
  );
};

export default DashboardPage;
