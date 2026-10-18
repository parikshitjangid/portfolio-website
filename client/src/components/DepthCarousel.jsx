import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './DepthCarousel.css'

function DepthCarousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const activeRef = useRef(0)
  const dragRef = useRef(null)
  const lockedRef = useRef(false)

  const getPosition = useCallback((index, active) => {
    const total = items.length
    let offset = index - active

    if (offset > total / 2) offset -= total
    if (offset < -total / 2) offset += total

    const front = offset === 0
    const side = Math.abs(offset) === 1

    return {
      xPercent: front ? 0 : offset < 0 ? -72 : 72,
      x: 0,
      y: 0,
      z: front ? 0 : side ? -150 : -280,
      rotateY: front ? 0 : offset < 0 ? 24 : -24,
      rotation: 0,
      scale: front ? 1 : side ? 0.82 : 0.65,
      opacity: front ? 1 : side ? 0.65 : 0,
      filter: front ? 'blur(0px)' : 'blur(1px)',
      zIndex: front ? 3 : side ? 2 : 1,
      visibility: front || side ? 'visible' : 'hidden',
    }
  }, [items.length])

  useLayoutEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    cards.forEach((card, index) => {
      gsap.set(card, getPosition(index, 0))
    })

    return () => {
      cards.forEach(card => gsap.killTweensOf(card))
    }
  }, [getPosition])

  const animateTo = useCallback((nextIndex, thrownCard = null, direction = 1) => {
    if (lockedRef.current || !items.length) return

    const total = items.length
    const next = (nextIndex + total) % total
    const cards = cardRefs.current.filter(Boolean)

    if (next === activeRef.current && !thrownCard) return

    lockedRef.current = true
    setIsAnimating(true)

    const timeline = gsap.timeline({
      onComplete: () => {
        lockedRef.current = false
        setIsAnimating(false)
      },
    })

    cards.forEach((card, index) => {
      gsap.killTweensOf(card)

      const target = getPosition(index, next)

      if (card === thrownCard) {
        const landingX = target.xPercent < 0 ? -1 : 1

        timeline.to(
          card,
          {
            x: direction * window.innerWidth * 0.8,
            y: -100,
            rotation: direction * 24,
            rotateY: direction * -18,
            scale: 0.88,
            opacity: 0,
            duration: 0.34,
            ease: 'power2.in',
          },
          0,
        )

        timeline.call(() => {
          gsap.set(card, {
            ...target,
            opacity: 0,
            scale: 0.68,
            z: -260,
            x: 0,
            y: 0,
            rotation: 0,
            rotateY: landingX * 32,
            visibility: 'visible',
          })
        }, null, 0.34)

        timeline.to(
          card,
          {
            opacity: target.opacity,
            scale: target.scale,
            z: target.z,
            rotateY: target.rotateY,
            xPercent: target.xPercent,
            duration: 0.42,
            ease: 'power3.out',
          },
          0.34,
        )
      } else {
        timeline.to(
          card,
          {
            ...target,
            duration: 0.68,
            ease: 'power3.inOut',
            overwrite: true,
          },
          0,
        )
      }
    })

    activeRef.current = next
    setActiveIndex(next)
  }, [getPosition, items.length])

  const goTo = (index) => animateTo(index)

  const handlePointerDown = (event) => {
    if (lockedRef.current) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    const card = event.target.closest('.depth-carousel__card')
    const activeCard = cardRefs.current[activeRef.current]

    if (!card || card !== activeCard) return

    const now = performance.now()

    dragRef.current = {
      card: activeCard,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: now,
      velocity: 0,
      dragging: false,
    }

    event.currentTarget.setPointerCapture(event.pointerId)

    gsap.killTweensOf(activeCard)
    gsap.to(activeCard, {
      z: 35,
      scale: 1.035,
      duration: 0.18,
      ease: 'power2.out',
      overwrite: true,
    })
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    const now = performance.now()
    const elapsed = Math.max(now - drag.lastTime, 1)

    drag.velocity = (event.clientX - drag.lastX) / elapsed
    drag.lastX = event.clientX
    drag.lastTime = now

    if (Math.abs(dx) > 5 && Math.abs(dx) > Math.abs(dy)) {
      drag.dragging = true
    }

    if (!drag.dragging) return

    gsap.set(drag.card, {
      x: dx,
      y: Math.min(22, Math.abs(dx) * 0.035),
      rotation: gsap.utils.clamp(-12, 12, dx * 0.035),
      rotateY: gsap.utils.clamp(-14, 14, -dx * 0.045),
      z: 35,
      scale: 1.035,
    })
  }

  const finishDrag = (event) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null

    const dx = event.clientX - drag.startX
    const distanceThreshold = Math.min(110, window.innerWidth * 0.18)
    const shouldThrow =
      drag.dragging &&
      (Math.abs(dx) > distanceThreshold || Math.abs(drag.velocity) > 0.65)

    if (shouldThrow) {
      const direction = dx < 0 ? -1 : 1
      animateTo(activeRef.current + (direction < 0 ? 1 : -1), drag.card, direction)
      return
    }

    gsap.to(drag.card, {
      ...getPosition(activeRef.current, activeRef.current),
      duration: 0.42,
      ease: 'elastic.out(1, 0.72)',
      overwrite: true,
    })
  }

  const cancelDrag = () => {
    const drag = dragRef.current
    if (!drag) return

    dragRef.current = null

    gsap.to(drag.card, {
      ...getPosition(activeRef.current, activeRef.current),
      duration: 0.35,
      ease: 'power3.out',
      overwrite: true,
    })
  }

  if (!items.length) return null

  return (
    <div className="depth-carousel">
      <div
        className="depth-carousel__stage"
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={cancelDrag}
        aria-label="Skills categories. Drag a card to rotate the deck."
      >
        {items.map((item, index) => (
          <article
            className="depth-carousel__card"
            key={item.title}
            ref={element => {
              cardRefs.current[index] = element
            }}
            aria-hidden={index !== activeIndex}
            inert={index !== activeIndex}
          >
            <div className="depth-carousel__card-content">
              <h3>{item.title}</h3>
              <p className="depth-carousel__description">{item.description}</p>
              <ul className="depth-carousel__technologies">
                {item.technologies.map(technology => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="depth-carousel__controls">
        <button
          className="depth-carousel__arrow"
          type="button"
          onClick={() => goTo(activeIndex - 1)}
          aria-label="Previous skill category"
          disabled={isAnimating}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
          </svg>
        </button>

        <div className="depth-carousel__indicators">
          {items.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={`depth-carousel__indicator ${
                index === activeIndex ? 'depth-carousel__indicator--active' : ''
              }`}
              onClick={() => goTo(index)}
              aria-label={`Show ${item.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>

        <button
          className="depth-carousel__arrow"
          type="button"
          onClick={() => goTo(activeIndex + 1)}
          aria-label="Next skill category"
          disabled={isAnimating}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m0 0-6-6m6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default DepthCarousel
