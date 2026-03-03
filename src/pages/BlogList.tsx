import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useJsonLd } from '../hooks/useJsonLd'

interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  hero_image: string | null
  published_at: string
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  'AI Strategy': 'linear-gradient(135deg, rgba(0,243,255,0.15) 0%, rgba(0,100,150,0.3) 100%)',
  'Growth Strategy': 'linear-gradient(135deg, rgba(100,0,255,0.15) 0%, rgba(50,0,180,0.3) 100%)',
  'Autonomous Agents': 'linear-gradient(135deg, rgba(0,255,150,0.12) 0%, rgba(0,120,80,0.25) 100%)',
  default: 'linear-gradient(135deg, rgba(50,50,50,0.4) 0%, rgba(20,20,20,0.6) 100%)',
}

function estimateReadTime(post: Post): string {
  // Rough estimate from excerpt length — guard against null excerpt
  const words = (post.excerpt ?? '').split(' ').length
  return `${Math.max(3, Math.round(words / 30 * 5))} min read`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const gradient = CATEGORY_GRADIENTS[post.category] ?? CATEGORY_GRADIENTS.default

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }, index * 100)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        ref={cardRef}
        style={{
          opacity: 0,
          transform: 'translateY(40px)',
          transition: 'opacity 0.7s cubic-bezier(0.34,1.56,0.64,1), transform 0.7s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(0,243,255,0.3)'
          el.style.background = 'rgba(0,243,255,0.025)'
          el.style.boxShadow = '0 0 40px rgba(0,243,255,0.07), 0 20px 60px rgba(0,0,0,0.35)'
          el.style.transform = 'translateY(-6px)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.08)'
          el.style.background = 'rgba(255,255,255,0.03)'
          el.style.boxShadow = 'none'
          el.style.transform = 'translateY(0)'
        }}
      >
        {/* Hero Image / Gradient */}
        <div
          style={{
            height: '180px',
            background: post.hero_image ? `url(${post.hero_image}) center/cover` : gradient,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {/* Category badge */}
          <span
            style={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              padding: '0.3rem 0.75rem',
              background: 'rgba(0,243,255,0.1)',
              border: '1px solid rgba(0,243,255,0.25)',
              borderRadius: '100px',
              color: '#00f3ff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(8px)',
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Card body */}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Date + read time */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: '#3f3f46',
                letterSpacing: '0.06em',
              }}
            >
              {formatDate(post.published_at)}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.65rem',
                color: '#3f3f46',
                letterSpacing: '0.06em',
              }}
            >
              {estimateReadTime(post)}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              marginBottom: '0.85rem',
            }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.875rem',
              color: '#71717a',
              lineHeight: 1.7,
              flex: 1,
              marginBottom: '1.5rem',
            }}
          >
            {post.excerpt}
          </p>

          {/* Read more link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#00f3ff',
              letterSpacing: '0.03em',
            }}
          >
            Read More
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

const PAGE_SIZE = 12

export function BlogList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`https://40k-digital-api.roccobot.workers.dev/api/posts?limit=${PAGE_SIZE}&offset=0`)
      .then((r) => r.json())
      .then((data) => {
        const fetched = data.posts ?? []
        setPosts(fetched)
        setHasMore(fetched.length === PAGE_SIZE)
        setOffset(fetched.length)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load posts.')
        setLoading(false)
      })
  }, [])

  const blogSchema = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      '@id': 'https://40kdigital.com/blog/#blog',
      'name': 'AI Insights & Perspectives — 40K Digital',
      'description': 'Thinking on AI, growth strategy, and the systems shaping modern marketing from the people building them.',
      'url': 'https://40kdigital.com/blog',
      'publisher': { '@id': 'https://40kdigital.com/#organization' },
      'inLanguage': 'en-US',
      'blogPost': posts.slice(0, 10).map((p) => ({
        '@type': 'BlogPosting',
        'headline': p.title,
        'description': p.excerpt,
        'url': `https://40kdigital.com/blog/${p.slug}`,
        'datePublished': p.published_at,
        'image': p.hero_image ?? undefined,
        'author': { '@type': 'Organization', 'name': '40K Digital' },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://40kdigital.com' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://40kdigital.com/blog' },
      ],
    },
  ], [posts])

  useJsonLd(blogSchema)

  function loadMore() {
    setLoadingMore(true)
    fetch(`https://40k-digital-api.roccobot.workers.dev/api/posts?limit=${PAGE_SIZE}&offset=${offset}`)
      .then((r) => r.json())
      .then((data) => {
        const fetched = data.posts ?? []
        setPosts((prev) => [...prev, ...fetched])
        setHasMore(fetched.length === PAGE_SIZE)
        setOffset((prev) => prev + fetched.length)
        setLoadingMore(false)
      })
      .catch(() => setLoadingMore(false))
  }

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
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Derive categories from posts
  const categories = ['All', ...Array.from(new Set(posts.map((p) => p.category)))]

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(0,243,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Tech grid */}
      <div
        aria-hidden="true"
        className="tech-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(1rem, 5vw, 4rem)', position: 'relative', zIndex: 1 }}>

        {/* Back nav */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#3f3f46',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '3rem',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#00f3ff')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#3f3f46')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Header */}
        <div
          ref={headerRef}
          style={{
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <div className="section-label" style={{ marginBottom: '1rem' }}>/ From The Lab</div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.0,
              marginBottom: '1.5rem',
            }}
          >
            AI Insights &{' '}
            <span style={{ color: '#a1a1aa' }}>Perspectives</span>
          </h1>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1.1rem',
              color: '#71717a',
              maxWidth: '540px',
              lineHeight: 1.7,
            }}
          >
            Thinking on AI, growth strategy, and the systems shaping modern marketing  - 
            from the people building them.
          </p>
        </div>

        {/* Category filter pills */}
        {!loading && categories.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '0.65rem',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  padding: '0.45rem 1rem',
                  background: activeCategory === cat ? 'rgba(0,243,255,0.15)' : 'rgba(255,255,255,0.04)',
                  border: activeCategory === cat ? '1px solid rgba(0,243,255,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '100px',
                  color: activeCategory === cat ? '#00f3ff' : '#71717a',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(0,243,255,0.2)'
                    el.style.color = '#a1a1aa'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(255,255,255,0.1)'
                    el.style.color = '#71717a'
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
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
              LOADING POSTS...
            </span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#71717a',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {error}
          </div>
        )}

        {/* Posts grid */}
        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filtered.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem',
              color: '#71717a',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            No posts found in this category.
          </div>
        )}

        {/* Load More */}
        {!loading && !error && hasMore && activeCategory === 'All' && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <button
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                padding: '0.85rem 2rem',
                background: 'rgba(0,243,255,0.06)',
                border: '1px solid rgba(0,243,255,0.2)',
                borderRadius: '8px',
                color: loadingMore ? '#3f3f46' : '#00f3ff',
                cursor: loadingMore ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loadingMore) {
                  const el = e.currentTarget
                  el.style.background = 'rgba(0,243,255,0.12)'
                  el.style.borderColor = 'rgba(0,243,255,0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loadingMore) {
                  const el = e.currentTarget
                  el.style.background = 'rgba(0,243,255,0.06)'
                  el.style.borderColor = 'rgba(0,243,255,0.2)'
                }
              }}
            >
              {loadingMore ? (
                <>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      border: '1.5px solid rgba(0,243,255,0.2)',
                      borderTopColor: '#00f3ff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Loading...
                </>
              ) : (
                <>
                  Load More Posts
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes spin { to { transform: none; } }
        }
      `}</style>
    </div>
  )
}
