import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, color, delay }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl border-4 border-black bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-600">{title}</p>
          <p className="text-3xl font-black text-black">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;