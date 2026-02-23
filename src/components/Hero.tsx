import { useEffect, useRef, useState } from 'react'
import { NeuralScene, NeuralFallback } from '../three/NeuralScene'
import { useReducedMotion } from '../hooks/useReducedMotion'

function useIsWebGLCapable() {
  const [capable, setCapable] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const isMobile = window.innerWidth < 768
      setCapable(!!gl && !isMobile)
    } catch {
      setCapable(false)
    }
  }, [])

  return capable
}

export function Hero() {
  const reduced = useReducedMotion()
  const webglCapable = useIsWebGLCapable()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !contentRef.current) return
    
    const el = contentRef.current
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    
    const timeout = setTimeout(() => {
      el.style.transition = 'opacity 1s ease, transform 1s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 200)

    return () => clearTimeout(timeout)
  }, [reduced])

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#000000',
      }}
    >
      {/* 3D Neural Background */}
      {webglCapable === true && (
        <NeuralScene
          className=""
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        />
      )}
      {webglCapable === false && <NeuralFallback />}

      {/* Gradient overlay for text readability */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Bottom fade to next section */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          zIndex: 2,
          background: 'linear-gradient(to bottom, transparent, #050505)',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          margin: '0 auto',
          padding: 'clamp(3.5rem, 5vw, 5rem) clamp(1rem, 5vw, 4rem) 4rem',
          width: '100%',
        }}
      >
        {/* Label */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            padding: '0.4rem 1rem',
            border: '1px solid rgba(0, 243, 255, 0.25)',
            borderRadius: '100px',
            background: 'rgba(0, 243, 255, 0.06)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#00f3ff',
              boxShadow: '0 0 8px rgba(0,243,255,0.8)',
              animation: reduced ? 'none' : 'pulse-accent 2s ease-in-out infinite',
            }}
          />
          <span className="section-label" style={{ fontSize: '0.7rem' }}>
            AI-Native Growth Agency
          </span>
        </div>

        {/* Main Headline */}
        <h1
          className="headline-display"
          style={{
            color: '#ffffff',
            marginBottom: '1rem',
            lineHeight: 0.9,
          }}
        >
          Where{' '}
          <span
            style={{
              color: '#00f3ff',
              textShadow: '0 0 40px rgba(0,243,255,0.4), 0 0 80px rgba(0,243,255,0.15)',
            }}
          >
            Performance
          </span>{' '}
          Meets{' '}
          <span style={{ color: '#ffffff' }}>
            Autonomous{' '}
            <span
              style={{
                display: 'inline-block',
                background: 'linear-gradient(90deg, #ffffff 0%, #00f3ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Systems
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#a1a1aa',
            maxWidth: '580px',
            marginBottom: '1.75rem',
            lineHeight: 1.7,
          }}
        >
          We combine 20+ years of performance marketing with custom-built AI infrastructure
          to scale brands at speeds that weren't possible before.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <a href="#contact" className="btn-primary" style={{ textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Start Growing
          </a>
          <a href="#services" className="btn-secondary" style={{ textDecoration: 'none' }}>
            What We Build
          </a>
        </div>

        {/* Proof tickers */}
        <div
          style={{
            display: 'flex',
            gap: '2.5rem',
            marginTop: '4rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: '30+', sub: 'brands scaled' },
            { label: '20+', sub: 'years deep' },
            { label: "100's", sub: 'Live Agents' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#00f3ff',
                  textShadow: '0 0 20px rgba(0,243,255,0.4)',
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#71717a',
                }}
              >
                {stat.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 0.4,
          animation: reduced ? 'none' : 'float 2s ease-in-out infinite',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#71717a',
          }}
        >
          scroll
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="1" y="1" width="14" height="22" rx="7" stroke="#71717a" strokeWidth="1.5"/>
          <rect
            x="7" y="5" width="2" height="6" rx="1" fill="#00f3ff"
            style={{
              animation: reduced ? 'none' : 'scroll-dot 2s ease-in-out infinite',
            }}
          />
        </svg>
        <style>{`
          @keyframes scroll-dot {
            0%, 100% { transform: translateY(0); opacity: 1; }
            50% { transform: translateY(8px); opacity: 0.4; }
          }
        `}</style>
      </div>
    </section>
  )
}
