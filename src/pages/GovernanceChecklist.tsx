import { useState } from 'react'

export function GovernanceChecklist() {
  const [formState, setFormState] = useState({ name: '', email: '', company: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          company: formState.company,
          message: 'Downloaded: AI Governance Checklist',
          source: 'governance-checklist',
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
      
      // Auto-trigger download
      const link = document.createElement('a')
      link.href = '/assets/ai-governance-checklist.html'
      link.download = 'AI-Governance-Checklist-40K-Digital.html'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

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

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#71717a',
    marginBottom: '0.5rem',
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh', paddingTop: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 80px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ 
                fontFamily: "'JetBrains Mono', monospace", 
                color: '#00f3ff', 
                fontSize: '0.8rem', 
                marginBottom: '20px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
            }}>
                / Free Resource
            </div>
            <h1 style={{ 
                fontFamily: "'Space Grotesk', sans-serif", 
                color: '#ffffff', 
                fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
                lineHeight: 1.1, 
                marginBottom: '20px',
                letterSpacing: '-0.02em'
            }}>
                The AI Governance Checklist <br />
                <span style={{ color: '#71717a' }}>for Marketing Teams</span>
            </h1>
            <p style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                color: '#a1a1aa', 
                fontSize: '1.1rem', 
                maxWidth: '600px', 
                margin: '0 auto', 
                lineHeight: 1.6 
            }}>
                27% of CMOs are blocked from AI adoption by security and governance concerns. 
                This checklist gets you unblocked in a day, not a quarter.
            </p>
        </div>

        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr', 
            gap: '40px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '24px',
            padding: '40px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            
            {/* Glow effect */}
            <div style={{
                position: 'absolute',
                top: '0',
                right: '0',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(0,243,255,0.05) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            {/* Value Props */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ 
                    fontFamily: "'Space Grotesk', sans-serif", 
                    color: '#ffffff', 
                    fontSize: '1.2rem', 
                    marginBottom: '20px' 
                }}>
                    What's Inside:
                </h3>
                <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0, 
                    fontFamily: "'Plus Jakarta Sans', sans-serif", 
                    color: '#e4e4e7',
                    display: 'grid',
                    gap: '15px'
                }}>
                    {[
                        "Complete vendor assessment framework (30+ questions)",
                        "Data classification matrix for marketing use cases",
                        "IT/Legal approval workflow template",
                        "Brand safety guardrails for AI-generated content",
                        "Incident response playbook"
                    ].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <span style={{ color: '#00f3ff', marginTop: '4px' }}>✓</span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Form */}
            <div style={{ 
                borderTop: '1px solid rgba(255,255,255,0.06)', 
                paddingTop: '30px' 
            }}>
                {submitted ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ 
                            width: '60px', 
                            height: '60px', 
                            background: 'rgba(0,243,255,0.1)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto 20px',
                            color: '#00f3ff'
                        }}>
                            ✓
                        </div>
                        <h3 style={{ color: '#fff', marginBottom: '10px', fontFamily: "'Space Grotesk', sans-serif" }}>Success!</h3>
                        <p style={{ color: '#a1a1aa', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: '20px' }}>
                            Your download should start automatically.
                        </p>
                        <a 
                            href="/assets/ai-governance-checklist.html" 
                            download
                            style={{ 
                                color: '#00f3ff', 
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                textDecoration: 'none',
                                borderBottom: '1px solid #00f3ff'
                            }}
                        >
                            Click here if it didn't start
                        </a>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: '20px', marginBottom: '30px' }}>
                            <div>
                                <label style={labelStyle}>First Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    style={inputStyle} 
                                    value={formState.name}
                                    onChange={e => setFormState({...formState, name: e.target.value})}
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Work Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    style={inputStyle} 
                                    value={formState.email}
                                    onChange={e => setFormState({...formState, email: e.target.value})}
                                    placeholder="name@company.com"
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Company</label>
                                <input 
                                    type="text" 
                                    required 
                                    style={inputStyle} 
                                    value={formState.company}
                                    onChange={e => setFormState({...formState, company: e.target.value})}
                                    placeholder="Company name"
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ 
                                color: '#ff6b6b', 
                                marginBottom: '20px', 
                                fontSize: '0.9rem', 
                                fontFamily: "'Plus Jakarta Sans', sans-serif" 
                            }}>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: '#00f3ff',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#000',
                                fontWeight: 600,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                opacity: submitting ? 0.7 : 1,
                                transition: 'all 0.2s',
                                fontSize: '1rem'
                            }}
                            onMouseEnter={e => !submitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={e => !submitting && (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            {submitting ? 'Processing...' : 'Get the Checklist'}
                        </button>
                    </form>
                )}
            </div>
        </div>
        
        <div style={{ 
            textAlign: 'center', 
            marginTop: '40px', 
            color: '#52525b', 
            fontSize: '0.9rem', 
            fontFamily: "'Plus Jakarta Sans', sans-serif" 
        }}>
            Used by marketing teams at AI-forward companies
        </div>

      </div>
    </div>
  )
}
