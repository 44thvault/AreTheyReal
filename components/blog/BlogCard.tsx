import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPost;
}

const categoryColors: Record<string, string> = {
  romance: 'bg-rose-100 text-rose-800',
  identity: 'bg-blue-100 text-blue-800',
  financial: 'bg-amber-100 text-amber-800',
  ai: 'bg-purple-100 text-purple-800',
};

export default function BlogCard({ post }: BlogCardProps) {
  const { frontmatter, readingTime, slug } = post;
  const formattedDate = new Date(frontmatter.publishedDate).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <article className="blog-card">
      <Link href={`/blog/${slug}`} className="blog-card-link">
        <div className="blog-card-meta">
          <time dateTime={frontmatter.publishedDate}>{formattedDate}</time>
          <span className="blog-card-dot" aria-hidden="true">
            &middot;
          </span>
          <span>{readingTime}</span>
        </div>
        <h2 className="blog-card-title">{frontmatter.title}</h2>
        <p className="blog-card-excerpt">{frontmatter.excerpt}</p>
        <span className="blog-card-cta">
          Read full article &rarr;
        </span>
      </Link>
    </article>
  );
}
