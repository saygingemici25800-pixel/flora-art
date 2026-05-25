import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getLenis } from '../../hooks/useLenis'

const EASE = [0.16, 1, 0.3, 1] as const

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = (scroll: number) => setVisible(scroll > 400)

    const lenis = getLenis()
    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => check(scroll)
      lenis.on('scroll', onScroll)
      check(lenis.scroll ?? 0)
      return () => {
        lenis.off('scroll', onScroll)
      }
    }

    const onWindowScroll = () => check(window.scrollY)
    onWindowScroll()
    window.addEventListener('scroll', onWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', onWindowScroll)
  }, [])

  function scrollTop() {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          aria-label="Back to top"
          onClick={scrollTop}
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 10 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed right-6 bottom-[92px] z-[80] grid place-items-center w-11 h-11 rounded-full shadow-lg"
          style={{
            background: 'var(--color-forest)',
            color: 'var(--color-gold)',
            border: '1px solid rgba(200,169,110,0.4)',
          }}
        >
          <ArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function ArrowUp() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  )
}
