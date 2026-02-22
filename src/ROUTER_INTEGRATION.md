# React Router Integration Guide

**Phase 3 deliverable** — Instructions for wiring the router into App.tsx after Phase 1 completes.

> ⚠️ Do NOT modify App.tsx until Phase 1 has merged and all homepage sections are confirmed working.

---

## What Was Built (Phase 3)

| File | Purpose |
|------|---------|
| `src/router.tsx` | React Router config: `/`, `/blog`, `/blog/:slug`, `/fit-test` |
| `src/pages/Home.tsx` | Homepage route — imports all existing sections |
| `src/pages/BlogList.tsx` | Blog listing page with category filters |
| `src/pages/BlogPost.tsx` | Individual post page with markdown rendering |
| `src/pages/FitTest.tsx` | Interactive AI Readiness Assessment quiz |
| `public/_redirects` | Cloudflare Pages SPA routing |

---

## Integration Steps

### 1. Verify react-router-dom is installed

```bash
cd ~/.openclaw/workspace/40k-digital
npm ls react-router-dom
# Should show: react-router-dom@7.x.x
```

If not installed:
```bash
npm install react-router-dom
```

### 2. Replace App.tsx with RouterProvider

Open `src/App.tsx` and replace the entire file with:

```tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  return <RouterProvider router={router} />
}

export default App
```

That's it. The router handles Navbar and Footer via `RootLayout`.

### 3. Update Navbar links for client-side routing

In `src/components/Navbar.tsx`, update the nav links array and add blog/fit-test links:

```tsx
import { Link } from 'react-router-dom'

// Change <a href="#services"> to <Link to="/#services">
// Add new nav items:
const links = [
  { label: 'What We Do', href: '/#services' },
  { label: 'Results', href: '/#numbers' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/#about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Fit Test', href: '/fit-test' },
]
```

Use `<Link to={link.href}>` instead of `<a href={link.href}>` for client-side links.

For the logo, change `<a href="#">` to `<Link to="/">`.

### 4. Verify _redirects is in place

The file `public/_redirects` should contain:
```
/* /index.html 200
```

This is already created by Phase 3. Confirm it exists:
```bash
cat public/_redirects
```

This tells Cloudflare Pages to serve `index.html` for all routes (SPA routing).

### 5. Verify BlogTeaser links point to /blog

In `src/components/BlogTeaser.tsx`, the "View All Posts →" button should link to `/blog`:
```tsx
<a href="/blog" ...>View All Posts →</a>
// or with router:
<Link to="/blog" ...>View All Posts →</Link>
```

Each post card's "Read More" should link to `/blog/${slug}`.

> **Note:** BlogTeaser currently has static hardcoded posts. If you want it to link to real blog posts, update the href to `/blog/${post.slug}` once you're fetching from the API.

### 6. Build and deploy

```bash
npm run build
```

Then deploy to Cloudflare Pages as usual.

---

## Route Summary

| Route | Component | Layout |
|-------|-----------|--------|
| `/` | `Home` (all sections) | Navbar + Footer |
| `/blog` | `BlogList` | Navbar + Footer |
| `/blog/:slug` | `BlogPost` | Navbar + Footer |
| `/fit-test` | `FitTest` | Minimal (no nav/footer) |

---

## API Endpoints Used

| Endpoint | Used By |
|----------|---------|
| `GET /api/posts` | BlogList, BlogPost (related posts) |
| `GET /api/posts/:slug` | BlogPost |
| `POST /api/fit-test` | FitTest (submit results + email) |

---

## Notes

- `marked` npm package is used for markdown → HTML rendering in BlogPost
- Both `react-router-dom` and `marked` were installed by Phase 3 (`npm install react-router-dom marked`)
- FitTest uses a minimal layout (no nav/footer) for immersive quiz UX
- Confetti fires on Grade A results only
- Quiz results are submitted to the API on completion; email is optional
