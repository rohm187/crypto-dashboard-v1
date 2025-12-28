'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MarketIndicators } from '@/lib/indicators';

interface IndicatorData {
  BTC: MarketIndicators;
  ETH: MarketIndicators;
  SOL: MarketIndicators;
}

export default function SignalBar() {
  const [indicators, setIndicators] = useState<IndicatorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIndicators();
    const interval = setInterval(fetchIndicators, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  async function fetchIndicators() {
    try {
      const response = await fetch('/api/crypto/indicators');
      const result = await response.json();

      if (result.success) {
        setIndicators(result.data);
      }
    } catch (err) {
      console.error('Error fetching indicators:', err);
    } finally {
      setLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="w-full py-3 px-4 bg-gradient-to-r from-muted/50 to-muted/50 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <Activity className="w-5 h-5 text-muted-foreground animate-pulse" />
          <span className="font-medium text-muted-foreground">Loading Market Analysis...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (!indicators) {
    return (
      <div className="w-full py-3 px-4 bg-gradient-to-r from-muted/50 to-muted/50 border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <Minus className="w-5 h-5 text-muted-foreground" />
          <span className="font-medium text-muted-foreground">Market Analysis Unavailable</span>
        </div>
      </div>
    );
  }

  // Count overall sentiments
  const bullishCount = Object.values(indicators).filter(
    (data) => data.overallSentiment === 'bullish'
  ).length;
  const bearishCount = Object.values(indicators).filter(
    (data) => data.overallSentiment === 'bearish'
  ).length;

  let overallMarket: 'bullish' | 'bearish' | 'neutral';
  let signalText: string;
  let Icon: typeof TrendingUp;

  if (bullishCount >= 2) {
    overallMarket = 'bullish';
    signalText = `Bullish Market Sentiment (${bullishCount}/3 assets showing bullish indicators)`;
    Icon = TrendingUp;
  } else if (bearishCount >= 2) {
    overallMarket = 'bearish';
    signalText = `Bearish Market Sentiment (${bearishCount}/3 assets showing bearish indicators)`;
    Icon = TrendingDown;
  } else {
    overallMarket = 'neutral';
    signalText = 'Mixed Market Signals - No clear trend';
    Icon = Minus;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={overallMarket}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`w-full py-3 px-4 ${
          overallMarket === 'bullish'
            ? 'bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border-b-2 border-green-500'
            : overallMarket === 'bearish'
            ? 'bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 border-b-2 border-red-500'
            : 'bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-500/20 border-b-2 border-yellow-500'
        } transition-all duration-300`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
          <motion.div
            animate={{
              scale: overallMarket !== 'neutral' ? [1, 1.2, 1] : 1,
              opacity: overallMarket !== 'neutral' ? [1, 0.7, 1] : 1,
            }}
            transition={{
              duration: 1.5,
              repeat: overallMarket !== 'neutral' ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            <Icon
              className={`w-5 h-5 ${
                overallMarket === 'bullish'
                  ? 'text-green-500'
                  : overallMarket === 'bearish'
                  ? 'text-red-500'
                  : 'text-yellow-500'
              }`}
            />
          </motion.div>
          <span
            className={`font-semibold ${
              overallMarket === 'bullish'
                ? 'text-green-500'
                : overallMarket === 'bearish'
                ? 'text-red-500'
                : 'text-yellow-500'
            }`}
          >
            {signalText}
          </span>
          {overallMarket !== 'neutral' && (
            <motion.div
              className={`w-2 h-2 rounded-full ${
                overallMarket === 'bullish' ? 'bg-green-500' : 'bg-red-500'
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}