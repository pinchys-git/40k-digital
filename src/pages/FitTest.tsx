import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ─── Question data ────────────────────────────────────────────────── */

interface Option {
  label: string
  score: number
  bottleneck?: string // only used for Q5
  size?: string       // only used for Q6
}

interface Question {
  id: number
  question: string
  icon: string
  options: Option[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'How much of your content is created manually?',
    icon: '✍️',
    options: [
      { label: 'Almost all of it', score: 1 },
      { label: 'Most, with some automation', score: 2 },
      { label: 'About half automated', score: 3 },
      { label: 'Mostly automated', score: 4 },
    ],
  },
  {
    id: 2,
    question: 'How do you currently handle marketing analytics?',
    icon: '📊',
    options: [
      { label: 'Spreadsheets and manual reports', score: 1 },
      { label: 'Basic dashboard tools', score: 2 },
      { label: 'Advanced analytics with some automation', score: 3 },
      { label: 'Fully automated, real-time insights', score: 4 },
    ],
  },
  {
    id: 3,
    question: 'How quickly can you launch a new campaign?',
    icon: '🚀',
    options: [
      { label: 'Weeks to months', score: 1 },
      { label: 'About a week', score: 2 },
      { label: 'A few days', score: 3 },
      { label: 'Same day', score: 4 },
    ],
  },
  {
    id: 4,
    question: "How many marketing tools are in your stack?",
    icon: '🧩',
    options: [
      { label: '1–3', score: 1 },
      { label: '4–7', score: 2 },
      { label: '8–12', score: 3 },
      { label: "13+ and it's a mess", score: 2 }, // trick answer
    ],
  },
  {
    id: 5,
    question: "What's your biggest growth bottleneck?",
    icon: '🎯',
    options: [
      { label: 'Content production', score: 0, bottleneck: 'Content AI' },
      { label: 'Data & analytics', score: 0, bottleneck: 'Analytics AI' },
      { label: 'Campaign execution speed', score: 0, bottleneck: 'Campaign AI' },
      { label: 'All of the above', score: 0, bottleneck: 'Full AI Suite' },
    ],
  },
  {
    id: 6,
    question: 'Company size?',
    icon: '🏢',
    options: [
      { label: 'Just me / small team', score: 0, size: 'startup' },
      { label: '10–50 employees', score: 0, size: 'growth' },
      { label: '50–500 employees', score: 0, size: 'mid-market' },
      { label: '500+ employees', score: 0, size: 'enterprise' },
    ],
  },
]

/* ─── Grade logic ────────────────────────────────────────────────── */

interface Grade {
  letter: 'A' | 'B' | 'C' | 'D'
  headline: string
  description: string
  color: string
  glow: string
}

function getGrade(score: number): Grade {
  if (score >= 18) return {
    letter: 'A',
    headline: "You're ready for AI-powered growth. Let's talk.",
    description: "Your team is already operating at a high level of automation. With 40K Digital's AI layer, you can amplify what's working, eliminate remaining friction, and compound your advantage faster than your competitors can react.",
    color: '#00f3ff',
    glow: '0 0 60px rgba(0,243,255,0.5), 0 0 120px rgba(0,243,255,0.2)',
  }
  if (score >= 12) return {
    letter: 'B',
    headline: 'Strong foundation. AI could 3X your output.',
    description: "You've built solid marketing operations, but there's significant headroom. The right AI stack would multiply your team's output without adding headcount  -  and close the gap on competitors who've already made the leap.",
    color: '#a3e635',
    glow: '0 0 60px rgba(163,230,53,0.4), 0 0 120px rgba(163,230,53,0.15)',
  }
  if (score >= 8) return {
    letter: 'C',
    headline: 'Significant opportunity. AI would transform your operations.',
    description: "Your current approach is leaving real growth on the table. Manual processes are slowing you down and every month you wait compounds the disadvantage. An AI transformation now would create outsized returns within 90 days.",
    color: '#fb923c',
    glow: '0 0 60px rgba(251,146,60,0.4), 0 0 120px rgba(251,146,60,0.15)',
  }
  return {
    letter: 'D',
    headline: 'You needed this yesterday. Let\'s start.',
    description: "Your competitors are pulling ahead fast. But the gap is closeable  -  and the companies that move now lock in advantages that compound for years. This is the moment. Let's rebuild your growth engine from the ground up.",
    color: '#f87171',
    glow: '0 0 60px rgba(248,113,113,0.4), 0 0 120px rgba(248,113,113,0.15)',
  }
}

const BOTTLENECK_RECS: Record<string, string> = {
  'Content AI': 'Based on your bottleneck, we\'d start with our Content AI system  -  autonomous agents that research, write, and publish at scale while matching your brand voice perfectly.',
  'Analytics AI': 'Based on your bottleneck, we\'d deploy our Analytics AI layer first  -  real-time dashboards, automated insights, and campaign signals that eliminate manual reporting entirely.',
  'Campaign AI': 'Based on your bottleneck, we\'d lead with Campaign AI  -  automated launch workflows that compress weeks of execution into hours, with built-in optimization loops.',
  'Full AI Suite': 'Given your across-the-board opportunity, we\'d architect a full AI growth stack  -  content, analytics, and campaign systems working in concert to transform your entire operation.',
}

/* ─── Confetti ────────────────────────────────────────────────────── */

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: ['#00f3ff', '#a3e635', '#ffffff', '#7c3aed', '#06b6d4'][Math.floor(Math.random() * 5)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
    }))

    let frame = 0
    let animId: number

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.opacity = Math.max(0, 1 - frame / 180)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })
      frame++
      if (frame < 200) animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9997,
      }}
    />
  )
}

/* ─── Main FitTest ───────────────────────────────────────────────── */

export function FitTest() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([]) // score per question
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const [bottleneck, setBottleneck] = useState<string>('Full AI Suite')
  const [companySize, setCompanySize] = useState<string>('growth')
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const totalScore = answers.reduce((a, b) => a + b, 0)
  const grade = getGrade(totalScore)
  const progress = done ? 100 : (currentQ / QUESTIONS.length) * 100

  function selectOption(optIdx: number) {
    if (selectedIdx !== null || transitioning) return
    setSelectedIdx(optIdx)

    const q = QUESTIONS[currentQ]
    const opt = q.options[optIdx]

    if (q.id === 5 && opt.bottleneck) setBottleneck(opt.bottleneck)
    if (q.id === 6 && opt.size) setCompanySize(opt.size)

    const newAnswers = [...answers, opt.score]

    // Auto-advance after 300ms
    setTimeout(() => {
      setTransitioning(true)
      // Slide out
      if (cardRef.current) {
        cardRef.current.style.opacity = '0'
        cardRef.current.style.transform = 'translateX(-40px)'
      }
      setTimeout(() => {
        setAnswers(newAnswers)
        setSelectedIdx(null)
        setTransitioning(false)

        if (currentQ + 1 >= QUESTIONS.length) {
          setDone(true)
          // Submit to API
          const totalSc = newAnswers.reduce((a, b) => a + b, 0)
          submitResults(totalSc, bottleneck, companySize)
          // Show confetti for A grade
          if (totalSc >= 18) setShowConfetti(true)
          // Animate results
          setTimeout(() => {
            if (resultRef.current) {
              resultRef.current.style.opacity = '1'
              resultRef.current.style.transform = 'scale(1) translateY(0)'
            }
          }, 100)
        } else {
          setCurrentQ(currentQ + 1)
          // Slide in new card
          setTimeout(() => {
            if (cardRef.current) {
              cardRef.current.style.transition = 'none'
              cardRef.current.style.opacity = '0'
              cardRef.current.style.transform = 'translateX(40px)'
              requestAnimationFrame(() => {
                if (cardRef.current) {
                  cardRef.current.style.transition = 'opacity 0.4s ease, transform 0.4s ease'
                  cardRef.current.style.opacity = '1'
                  cardRef.current.style.transform = 'translateX(0)'
                }
              })
            }
          }, 50)
        }
      }, 300)
    }, 300)
  }

  function submitResults(score: number, neck: string, size: string) {
    fetch('https://40k-digital-api.roccobot.workers.dev/api/fit-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score,
        grade: getGrade(score).letter,
        bottleneck: neck,
        company_size: size,
        answers,
      }),
    }).catch(() => {}) // silent fail
  }

  function submitEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    // Submit email with results
    fetch('https://40k-digital-api.roccobot.workers.dev/api/fit-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: totalScore,
        grade: grade.letter,
        bottleneck,
        company_size: companySize,
        email,
        answers,
      }),
    }).catch(() => {})
    setEmailSubmitted(true)
  }

  // Entry animation for card
  useEffect(() => {
    if (!cardRef.current || done) return
    cardRef.current.style.opacity = '1'
    cardRef.current.style.transform = 'translateX(0)'
  }, [currentQ, done])

  if (done) {
    const rec = BOTTLENECK_RECS[bottleneck] ?? BOTTLENECK_RECS['Full AI Suite']

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050505',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(5rem, 10vw, 8rem) clamp(1rem, 5vw, 4rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {showConfetti && <Confetti />}

        {/* Ambient glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: `radial-gradient(ellipse, ${grade.color}10 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Progress bar  -  full */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(255,255,255,0.06)',
            zIndex: 200,
          }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              background: 'linear-gradient(90deg, #00f3ff, #7c3aed)',
              boxShadow: '0 0 10px rgba(0,243,255,0.6)',
              transition: 'width 0.6s ease',
            }}
          />
        </div>

        <div
          ref={resultRef}
          style={{
            maxWidth: '640px',
            width: '100%',
            textAlign: 'center',
            opacity: 0,
            transform: 'scale(0.9) translateY(20px)',
            transition: 'opacity 0.8s cubic-bezier(0.34,1.56,0.64,1), transform 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Grade display */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(6rem, 18vw, 10rem)',
                fontWeight: 900,
                color: grade.color,
                lineHeight: 1,
                textShadow: grade.glow,
                letterSpacing: '-0.05em',
                animation: 'grade-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both',
              }}
            >
              {grade.letter}
            </div>
            <div
              className="section-label"
              style={{ marginTop: '0.5rem', color: grade.color }}
            >
              / AI Readiness Score: {totalScore}/20
            </div>
          </div>

          {/* Grade card */}
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${grade.color}30`,
              borderRadius: '24px',
              padding: 'clamp(2rem, 5vw, 3rem)',
              marginBottom: '1.5rem',
              boxShadow: `0 0 40px ${grade.color}10`,
            }}
          >
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '1.25rem',
              }}
            >
              {grade.headline}
            </h1>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '1rem',
                color: '#71717a',
                lineHeight: 1.75,
                marginBottom: '1.75rem',
              }}
            >
              {grade.description}
            </p>

            {/* Personalized recommendation */}
            <div
              style={{
                background: `rgba(0,243,255,0.04)`,
                border: '1px solid rgba(0,243,255,0.15)',
                borderRadius: '14px',
                padding: '1.25rem 1.5rem',
                textAlign: 'left',
              }}
            >
              <div className="section-label" style={{ marginBottom: '0.65rem', fontSize: '0.65rem' }}>
                / Recommended First Step
              </div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.9rem',
                  color: '#a1a1aa',
                  lineHeight: 1.7,
                }}
              >
                {rec}
              </p>
            </div>
          </div>

          {/* Email capture */}
          {!emailSubmitted ? (
            <form
              onSubmit={submitEmail}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                Get your full AI Readiness Report →
              </p>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.8rem', color: '#52525b' }}>
                We'll send a personalized breakdown to your inbox.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,243,255,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
                <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
                  Send Report
                </button>
              </div>
            </form>
          ) : (
            <div
              style={{
                background: 'rgba(0,243,255,0.06)',
                border: '1px solid rgba(0,243,255,0.2)',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.9rem',
                color: '#00f3ff',
              }}
            >
              ✓ Report request received  -  we'll be in touch shortly.
            </div>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/#contact" className="btn-primary" style={{ textDecoration: 'none' }}>
              Let's Talk →
            </a>
            <Link
              to="/fit-test"
              onClick={() => {
                setCurrentQ(0)
                setAnswers([])
                setSelectedIdx(null)
                setDone(false)
                setShowConfetti(false)
                setEmailSubmitted(false)
                setEmail('')
              }}
              className="btn-secondary"
              style={{ textDecoration: 'none' }}
            >
              Retake Assessment
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes grade-pop {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  const q = QUESTIONS[currentQ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Tech grid background */}
      <div
        aria-hidden="true"
        className="tech-grid"
        style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }}
      />

      {/* Ambient cyan glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(0,243,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Progress bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 200,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #00f3ff, #7c3aed)',
            boxShadow: '0 0 10px rgba(0,243,255,0.6)',
            transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        />
      </div>

      {/* Header */}
      <div
        style={{
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 5vw, 4rem) 1rem',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textDecoration: 'none',
            marginBottom: '2rem',
          }}
        >
          <span style={{ color: '#00f3ff', textShadow: '0 0 20px rgba(0,243,255,0.5)' }}>40K</span>
          <span style={{ color: '#ffffff' }}>DIGITAL</span>
        </Link>

        <div className="section-label" style={{ marginBottom: '0.5rem' }}>
          / AI Growth Readiness Assessment
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.75rem',
            color: '#3f3f46',
            letterSpacing: '0.08em',
          }}
        >
          Question {currentQ + 1} of {QUESTIONS.length}
        </div>
      </div>

      {/* Question card */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem clamp(1rem, 5vw, 4rem) clamp(4rem, 8vw, 6rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          ref={cardRef}
          style={{
            maxWidth: '680px',
            width: '100%',
            opacity: 0,
            transform: 'translateX(40px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {/* Question */}
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                lineHeight: 1,
              }}
              role="img"
              aria-hidden="true"
            >
              {q.icon}
            </div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {q.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx
              const isOther = selectedIdx !== null && selectedIdx !== idx
              return (
                <button
                  key={idx}
                  onClick={() => selectOption(idx)}
                  disabled={selectedIdx !== null}
                  style={{
                    width: '100%',
                    padding: '1.25rem 1.75rem',
                    background: isSelected
                      ? 'rgba(0,243,255,0.12)'
                      : 'rgba(255,255,255,0.03)',
                    border: isSelected
                      ? '1px solid rgba(0,243,255,0.5)'
                      : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '14px',
                    color: isSelected ? '#00f3ff' : '#a1a1aa',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '1rem',
                    fontWeight: isSelected ? 600 : 400,
                    textAlign: 'left',
                    cursor: selectedIdx !== null ? 'default' : 'pointer',
                    transition: 'all 0.25s ease',
                    opacity: isOther ? 0.4 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: isSelected ? '0 0 20px rgba(0,243,255,0.15), inset 0 0 20px rgba(0,243,255,0.05)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedIdx !== null) return
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(0,243,255,0.3)'
                    el.style.background = 'rgba(0,243,255,0.06)'
                    el.style.color = '#ffffff'
                    el.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={(e) => {
                    if (isSelected) return
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(255,255,255,0.08)'
                    el.style.background = 'rgba(255,255,255,0.03)'
                    el.style.color = '#a1a1aa'
                    el.style.transform = 'translateX(0)'
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      style={{ flexShrink: 0 }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
        }
      `}</style>
    </div>
  )
}
