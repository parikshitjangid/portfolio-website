
import { useState } from 'react'
import { flushSync } from 'react-dom'
import './Hero.css'

function Hero() {
    const [isLight, setIsLight] = useState(false)

    const handleThemeToggle = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.round(rect.left + rect.width  / 2)
        const y = Math.round(rect.top  + rect.height / 2)
        document.documentElement.style.setProperty('--wave-x', `${x}px`)
        document.documentElement.style.setProperty('--wave-y', `${y}px`)

        if (!document.startViewTransition) {
            setIsLight(prev => !prev)
            return
        }

        document.startViewTransition(() => {
            flushSync(() => setIsLight(prev => !prev))
        })
    }

    return (
        <div className={`portfolio-shell ${isLight ? 'theme-light' : ''}`}>
            <header className="navbar container">
                <a className="navbar__brand" href="#home" aria-label="Go to home">
                    <svg className="navbar__logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" aria-hidden="true">
                        <path fill="currentColor" fillRule="evenodd" d="
                            M140 88 L180 68 L258 112 L258 160 L220 182 L183 160 L183 235 L140 210 Z
                            M183 120 L218 98 L218 140 L183 160 Z"/>
                    </svg>
                </a>

                <nav className="navbar__links" aria-label="Main navigation">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#projects">Projects</a>
                    <a href="#services">Services</a>
                </nav>

                <div className="navbar__actions">
                    <button
                        className="toggle"
                        type="button"
                        aria-pressed={isLight}
                        aria-label={isLight ? 'Switch to night mode' : 'Switch to day mode'}
                        onClick={handleThemeToggle}
                    >
                        <svg viewBox="0 0 100 100" aria-hidden="true">
                            <defs>
                                <mask id="crescent" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140">
                                    <rect x="-20" y="-20" width="140" height="140" fill="#fff"/>
                                    <circle className="cut" cx="50" cy="50" r="17" fill="#000"/>
                                </mask>
                            </defs>
                            <g className="rays">
                                <line className="ray" style={{'--i':0}} x1="50" y1="12" x2="50" y2="21"/>
                                <line className="ray" style={{'--i':1}} x1="50" y1="12" x2="50" y2="21"/>
                                <line className="ray" style={{'--i':2}} x1="50" y1="12" x2="50" y2="21"/>
                                <line className="ray" style={{'--i':3}} x1="50" y1="12" x2="50" y2="21"/>
                                <line className="ray" style={{'--i':4}} x1="50" y1="12" x2="50" y2="21"/>
                                <line className="ray" style={{'--i':5}} x1="50" y1="12" x2="50" y2="21"/>
                                <line className="ray" style={{'--i':6}} x1="50" y1="12" x2="50" y2="21"/>
                                <line className="ray" style={{'--i':7}} x1="50" y1="12" x2="50" y2="21"/>
                            </g>
                            <g className="body-group">
                                <circle cx="50" cy="50" r="18" fill="#e9204f" mask="url(#crescent)"/>
                            </g>
                        </svg>
                    </button>

                    <a className="navbar__contact" href="#contact">
                        Let's Connect
                    </a>
                </div>
            </header>

            <main>
                <section className="hero" id="home">
                    <div className="hero__content">
                        <h1 className="hero__title">
                            Building ideas
                            <br />
                            into <span>lasting</span>
                            <br />
                            experiences.
                        </h1>

                        <p className="hero__description">
                            I create thoughtful digital experiences by combining
                            clean code, creative thinking, and a curiosity for how
                            technology works.
                        </p>

                        <div className="hero__actions">
                            <a className="hero__button hero__button--primary" href="#contact">
                                Get in touch
                            </a>
                            <a className="hero__button hero__button--secondary" href="#projects">
                                See my work
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="hero-footer container">
                <p>Portfolio © {new Date().getFullYear()}</p>

                <p className="hero-footer__status">
                    Open to opportunities
                </p>

                <a href="#home">Back to top</a>
            </footer>
        </div>
    )
}

export default Hero
