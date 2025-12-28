import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const coinbaseLink = process.env.NEXT_PUBLIC_COINBASE_AFFILIATE_LINK;

  return (
    <footer className="w-full border-t bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="font-bold">Crypto Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            {coinbaseLink && (
              <a 
                href={coinbaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors text-blue-400"
              >
                Get Coinbase
              </a>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Crypto Dashboard. All rights reserved.</p>
          <p className="text-xs mt-2">Powered by Coinbase Commerce</p>
        </div>
      </div>
    </footer>
  );
}