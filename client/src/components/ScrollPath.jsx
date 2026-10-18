import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import './ScrollPath.css'

function ScrollPath() {
  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const [geometry, setGeometry] = useState({
    width: 1000,
    height: 4000,
    d: '',
  })

  const targetProgress = useMotionValue(0)
  const smoothProgress = useSpring(targetProgress, {
    stiffness: 500,
    damping: 50,
    mass: 0.08,
  })

  useEffect(() => {
    let frame = 0

    function buildPath() {
      const shell = document.querySelector('.portfolio-shell')
      const ids = ['home', 'about', 'skills', 'projects', 'contact']

      if (!shell || ids.some(id => !document.getElementById(id))) return

      const shellRect = shell.getBoundingClientRect()
      const shellTop = shellRect.top + window.scrollY
      const width = shell.clientWidth
      const height = shell.scrollHeight

      const xFactors = [0.12, 0.88, 0.12, 0.12, 0.88]

      const positions = ids.map((id, index) => {
        const section = document.getElementById(id)
        const rect = section.getBoundingClientRect()
        const top = rect.top + window.scrollY - shellTop

        return {
          x: width * xFactors[index],
          y: top + rect.height * (index === 0 ? 0.72 : 0.5),
        }
      })

      const points = [
        { x: width * xFactors[0], y: 0 },
        ...positions,
        { x: width * 0.48, y: height },
      ]

      let d = `M ${points[0].x} ${points[0].y}`

      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const b = points[i]
        const dy = b.y - a.y

        d += ` C ${a.x} ${a.y + dy * 0.45}, ${b.x} ${b.y - dy * 0.45}, ${b.x} ${b.y}`
      }

      setGeometry({ width, height, d })
    }

    function scheduleBuild() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(buildPath)
    }

    scheduleBuild()

    const observer = new ResizeObserver(scheduleBuild)
    const shell = document.querySelector('.portfolio-shell')

    if (shell) observer.observe(shell)

    window.addEventListener('resize', scheduleBuild)
    window.addEventListener('load', scheduleBuild)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', scheduleBuild)
      window.removeEventListener('load', scheduleBuild)
    }
  }, [])

  useEffect(() => {
    let frame = 0

    function updateProgress() {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        const pathElement = pathRef.current
        if (!pathElement || !geometry.d) return

        const length = pathElement.getTotalLength()
        const shell = document.querySelector('.portfolio-shell')
        if (!shell) return

        const shellTop = shell.getBoundingClientRect().top + window.scrollY
        const targetY = window.scrollY + window.innerHeight * 0.35 - shellTop

        let low = 0
        let high = length

        for (let i = 0; i < 18; i++) {
          const mid = (low + high) / 2
          const point = pathElement.getPointAtLength(mid)

          if (point.y < targetY) low = mid
          else high = mid
        }

        targetProgress.set(Math.max(0, Math.min(1, low / length)))
      })
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [geometry, targetProgress])

  return (
    <svg
      ref={svgRef}
      className="scroll-path"
      viewBox={`0 0 ${geometry.width} ${geometry.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {geometry.d && (
        <>
          <path
            className="scroll-path__track"
            d={geometry.d}
          />
          <motion.path
            ref={pathRef}
            className="scroll-path__progress"
            d={geometry.d}
            pathLength="1"
            strokeDasharray="1"
            style={{
              pathLength: smoothProgress,
            }}
          />
        </>
      )}
    </svg>
  )
}

export default ScrollPath
