
import { useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import SkillBars from './components/SkillBars'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ScrollPath from './components/ScrollPath'
import './App.css'

function App() {
  const [isLight, setIsLight] = useState(false)
  const [aboutNavbarCompact, setAboutNavbarCompact] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  function openContact() {
    setIsContactOpen(true)
  }

  function closeContact() {
    setIsContactOpen(false)
  }

  return (
    <div className={`portfolio-shell ${isLight ? 'theme-light' : ''}`}>
      <div className="portfolio-glow" aria-hidden="true" />

      <ScrollPath />

      <main>
        <Hero
          isLight={isLight}
          onThemeToggle={() => setIsLight(prev => !prev)}
          aboutNavbarCompact={aboutNavbarCompact}
          onContactOpen={openContact}
        />

        <About onExpansionChange={setAboutNavbarCompact} />
        <SkillBars />
        <Projects />

        <Contact
          isOpen={isContactOpen}
          onClose={closeContact}
        />
      </main>

      <footer className="hero-footer container">
        <p>Portfolio © {new Date().getFullYear()}</p>
        <p className="hero-footer__status">Open to opportunities</p>
        <a href="#home">Back to top</a>
      </footer>
    </div>
  )
}

export default App
