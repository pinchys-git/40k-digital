import { useEffect, useRef } from 'react'

const phases = [
  {
    step: '01',
    title: 'Strategy',
    description:
      'We audit your current stack, map your growth opportunity, and design a custom AI+performance playbook. No templates. No cookie-cutter plans.',
    details: ['Growth audit & competitive analysis', 'AI readiness assessment', 'Custom roadmap design'],
  },
  {
    step: '02',
    title: 'Build',
    description:
      'We engineer the AI systems and growth infrastructure  -  autonomous agents, content pipelines, ad infrastructure, and measurement frameworks.',
    details: ['Agent & pipeline development', 'Ad infrastructure buildout', 'Attribution & data architecture'],
  },
  {
    step: '03',
    title: 'Deploy',
    description:
      'Everything ships to production-grade edge infrastructure. Fast. We don\'t hand you a prototype  -  we hand you a running machine.',
    details: ['Edge infrastructure deployment', 'End-to-end QA & testing', 'Go-live & launch support'],
  },
  {
    step: '04',
    title: 'Optimize',
    description:
      'AI systems don\'t sleep. Continuous monitoring, model updates, and performance optimization  -  keeping your growth engine tuned and accelerating.',
    details: ['Continuous performance monitoring', 'Model tuning & iteration', 'Scaling as you grow'],
  },
]

export function HowWeWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const elements = [headerRef.current, ...itemsRef.current].filter(Boolean)
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = el.dataset.delay || '0'
            setTimeout(() => {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            }, parseInt(delay))
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    elements.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
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
          data-delay="0"
          style={{
            opacity: 0,
            transform: 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            marginBottom: 'clamp(3rem, 6vw, 5rem)',
          }}
        >
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            / How We Work
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
            Our AI-First Process.{' '}
            <span style={{ color: '#a1a1aa' }}>From First Call to Full Velocity.</span>
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
            Four phases. Clear milestones. No ambiguity. You'll know exactly where we are
            and what's coming next.
          </p>
        </div>

        {/* Process phases */}
        <div style={{ position: 'relative' }}>
          {/* Connecting line */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '27px',
              top: '60px',
              bottom: '60px',
              width: '1px',
              background: 'linear-gradient(to bottom, rgba(0,243,255,0.3), rgba(0,243,255,0.05) 80%, transparent)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {phases.map((phase, i) => (
              <div
                key={phase.step}
                ref={(el) => { itemsRef.current[i] = el }}
                data-delay={`${i * 100}`}
                style={{
                  opacity: 0,
                  transform: 'translateY(30px)',
                  transition: `opacity 0.7s ease, transform 0.7s ease`,
                  display: 'flex',
                  gap: '2rem',
                  padding: '2.5rem 0',
                  borderBottom: i < phases.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                {/* Step indicator */}
                <div style={{ flexShrink: 0, position: 'relative', zIndex: 2 }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: '#000000',
                      border: '1px solid rgba(0, 243, 255, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(0,243,255,0.1)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#00f3ff',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {phase.step}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '1rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {phase.title}
                    </h3>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '0.65rem',
                        color: '#3f3f46',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Phase {phase.step}
                    </span>
                  </div>

                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '0.95rem',
                      color: '#a1a1aa',
                      lineHeight: 1.7,
                      maxWidth: '580px',
                      marginBottom: '1.25rem',
                    }}
                  >
                    {phase.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {phase.details.map((detail) => (
                      <span
                        key={detail}
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.7rem',
                          padding: '0.3rem 0.75rem',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '100px',
                          color: '#71717a',
                          letterSpacing: '0.02em',
                        }}
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
