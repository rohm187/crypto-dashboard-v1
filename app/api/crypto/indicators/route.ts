import { NextResponse } from 'next/server';
import { calculateAllIndicators, type MarketIndicators } from '@/lib/indicators';

/**
 * Fetch historical market data from CoinGecko for indicator calculations
 */
async function fetchHistoricalData(coinId: string, days: number = 60) {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      {
        headers: {
          'Accept': 'application/json'
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      prices: data.prices.map((p: [number, number]) => p[1]), // Extract price values
      volumes: data.total_volumes.map((v: [number, number]) => v[1]) // Extract volume values
    };
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    return { prices: [], volumes: [] };
  }
}

/**
 * GET /api/crypto/indicators
 * Returns technical indicators for BTC, ETH, and SOL
 */
export async function GET() {
  try {
    const coins = [
      { id: 'bitcoin', symbol: 'BTC' },
      { id: 'ethereum', symbol: 'ETH' },
      { id: 'solana', symbol: 'SOL' }
    ];

    const indicatorsData: Record<string, MarketIndicators> = {};

    // Fetch indicators for each coin
    await Promise.all(
      coins.map(async (coin) => {
        const { prices, volumes } = await fetchHistoricalData(coin.id);
        
        if (prices.length > 0) {
          indicatorsData[coin.symbol] = calculateAllIndicators(prices, volumes);
        } else {
          // Return neutral indicators if data fetch fails
          indicatorsData[coin.symbol] = {
            rsi: {
              value: 50,
              signal: 'neutral',
              description: 'RSI (14)',
              interpretation: 'Data unavailable'
            },
            macd: {
              macdLine: 0,
              signalLine: 0,
              histogram: 0,
              signal: 'neutral',
              interpretation: 'Data unavailable'
            },
            movingAverages: {
              sma20: 0,
              sma50: 0,
              currentPrice: 0,
              signal: 'neutral',
              interpretation: 'Data unavailable'
            },
            volumeTrend: {
              current: 0,
              average: 0,
              signal: 'normal',
              interpretation: 'Data unavailable'
            },
            overallSentiment: 'neutral'
          };
        }
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: indicatorsData,
        timestamp: new Date().toISOString(),
        disclaimer: 'These indicators are for educational purposes only. Not financial advice.'
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('Error calculating indicators:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate indicators',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
