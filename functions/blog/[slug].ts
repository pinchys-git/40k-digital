// Cloudflare Pages Function: intercepts /blog/:slug to inject OG meta tags
// Works for social crawlers (Slack, Twitter, LinkedIn) that parse raw HTML

const API_BASE = 'https://40k-digital-api.roccobot.workers.dev'
const SITE_URL = 'https://40kdigital.com'
const FALLBACK_IMAGE = 'https://imagedelivery.net/ReyqBRCGi-Kk-ySrtBB7ag/fc317391-ec3d-47b5-5cf2-c0dd54c68600/public'

interface Post {
  title: string
  excerpt: string | null
  hero_image: string | null
  og_image: string | null
  slug: string
  category: string | null
  author: string | null
}

export async function onRequest(context: any) {
  const { request, params, env } = context
  const slug = params.slug as string

  // Fetch the static index.html from Pages assets
  const assetUrl = new URL(request.url)
  assetUrl.pathname = '/'
  const assetResponse = await env.ASSETS.fetch(new Request(assetUrl.toString()))
  let html = await assetResponse.text()

  // Defaults (used if API fetch fails)
  let title = '40K Digital — AI-Native Growth Agency'
  let description = 'AI-native growth agency combining performance marketing expertise with autonomous AI systems.'
  let image = FALLBACK_IMAGE
  let canonicalUrl = `${SITE_URL}/blog/${slug}`

  try {
    const res = await fetch(`${API_BASE}/api/posts/${encodeURIComponent(slug)}`)
    if (res.ok) {
      const post: Post = await res.json()
      title = `${post.title} — 40K Digital`
      description = post.excerpt || description
      image = post.og_image || post.hero_image || FALLBACK_IMAGE
    }
  } catch (_) {
    // Fall through to defaults
  }

  // Build meta tag block
  const metaTags = `
    <!-- Blog post OG tags (injected by Pages Function) -->
    <title>${escHtml(title)}</title>
    <meta name="description" content="${escHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escHtml(title)}" />
    <meta property="og:description" content="${escHtml(description)}" />
    <meta property="og:image" content="${escHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${escHtml(canonicalUrl)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escHtml(title)}" />
    <meta name="twitter:description" content="${escHtml(description)}" />
    <meta name="twitter:image" content="${escHtml(image)}" />`

  // Strip static title + any existing og:/twitter: meta tags, then inject post-specific ones
  html = html
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/<meta\s+(?:name|property)="(?:og:[^"]+|twitter:[^"]+|description)"[^>]*>/gi, '')
    .replace('</head>', `${metaTags}\n  </head>`)

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  })
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
