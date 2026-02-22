import { useEffect, useRef } from 'react'

const credentials = [
  { role: 'Streaming & OTT', company: 'Growth Leadership', outcome: 'Scaled platforms to nearly 1M subscribers' },
  { role: 'Telecom & Media', company: 'Digital Acquisition', outcome: 'Built systems that created acquisition targets' },
  { role: 'Agency & Enterprise', company: 'Performance Marketing', outcome: 'Led strategy across 30+ brands' },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0,243,255,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={contentRef}
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          opacity: 0,
          transform: 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left — text */}
          <div>
            <div className="section-label" style={{ marginBottom: '1rem' }}>
              / Leadership
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
              }}
            >
              Built by Someone{' '}
              <br />
              <span style={{ color: '#00f3ff' }}>Who's Done It</span>
            </h2>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1rem',
                color: '#a1a1aa',
                lineHeight: 1.8,
                marginBottom: '1.5rem',
              }}
            >
              40K Digital was founded by operators who've been in the room when 
              the big deals close. Not as advisors — as the people responsible for the 
              growth that made those outcomes possible.
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1rem',
                color: '#a1a1aa',
                lineHeight: 1.8,
                marginBottom: '2rem',
              }}
            >
              That experience now powers a new kind of agency — one where deep strategic 
              instincts are amplified by AI systems we build and operate ourselves. 
              Not off-the-shelf tools. Custom infrastructure.
            </p>

            {/* Founder name */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                width: 'fit-content',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(0,243,255,0.2), rgba(0,64,255,0.2))',
                  border: '1px solid rgba(0,243,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#00f3ff',
                  flexShrink: 0,
                }}
              >
                CJ
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    color: '#ffffff',
                    fontSize: '0.95rem',
                  }}
                >
                  Chris Joel
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.7rem',
                    color: '#71717a',
                    letterSpacing: '0.04em',
                  }}
                >
                  Founder & CEO
                </div>
              </div>
            </div>
          </div>

          {/* Right — credential cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {credentials.map((cred, i) => (
              <div
                key={cred.company}
                className="glass"
                style={{
                  padding: '1.5rem 2rem',
                  transition: 'all 0.3s ease',
                  animationDelay: `${i * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(0, 243, 255, 0.2)'
                  el.style.background = 'rgba(0, 243, 255, 0.03)'
                  el.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                  el.style.background = 'rgba(255, 255, 255, 0.03)'
                  el.style.transform = 'translateX(0)'
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    color: '#00f3ff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: '0.4rem',
                  }}
                >
                  {cred.role}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.4rem',
                  }}
                >
                  {cred.company}
                </div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.8rem',
                    color: '#71717a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span style={{ color: '#00f3ff' }}>→</span>
                  {cred.outcome}
                </div>
              </div>
            ))}

            {/* Stats pill */}
            <div
              style={{
                padding: '1.25rem 2rem',
                background: 'rgba(0, 243, 255, 0.05)',
                border: '1px solid rgba(0, 243, 255, 0.15)',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              {[
                { val: '30+', label: 'Brands scaled' },
                { val: '20+', label: 'Years in the arena' },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      color: '#00f3ff',
                      textShadow: '0 0 20px rgba(0,243,255,0.4)',
                    }}
                  >
                    {item.val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.75rem',
                      color: '#71717a',
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
