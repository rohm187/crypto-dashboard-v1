'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Image from 'next/image';

interface CryptoCardProps {
  crypto: {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
  };
}

export default function CryptoCard({ crypto }: CryptoCardProps) {
  const isPositive = (crypto?.price_change_percentage_24h ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-xl bg-card border shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
            {crypto?.image && (
              <Image
                src={crypto.image}
                alt={crypto?.name ?? 'Crypto'}
                fill
                className="object-cover"
                unoptimized
              />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">{crypto?.name ?? 'Unknown'}</h3>
            <p className="text-sm text-muted-foreground uppercase">{crypto?.symbol ?? ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold">
          ${(crypto?.current_price ?? 0)?.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {(crypto?.price_change_percentage_24h ?? 0)?.toFixed(2)}%
          </span>
          <span className="text-muted-foreground">24h</span>
        </div>
      </div>
    </motion.div>
  );
}