/**
 * Home.tsx  -  Route component for the "/" homepage.
 *
 * This file imports and composes all homepage sections in order.
 * It is used when React Router is wired in (see ROUTER_INTEGRATION.md).
 *
 * Phase 1 sections (already live): Hero, WhatWeDo, AIEmployees, Numbers,
 *   Clients, HowWeWork, About, BlogTeaser, Contact
 * Future sections can be uncommented below as they're added.
 */

import { Hero } from '../components/Hero'
import { WhatWeDo } from '../components/WhatWeDo'
import { Numbers } from '../components/Numbers'
import { HowWeWork } from '../components/HowWeWork'
import { About } from '../components/About'
import { Contact } from '../components/Contact'

// Phase 1 components (uncomment after confirming they're deployed)
import { AIEmployees } from '../components/AIEmployees'
import { Clients } from '../components/Clients'
import { BlogTeaser } from '../components/BlogTeaser'

// TODO: Add future sections here as they're created
// import { CaseStudies } from '../components/CaseStudies'
// import { Pricing } from '../components/Pricing'
// import { Testimonials } from '../components/Testimonials'

export function Home() {
  return (
    <main>
      <Hero />
      <WhatWeDo />
      <AIEmployees />
      <Numbers />
      <Clients />
      <HowWeWork />
      <About />
      <BlogTeaser />
      <Contact />
    </main>
  )
}
