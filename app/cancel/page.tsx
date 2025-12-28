import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CancelPage() {
  return (
    <div className="w-full min-h-[calc(100vh-16rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6 border-2 border-border">
            <XCircle className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Payment Cancelled</h1>
          <p className="text-lg text-muted-foreground">
            Your payment was cancelled. No charges were made.
          </p>
        </div>

        <div className="p-6 rounded-lg bg-card border shadow-lg space-y-4">
          <p className="text-sm text-muted-foreground">
            If you experienced any issues during checkout, please try again or contact our support team.
          </p>
        </div>

        <Button asChild size="lg" className="w-full">
          <Link href="/">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}