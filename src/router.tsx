/**
 * router.tsx  -  React Router configuration for 40K Digital.
 *
 * Routes:
 *   /             → Homepage (all sections)
 *   /blog         → Blog listing page
 *   /blog/:slug   → Individual blog post
 *   /fit-test     → AI Growth Readiness Assessment quiz
 *
 * See ROUTER_INTEGRATION.md for full wiring instructions.
 */

import { createBrowserRouter, Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { BlogList } from './pages/BlogList'
import { BlogPost } from './pages/BlogPost'
import { FitTest } from './pages/FitTest'

/** Layout wrapper: Navbar + page content + Footer */
function RootLayout() {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

/** Fit Test has no nav/footer for immersive focus */
function MinimalLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/blog', element: <BlogList /> },
      { path: '/blog/:slug', element: <BlogPost /> },
    ],
  },
  {
    element: <MinimalLayout />,
    children: [
      { path: '/fit-test', element: <FitTest /> },
    ],
  },
])
