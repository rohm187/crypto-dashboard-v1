export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  meta_description: string;
  tags: string[];
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}