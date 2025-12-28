import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  return (
    <div className="w-full min-h-[calc(100vh-16rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-500/10 p-6 border-2 border-green-500">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Thank you for subscribing to Premium Trading Signals
          </p>
        </div>

        <div className="p-6 rounded-lg bg-card border shadow-lg space-y-4">
          <p className="text-sm text-muted-foreground">
            Your subscription is now active. You'll receive a confirmation email shortly with your subscription details.
          </p>
          <p className="text-sm text-muted-foreground">
            Access to premium features will be available immediately.
          </p>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link href="/">
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}