'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Info, Activity, BarChart3, LineChart, Volume2 } from 'lucide-react';
import type { MarketIndicators } from '@/lib/indicators';

interface IndicatorData {
  BTC: MarketIndicators;
  ETH: MarketIndicators;
  SOL: MarketIndicators;
}

export function IndicatorDashboard() {
  const [indicators, setIndicators] = useState<IndicatorData | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<'BTC' | 'ETH' | 'SOL'>('BTC');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIndicators();
    const interval = setInterval(fetchIndicators, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  async function fetchIndicators() {
    try {
      setLoading(true);
      const response = await fetch('/api/crypto/indicators');
      const result = await response.json();

      if (result.success) {
        setIndicators(result.data);
        setError(null);
      } else {
        setError('Failed to load indicators');
      }
    } catch (err) {
      console.error('Error fetching indicators:', err);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !indicators) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Market Analysis Tools
          </CardTitle>
          <CardDescription>Loading technical indicators...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !indicators) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Market Analysis Tools</CardTitle>
          <CardDescription className="text-destructive">{error || 'No data available'}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const data = indicators[selectedCoin];

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'bullish': return 'text-green-500';
      case 'bearish': return 'text-red-500';
      case 'neutral': return 'text-yellow-500';
      case 'high': return 'text-green-500';
      case 'low': return 'text-red-500';
      case 'normal': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getSignalBadgeVariant = (signal: string): 'default' | 'destructive' | 'secondary' => {
    switch (signal) {
      case 'bullish': return 'default';
      case 'bearish': return 'destructive';
      default: return 'secondary';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'bullish': return <TrendingUp className="h-4 w-4" />;
      case 'bearish': return <TrendingDown className="h-4 w-4" />;
      default: return <Minus className="h-4 w-4" />;
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Market Analysis Tools
              </CardTitle>
              <CardDescription>Technical indicators for educational purposes only</CardDescription>
            </div>
            <div className="flex gap-2">
              {(['BTC', 'ETH', 'SOL'] as const).map((coin) => (
                <button
                  key={coin}
                  onClick={() => setSelectedCoin(coin)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedCoin === coin
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {coin}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Overall Sentiment */}
          <div className="mb-6 p-4 rounded-lg bg-secondary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Overall Market Sentiment</h3>
                <p className="text-sm text-muted-foreground">Based on multiple technical indicators</p>
              </div>
              <Badge 
                variant={getSignalBadgeVariant(data.overallSentiment)}
                className="text-lg px-4 py-2 flex items-center gap-2"
              >
                {getSignalIcon(data.overallSentiment)}
                {data.overallSentiment.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Indicators Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* RSI Indicator */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  RSI (Relative Strength Index)
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">What is RSI?</p>
                      <p className="text-sm">Measures momentum on a scale of 0-100. Above 70 = overbought, below 30 = oversold.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-3xl font-bold ${getSignalColor(data.rsi.signal)}`}>
                    {data.rsi.value}
                  </span>
                  <Badge variant={getSignalBadgeVariant(data.rsi.signal)}>
                    {data.rsi.signal}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{data.rsi.interpretation}</p>
                {/* RSI Bar */}
                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      data.rsi.value > 70 ? 'bg-red-500' :
                      data.rsi.value < 30 ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${data.rsi.value}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0 (Oversold)</span>
                  <span>50</span>
                  <span>100 (Overbought)</span>
                </div>
              </CardContent>
            </Card>

            {/* MACD Indicator */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  MACD (Trend Momentum)
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">What is MACD?</p>
                      <p className="text-sm">Shows relationship between two moving averages. Positive histogram = bullish, negative = bearish.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Histogram</div>
                    <span className={`text-2xl font-bold ${getSignalColor(data.macd.signal)}`}>
                      {data.macd.histogram > 0 ? '+' : ''}{data.macd.histogram}
                    </span>
                  </div>
                  <Badge variant={getSignalBadgeVariant(data.macd.signal)}>
                    {data.macd.signal}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{data.macd.interpretation}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MACD Line:</span>
                    <span className="font-semibold">{data.macd.macdLine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signal Line:</span>
                    <span className="font-semibold">{data.macd.signalLine}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Moving Averages */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Moving Averages
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">What are Moving Averages?</p>
                      <p className="text-sm">Shows average price over time. Price above MAs = uptrend, below = downtrend.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={getSignalBadgeVariant(data.movingAverages.signal)} className="text-sm">
                    {data.movingAverages.signal}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{data.movingAverages.interpretation}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Price:</span>
                    <span className="font-bold">${data.movingAverages.currentPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SMA 20:</span>
                    <span className={`font-semibold ${
                      data.movingAverages.currentPrice > data.movingAverages.sma20 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${data.movingAverages.sma20.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SMA 50:</span>
                    <span className={`font-semibold ${
                      data.movingAverages.currentPrice > data.movingAverages.sma50 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${data.movingAverages.sma50.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volume Analysis */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Volume Analysis
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">What is Volume?</p>
                      <p className="text-sm">Shows trading activity. High volume = strong interest, low volume = weak participation.</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={data.volumeTrend.signal === 'high' ? 'default' : 'secondary'}
                    className="text-sm"
                  >
                    {data.volumeTrend.signal.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{data.volumeTrend.interpretation}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Volume:</span>
                    <span className="font-bold">${(data.volumeTrend.current / 1e9).toFixed(2)}B</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Volume:</span>
                    <span className="font-semibold">${(data.volumeTrend.average / 1e9).toFixed(2)}B</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-muted-foreground">
              <strong>Educational Disclaimer:</strong> These indicators are provided for educational purposes only. 
              This is NOT financial advice. Always do your own research and consult with a qualified financial advisor 
              before making any investment decisions. Past performance does not guarantee future results.
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
