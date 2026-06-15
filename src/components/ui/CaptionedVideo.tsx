/**
 * Captioned speaking-video player for the Vahap interview clips.
 *
 * One place, reused by the header trio, the About gallery, Shop and Contact.
 *
 * - Poster layer (lightweight .webp) renders underneath at all times, so the
 *   box is never dark while the video loads. The video fades in over it once
 *   it actually starts playing.
 * - Lazy + cheap: preload="none" plus an IntersectionObserver — the video only
 *   downloads/plays while it is on screen, and pauses when scrolled away.
 * - Karaoke caption: per-clip `.words.json` (word-level timestamps) lights up
 *   each word in gold as it is spoken, rendered as plain DOM (rAF → innerHTML)
 *   so it works in every browser, unlike native ::cue.
 * - Seek bar with a draggable handle: click, drag, or touch to scrub.
 * - Sound toggle styled as a half-moon green gradient ring.
 * - Click the video to open a large lightbox (sound on); closing restores the
 *   exact scroll position.
 *
 * Sound can be controlled (gallery enforces one-at-a-time) or internal.
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getLenis } from '../../hooks/useLenis'

const EASE = [0.16, 1, 0.3, 1] as const

interface Word { w: string; s: number; e: number }
interface Cue { s: number; e: number; words: Word[] }

interface Props {
  src: string
  poster: string
  /** URL of the `.words.json` karaoke data. */
  wordsSrc: string
  /** Controlled sound state. Omit to let the component manage its own. */
  soundOn?: boolean
  /** Called when the user taps the sound button (controlled mode). */
  onToggleSound?: () => void
  className?: string
  /** Clicking the video opens a lightbox. Disabled for the lightbox's own player. */
  enableLightbox?: boolean
  /** Skip the IntersectionObserver and just play (used inside the lightbox). */
  alwaysPlay?: boolean
  /** Initial internal sound state (the lightbox opens with sound on). */
  defaultSound?: boolean
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;',
  )
}

export default function CaptionedVideo({
  src,
  poster,
  wordsSrc,
  soundOn,
  onToggleSound,
  className = '',
  enableLightbox = true,
  alwaysPlay = false,
  defaultSound = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const capRef = useRef<HTMLDivElement | null>(null)
  const fillRef = useRef<HTMLDivElement | null>(null)
  const seekRef = useRef<HTMLDivElement | null>(null)
  const cuesRef = useRef<Cue[]>([])
  const draggingRef = useRef(false)
  const inViewRef = useRef(false)
  const [loaded, setLoaded] = useState(false)
  const [internalSound, setInternalSound] = useState(defaultSound)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const isControlled = soundOn !== undefined
  const sound = isControlled ? soundOn : internalSound

  // Load karaoke word data.
  useEffect(() => {
    let alive = true
    fetch(wordsSrc)
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Cue[]) => {
        if (alive) cuesRef.current = Array.isArray(d) ? d : []
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [wordsSrc])

  // Play only while on screen; pause when scrolled away. preload="none" means
  // nothing downloads until the first play() call.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (alwaysPlay) {
      v.play().catch(() => {})
      return
    }
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inViewRef.current = e.isIntersecting
          if (e.isIntersecting) v.play().catch(() => {})
          else v.pause()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [alwaysPlay])

  // Per-frame loop: karaoke word-follow highlight + seek-bar progress fill.
  useEffect(() => {
    let raf = 0
    let lastKey = ''
    const tick = () => {
      const v = videoRef.current
      if (v) {
        const t = v.currentTime
        const cap = capRef.current
        if (cap) {
          const cue = cuesRef.current.find((c) => t >= c.s - 0.15 && t <= c.e + 0.25)
          if (!cue) {
            if (lastKey !== '') {
              cap.innerHTML = ''
              lastKey = ''
            }
          } else {
            const key = cue.s + ':' + cue.words.map((w) => (t >= w.e ? 2 : t >= w.s ? 1 : 0)).join('')
            if (key !== lastKey) {
              lastKey = key
              cap.innerHTML = cue.words
                .map((w) => {
                  const cls = t >= w.e ? 'done' : t >= w.s ? 'active' : 'next'
                  return `<span class="w ${cls}">${escapeHtml(w.w)}</span>`
                })
                .join(' ')
            }
          }
        }
        const fill = fillRef.current
        if (fill && v.duration && isFinite(v.duration)) {
          fill.style.width = `${Math.min(100, (t / v.duration) * 100)}%`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Keep the element's muted flag in sync with the sound state.
  useEffect(() => {
    const v = videoRef.current
    if (v) v.muted = !sound
  }, [sound])

  // Lightbox: lock scroll (freeze Lenis) and restore the exact position on close.
  useEffect(() => {
    if (!lightboxOpen) return
    const lenis = getLenis()
    const y = window.scrollY
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    videoRef.current?.pause()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      lenis?.start()
      window.scrollTo(0, y)
      if (inViewRef.current && !alwaysPlay) videoRef.current?.play().catch(() => {})
    }
  }, [lightboxOpen, alwaysPlay])

  function toggleSound(e: React.MouseEvent) {
    e.stopPropagation()
    if (onToggleSound) onToggleSound()
    else setInternalSound((s) => !s)
  }

  // Seek by mapping a pointer x-position onto the bar width.
  function seekToClientX(clientX: number) {
    const v = videoRef.current
    const el = seekRef.current
    if (!v || !el || !v.duration || !isFinite(v.duration)) return
    const rect = el.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    v.currentTime = ratio * v.duration
  }
  function onSeekDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    draggingRef.current = true
    try {
      seekRef.current?.setPointerCapture(e.pointerId)
    } catch {
      /* capture unsupported */
    }
    seekToClientX(e.clientX)
  }
  function onSeekMove(e: React.PointerEvent<HTMLDivElement>) {
    if (draggingRef.current) seekToClientX(e.clientX)
  }
  function onSeekUp(e: React.PointerEvent<HTMLDivElement>) {
    draggingRef.current = false
    try {
      seekRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      /* capture unsupported */
    }
  }

  const surface = (
    <div
      ref={containerRef}
      className={`fa-cvideo relative overflow-hidden ${enableLightbox ? 'cursor-pointer' : ''} ${className}`}
      style={{ aspectRatio: '16 / 9', background: 'var(--color-forest)', border: '1px solid rgba(200,169,110,0.2)' }}
      onClick={enableLightbox ? () => setLightboxOpen(true) : undefined}
    >
      {/* always-visible poster underneath */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="fa-scrim" />
      <div ref={capRef} className="fa-cap" aria-hidden="true" />

      <button
        type="button"
        onClick={toggleSound}
        className="fa-soundbtn"
        aria-label={sound ? 'Sesi kapat' : 'Sesi aç'}
        aria-pressed={sound}
        data-on={sound}
      >
        <span className="fa-ring" aria-hidden="true" />
        <span className="fa-ring-icon">{sound ? <UnmuteGlyph /> : <MuteGlyph />}</span>
      </button>

      <div
        ref={seekRef}
        className="fa-seek"
        role="slider"
        tabIndex={-1}
        aria-label="Video ilerleme çubuğu"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onSeekDown}
        onPointerMove={onSeekMove}
        onPointerUp={onSeekUp}
        onPointerCancel={onSeekUp}
      >
        <div className="fa-seek-track">
          <div ref={fillRef} className="fa-seek-fill">
            <span className="fa-seek-handle" />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {surface}
      {enableLightbox &&
        createPortal(
          <AnimatePresence>
            {lightboxOpen && (
              <motion.div
                className="fixed inset-0 z-[300] grid place-items-center p-4"
                style={{ background: 'rgba(6,12,6,0.86)', backdropFilter: 'blur(6px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                onClick={() => setLightboxOpen(false)}
              >
                <motion.div
                  className="relative w-full"
                  style={{ width: 'min(1180px, 74vw)', maxWidth: '94vw' }}
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(false)}
                    aria-label="Kapat"
                    className="absolute -top-11 right-0 grid h-9 w-9 place-items-center rounded-full"
                    style={{ border: '1px solid rgba(200,169,110,0.5)', color: 'var(--color-cream)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                      <line x1="6" y1="6" x2="18" y2="18" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                    </svg>
                  </button>
                  <CaptionedVideo
                    src={src}
                    poster={poster}
                    wordsSrc={wordsSrc}
                    enableLightbox={false}
                    alwaysPlay
                    defaultSound
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}

function MuteGlyph() {
  return (
    <svg width="44%" height="44%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9 H9 L14 5 V19 L9 15 H5 Z" />
      <line x1="17" y1="9" x2="22" y2="14" />
      <line x1="22" y1="9" x2="17" y2="14" />
    </svg>
  )
}

function UnmuteGlyph() {
  return (
    <svg width="44%" height="44%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9 H9 L14 5 V19 L9 15 H5 Z" />
      <path d="M17 8 C19 10,19 14,17 16" />
      <path d="M19.5 6 C22.5 9,22.5 15,19.5 18" />
    </svg>
  )
}
