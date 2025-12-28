import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/lib/blog';

export const metadata = {
  title: 'Crypto Trading Blog | Insights & Analysis',
  description: 'Expert insights on crypto trading, technical analysis, risk management, and market trends. Learn from professional traders.',
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Trading Insights & Analysis</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert articles on crypto trading strategies, technical analysis, and market trends
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map?.((post) => (
            <BlogPostCard key={post?.slug} post={post} />
          )) ?? null}
        </div>
      </div>
    </div>
  );
}

function BlogPostCard({ post }: { post: any }) {
  return (
    <article className="group rounded-xl bg-card border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post?.tags?.slice?.(0, 2)?.map?.((tag: string) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          )) ?? null}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors line-clamp-2">
          {post?.title ?? 'Untitled'}
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground mb-4 flex-1 line-clamp-3">
          {post?.excerpt ?? ''}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{post?.author ?? 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {post?.date
                ? formatDistanceToNow(new Date(post.date), { addSuffix: true })
                : 'Unknown'}
            </span>
          </div>
        </div>

        {/* Read More Button */}
        <Button asChild variant="ghost" className="w-full group-hover:bg-blue-500/10">
          <Link href={`/blog/${post?.slug ?? ''}`}>
            Read Full Article
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </article>
  );
}