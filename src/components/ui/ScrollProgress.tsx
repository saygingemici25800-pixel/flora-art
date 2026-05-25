import { useEffect, useState } from 'react'
import { getLenis } from '../../hooks/useLenis'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calc = (scroll: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(100, Math.max(0, (scroll / max) * 100)))
    }

    const lenis = getLenis()
    if (lenis) {
      const onScroll = ({ scroll }: { scroll: number }) => calc(scroll)
      lenis.on('scroll', onScroll)
      calc(lenis.scroll ?? 0)
      return () => {
        lenis.off('scroll', onScroll)
      }
    }

    const onWindowScroll = () => calc(window.scrollY)
    onWindowScroll()
    window.addEventListener('scroll', onWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', onWindowScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-[200]"
      style={{ height: '3px', background: 'transparent' }}
    >
      <div
        className="h-full origin-left transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: 'var(--color-gold)',
        }}
      />
    </div>
  )
}
