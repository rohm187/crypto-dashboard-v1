'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import CryptoCard from './crypto-card';
import StripeCheckoutButton from './stripe-checkout-button';
import CryptoCheckoutButton from './crypto-checkout-button';
import { Button } from './ui/button';

interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export default function CryptoDashboard() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setError(null);
      const response = await fetch('/api/crypto/prices');
      
      if (!response?.ok) {
        throw new Error('Failed to fetch prices');
      }
      
      const data = await response.json();
      setPrices(data?.prices ?? []);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching crypto prices:', err);
      setError('Failed to load prices. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchPrices();
  };

  if (loading && prices?.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Live Crypto Prices</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {lastUpdate?.toLocaleTimeString() ?? 'N/A'}
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          {error}
        </div>
      )}

      {/* Crypto Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prices?.map?.((crypto) => (
          <CryptoCard key={crypto?.id} crypto={crypto} />
        )) ?? null}
      </div>

      {/* Subscription CTA */}
      <div className="mt-12 p-8 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 shadow-lg">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-bold">Choose Your Perfect Plan</h3>
          <p className="text-muted-foreground">
            From basic signals to elite trading tools. Plans starting at just $29/month.
          </p>
          <div className="pt-4">
            <Button
              size="lg"
              onClick={() => window.location.href = '/pricing'}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8"
            >
              View All Pricing Plans
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Pay with credit card or cryptocurrency (BTC, ETH, USDC, DAI)
          </p>
        </div>
      </div>
    </div>
  );
}