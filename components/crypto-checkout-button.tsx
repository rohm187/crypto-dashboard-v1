'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Bitcoin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CryptoCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const coinbaseLink = process.env.NEXT_PUBLIC_COINBASE_AFFILIATE_LINK;

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/coinbase/create-charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response?.ok) {
        throw new Error('Failed to create crypto payment');
      }

      const data = await response.json();

      // Redirect to Coinbase Commerce
      if (data?.hosted_url) {
        window.location.href = data.hosted_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Crypto checkout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start crypto payment. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleCheckout}
        disabled={loading}
        size="lg"
        variant="outline"
        className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-semibold px-8"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Bitcoin className="mr-2 h-5 w-5" />
            Pay with Crypto
          </>
        )}
      </Button>
      {coinbaseLink && (
        <a
          href={coinbaseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Don't have crypto? Get started on Coinbase →
        </a>
      )}
    </div>
  );
}
