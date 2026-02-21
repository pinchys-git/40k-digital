import { useEffect, useRef } from 'react'

interface Service {
  icon: React.ReactNode
  label: string
  title: string
  description: string
  points: string[]
}

const services: Service[] = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
    label: '01 / Growth',
    title: 'Growth Strategy',
    description: 'Performance marketing powered by AI. We combine deep media buying expertise with machine-learning attribution to find your most profitable growth channels.',
    points: [
      'Automated multi-channel acquisition',
      'Intelligent media buying & optimization',
      'AI-driven attribution modeling',
      'Subscriber & retention growth',
    ],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="7" height="7" rx="1"/>
        <rect x="15" y="3" width="7" height="7" rx="1"/>
        <rect x="2" y="14" width="7" height="7" rx="1"/>
        <path d="M18.5 14v3M21 16.5h-5M15 7h4M19 3v4"/>
      </svg>
    ),
    label: '02 / AI Systems',
    title: 'Autonomous AI Systems',
    description: 'Custom-built agents that research, create, verify, and publish content at scale. Multi-model orchestration that turns weeks of work into hours.',
    points: [
      'Autonomous content pipelines',
      'Multi-model AI orchestration',
      'Intelligent ad creative generation',
      'Real-time performance agents',
    ],
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    label: '03 / Engineering',
    title: 'Product Engineering',
    description: 'Full-stack products from concept to production — built on edge infrastructure and deployed in days, not months. Strategy and execution in one team.',
    points: [
      'Concept to production in days',
      'Edge-first infrastructure',
      'AI-native application architecture',
      'Rapid iteration & deployment',
    ],
  },
]

function ServiceCard({ service, index }: { service: Service; index: number }) {
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
      { threshold: 0.15 }
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
        cursor: 'default',
        flex: '1 1 300px',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = 'rgba(0, 243, 255, 0.25)'
        el.style.background = 'rgba(255, 255, 255, 0.045)'
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
      {/* Subtle gradient corner glow */}
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
        {service.icon}
      </div>

      {/* Label */}
      <div className="section-label" style={{ marginBottom: '0.75rem', fontSize: '0.65rem' }}>
        {service.label}
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
        {service.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '0.95rem',
          color: '#a1a1aa',
          lineHeight: 1.7,
          marginBottom: '1.75rem',
        }}
      >
        {service.description}
      </p>

      {/* Points */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {service.points.map((point) => (
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

export function WhatWeDo() {
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
      id="services"
      className="tech-grid"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
        background: '#050505',
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
          }}
        >
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            / What We Build
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.05,
              maxWidth: '600px',
            }}
          >
            Three Disciplines.{' '}
            <span style={{ color: '#a1a1aa' }}>One Integrated Machine.</span>
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1rem',
              color: '#71717a',
              maxWidth: '480px',
              marginTop: '1.25rem',
              lineHeight: 1.7,
            }}
          >
            Most agencies pick one. We built the infrastructure to run all three simultaneously,
            with AI coordinating across every layer.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
