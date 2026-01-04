import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const ScanResults = ({ results }) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Original Image */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
      >
        <h3 className="text-2xl font-black mb-4 text-black">Original Image</h3>
        <div className="aspect-[4/3] bg-slate-100 rounded-lg border-4 border-black overflow-hidden">
          <img
            src={results.originalImage}
            alt="Original document"
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>

      {/* AI Refined Data */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
      >
        <h3 className="text-2xl font-black mb-4 text-black">AI Refined Data</h3>
        <div className="space-y-3">
          {results.refinedData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-bold text-sm text-slate-600">{item.field}</span>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-bold">{item.confidence}%</span>
                </div>
              </div>
              <p className="text-black font-medium">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ScanResults;