import { useEffect, useRef } from 'react'

const posts = [
  {
    category: 'AI Strategy',
    date: 'Feb 2025',
    title: 'Why Every Growth Team Needs an AI Agent Layer in 2025',
    excerpt:
      'The brands winning right now aren\'t using AI as a tool — they\'re running it as infrastructure. Here\'s what a real autonomous growth stack looks like and why it compounds.',
    readTime: '6 min read',
  },
  {
    category: 'Autonomous Agents',
    date: 'Jan 2025',
    title: 'Multi-Agent Orchestration: The Architecture Behind 10× Content Output',
    excerpt:
      'We broke down how our content pipeline uses specialized agents in sequence — researcher, writer, editor, publisher — to produce at scale without sacrificing brand quality.',
    readTime: '8 min read',
  },
  {
    category: 'Growth Strategy',
    date: 'Jan 2025',
    title: 'From $0 to Exit: The Growth Playbook Nobody Talks About',
    excerpt:
      'After scaling multiple brands to acquisition, the pattern is clear. It\'s not about the channel — it\'s about building compounding systems early and letting AI accelerate the flywheel.',
    readTime: '5 min read',
  },
]

function PostCard({ post, index }: { post: typeof posts[0]; index: number }) {
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
    <div
      ref={cardRef}
      style={{
        opacity: 0,
        transform: 'translateY(40px)',
        transition: 'opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2.25rem',
        position: 'relative',
        overflow: 'hidden',
        flex: '1 1 280px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
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
      {/* Category + date row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            padding: '0.3rem 0.75rem',
            background: 'rgba(0, 243, 255, 0.08)',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            borderRadius: '100px',
            color: '#00f3ff',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {post.category}
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: '#3f3f46',
            letterSpacing: '0.06em',
          }}
        >
          {post.date}
        </span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '0.9rem',
          lineHeight: 1.3,
        }}
      >
        {post.title}
      </h3>

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

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.65rem',
            color: '#3f3f46',
            letterSpacing: '0.06em',
          }}
        >
          {post.readTime}
        </span>
        <a
          href="/blog"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#00f3ff',
            textDecoration: 'none',
            letterSpacing: '0.03em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'gap 0.2s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.gap = '0.6rem' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.gap = '0.35rem' }}
        >
          Read More
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

export function BlogTeaser() {
  const headerRef = useRef<HTMLDivElement>(null)

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
    <section
      id="blog"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,243,255,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header row */}
        <div
          ref={headerRef}
          style={{
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>
              / From The Lab
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.05,
                maxWidth: '580px',
              }}
            >
              AI Insights &{' '}
              <span style={{ color: '#a1a1aa' }}>Perspectives</span>
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1rem',
                color: '#71717a',
                maxWidth: '460px',
                marginTop: '1.25rem',
                lineHeight: 1.7,
              }}
            >
              Thinking on AI, growth strategy, and the systems shaping modern marketing —
              from the people building them.
            </p>
          </div>

          <a
            href="/blog"
            className="btn-secondary"
            style={{ textDecoration: 'none', flexShrink: 0, alignSelf: 'flex-start' }}
          >
            View All Posts →
          </a>
        </div>

        {/* Post cards */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {posts.map((post, i) => (
            <PostCard key={post.title} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
