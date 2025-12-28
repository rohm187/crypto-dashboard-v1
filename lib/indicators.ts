/**
 * Technical Indicator Calculations for Crypto Market Analysis
 * 
 * DISCLAIMER: These indicators are for EDUCATIONAL purposes only.
 * This is NOT financial advice. Users should do their own research.
 */

export interface IndicatorResult {
  value: number;
  signal: 'bullish' | 'bearish' | 'neutral';
  description: string;
  interpretation: string;
}

export interface MarketIndicators {
  rsi: IndicatorResult;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
    signal: 'bullish' | 'bearish' | 'neutral';
    interpretation: string;
  };
  movingAverages: {
    sma20: number;
    sma50: number;
    currentPrice: number;
    signal: 'bullish' | 'bearish' | 'neutral';
    interpretation: string;
  };
  volumeTrend: {
    current: number;
    average: number;
    signal: 'high' | 'low' | 'normal';
    interpretation: string;
  };
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
}

/**
 * Calculate RSI (Relative Strength Index)
 * RSI measures momentum on a scale of 0-100
 * - Above 70: Overbought (potential reversal down)
 * - Below 30: Oversold (potential reversal up)
 * - 40-60: Neutral zone
 */
export function calculateRSI(prices: number[], period: number = 14): IndicatorResult {
  if (prices.length < period + 1) {
    return {
      value: 50,
      signal: 'neutral',
      description: 'Insufficient data',
      interpretation: 'Need more price history for accurate RSI calculation'
    };
  }

  let gains = 0;
  let losses = 0;

  // Calculate initial average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Calculate RSI for remaining prices using smoothed moving average
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  const rs = avgGain / (avgLoss || 0.001); // Prevent division by zero
  const rsi = 100 - (100 / (1 + rs));

  let signal: 'bullish' | 'bearish' | 'neutral';
  let interpretation: string;

  if (rsi > 70) {
    signal = 'bearish';
    interpretation = 'Overbought zone - price may be due for a pullback';
  } else if (rsi < 30) {
    signal = 'bullish';
    interpretation = 'Oversold zone - price may be due for a bounce';
  } else if (rsi >= 50) {
    signal = 'bullish';
    interpretation = 'Bullish momentum - buyers are in control';
  } else {
    signal = 'neutral';
    interpretation = 'Neutral zone - no strong momentum detected';
  }

  return {
    value: Math.round(rsi * 100) / 100,
    signal,
    description: `RSI (${period})`,
    interpretation
  };
}

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * MACD shows the relationship between two moving averages
 * - Positive histogram: Bullish momentum
 * - Negative histogram: Bearish momentum
 * - Crossovers indicate potential trend changes
 */
export function calculateMACD(
  prices: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
) {
  if (prices.length < slowPeriod) {
    return {
      macdLine: 0,
      signalLine: 0,
      histogram: 0,
      signal: 'neutral' as const,
      interpretation: 'Insufficient data for MACD calculation'
    };
  }

  // Calculate EMAs
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  const macdLine = fastEMA - slowEMA;

  // For signal line, we'd need MACD history, so we'll use a simplified version
  const signalLine = macdLine * 0.9; // Simplified approximation
  const histogram = macdLine - signalLine;

  let signal: 'bullish' | 'bearish' | 'neutral';
  let interpretation: string;

  if (histogram > 0 && macdLine > 0) {
    signal = 'bullish';
    interpretation = 'Strong bullish momentum - MACD above signal line';
  } else if (histogram < 0 && macdLine < 0) {
    signal = 'bearish';
    interpretation = 'Strong bearish momentum - MACD below signal line';
  } else {
    signal = 'neutral';
    interpretation = 'Weak momentum - watch for crossover signals';
  }

  return {
    macdLine: Math.round(macdLine * 100) / 100,
    signalLine: Math.round(signalLine * 100) / 100,
    histogram: Math.round(histogram * 100) / 100,
    signal,
    interpretation
  };
}

/**
 * Calculate Simple Moving Average (SMA)
 */
function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;
  const slice = prices.slice(-period);
  return slice.reduce((sum, price) => sum + price, 0) / period;
}

/**
 * Calculate Exponential Moving Average (EMA)
 * Gives more weight to recent prices
 */
function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return prices[prices.length - 1] || 0;

  const multiplier = 2 / (period + 1);
  let ema = calculateSMA(prices.slice(0, period), period);

  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }

  return ema;
}

/**
 * Analyze Moving Averages
 * Compares current price to SMA20 and SMA50
 * - Price above both: Bullish trend
 * - Price below both: Bearish trend
 * - Mixed: Neutral/consolidation
 */
export function analyzeMovingAverages(
  prices: number[]
): MarketIndicators['movingAverages'] {
  const currentPrice = prices[prices.length - 1] || 0;
  const sma20 = calculateSMA(prices, 20);
  const sma50 = calculateSMA(prices, 50);

  let signal: 'bullish' | 'bearish' | 'neutral';
  let interpretation: string;

  if (currentPrice > sma20 && currentPrice > sma50) {
    signal = 'bullish';
    interpretation = 'Price above both moving averages - uptrend confirmed';
  } else if (currentPrice < sma20 && currentPrice < sma50) {
    signal = 'bearish';
    interpretation = 'Price below both moving averages - downtrend confirmed';
  } else {
    signal = 'neutral';
    interpretation = 'Mixed signals - market may be consolidating';
  }

  return {
    sma20: Math.round(sma20 * 100) / 100,
    sma50: Math.round(sma50 * 100) / 100,
    currentPrice: Math.round(currentPrice * 100) / 100,
    signal,
    interpretation
  };
}

/**
 * Analyze Volume Trends
 * High volume = strong conviction
 * Low volume = weak participation
 */
export function analyzeVolume(
  volumes: number[]
): MarketIndicators['volumeTrend'] {
  if (volumes.length === 0) {
    return {
      current: 0,
      average: 0,
      signal: 'normal',
      interpretation: 'No volume data available'
    };
  }

  const current = volumes[volumes.length - 1] || 0;
  const average = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;

  let signal: 'high' | 'low' | 'normal';
  let interpretation: string;

  if (current > average * 1.5) {
    signal = 'high';
    interpretation = 'High trading volume - strong market participation';
  } else if (current < average * 0.5) {
    signal = 'low';
    interpretation = 'Low trading volume - weak market interest';
  } else {
    signal = 'normal';
    interpretation = 'Normal trading volume - typical market activity';
  }

  return {
    current: Math.round(current),
    average: Math.round(average),
    signal,
    interpretation
  };
}

/**
 * Calculate all indicators for a cryptocurrency
 */
export function calculateAllIndicators(
  prices: number[],
  volumes: number[]
): MarketIndicators {
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  const movingAverages = analyzeMovingAverages(prices);
  const volumeTrend = analyzeVolume(volumes);

  // Determine overall sentiment
  const bullishSignals = [
    rsi.signal === 'bullish',
    macd.signal === 'bullish',
    movingAverages.signal === 'bullish'
  ].filter(Boolean).length;

  const bearishSignals = [
    rsi.signal === 'bearish',
    macd.signal === 'bearish',
    movingAverages.signal === 'bearish'
  ].filter(Boolean).length;

  let overallSentiment: 'bullish' | 'bearish' | 'neutral';
  if (bullishSignals >= 2) {
    overallSentiment = 'bullish';
  } else if (bearishSignals >= 2) {
    overallSentiment = 'bearish';
  } else {
    overallSentiment = 'neutral';
  }

  return {
    rsi,
    macd,
    movingAverages,
    volumeTrend,
    overallSentiment
  };
}
