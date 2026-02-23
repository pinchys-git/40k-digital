import { useEffect, useRef, useState } from 'react'

const API = 'https://40k-digital-api.roccobot.workers.dev'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  category: string | null
  hero_image: string | null
  published_at: string | null
  author: string | null
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function estimateReadTime(excerpt: string | null) {
  if (!excerpt) return '5 min read'
  const words = excerpt.split(/\s+/).length
  return `${Math.max(3, Math.round(words / 200 * 5))} min read`
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }, index * 120)
          observer.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <a
      href={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', flex: '1 1 280px', display: 'flex' }}
    >
      <div
        ref={cardRef}
        style={{
          opacity: 0,
          transform: 'translateY(40px)',
          transition: 'opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.25s, background 0.25s, box-shadow 0.25s',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(0, 243, 255, 0.25)'
          el.style.background = 'rgba(0, 243, 255, 0.025)'
          el.style.boxShadow = '0 0 40px rgba(0, 243, 255, 0.06), 0 20px 60px rgba(0,0,0,0.3)'
          el.style.transform = 'translateY(-4px)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255, 255, 255, 0.08)'
          el.style.background = 'rgba(255, 255, 255, 0.03)'
          el.style.boxShadow = 'none'
          el.style.transform = 'translateY(0)'
        }}
      >
        {/* Hero image */}
        {post.hero_image && (
          <div
            style={{
              width: '100%',
              height: '180px',
              background: `url(${post.hero_image}) center/cover no-repeat`,
              flexShrink: 0,
            }}
          />
        )}

        {/* Content */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Category + date */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            {post.category && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.62rem',
                padding: '0.3rem 0.75rem',
                background: 'rgba(0, 243, 255, 0.08)',
                border: '1px solid rgba(0, 243, 255, 0.2)',
                borderRadius: '100px',
                color: '#00f3ff',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                {post.category}
              </span>
            )}
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem',
              color: '#52525b',
              letterSpacing: '0.06em',
              marginLeft: 'auto',
            }}>
              {formatDate(post.published_at)}
            </span>
          </div>

          {/* Title */}
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '0.85rem',
            lineHeight: 1.3,
          }}>
            {post.title}
          </h3>

          {/* Excerpt */}
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.875rem',
            color: '#71717a',
            lineHeight: 1.7,
            flex: 1,
            marginBottom: '1.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}>
            {post.excerpt || ''}
          </p>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.62rem',
              color: '#52525b',
              letterSpacing: '0.06em',
            }}>
              {estimateReadTime(post.excerpt)}
            </span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#00f3ff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}>
              Read More
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      flex: '1 1 280px',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '20px',
      overflow: 'hidden',
    }}>
      <div style={{ height: '180px', background: 'rgba(255,255,255,0.04)' }} />
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ height: '12px', width: '30%', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
        <div style={{ height: '20px', width: '90%', background: 'rgba(255,255,255,0.06)', borderRadius: '6px' }} />
        <div style={{ height: '14px', width: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }} />
        <div style={{ height: '14px', width: '80%', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }} />
      </div>
    </div>
  )
}

export function BlogTeaser() {
  const headerRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/posts?limit=3`)
      .then((r) => r.json())
      .then((data) => {
        setPosts((data.posts || []).slice(0, 3))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="blog" style={{
      padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
      background: '#000000',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '700px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(0,243,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{
          opacity: 0, transform: 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1.5rem',
          marginBottom: 'clamp(3rem, 6vw, 5rem)',
        }}>
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>/ From The Lab</div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800, letterSpacing: '-0.03em',
              color: '#ffffff', lineHeight: 1.05, maxWidth: '580px',
            }}>
              AI Insights &{' '}
              <span style={{ color: '#a1a1aa' }}>Perspectives</span>
            </h2>
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1rem', color: '#71717a',
              maxWidth: '460px', marginTop: '1.25rem', lineHeight: 1.7,
            }}>
              Thinking on AI, growth strategy, and the systems shaping modern marketing
              from the people building them.
            </p>
          </div>
          <a href="/blog" className="btn-secondary" style={{ textDecoration: 'none', flexShrink: 0, alignSelf: 'flex-start' }}>
            View All Posts →
          </a>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {loading
            ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
            : posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)
          }
        </div>
      </div>
    </section>
  )
}
