import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp'
import { useReducedMotion } from '../hooks/useReducedMotion'

interface Stat {
  prefix?: string
  value: number
  suffix: string
  label: string
  description: string
}

const stats: Stat[] = [
  {
    value: 30,
    suffix: '+',
    label: 'Brands Scaled',
    description: 'From startups to Fortune 500 — growth systems built across every vertical',
  },
  {
    value: 20,
    suffix: '+',
    label: 'Years In The Arena',
    description: 'Two decades of performance marketing, now amplified by autonomous AI',
  },
  {
    value: 10,
    suffix: 'X',
    label: 'Revenue Multiplier',
    description: 'Average account revenue growth delivered through data-driven strategy',
  },
  {
    value: 3,
    suffix: '',
    label: 'AI Products Shipped',
    description: 'Custom-built autonomous systems running in production today',
  },
]

function StatItem({ stat, index, shouldAnimate }: { stat: Stat; index: number; shouldAnimate: boolean }) {
  const reduced = useReducedMotion()
  const count = useCountUp(stat.value, 2200, shouldAnimate && !reduced)
  const itemRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={itemRef}
      style={{
        flex: '1 1 200px',
        padding: '2.5rem',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '16px',
        transition: 'all 0.4s ease',
        opacity: 0,
        transform: 'translateY(20px)',
        animation: `fade-up 0.7s ${index * 0.1 + 0.2}s ease-out forwards`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 243, 255, 0.2)'
        e.currentTarget.style.background = 'rgba(0, 243, 255, 0.03)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
      }}
    >
      {/* The number */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 700,
          color: '#00f3ff',
          textShadow: '0 0 30px rgba(0,243,255,0.4)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
          marginBottom: '0.75rem',
        }}
      >
        {stat.prefix}{shouldAnimate && !reduced ? count : stat.value}{stat.suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '1rem',
          fontWeight: 600,
          color: '#ffffff',
          marginBottom: '0.5rem',
        }}
      >
        {stat.label}
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '0.8rem',
          color: '#71717a',
          lineHeight: 1.6,
        }}
      >
        {stat.description}
      </p>
    </div>
  )
}

export function Numbers() {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const header = headerRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldAnimate(true)
          if (header) {
            header.style.opacity = '1'
            header.style.transform = 'translateY(0)'
          }
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="numbers"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background accent radial */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,243,255,0.04) 0%, transparent 70%)',
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
            textAlign: 'center',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <div className="section-label" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            / By The Numbers
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
            Scale That Speaks{' '}
            <span style={{ color: '#00f3ff' }}>For Itself</span>
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1rem',
              color: '#71717a',
              maxWidth: '480px',
              marginTop: '1.25rem',
              lineHeight: 1.7,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Not hypothetical results. Real brands scaled, real systems deployed, real growth 
            delivered — across the most competitive markets in the world.
          </p>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          {stats.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} shouldAnimate={shouldAnimate} />
          ))}
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.5rem 2rem',
            background: 'rgba(0, 243, 255, 0.04)',
            border: '1px solid rgba(0, 243, 255, 0.12)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00f3ff',
              boxShadow: '0 0 10px rgba(0,243,255,0.8)',
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.9rem',
              color: '#a1a1aa',
              textAlign: 'center',
            }}
          >
            <span style={{ color: '#ffffff', fontWeight: 600 }}>Multiple successful exits</span>{' '}
            — Growth strategy that doesn't just scale brands, it creates acquisition targets.
          </p>
        </div>
      </div>
    </section>
  )
}
