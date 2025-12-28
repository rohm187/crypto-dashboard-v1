import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPosts } from '@/lib/blog';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts?.map?.((post) => ({
    slug: post?.slug ?? '',
  })) ?? [];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const posts = getBlogPosts();
  const post = posts?.find?.((p) => p?.slug === params?.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post?.title ?? 'Blog Post',
    description: post?.meta_description ?? post?.excerpt ?? '',
    keywords: post?.tags ?? [],
    openGraph: {
      title: post?.title ?? 'Blog Post',
      description: post?.meta_description ?? post?.excerpt ?? '',
      type: 'article',
      publishedTime: post?.date ?? undefined,
      authors: [post?.author ?? 'Unknown'],
      tags: post?.tags ?? [],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const posts = getBlogPosts();
  const post = posts?.find?.((p) => p?.slug === params?.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full py-12 px-4">
      <article className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-5xl font-bold mb-4">{post?.title ?? 'Untitled'}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{post?.author ?? 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={post?.date ?? ''}>
                {post?.date
                  ? new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Unknown date'}
              </time>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post?.tags?.map?.((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20"
              >
                <Tag className="w-3.5 h-3.5" />
                {tag}
              </span>
            )) ?? null}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-3xl font-bold mt-8 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                  {children}
                </ul>
              ),
              li: ({ children }) => <li className="ml-4">{children}</li>,
              strong: ({ children }) => (
                <strong className="font-bold text-foreground">{children}</strong>
              ),
            }}
          >
            {post?.content ?? ''}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}