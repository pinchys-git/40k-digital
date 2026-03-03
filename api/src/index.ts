import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
  CORS_ORIGIN: string
  TURNSTILE_SECRET: string
  ADMIN_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS
app.use('*', cors({
  origin: (origin, c) => {
    const allowed = [
      c.env.CORS_ORIGIN,
      'https://40kdigital.com',
      'https://www.40kdigital.com',
      'https://40k-review.roccobot.workers.dev',
      'http://localhost:5173',
      'http://localhost:4173',
    ]
    return allowed.includes(origin) ? origin : ''
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// ─── Health ────────────────────────────────────────────────────────────────

app.get('/api/health', (c) => {
  return c.json({
    ok: true,
    service: '40k-digital-api',
    timestamp: new Date().toISOString(),
  })
})

// ─── Contact Form ──────────────────────────────────────────────────────────

app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, company, message, source = 'contact_form', turnstileToken } = body

    if (!name || !email) {
      return c.json({ error: 'Name and email are required' }, 400)
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email address' }, 400)
    }

    // Verify Turnstile token
    let turnstileVerified = 0
    if (turnstileToken && c.env.TURNSTILE_SECRET) {
      const formData = new FormData()
      formData.append('secret', c.env.TURNSTILE_SECRET)
      formData.append('response', turnstileToken)

      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        body: formData,
      })
      const verifyData: any = await verifyRes.json()
      turnstileVerified = verifyData.success ? 1 : 0

      if (!verifyData.success) {
        return c.json({ error: 'Bot verification failed. Please try again.' }, 400)
      }
    }

    // Store in D1
    const result = await c.env.DB.prepare(
      `INSERT INTO contacts (name, email, company, message, source, turnstile_verified)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(name, email, company || null, message || null, source, turnstileVerified).run()

    return c.json({
      success: true,
      id: result.meta.last_row_id,
      message: "Thanks! We'll be in touch shortly.",
    })
  } catch (err: any) {
    console.error('Contact error:', err)
    return c.json({ error: 'Failed to submit contact form' }, 500)
  }
})

// ─── Blog Posts ────────────────────────────────────────────────────────────

app.get('/api/posts', async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50)
    const offset = parseInt(c.req.query('offset') || '0')
    const category = c.req.query('category')

    let query = `SELECT id, title, slug, excerpt, category, tags, author, hero_image, published_at
                 FROM posts
                 WHERE status = 'published' AND replace(replace(published_at, 'T', ' '), 'Z', '') <= datetime('now')`
    const params: any[] = []

    if (category) {
      query += ` AND category = ?`
      params.push(category)
    }

    query += ` ORDER BY published_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const { results } = await c.env.DB.prepare(query).bind(...params).all()

    // Parse tags JSON
    const posts = results.map((post: any) => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
    }))

    return c.json({ posts, limit, offset })
  } catch (err: any) {
    console.error('Posts list error:', err)
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

app.get('/api/posts/:slug', async (c) => {
  try {
    const slug = c.req.param('slug')

    const post = await c.env.DB.prepare(
      `SELECT * FROM posts WHERE slug = ? AND status = 'published'`
    ).bind(slug).first()

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    return c.json({
      ...post,
      tags: (post as any).tags ? JSON.parse((post as any).tags as string) : [],
    })
  } catch (err: any) {
    console.error('Post fetch error:', err)
    return c.json({ error: 'Failed to fetch post' }, 500)
  }
})

// ─── Admin: Create/Update Posts (for Content Pipeline) ─────────────────────

// Strip em dashes from content strings (replace with ' - ')
const stripEmDashes = (text: string | null | undefined): string | null | undefined => {
  if (!text) return text
  return text.replace(/—/g, ' - ').replace(/  +/g, ' ')
}

// Auth middleware for admin routes
const adminAuth = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization')
  const adminSecret = c.env.ADMIN_SECRET
  if (!adminSecret || !authHeader) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.replace('Bearer ', '')
  if (token !== adminSecret) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
}

// Create a new post
app.post('/api/admin/posts', adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const {
      title, slug, content, excerpt, category, tags,
      author = '40K Digital', hero_image, status = 'draft', published_at,
    } = body

    if (!title || !slug || !content) {
      return c.json({ error: 'title, slug, and content are required' }, 400)
    }

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Strip em dashes from all text fields
    const cleanTitle = stripEmDashes(title) as string
    const cleanContent = stripEmDashes(content) as string
    const cleanExcerpt = stripEmDashes(excerpt)

    const result = await c.env.DB.prepare(
      `INSERT INTO posts (title, slug, content, excerpt, category, tags, author, hero_image, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      cleanTitle,
      finalSlug,
      cleanContent,
      cleanExcerpt || null,
      category || null,
      tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
      author,
      hero_image || null,
      status,
      published_at || new Date().toISOString(),
    ).run()

    return c.json({
      success: true,
      data: {
        id: result.meta.last_row_id,
        slug: finalSlug,
      },
    })
  } catch (err: any) {
    console.error('Admin create post error:', err)
    if (err.message?.includes('UNIQUE constraint')) {
      return c.json({ error: 'A post with that slug already exists' }, 409)
    }
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

// Publish a post (set status to published)
app.post('/api/admin/posts/:id/publish', adminAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const result = await c.env.DB.prepare(
      `UPDATE posts SET status = 'published', published_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ? AND status != 'published'`
    ).bind(id).run()

    if (result.meta.changes === 0) {
      // Check if already published or not found
      const post = await c.env.DB.prepare('SELECT id, status FROM posts WHERE id = ?').bind(id).first()
      if (!post) return c.json({ error: 'Post not found' }, 404)
      return c.json({ success: true, message: 'Already published' })
    }

    return c.json({ success: true, message: 'Post published' })
  } catch (err: any) {
    console.error('Admin publish error:', err)
    return c.json({ error: 'Failed to publish post' }, 500)
  }
})

// Update a post
app.put('/api/admin/posts/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id')
    const body = await c.req.json()
    const fields: string[] = []
    const values: any[] = []

    for (const [key, val] of Object.entries(body)) {
      if (['title', 'slug', 'content', 'excerpt', 'category', 'tags', 'author', 'hero_image', 'og_image', 'status', 'published_at'].includes(key)) {
        fields.push(`${key} = ?`)
        if (key === 'tags' && typeof val !== 'string') {
          values.push(JSON.stringify(val))
        } else if (['title', 'content', 'excerpt'].includes(key) && typeof val === 'string') {
          // Strip em dashes from text fields on every update
          values.push(stripEmDashes(val))
        } else {
          values.push(val)
        }
      }
    }

    if (fields.length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400)
    }

    fields.push("updated_at = datetime('now')")
    values.push(id)

    await c.env.DB.prepare(
      `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`
    ).bind(...values).run()

    return c.json({ success: true })
  } catch (err: any) {
    console.error('Admin update post error:', err)
    return c.json({ error: 'Failed to update post' }, 500)
  }
})

// List all posts (including drafts) for admin
app.get('/api/admin/posts', adminAuth, async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT * FROM posts ORDER BY created_at DESC`
    ).all()
    return c.json({ posts: results })
  } catch (err: any) {
    return c.json({ error: 'Failed to fetch posts' }, 500)
  }
})

// ─── Admin: Research Items ─────────────────────────────────────────────────

// Store a research item
app.post('/api/admin/research/items', adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const {
      title, summary, source_url, source_name, category,
      confidence = 'medium', fact_checked = 0, published_date,
      scan_session, tags, relevance_score = 5, competitor_name,
      action_recommended,
    } = body

    if (!title || !summary || !category) {
      return c.json({ error: 'title, summary, and category are required' }, 400)
    }

    const result = await c.env.DB.prepare(
      `INSERT INTO research_items
        (title, summary, source_url, source_name, category, confidence, fact_checked,
         published_date, scan_session, tags, relevance_score, competitor_name, action_recommended)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      title,
      summary,
      source_url || null,
      source_name || null,
      category,
      confidence,
      fact_checked,
      published_date || null,
      scan_session || null,
      tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
      relevance_score,
      competitor_name || null,
      action_recommended || null,
    ).run()

    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (err: any) {
    console.error('Research item create error:', err)
    return c.json({ error: 'Failed to store research item' }, 500)
  }
})

// Query research items
app.get('/api/admin/research/items', adminAuth, async (c) => {
  try {
    const category = c.req.query('category')
    const session = c.req.query('session')
    const date = c.req.query('date')
    const action = c.req.query('action')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100)
    const min_relevance = parseInt(c.req.query('min_relevance') || '1')

    let query = `SELECT * FROM research_items WHERE relevance_score >= ?`
    const params: any[] = [min_relevance]

    if (category) { query += ` AND category = ?`; params.push(category) }
    if (session) { query += ` AND scan_session = ?`; params.push(session) }
    if (date) { query += ` AND scan_session LIKE ?`; params.push(`${date}%`) }
    if (action) { query += ` AND action_recommended = ?`; params.push(action) }

    query += ` ORDER BY captured_at DESC LIMIT ?`
    params.push(limit)

    const { results } = await c.env.DB.prepare(query).bind(...params).all()

    const items = results.map((item: any) => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
    }))

    return c.json({ items, count: items.length })
  } catch (err: any) {
    console.error('Research items list error:', err)
    return c.json({ error: 'Failed to fetch research items' }, 500)
  }
})

// ─── Admin: Research Briefs ────────────────────────────────────────────────

// Store a research brief
app.post('/api/admin/research/briefs', adminAuth, async (c) => {
  try {
    const body = await c.req.json()
    const {
      scan_date, session, executive_summary, item_count = 0,
      top_signals, content_opportunities,
    } = body

    if (!scan_date || !session) {
      return c.json({ error: 'scan_date and session are required' }, 400)
    }

    const result = await c.env.DB.prepare(
      `INSERT INTO research_briefs
        (scan_date, session, executive_summary, item_count, top_signals, content_opportunities)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      scan_date,
      session,
      executive_summary || null,
      item_count,
      top_signals ? (typeof top_signals === 'string' ? top_signals : JSON.stringify(top_signals)) : null,
      content_opportunities ? (typeof content_opportunities === 'string' ? content_opportunities : JSON.stringify(content_opportunities)) : null,
    ).run()

    return c.json({ success: true, id: result.meta.last_row_id })
  } catch (err: any) {
    console.error('Research brief create error:', err)
    return c.json({ error: 'Failed to store research brief' }, 500)
  }
})

// List research briefs
app.get('/api/admin/research/briefs', adminAuth, async (c) => {
  try {
    const date = c.req.query('date')
    const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100)

    let query = `SELECT * FROM research_briefs`
    const params: any[] = []

    if (date) { query += ` WHERE scan_date = ?`; params.push(date) }

    query += ` ORDER BY created_at DESC LIMIT ?`
    params.push(limit)

    const { results } = await c.env.DB.prepare(query).bind(...params).all()

    const briefs = results.map((brief: any) => ({
      ...brief,
      top_signals: brief.top_signals ? JSON.parse(brief.top_signals) : [],
      content_opportunities: brief.content_opportunities ? JSON.parse(brief.content_opportunities) : [],
    }))

    return c.json({ briefs, count: briefs.length })
  } catch (err: any) {
    console.error('Research briefs list error:', err)
    return c.json({ error: 'Failed to fetch research briefs' }, 500)
  }
})

// Get single brief with its items
app.get('/api/admin/research/briefs/:id', adminAuth, async (c) => {
  try {
    const id = c.req.param('id')

    const brief = await c.env.DB.prepare(
      `SELECT * FROM research_briefs WHERE id = ?`
    ).bind(id).first()

    if (!brief) {
      return c.json({ error: 'Brief not found' }, 404)
    }

    // Build scan_session pattern: scan_date + '-' + session
    const scanSession = `${(brief as any).scan_date}-${(brief as any).session}`

    const { results: items } = await c.env.DB.prepare(
      `SELECT * FROM research_items WHERE scan_session = ? ORDER BY relevance_score DESC, captured_at DESC`
    ).bind(scanSession).all()

    const parsedItems = items.map((item: any) => ({
      ...item,
      tags: item.tags ? JSON.parse(item.tags) : [],
    }))

    return c.json({
      brief: {
        ...(brief as any),
        top_signals: (brief as any).top_signals ? JSON.parse((brief as any).top_signals as string) : [],
        content_opportunities: (brief as any).content_opportunities ? JSON.parse((brief as any).content_opportunities as string) : [],
      },
      items: parsedItems,
      item_count: parsedItems.length,
    })
  } catch (err: any) {
    console.error('Research brief fetch error:', err)
    return c.json({ error: 'Failed to fetch research brief' }, 500)
  }
})

// ─── Fit Test ──────────────────────────────────────────────────────────────

const GRADE_RECOMMENDATIONS: Record<string, string> = {
  A: "You're a perfect fit for AI-powered growth. Let's build your digital employee stack together.",
  B: "Strong fit. A few gaps remain but AI can accelerate your growth significantly right now.",
  C: "Moderate fit. You'd benefit from AI assistance in specific areas — let's identify the quick wins.",
  D: "Early stage fit. We'll help you build the foundation so AI can work effectively for you.",
  F: "Not yet — but that's okay. Let's talk about where to start your AI-readiness journey.",
}

app.post('/api/fit-test', async (c) => {
  try {
    const body = await c.req.json()
    const { answers, score, grade, email, name, company } = body

    if (!answers) {
      return c.json({ error: 'Answers are required' }, 400)
    }

    const answersJson = typeof answers === 'string' ? answers : JSON.stringify(answers)
    const resolvedGrade = grade || scoreToGrade(score)
    const recommendation = GRADE_RECOMMENDATIONS[resolvedGrade] || GRADE_RECOMMENDATIONS['C']

    await c.env.DB.prepare(
      `INSERT INTO fit_tests (answers, score, grade, email, name, company)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      answersJson,
      score ?? null,
      resolvedGrade ?? null,
      email || null,
      name || null,
      company || null,
    ).run()

    return c.json({
      success: true,
      grade: resolvedGrade,
      score,
      recommendation,
    })
  } catch (err: any) {
    console.error('Fit test error:', err)
    return c.json({ error: 'Failed to submit fit test' }, 500)
  }
})

function scoreToGrade(score?: number): string {
  if (score === undefined || score === null) return 'C'
  if (score >= 90) return 'A'
  if (score >= 75) return 'B'
  if (score >= 60) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

export default app
