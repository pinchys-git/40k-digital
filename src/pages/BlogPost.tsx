import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { marked } from 'marked'

interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  hero_image: string | null
  published_at: string
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  'AI Strategy': 'linear-gradient(135deg, rgba(0,243,255,0.12) 0%, rgba(0,80,120,0.25) 60%, rgba(5,5,5,0) 100%)',
  'Growth Strategy': 'linear-gradient(135deg, rgba(100,0,255,0.12) 0%, rgba(40,0,150,0.2) 60%, rgba(5,5,5,0) 100%)',
  'Autonomous Agents': 'linear-gradient(135deg, rgba(0,255,150,0.1) 0%, rgba(0,100,60,0.2) 60%, rgba(5,5,5,0) 100%)',
  default: 'linear-gradient(135deg, rgba(50,50,50,0.2) 0%, rgba(5,5,5,0) 100%)',
}

function estimateReadTime(content: string): string {
  const wordCount = content.split(/\s+/).length
  const minutes = Math.max(3, Math.round(wordCount / 200))
  return `${minutes} min read`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function RelatedCard({ post }: { post: Post }) {
  return (
    <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
          transition: 'border-color 0.3s ease, background 0.3s ease, transform 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(0,243,255,0.25)'
          el.style.background = 'rgba(0,243,255,0.02)'
          el.style.transform = 'translateY(-3px)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.08)'
          el.style.background = 'rgba(255,255,255,0.03)'
          el.style.transform = 'translateY(0)'
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            padding: '0.25rem 0.65rem',
            background: 'rgba(0,243,255,0.08)',
            border: '1px solid rgba(0,243,255,0.2)',
            borderRadius: '100px',
            color: '#00f3ff',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.85rem',
          }}
        >
          {post.category}
        </span>
        <h4
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.35,
            marginBottom: '0.5rem',
          }}
        >
          {post.title}
        </h4>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.8rem',
            color: '#52525b',
            lineHeight: 1.6,
          }}
        >
          {post.excerpt.slice(0, 100)}…
        </p>
      </div>
    </Link>
  )
}

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [related, setRelated] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setPost(null)

    fetch(`https://40k-digital-api.roccobot.workers.dev/api/posts/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then((data) => {
        if (!data) return
        setPost(data)
        setLoading(false)
        // Fetch related posts
        fetch('https://40k-digital-api.roccobot.workers.dev/api/posts')
          .then((r) => r.json())
          .then((all) => {
            const others = (all.posts ?? []).filter((p: Post) => p.slug !== slug).slice(0, 3)
            setRelated(others)
          })
          .catch(() => {})
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [slug])

  // Animate hero in
  useEffect(() => {
    if (!post) return
    const el = heroRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [post])

  // Render markdown HTML into the content div (strip leading h1 — title is in hero)
  useEffect(() => {
    if (!post || !contentRef.current) return
    const html = (marked.parse(post.content) as string).replace(/^<h1[^>]*>.*?<\/h1>\s*/i, '')
    contentRef.current.innerHTML = html
  }, [post])

  const gradient = post
    ? (CATEGORY_GRADIENTS[post.category] ?? CATEGORY_GRADIENTS.default)
    : CATEGORY_GRADIENTS.default

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '2px solid rgba(0,243,255,0.2)',
            borderTopColor: '#00f3ff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#3f3f46',
            letterSpacing: '0.1em',
          }}
        >
          LOADING...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (notFound) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1.5rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '6rem',
            fontWeight: 800,
            color: 'rgba(0,243,255,0.15)',
            lineHeight: 1,
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          Post Not Found
        </h1>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#71717a', maxWidth: '400px' }}>
          This article doesn't exist or may have been removed.
        </p>
        <Link to="/blog" className="btn-primary" style={{ textDecoration: 'none', marginTop: '1rem' }}>
          ← Back to Blog
        </Link>
      </div>
    )
  }

  if (!post) return null

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      {/* Hero Header */}
      <div
        style={{
          background: post.hero_image
            ? `url(${post.hero_image}) center/cover`
            : `#050505`,
          position: 'relative',
          paddingTop: '8rem',
          paddingBottom: '5rem',
          overflow: 'hidden',
        }}
      >
        {/* Gradient overlay for non-image hero */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: gradient,
            pointerEvents: 'none',
          }}
        />
        {/* Tech grid */}
        <div
          aria-hidden="true"
          className="tech-grid"
          style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }}
        />
        {/* Bottom fade */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to bottom, transparent, #050505)',
            pointerEvents: 'none',
          }}
        />

        <div
          ref={heroRef}
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '0 clamp(1rem, 5vw, 3rem)',
            position: 'relative',
            zIndex: 1,
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* Back link */}
          <Link
            to="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: '#3f3f46',
              textDecoration: 'none',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '2rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#00f3ff')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#3f3f46')}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Posts
          </Link>

          {/* Category */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                padding: '0.3rem 0.75rem',
                background: 'rgba(0,243,255,0.1)',
                border: '1px solid rgba(0,243,255,0.25)',
                borderRadius: '100px',
                color: '#00f3ff',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            {post.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: '#52525b',
                letterSpacing: '0.06em',
              }}
            >
              {formatDate(post.published_at)}
            </span>
            <span style={{ color: '#3f3f46', fontSize: '0.65rem' }}>•</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: '#52525b',
                letterSpacing: '0.06em',
              }}
            >
              {estimateReadTime(post.content)}
            </span>
            <span style={{ color: '#3f3f46', fontSize: '0.65rem' }}>•</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.7rem',
                color: '#52525b',
                letterSpacing: '0.06em',
              }}
            >
              {post.author}
            </span>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '4rem clamp(1rem, 5vw, 3rem)',
        }}
      >
        <div
          ref={contentRef}
          className="blog-content"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(1rem, 1.5vw, 1.1rem)',
            color: '#a1a1aa',
            lineHeight: 1.85,
            maxWidth: '720px',
          }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.65rem',
                  padding: '0.3rem 0.75rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '100px',
                  color: '#52525b',
                  letterSpacing: '0.06em',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: '4rem',
            padding: '2.5rem',
            background: 'rgba(0,243,255,0.04)',
            border: '1px solid rgba(0,243,255,0.15)',
            borderRadius: '20px',
            textAlign: 'center',
          }}
        >
          <div className="section-label" style={{ marginBottom: '0.75rem' }}>/ Work With Us</div>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
            }}
          >
            Ready to Build Your AI Growth Stack?
          </h3>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.95rem',
              color: '#71717a',
              marginBottom: '1.75rem',
              lineHeight: 1.6,
            }}
          >
            Let's talk about how AI can transform your marketing operations.
          </p>
          <a href="/#contact" className="btn-primary" style={{ textDecoration: 'none' }}>
            Let's Talk →
          </a>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: '5rem' }}>
            <div className="section-label" style={{ marginBottom: '1.5rem' }}>/ More From The Lab</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
              }}
            >
              {related.map((r) => (
                <RelatedCard key={r.id} post={r} />
              ))}
            </div>
          </div>
        )}

        {/* Back link bottom */}
        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link
            to="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#71717a',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#00f3ff')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#71717a')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </div>

      {/* Markdown prose styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        [ref="contentRef"] h1,
        div[style*="maxWidth: '720px'"] h1,
        div[style*="max-width: 720px"] h1 { display: none; }

        .blog-content h1 { display: none; }
        .blog-content h2 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.3rem, 2.5vw, 1.7rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .blog-content h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.1rem, 2vw, 1.3rem);
          font-weight: 600;
          color: #e4e4e7;
          letter-spacing: -0.01em;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p { margin-bottom: 1.5rem; }
        .blog-content strong { color: #e4e4e7; font-weight: 600; }
        .blog-content em { color: #a1a1aa; font-style: italic; }
        .blog-content ul, .blog-content ol {
          margin: 1.25rem 0 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .blog-content li::marker { color: #00f3ff; }
        .blog-content code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85em;
          background: rgba(0,243,255,0.07);
          border: 1px solid rgba(0,243,255,0.15);
          padding: 0.15em 0.5em;
          border-radius: 4px;
          color: #00f3ff;
        }
        .blog-content pre {
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        .blog-content pre code {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.875rem;
          color: #a1a1aa;
        }
        .blog-content blockquote {
          border-left: 3px solid rgba(0,243,255,0.4);
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          color: #71717a;
          font-style: italic;
        }
        .blog-content a { color: #00f3ff; text-decoration: underline; text-underline-offset: 3px; }
        .blog-content hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 2.5rem 0;
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes spin { to { transform: none; } }
        }
      `}</style>

    </div>
  )
}
