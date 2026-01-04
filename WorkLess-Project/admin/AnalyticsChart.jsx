import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const AnalyticsChart = ({ data }) => {
  const maxScans = Math.max(...data.map(d => d.scans), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-black text-black">Scan Activity</h2>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No data available</p>
          </div>
        ) : (
          data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-600">{item.day}</span>
                <span className="font-bold text-black">{item.scans} scans</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 border-2 border-black overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.scans / maxScans) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default AnalyticsChart;