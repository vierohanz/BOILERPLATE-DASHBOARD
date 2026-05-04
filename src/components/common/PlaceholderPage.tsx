import React from 'react';
import { motion } from 'framer-motion';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-text-main tracking-tight uppercase">{title}</h1>
      </div>

      <div className="glass-card p-16 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <div className="w-12 h-12 border-4 border-primary rounded-full border-t-transparent animate-spin" />
          </motion.div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-black text-text-main uppercase tracking-widest">Under Construction</h2>
          <p className="text-text-muted font-medium max-w-md mx-auto">
            {description || "This page is currently under development and data integration."}
          </p>
        </div>

        <button className="px-8 py-3 bg-slate-100 dark:bg-white/5 text-text-muted rounded-xl text-xs font-black uppercase tracking-widest hover:text-text-main transition-all">
          Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
};

export default PlaceholderPage;
