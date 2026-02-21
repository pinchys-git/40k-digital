import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { WhatWeDo } from './components/WhatWeDo'
import { Numbers } from './components/Numbers'
import { HowWeWork } from './components/HowWeWork'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <Numbers />
        <HowWeWork />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
