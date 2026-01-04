import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UsageStats = ({ userMetadata }) => {
  const isPro = userMetadata?.subscription_tier === 'pro';
  const scansUsed = userMetadata?.scans_today || 0;
  const scansLimit = isPro ? '∞' : 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mb-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl border-4 border-black ${
            isPro ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-purple-500'
          }`}>
            {isPro ? (
              <Crown className="w-6 h-6 text-white" />
            ) : (
              <Zap className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-black text-black">
              {isPro ? 'Pro Plan' : 'Basic Plan'}
            </h3>
            <p className="text-slate-600">
              {isPro ? (
                'Unlimited scans available'
              ) : (
                <>Today's Usage: {scansUsed} / {scansLimit} scans</>
              )}
            </p>
          </div>
        </div>

        {!isPro && (
          <Button
            onClick={() => window.location.href = '/pricing'}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>
        )}
      </div>

      {!isPro && (
        <div className="mt-4">
          <div className="w-full bg-slate-200 rounded-full h-3 border-4 border-black overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(scansUsed / 3) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UsageStats;