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

import { useMemo } from 'react'
import { Hero } from '../components/Hero'
import { WhatWeDo } from '../components/WhatWeDo'
import { Numbers } from '../components/Numbers'
import { HowWeWork } from '../components/HowWeWork'
import { About } from '../components/About'
import { Contact } from '../components/Contact'
import { AIEmployees } from '../components/AIEmployees'
import { Clients } from '../components/Clients'
import { BlogTeaser } from '../components/BlogTeaser'
import { useJsonLd } from '../hooks/useJsonLd'

// TODO: Add future sections here as they're created
// import { CaseStudies } from '../components/CaseStudies'
// import { Pricing } from '../components/Pricing'
// import { Testimonials } from '../components/Testimonials'

const BASE = 'https://40kdigital.com'

export function Home() {
  const schema = useMemo(() => [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${BASE}/#service`,
      'name': '40K Digital',
      'url': BASE,
      'description': 'AI-native growth agency combining 20+ years of performance marketing expertise with custom-built autonomous AI systems to scale brands at speeds that weren\'t possible before.',
      'priceRange': '$$$$',
      'areaServed': {
        '@type': 'AdministrativeArea',
        'name': 'Worldwide',
      },
      'provider': { '@id': `${BASE}/#organization` },
      'serviceType': 'AI-Native Growth Agency',
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'AI Growth Services',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Growth Strategy',
              'description': 'Performance marketing powered by AI. Deep media buying expertise combined with machine-learning attribution to find your most profitable growth channels.',
            },
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Autonomous AI Systems',
              'description': 'Custom-built agents that research, create, verify, and publish content at scale. Multi-model orchestration that turns weeks of work into hours.',
            },
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Product Engineering',
              'description': 'Full-stack products from concept to production built on edge infrastructure and deployed in days, not months.',
            },
          },
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': '40K Digital Services',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'item': {
            '@type': 'Service',
            'name': 'Growth Strategy',
            'url': `${BASE}/#services`,
            'description': 'AI-powered performance marketing and media buying with machine-learning attribution.',
            'provider': { '@id': `${BASE}/#organization` },
          },
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'item': {
            '@type': 'Service',
            'name': 'Autonomous AI Systems',
            'url': `${BASE}/#services`,
            'description': 'Custom-built AI agents for content, research, and marketing automation at scale.',
            'provider': { '@id': `${BASE}/#organization` },
          },
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'item': {
            '@type': 'Service',
            'name': 'Product Engineering',
            'url': `${BASE}/#services`,
            'description': 'Full-stack product development on edge infrastructure, strategy through deployment.',
            'provider': { '@id': `${BASE}/#organization` },
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': BASE },
      ],
    },
  ], [])

  useJsonLd(schema)

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
