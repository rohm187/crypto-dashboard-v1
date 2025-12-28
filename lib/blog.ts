import { readFileSync } from 'fs';
import { join } from 'path';

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

let cachedPosts: BlogPost[] | null = null;

export function getBlogPosts(): BlogPost[] {
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const filePath = join(process.cwd(), 'public', 'data', 'blog-posts.json');
    const fileContents = readFileSync(filePath, 'utf8');
    cachedPosts = JSON.parse(fileContents) as BlogPost[];
    return cachedPosts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getBlogPosts();
  return posts?.find?.((post) => post?.slug === slug);
}