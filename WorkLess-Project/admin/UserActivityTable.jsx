import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const UserActivityTable = ({ activity }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
    >
      <h2 className="text-2xl font-black mb-4 text-black">Recent Activity</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activity.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No activity yet</p>
          </div>
        ) : (
          activity.map((scan, index) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-slate-50 rounded-lg border-2 border-slate-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-bold text-sm text-black">{scan.file_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(scan.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  {scan.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default UserActivityTable;