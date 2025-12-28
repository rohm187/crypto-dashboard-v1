'use client';

import Script from 'next/script';

export default function RewardfulScript() {
  const REWARDFUL_API_KEY = process.env.NEXT_PUBLIC_REWARDFUL_API_KEY;

  if (!REWARDFUL_API_KEY || REWARDFUL_API_KEY === 'rf_placeholder_key') {
    return null;
  }

  return (
    <Script
      id="rewardful-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');
        `,
      }}
    />
  );
}

export function getRewardfulReferral(): string | null {
  if (typeof window !== 'undefined' && (window as any).Rewardful) {
    return (window as any).Rewardful.referral || null;
  }
  return null;
}
