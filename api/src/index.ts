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
                 WHERE status = 'published' AND published_at <= datetime('now')`
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

    const result = await c.env.DB.prepare(
      `INSERT INTO posts (title, slug, content, excerpt, category, tags, author, hero_image, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      title,
      finalSlug,
      content,
      excerpt || null,
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
      `UPDATE posts SET status = 'published', updated_at = datetime('now')
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
      if (['title', 'slug', 'content', 'excerpt', 'category', 'tags', 'author', 'hero_image', 'status', 'published_at'].includes(key)) {
        fields.push(`${key} = ?`)
        if (key === 'tags' && typeof val !== 'string') {
          values.push(JSON.stringify(val))
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
