'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getRewardfulReferral } from './rewardful-script';

export default function StripeCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Get Rewardful referral ID if available
      const referralId = getRewardfulReferral();

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralId }),
      });

      if (!response?.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start checkout. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      size="lg"
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Subscribe Now
        </>
      )}
    </Button>
  );
}