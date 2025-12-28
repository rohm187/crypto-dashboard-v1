import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface CoinGeckoResponse {
  id?: string;
  symbol?: string;
  name?: string;
  image?: string;
  current_price?: number;
  price_change_percentage_24h?: number;
}

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=3&page=1&sparkline=false',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    );

    if (!response?.ok) {
      throw new Error(`CoinGecko API error: ${response?.status}`);
    }

    const data: CoinGeckoResponse[] = await response.json();

    return NextResponse.json({
      prices: data?.map?.((coin) => ({
        id: coin?.id ?? '',
        symbol: coin?.symbol ?? '',
        name: coin?.name ?? '',
        current_price: coin?.current_price ?? 0,
        price_change_percentage_24h: coin?.price_change_percentage_24h ?? 0,
        image: coin?.image ?? '',
      })) ?? [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto prices', prices: [] },
      { status: 500 }
    );
  }
}