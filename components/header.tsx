'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          <span className="font-bold text-xl">Crypto Dashboard</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link
            href="/"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/' ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/pricing' ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname?.startsWith('/blog') ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}