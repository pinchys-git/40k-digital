export function Footer() {
  const links = [
    { label: 'What We Do', href: '#services' },
    { label: 'Results', href: '#numbers' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <footer
      style={{
        padding: '3rem clamp(1rem, 5vw, 4rem)',
        background: '#000000',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#00f3ff',
                textShadow: '0 0 15px rgba(0,243,255,0.4)',
              }}
            >
              40K
            </span>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.1rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: '#ffffff',
              }}
            >
              DIGITAL
            </span>
          </a>

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.85rem',
                  color: '#52525b',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#a1a1aa')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#52525b')}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: '#3f3f46',
              letterSpacing: '0.05em',
            }}
          >
            © 2026 40K Digital. All rights reserved.
          </p>

          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              color: '#3f3f46',
              letterSpacing: '0.08em',
            }}
          >
            AI-NATIVE · PERFORMANCE-LED · EDGE-DEPLOYED
          </p>
        </div>
      </div>
    </footer>
  )
}
