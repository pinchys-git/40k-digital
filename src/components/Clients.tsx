import { useEffect, useRef } from 'react'

const tiers = [
  {
    label: '01 / Startups',
    title: 'Startups & Founders',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    description:
      'You need to move fast and prove the model. We deploy lean AI systems that let a 3-person team punch like a 30-person agency — growth infrastructure built for speed over polish.',
    highlights: [
      'AI content engine from day one',
      'Performance acquisition on lean budgets',
      'Rapid iteration cycles',
      'Founder-friendly reporting',
    ],
  },
  {
    label: '02 / Growth Stage',
    title: 'Growth Stage',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    description:
      'You have traction. Now you need scale without losing efficiency. Our AI systems amplify what\'s already working, cut the channels that aren\'t, and build the infrastructure for the next order of magnitude.',
    highlights: [
      'Multi-channel AI orchestration',
      'Attribution & LTV modelling',
      'Autonomous campaign management',
      'Team augmentation',
    ],
  },
  {
    label: '03 / Enterprise',
    title: 'Enterprise',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
    description:
      'Complex org. Multiple brands. Legacy infrastructure. We build custom AI systems that integrate with what you have, unlock the data you\'re sitting on, and create measurable EBITDA lift at scale.',
    highlights: [
      'Custom AI infrastructure & integration',
      'Cross-brand growth systems',
      'Executive-level strategy',
      'Enterprise SLA & compliance',
    ],
  },
]

function TierCard({ tier, index }: { tier: typeof tiers[0]; index: number }) {
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
        flex: '1 1 280px',
        cursor: 'default',
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
      {/* Corner glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(0,243,255,0.05) 0%, transparent 70%)',
          borderRadius: '0 20px 0 0',
          pointerEvents: 'none',
        }}
      />

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
        {tier.icon}
      </div>

      {/* Label */}
      <div className="section-label" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>
        {tier.label}
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
          lineHeight: 1.2,
        }}
      >
        {tier.title}
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
        {tier.description}
      </p>

      {/* Highlights */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {tier.highlights.map((point) => (
          <li
            key={point}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.85rem',
              color: '#71717a',
            }}
          >
            <span
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: '#00f3ff',
                flexShrink: 0,
                boxShadow: '0 0 6px rgba(0,243,255,0.6)',
              }}
            />
            {point}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Clients() {
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
      id="clients"
      className="tech-grid"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
        background: '#050505',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
            textAlign: 'center',
          }}
        >
          <div className="section-label" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            / Who We Work With
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.05,
            }}
          >
            AI-Powered Growth{' '}
            <span style={{ color: '#00f3ff' }}>For Every Stage</span>
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1rem',
              color: '#71717a',
              maxWidth: '520px',
              marginTop: '1.25rem',
              lineHeight: 1.7,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            From pre-revenue founders to Fortune 500 operators — we build the AI growth system
            your stage actually needs, not a one-size-fits-all retainer.
          </p>
        </div>

        {/* Tier cards */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {tiers.map((tier, i) => (
            <TierCard key={tier.title} tier={tier} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
