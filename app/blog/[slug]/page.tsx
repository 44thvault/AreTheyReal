import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getAllSlugs, getPostBySlug, getPostJsonLd } from '@/lib/blog';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://aretheyreal.com';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const { frontmatter } = post;

  return {
    title: frontmatter.metaTitle,
    description: frontmatter.metaDescription,
    keywords: frontmatter.keywords,
    authors: [{ name: frontmatter.author }],
    openGraph: {
      title: frontmatter.metaTitle,
      description: frontmatter.metaDescription,
      type: 'article',
      publishedTime: frontmatter.publishedDate,
      modifiedTime: frontmatter.updatedDate || frontmatter.publishedDate,
      authors: [frontmatter.author],
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.metaTitle,
      description: frontmatter.metaDescription,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  const { frontmatter, content, readingTime } = post;
  const jsonLd = getPostJsonLd(post, BASE_URL);
  const formattedDate = new Date(frontmatter.publishedDate).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="blog-nav-bar">
        <nav className="blog-nav">
          <Link href="/" className="blog-nav-logo">
            Are They <span>Real</span>?
          </Link>
          <div className="blog-nav-links">
            <Link href="/blog">All Articles</Link>
            <Link href="/" className="blog-nav-cta">
              Free Scam Risk Test
            </Link>
          </div>
        </nav>
      </header>

      <main className="blog-post-main">
        <article className="blog-post" itemScope itemType="https://schema.org/Article">
          <header className="blog-post-header">
            <div className="blog-post-meta">
              <time dateTime={frontmatter.publishedDate} itemProp="datePublished">
                {formattedDate}
              </time>
              <span className="blog-card-dot" aria-hidden="true">
                &middot;
              </span>
              <span>{readingTime}</span>
              <span className="blog-card-dot" aria-hidden="true">
                &middot;
              </span>
              <span itemProp="author">{frontmatter.author}</span>
            </div>
            <h1 itemProp="headline">{frontmatter.title}</h1>
            <p className="blog-post-excerpt" itemProp="description">
              {frontmatter.metaDescription}
            </p>
          </header>

          <div className="blog-post-body" itemProp="articleBody">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                },
              }}
            />
          </div>

          <footer className="blog-post-footer">
            <div className="blog-cta-box">
              <h2>Think You Might Be Dealing With a Scam?</h2>
              <p>
                Take our free, confidential Relationship Safety Quiz. 20
                questions, instant results, no sign-up. Your answers never leave
                your device.
              </p>
              <Link href="/" className="blog-cta-btn">
                Take the Free Scam Risk Test Now
              </Link>
            </div>
            <Link href="/blog" className="blog-back-link">
              &larr; Back to all articles
            </Link>
          </footer>
        </article>
      </main>

      <footer className="blog-footer">
        <p>
          <strong>Are They Real?</strong> is a free educational tool. It does not
          collect or store any of your information.
        </p>
      </footer>
    </>
  );
}
