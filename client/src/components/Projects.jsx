import { useEffect, useRef, useState } from 'react'
import './Projects.css'

const projects = [
  {
    title: 'Free Keylogger',
    category: 'CYBERSECURITY',
    description:
      'An educational proof of concept exploring keystroke capture and communication between a Python client and a Node.js server.',
    technologies: ['Python', 'Node.js', 'Koyeb'],
    github: 'https://github.com/parikshitjangid/Free-keylogger',
  },
  {
    title: 'ViralTracks',
    category: 'WEB3 · HACKATHON',
    description:
      'A music royalty NFT platform with virality-based pricing, fractional ownership, and automated royalty distribution on Monad.',
    technologies: ['React', 'Solidity', 'Hardhat', 'Monad'],
    github: 'https://github.com/parikshitjangid/LNM_Hacks_method2',
  },
  {
    title: 'DeckWars',
    category: 'BLOCKCHAIN GAMING',
    description:
      'A blockchain card-game project featuring smart contracts for quests, seasons, player rankings, and rewards on HeLa L1.',
    technologies: ['Solidity', 'Hardhat', 'HeLa L1'],
    github: 'https://github.com/parikshitjangid/DeckWars',
  },
]

const clamp = (value) => Math.min(Math.max(value, 0), 1)

function Projects() {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = [...section.querySelectorAll('[data-project-card]')]
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    let scheduled = false

    function updateScrollEffect() {
      scheduled = false

      if (reducedMotion.matches) {
        cards.forEach((card) => {
          card.style.setProperty('--card-y', '0px')
          card.style.setProperty(
            '--card-rotation',
            `${5 + Number(card.dataset.projectIndex) * 5}deg`
          )
        })
        setActiveIndex(0)
        return
      }

      const viewportBottom = window.scrollY + window.innerHeight
      const progressValues = []

      cards.forEach((card) => {
        const index = Number(card.dataset.projectIndex)
        const marker = section.querySelector(
          `[data-project-trigger="${index}"]`
        )

        if (!marker) return

        const markerTop =
          marker.getBoundingClientRect().top + window.scrollY

        const progress = clamp(
          (viewportBottom - markerTop) / (window.innerHeight * 0.38)
        )

        const startAngle = 5 + index * 5
        const angle = startAngle + (-45 - startAngle) * progress

        card.style.setProperty('--card-y', `${-700 * progress}px`)
        card.style.setProperty('--card-rotation', `${angle}deg`)

        progressValues[index] = progress
      })

      const nextActiveIndex = progressValues.findIndex(
        (progress) => progress < 0.98
      )

      setActiveIndex(nextActiveIndex)
    }

    function requestUpdate() {
      if (!scheduled) {
        scheduled = true
        requestAnimationFrame(updateScrollEffect)
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    reducedMotion.addEventListener('change', requestUpdate)

    requestUpdate()

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      reducedMotion.removeEventListener('change', requestUpdate)
    }
  }, [])

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="projects__stage">
        <header className="projects__heading">
          <p className="projects__eyebrow">03 / SELECTED WORK</p>
        </header>

        <div className="projects__stack">
          {[...projects].reverse().map((project) => {
            const index = projects.indexOf(project)
            const isActive = activeIndex === index

            return (
              <a
                className={`project-card ${isActive ? 'project-card--active' : ''}`}
                data-project-card
                data-project-index={index}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${project.title} on GitHub`}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                key={project.title}
                style={{ zIndex: projects.length - index }}
              >
                <span className="project-card__number">
                  PROJECT {String(index + 1).padStart(2, '0')}
                </span>

                <span className="project-card__category">
                  {project.category}
                </span>

                <span className="project-card__title">
                  {project.title}
                </span>

                <span className="project-card__description">
                  {project.description}
                </span>

                <span className="project-card__technologies">
                  {project.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </span>

                <span className="project-card__link">
                  Explore on GitHub <span aria-hidden="true">↗</span>
                </span>
              </a>
            )
          })}
        </div>

        <p className="projects__scroll-hint" aria-hidden="true">
          SCROLL TO EXPLORE <span>↓</span>
        </p>
      </div>

      <div className="projects__triggers" aria-hidden="true">
        {projects.map((project, index) => (
          <span data-project-trigger={index} key={project.title} />
        ))}
      </div>
    </section>
  )
}

export default Projects
