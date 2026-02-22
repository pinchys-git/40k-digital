import { useEffect, useRef } from 'react'

const agents = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    name: 'Content Agent',
    role: 'Always Writing',
    description:
      'Researches, drafts, and publishes brand-consistent content 24/7. Blog posts, social copy, ad creative, email sequences — at 100× the speed of a human team.',
    tags: ['Blog', 'Social', 'Email', 'Ad Copy'],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        <path d="M11 8v6M8 11h6"/>
      </svg>
    ),
    name: 'Research Agent',
    role: 'Always Watching',
    description:
      'Monitors competitors, tracks industry trends, and synthesises market intelligence into actionable briefs. Never misses a signal — never sleeps.',
    tags: ['Market Intel', 'Competitors', 'Trends', 'Signals'],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    name: 'Analytics Agent',
    role: 'Always Measuring',
    description:
      'Pulls data from every channel, identifies anomalies, and surfaces growth opportunities before you even think to look. Reports itself.',
    tags: ['Attribution', 'Dashboards', 'Anomaly Alerts'],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        <path d="M7 8l3 3 3-3 4 4"/>
      </svg>
    ),
    name: 'Campaign Agent',
    role: 'Always Optimizing',
    description:
      'Manages paid campaigns in real-time — adjusting bids, rotating creatives, reallocating budgets. Your ROAS improves while you sleep.',
    tags: ['Paid Ads', 'Bid Management', 'Creative Rotation'],
  },
]

function AgentCard({ agent, index }: { agent: typeof agents[0]; index: number }) {
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
        padding: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        flex: '1 1 260px',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(0, 243, 255, 0.3)'
        el.style.background = 'rgba(0, 243, 255, 0.03)'
        el.style.boxShadow = '0 0 40px rgba(0, 243, 255, 0.07), 0 20px 60px rgba(0,0,0,0.3)'
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
      {/* Corner glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(0,243,255,0.06) 0%, transparent 70%)',
          borderRadius: '0 20px 0 0',
          pointerEvents: 'none',
        }}
      />

      {/* Status badge */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.25rem 0.6rem',
          background: 'rgba(0, 243, 255, 0.07)',
          border: '1px solid rgba(0, 243, 255, 0.2)',
          borderRadius: '100px',
        }}
      >
        <span
          style={{
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: '#00f3ff',
            boxShadow: '0 0 6px rgba(0,243,255,0.8)',
            animation: 'pulse-accent 2s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            color: '#00f3ff',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {agent.role}
        </span>
      </div>

      {/* Icon */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: 'rgba(0, 243, 255, 0.08)',
          border: '1px solid rgba(0, 243, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#00f3ff',
          marginBottom: '1.75rem',
        }}
      >
        {agent.icon}
      </div>

      {/* Name */}
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
          lineHeight: 1.2,
        }}
      >
        {agent.name}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '0.9rem',
          color: '#a1a1aa',
          lineHeight: 1.7,
          marginBottom: '1.75rem',
        }}
      >
        {agent.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {agent.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              padding: '0.3rem 0.65rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '100px',
              color: '#71717a',
              letterSpacing: '0.03em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export function AIEmployees() {
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
      id="ai-employees"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background radial accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(0,243,255,0.04) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            / AI Workforce
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.05,
              maxWidth: '700px',
            }}
          >
            AI Digital Employees{' '}
            <span style={{ color: '#00f3ff' }}>That Never Sleep</span>
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1rem',
              color: '#71717a',
              maxWidth: '520px',
              marginTop: '1.25rem',
              lineHeight: 1.7,
            }}
          >
            Every 40K engagement deploys a squad of specialized AI agents — each one purpose-built,
            always on, and working in concert. Your competitors are still hiring.
          </p>
        </div>

        {/* Agent cards */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {agents.map((agent, i) => (
            <AgentCard key={agent.name} agent={agent} index={i} />
          ))}
        </div>

        {/* Bottom callout */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.75rem 2.5rem',
            background: 'rgba(0, 243, 255, 0.03)',
            border: '1px solid rgba(0, 243, 255, 0.12)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '0.35rem',
              }}
            >
              Custom agents built for your brand
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.85rem',
                color: '#71717a',
              }}
            >
              Every agent is trained on your voice, data, and goals — not a generic template.
            </p>
          </div>
          <a
            href="#contact"
            className="btn-primary"
            style={{ textDecoration: 'none', flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Deploy Your AI Team
          </a>
        </div>
      </div>
    </section>
  )
}
