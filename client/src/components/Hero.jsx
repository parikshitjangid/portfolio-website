
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { motion } from 'framer-motion'
import './Hero.css'

function Hero({
    isLight,
    onThemeToggle,
    aboutNavbarCompact,
    onContactOpen,
}) {
    const [iconLight, setIconLight] = useState(false)
    const [activeSection, setActiveSection] = useState('home')
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth)
    const [isCvDialogOpen, setIsCvDialogOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth)

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const links = document.querySelectorAll('.navbar__links a')
        const sections = [...links]
            .map(link => document.querySelector(link.getAttribute('href')))
            .filter(Boolean)

        if (!sections.length) return

        const observer = new IntersectionObserver(
            entries => {
                const visible = entries
                    .filter(entry => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            Math.abs(a.boundingClientRect.top - window.innerHeight * 0.3) -
                            Math.abs(b.boundingClientRect.top - window.innerHeight * 0.3)
                    )

                if (visible.length) {
                    setActiveSection(visible[0].target.id)
                }
            },
            {
                rootMargin: '-20% 0px -65% 0px',
                threshold: 0,
            }
        )

        sections.forEach(section => observer.observe(section))

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isMobileMenuOpen) return

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                setIsMobileMenuOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isMobileMenuOpen])

    const handleThemeToggle = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.round(rect.left + rect.width / 2)
        const y = Math.round(rect.top + rect.height / 2)

        document.documentElement.style.setProperty('--wave-x', `${x}px`)
        document.documentElement.style.setProperty('--wave-y', `${y}px`)

        setIconLight(prev => !prev)

        if (!document.startViewTransition) {
            onThemeToggle()
            return
        }

        document.startViewTransition(() => {
            flushSync(() => onThemeToggle())
        })
    }

    const isCompact =
        activeSection === 'about'
            ? aboutNavbarCompact
            : activeSection !== 'home'

    return (
        <>
            <motion.header
                className={`navbar${isCompact ? ' navbar--compact' : ''}`}
                animate={{
                    width:
                        !isCompact
                            ? viewportWidth
                            : Math.min(1120, viewportWidth - 32),
                    top: !isCompact ? 0 : 14,
                    borderRadius: !isCompact ? 0 : 22,
                    backgroundColor: isLight
                        ? !isCompact
                            ? 'rgba(243, 243, 243, 0.22)'
                            : 'rgba(243, 243, 243, 0.78)'
                        : !isCompact
                            ? 'rgba(27, 27, 27, 0.18)'
                            : 'rgba(27, 27, 27, 0.78)',
                    borderColor: isLight
                        ? 'rgba(27, 27, 27, 0.10)'
                        : 'rgba(243, 243, 243, 0.12)',
                    backdropFilter: !isCompact
                        ? 'blur(10px)'
                        : 'blur(16px)',
                    boxShadow: !isCompact
                        ? '0px 12px 40px rgba(0, 0, 0, 0)'
                        : isLight
                            ? '0px 12px 40px rgba(27, 27, 27, 0.08)'
                            : '0px 12px 40px rgba(0, 0, 0, 0.16)',
                }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    mass: 0.9,
                    boxShadow: {
                        type: 'tween',
                        duration: 0.4,
                        ease: 'easeInOut',
                    },
                }}
            >
                <div className="navbar__inner container">
                    <button
                        className={`navbar__menu-toggle${isMobileMenuOpen ? ' is-open' : ''}`}
                        type="button"
                        aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-navigation"
                        onClick={() => setIsMobileMenuOpen(previous => !previous)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>

                    <a className="navbar__brand" href="#home" aria-label="Go to home">
                        <svg className="navbar__logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" aria-hidden="true">
                            <path fill="currentColor" fillRule="evenodd" d="
                            M140 88 L180 68 L258 112 L258 160 L220 182 L183 160 L183 235 L140 210 Z
                            M183 120 L218 98 L218 140 L183 160 Z"/>
                        </svg>
                    </a>

                    <nav className="navbar__links" aria-label="Main navigation">
                        <a
                            href="#home"
                            className={activeSection === 'home' ? 'is-active' : ''}
                            aria-current={activeSection === 'home' ? 'location' : undefined}
                        >
                            Home
                        </a>
                        <a
                            href="#about"
                            className={activeSection === 'about' ? 'is-active' : ''}
                            aria-current={activeSection === 'about' ? 'location' : undefined}
                        >
                            About
                        </a>
                        <a
                            href="#projects"
                            className={activeSection === 'projects' ? 'is-active' : ''}
                            aria-current={activeSection === 'projects' ? 'location' : undefined}
                        >
                            Projects
                        </a>
                        <a
                            href="#contact"
                            className={activeSection === 'contact' ? 'is-active' : ''}
                            aria-current={activeSection === 'contact' ? 'location' : undefined}
                        >
                            Contact
                        </a>
                    </nav>

                    <div className="navbar__actions">
                        <button
                            className="toggle"
                            type="button"
                            aria-pressed={iconLight}
                            aria-label={iconLight ? 'Switch to night mode' : 'Switch to day mode'}
                            onClick={handleThemeToggle}
                        >
                            <svg viewBox="0 0 100 100" aria-hidden="true">
                                <defs>
                                    <mask id="crescent" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140">
                                        <rect x="-20" y="-20" width="140" height="140" fill="#fff" />
                                        <circle className="cut" cx="50" cy="50" r="17" fill="#000" />
                                    </mask>
                                </defs>
                                <g className="rays">
                                    {Array.from({ length: 8 }, (_, i) => (
                                        <line
                                            key={i}
                                            className="ray"
                                            style={{ '--i': i }}
                                            x1="50"
                                            y1="12"
                                            x2="50"
                                            y2="21"
                                        />
                                    ))}
                                </g>
                                <g className="body-group">
                                    <circle cx="50" cy="50" r="18" fill="#e9204f" mask="url(#crescent)" />
                                </g>
                            </svg>
                        </button>

                        <button
                            className="navbar__contact"
                            type="button"
                            onClick={onContactOpen}
                        >
                            Let's Connect
                        </button>
                    </div>
                </div>
            </motion.header>

            {isMobileMenuOpen && (
                <div
                    className="mobile-menu"
                    onMouseDown={event => {
                        if (event.target === event.currentTarget) {
                            setIsMobileMenuOpen(false)
                        }
                    }}
                >
                    <nav
                        id="mobile-navigation"
                        className="mobile-menu__nav"
                        aria-label="Mobile navigation"
                    >
                        {[
                            { label: 'Home', href: '#home', id: 'home' },
                            { label: 'About', href: '#about', id: 'about' },
                            { label: 'Projects', href: '#projects', id: 'projects' },
                            { label: 'Contact', href: '#contact', id: 'contact' },
                        ].map(item => (
                            <a
                                key={item.id}
                                className={`mobile-menu__link${activeSection === item.id ? ' is-active' : ''}`}
                                href={item.href}
                                aria-current={activeSection === item.id ? 'location' : undefined}
                                onClick={event => {
                                    setIsMobileMenuOpen(false)

                                    if (item.id === 'contact') {
                                        event.preventDefault()
                                        onContactOpen()
                                    }
                                }}
                            >
                                <span>{item.label}</span>
                                <span className="mobile-menu__arrow" aria-hidden="true">↗</span>
                            </a>
                        ))}
                    </nav>
                </div>
            )}

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
                        <button
                            className="hero__button hero__button--primary"
                            type="button"
                            onClick={onContactOpen}
                        >
                            Get in touch
                        </button>

                        <a className="hero__button hero__button--secondary" href="#projects">
                            See my work
                        </a>

                        <button
                            className="hero__button hero__button--secondary"
                            type="button"
                            onClick={() => setIsCvDialogOpen(true)}
                        >
                            Download CV
                        </button>
                    </div>
                </div>
            </section>

            {isCvDialogOpen && (
                <div
                    className="cv-dialog__backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsCvDialogOpen(false)
                        }
                    }}
                >
                    <section
                        className="cv-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cv-dialog-title"
                    >
                        <button
                            className="cv-dialog__close"
                            type="button"
                            aria-label="Close download options"
                            onClick={() => setIsCvDialogOpen(false)}
                        >
                            ×
                        </button>

                        <h2 id="cv-dialog-title">Choose your format</h2>
                        <p className="cv-dialog__description">
                            Download my resume in your preferred format.
                        </p>

                        <a
                            className="cv-dialog__option"
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cv/pdf`}
                            onClick={() => setIsCvDialogOpen(false)}
                        >
                            <span>
                                <strong>PDF document</strong>
                                <small>Portable document · .pdf</small>
                            </span>
                        </a>

                        <a
                            className="cv-dialog__option"
                            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cv/docx`}
                            onClick={() => setIsCvDialogOpen(false)}
                        >
                            <span>
                                <strong>Word document</strong>
                                <small>Microsoft Word · .docx</small>
                            </span>
                        </a>
                    </section>
                </div>
            )}
        </>
    )
}

export default Hero
