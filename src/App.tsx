import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { WhatWeDo } from './components/WhatWeDo'
import { AIEmployees } from './components/AIEmployees'
import { Numbers } from './components/Numbers'
import { Clients } from './components/Clients'
import { HowWeWork } from './components/HowWeWork'
import { About } from './components/About'
import { BlogTeaser } from './components/BlogTeaser'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  )
}

export default App
