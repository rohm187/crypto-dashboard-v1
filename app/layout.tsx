import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import GoogleAnalytics from '@/components/google-analytics';
import RewardfulScript from '@/components/rewardful-script';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crypto Trading Dashboard | Live Signals & Market Data',
  description: 'Professional crypto trading dashboard with live BTC, ETH, and SOL prices. Get real-time trading signals and insights to maximize your trading profits.',
  keywords: ['crypto trading', 'bitcoin', 'ethereum', 'solana', 'trading signals', 'cryptocurrency'],
  authors: [{ name: 'Crypto Trading Dashboard' }],
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Crypto Trading Dashboard | Live Signals & Market Data',
    description: 'Professional crypto trading dashboard with live prices and trading signals',
    url: '/',
    siteName: 'Crypto Trading Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Crypto Trading Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Trading Dashboard',
    description: 'Professional crypto trading dashboard with live prices and signals',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const REWARDFUL_API_KEY = process.env.NEXT_PUBLIC_REWARDFUL_API_KEY;
  const showRewardful = REWARDFUL_API_KEY && REWARDFUL_API_KEY !== 'rf_placeholder_key';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {showRewardful && (
          <Script
            src={`https://r.wdfl.co/rw.js`}
            data-rewardful={REWARDFUL_API_KEY}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
        <GoogleAnalytics />
        <RewardfulScript />
      </body>
    </html>
  );
}