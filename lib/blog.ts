import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogFrontmatter {
  title: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  author: string;
  publishedDate: string;
  updatedDate?: string;
  ogImage?: string;
  keywords: string[];
  excerpt: string;
}

export interface BlogPost {
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: string;
  slug: string;
}

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(BLOG_DIR);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    frontmatter: data as BlogFrontmatter,
    content,
    readingTime: stats.text,
    slug,
  };
}

export function getAllPosts(): BlogPost[] {
  const slugs = getAllSlugs();
  const posts = slugs.map((slug) => getPostBySlug(slug));

  return posts.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedDate).getTime() -
      new Date(a.frontmatter.publishedDate).getTime()
  );
}

export function getPostJsonLd(post: BlogPost, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.frontmatter.title,
    description: post.frontmatter.metaDescription,
    author: {
      '@type': 'Organization',
      name: post.frontmatter.author,
    },
    datePublished: post.frontmatter.publishedDate,
    dateModified: post.frontmatter.updatedDate || post.frontmatter.publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Are They Real?',
    },
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${parseInt(post.readingTime)}M`,
  };
}
