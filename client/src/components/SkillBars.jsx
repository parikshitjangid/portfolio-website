import { useEffect, useRef, useState } from 'react'
import './SkillBars.css'

const skillGroups = [
  {
    title: 'Frontend',
    skills: [
      { name: 'HTML', percentage: 80 },
      { name: 'CSS', percentage: 75 },
      { name: 'JavaScript', percentage: 65 },
      { name: 'React', percentage: 60 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', percentage: 60 },
      { name: 'Express', percentage: 55 },
      { name: 'MongoDB', percentage: 55 },
    ],
  },
  {
    title: 'Tools & Technologies',
    skills: [
      { name: 'Git', percentage: 65 },
      { name: 'GitHub', percentage: 75 },
      { name: 'Python', percentage: 75 },
      { name: 'Linux', percentage: 70 },
    ],
  },
]

function PercentageCounter({ value, active }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) {
      setCount(0)
      return
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) {
      setCount(value)
      return
    }

    let frameId
    let startTime

    const duration = 1200

    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp

      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setCount(Math.round(eased * value))

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [value, active])

  return <>{count}%</>
}

function SkillBars() {
  const sectionRef = useRef(null)
  const [activatedGroups, setActivatedGroups] = useState(() => new Set())

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const markers = section.querySelectorAll(
      '[data-skill-trigger]',
    )

    const observer = new IntersectionObserver(
      (entries) => {
        setActivatedGroups((previous) => {
          let next = previous

          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            const index = Number(
              entry.target.getAttribute('data-skill-trigger'),
            )

            if (next.has(index)) return

            if (next === previous) next = new Set(previous)

            next.add(index)
            observer.unobserve(entry.target)
          })

          return next
        })
      },
      {
        root: null,
        rootMargin: '0px 0px -20% 0px',
        threshold: 0,
      },
    )

    markers.forEach((marker) => observer.observe(marker))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="skill-bars" id="skills" ref={sectionRef}>
      <div className="skill-bars__container">
        <header className="skill-bars__heading">
          <p className="skill-bars__eyebrow">
            02 / WHAT I WORK WITH
          </p>
        </header>

        {skillGroups.map((group, groupIndex) => {
          const active = activatedGroups.has(groupIndex)

          return (
            <div className="skill-bars__group" key={group.title}>
              <h3 className="skill-bars__group-title">
                {group.title}
              </h3>

              <div className="skill-bars__list">
                {group.skills.map((skill) => (
                  <div className="skill-bar" key={skill.name}>
                    <div className="skill-bar__top">
                      <span className="skill-bar__name">
                        {skill.name}
                      </span>

                      <span className="skill-bar__percentage">
                        <PercentageCounter
                          value={skill.percentage}
                          active={active}
                        />
                      </span>
                    </div>

                    <div
                      className="skill-bar__track"
                      role="progressbar"
                      aria-label={`${skill.name} proficiency`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={active ? skill.percentage : 0}
                    >
                      <div
                        className={`skill-bar__fill ${
                          active ? 'skill-bar__fill--active' : ''
                        }`}
                        style={{
                          '--skill-value': `${skill.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="skill-bars__trigger"
                data-skill-trigger={groupIndex}
                aria-hidden="true"
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SkillBars
