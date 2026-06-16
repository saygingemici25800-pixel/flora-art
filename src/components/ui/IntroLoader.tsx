/**
 * First-visit intro overlay. Forest screen with the wordmark + a gold line
 * filling 0→100, then a "curtain-up" clip-path reveal of the page beneath.
 * Shows once per session (sessionStorage) — not on every route change.
 */
import { useEffect, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { getLenis } from '../../hooks/useLenis'

const STORAGE_KEY = 'fa_intro_seen'
const EASE = [0.16, 1, 0.3, 1] as const

export default function IntroLoader() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== '1'
    } catch {
      return true
    }
  })

  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const lineScale = useTransform(count, [0, 100], [0, 1])

  useEffect(() => {
    if (!visible) return
    const lenis = getLenis()
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const controls = animate(count, 100, { duration: 1.5, ease: EASE })
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        /* storage unavailable */
      }
      setVisible(false)
    }, 1900)

    return () => {
      controls.stop()
      clearTimeout(timer)
      document.body.style.overflow = prevOverflow
      getLenis()?.start()
    }
  }, [visible, count])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center"
          style={{ background: 'var(--color-forest)' }}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="flex flex-col items-center px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.75rem, 9vw, 5.5rem)',
                color: 'var(--color-cream)',
                letterSpacing: '0.04em',
                lineHeight: 1,
              }}
            >
              Flora Art
            </motion.p>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-3 text-[10px] tracking-[0.42em] uppercase"
              style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
            >
              Fethiye · Florist
            </motion.span>

            <div
              className="mt-10 h-px w-[180px] overflow-hidden"
              style={{ background: 'rgba(200,169,110,0.2)' }}
            >
              <motion.div
                className="h-full w-full origin-left"
                style={{ background: 'var(--color-gold)', scaleX: lineScale }}
              />
            </div>

            <p
              className="mt-4 inline-flex items-baseline text-[11px] tracking-[0.3em]"
              style={{ color: 'rgba(255,239,179,0.5)', fontFamily: 'var(--font-body)' }}
            >
              <motion.span>{rounded}</motion.span>
              <span>%</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
