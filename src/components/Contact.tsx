import { useEffect, useRef, useState } from 'react'

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return

    // If navigating directly to #contact (e.g. from blog CTA), show immediately
    if (window.location.hash === '#contact') {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      return
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('https://40k-digital-api.roccobot.workers.dev/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
          source: 'contact_form',
        }),
      })

      const data = await res.json() as { error?: string }

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      setSubmitting(false)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem 1.25rem',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: '#ffffff',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s ease',
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="tech-grid"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
        background: '#050505',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow accent */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,243,255,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={contentRef}
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          opacity: 0,
          transform: 'translateY(30px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="section-label" style={{ marginBottom: '1rem' }}>
            / Let's Build Something
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              lineHeight: 1.05,
              marginBottom: '1.25rem',
            }}
          >
            Ready to Scale{' '}
            <span
              style={{
                color: '#00f3ff',
                textShadow: '0 0 40px rgba(0,243,255,0.3)',
              }}
            >
              Differently?
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '1rem',
              color: '#71717a',
              lineHeight: 1.7,
              maxWidth: '460px',
              margin: '0 auto',
            }}
          >
            Tell us what you're building. We'll tell you exactly how we'd approach it.
            No decks. No fluff. Just a real conversation.
          </p>
        </div>

        {/* Contact card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            boxShadow: '0 0 60px rgba(0,243,255,0.04), 0 40px 80px rgba(0,0,0,0.4)',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(0, 243, 255, 0.1)',
                  border: '1px solid rgba(0, 243, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 0 30px rgba(0,243,255,0.2)',
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                }}
              >
                Message Received
              </h3>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#71717a' }}>
                We'll be in touch within one business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: '#71717a',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    style={inputStyle}
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 243, 255, 0.4)'
                      e.target.style.boxShadow = '0 0 0 1px rgba(0, 243, 255, 0.15)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                      color: '#71717a',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    style={inputStyle}
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 243, 255, 0.4)'
                      e.target.style.boxShadow = '0 0 0 1px rgba(0, 243, 255, 0.15)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: '#71717a',
                    marginBottom: '0.5rem',
                  }}
                >
                  What are you building?
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your business and growth goals..."
                  style={{
                    ...inputStyle,
                    resize: 'none',
                    lineHeight: 1.7,
                  }}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(0, 243, 255, 0.4)'
                    e.target.style.boxShadow = '0 0 0 1px rgba(0, 243, 255, 0.15)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              {error && (
                <div
                  style={{
                    marginBottom: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,60,60,0.08)',
                    border: '1px solid rgba(255,60,60,0.25)',
                    borderRadius: '10px',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.85rem',
                    color: '#ff6b6b',
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.8rem',
                    color: '#71717a',
                  }}
                >
                  Or reach us directly:{' '}
                  <a
                    href="mailto:hello@40kdigital.com"
                    style={{
                      color: '#00f3ff',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                  >
                    hello@40kdigital.com
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={{ animation: 'spin 1s linear infinite' }}
                      >
                        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        <path d="M12 3a9 9 0 019 9"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          form > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
