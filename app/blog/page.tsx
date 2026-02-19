import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog';
import BlogCard from '@/components/blog/BlogCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Romance Scam Prevention Blog | Are They Real?',
  description:
    'Expert guides on identifying romance scams, military scams, crypto fraud, AI deepfake impersonation, and online dating red flags. Protect yourself with real case studies and actionable advice.',
  openGraph: {
    title: 'Romance Scam Prevention Blog | Are They Real?',
    description:
      'Expert guides on identifying romance scams, military scams, crypto fraud, and AI impersonation. Real cases, real advice.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Romance Scam Prevention Blog | Are They Real?',
    description:
      'Expert guides on identifying romance scams with real case studies and actionable checklists.',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <header className="blog-hero">
        <nav className="blog-nav">
          <Link href="/" className="blog-nav-logo">
            Are They <span>Real</span>?
          </Link>
          <Link href="/" className="blog-nav-cta">
            Free Scam Risk Test
          </Link>
        </nav>
        <div className="blog-hero-content">
          <h1>Romance Scam Prevention Guide</h1>
          <p>
            Expert articles on identifying online romance scams, protecting your
            finances, and verifying who you are really talking to. Written by
            fraud prevention researchers with real case studies and cited sources.
          </p>
        </div>
      </header>

      <main className="blog-index">
        <section className="blog-grid">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </section>

        <aside className="blog-cta-box">
          <h2>Worried About Someone You Met Online?</h2>
          <p>
            Take our free, private Relationship Safety Quiz. Answer 20 questions
            and get an instant risk assessment. No sign-up required.
          </p>
          <Link href="/" className="blog-cta-btn">
            Take the Free Scam Risk Test
          </Link>
        </aside>
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
