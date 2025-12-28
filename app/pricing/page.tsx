'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

const pricingTiers = [
  {
    name: 'Basic',
    price: 29,
    description: 'Perfect for getting started with crypto tracking',
    features: [
      'Live BTC, ETH, SOL price tracking',
      'Real-time price updates every 30s',
      'Basic market analysis tools (RSI, MACD)',
      'Access to educational blog content',
      'Market trend indicators',
      'Email support',
    ],
    cta: 'Start Basic',
    popular: false,
  },
  {
    name: 'Pro',
    price: 49,
    description: 'Most popular for serious traders',
    features: [
      'Everything in Basic',
      'Advanced technical indicators dashboard',
      'Moving averages & volume analysis',
      'Priority email support',
      'Price alerts & notifications',
      'Mobile-optimized dashboard',
      'Historical price data access',
    ],
    cta: 'Start Pro',
    popular: true,
  },
  {
    name: 'Elite',
    price: 99,
    description: 'For professional traders who want it all',
    features: [
      'Everything in Pro',
      'Full market analysis suite',
      'Exclusive Discord community access',
      'Daily market analysis reports',
      'API access for automation',
      'Advanced charting tools',
      'Early access to new features',
      'Premium market research',
    ],
    cta: 'Start Elite',
    popular: false,
  },
];

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (tierName: string, price: number) => {
    setLoadingTier(tierName);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          tier: tierName.toLowerCase(),
          amount: price * 100 // Convert to cents
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
      setLoadingTier(null);
    }
  };

  const coinbaseLink = process.env.NEXT_PUBLIC_COINBASE_AFFILIATE_LINK;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Crypto Trading Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-gray-700 hover:bg-gray-800"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start tracking crypto prices and join our community. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative p-8 ${
                tier.popular
                  ? 'border-2 border-green-500 bg-gray-800/50'
                  : 'border border-gray-700 bg-gray-800/30'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tier.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-white">${tier.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(tier.name, tier.price)}
                disabled={loadingTier === tier.name}
                className={`w-full ${
                  tier.popular
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {loadingTier === tier.name ? 'Loading...' : tier.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* Coinbase Affiliate CTA */}
        {coinbaseLink && (
          <div className="mt-16 max-w-3xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  New to Crypto? Start Here!
                </h3>
                <p className="text-gray-300 mb-6">
                  Don't have a crypto wallet yet? Sign up for Coinbase to buy Bitcoin, Ethereum, and more.
                </p>
                <Button
                  size="lg"
                  onClick={() => window.open(coinbaseLink, '_blank')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Get Started on Coinbase
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  When you sign up and trade $100, you'll get a bonus (and so will we!)
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                Can I switch plans later?
              </h4>
              <p className="text-gray-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-gray-400">
                We accept all major credit cards via Stripe, and cryptocurrency payments (BTC, ETH, USDC, DAI) via Coinbase Commerce.
              </p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                What's your refund policy?
              </h4>
              <p className="text-gray-400">
                We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">
                What are Market Analysis Tools?
              </h4>
              <p className="text-gray-400">
                We provide professional-grade technical indicators (RSI, MACD, Moving Averages, Volume Analysis) calculated from real market data. These tools help you learn technical analysis and make informed decisions. <strong>Educational use only - not financial advice.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
