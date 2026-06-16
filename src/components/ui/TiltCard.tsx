/**
 * 3D tilt-on-hover wrapper (Aceternity-style technique, framework-free).
 *
 * Pointer position over the card maps to rotateX / rotateY via spring-smoothed
 * motion values; a perspective on the parent + transform-style: preserve-3d on
 * the tilting element let inner layers lift with their own translateZ. Resets
 * softly on pointer-leave. Disabled on coarse / non-hover pointers (touch).
 *
 * IMPORTANT: the tilting element must NOT set overflow/opacity/filter — those
 * force `transform-style: flat`, which would cancel the children's translateZ.
 * Clip inner layers individually instead.
 */
import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/** True only on devices with a precise, hover-capable pointer (desktop). */
function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setFine(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return fine
}

interface TiltCardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  /** Maximum tilt in degrees on each axis. */
  maxTilt?: number
}

export default function TiltCard({ children, className, style, maxTilt = 11 }: TiltCardProps) {
  const fine = useFinePointer()

  // Pointer position within the card, normalised to -0.5 … 0.5.
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 150, damping: 18, mass: 0.4 }
  const sx = useSpring(px, spring)
  const sy = useSpring(py, spring)

  const rotateX = useTransform(sy, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-maxTilt, maxTilt])
  // Shadow drifts opposite the tilt for depth, with a soft resting offset.
  const boxShadow = useTransform([sx, sy], ([x, y]: number[]) => {
    const ox = (-x * 26).toFixed(1)
    const oy = (-y * 26 + 18).toFixed(1)
    return `${ox}px ${oy}px 50px -18px rgba(1,62,55,0.45)`
  })

  if (!fine) {
    // Touch / coarse pointer: render the card flat, no tilt handlers.
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          px.set((e.clientX - rect.left) / rect.width - 0.5)
          py.set((e.clientY - rect.top) / rect.height - 0.5)
        }}
        onPointerLeave={() => {
          px.set(0)
          py.set(0)
        }}
        className={className}
        style={{
          ...style,
          rotateX,
          rotateY,
          boxShadow,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
