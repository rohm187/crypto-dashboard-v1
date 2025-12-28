import CryptoDashboard from '@/components/crypto-dashboard';
import SignalBar from '@/components/signal-bar';
import { IndicatorDashboard } from '@/components/indicator-dashboard';
import { Zap, TrendingUp, Shield, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Signal Bar */}
      <SignalBar />

      {/* Hero Section */}
      <section className="relative w-full py-20 px-4 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Real-Time Crypto Price Tracker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Track live prices for Bitcoin, Ethereum, and Solana. Monitor market trends with professional-grade technical indicators and join our exclusive trading community.
          </p>
        </div>
      </section>

      {/* Crypto Dashboard */}
      <section className="w-full py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <CryptoDashboard />
        </div>
      </section>

      {/* Market Analysis Tools */}
      <section className="w-full py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-3">Market Analysis Tools</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional technical indicators calculated from real market data. Learn to read RSI, MACD, moving averages, and volume trends to make informed decisions.
            </p>
          </div>
          <IndicatorDashboard />
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Real-Time Data"
              description="Live price updates every 30 seconds from CoinGecko API"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Market Insights"
              description="Professional technical indicators for educational purposes"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Reliable"
              description="Bank-level security with encrypted data transmission"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Educational Tools"
              description="Learn technical analysis with real market data"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg bg-card border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4 text-blue-500">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}