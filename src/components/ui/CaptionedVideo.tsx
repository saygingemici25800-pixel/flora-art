/**
 * Captioned speaking-video player for the Vahap interview clips.
 *
 * - Autoplay muted loop (browser policy), with a faint center sound toggle.
 * - Karaoke caption: reads a per-clip `.words.json` (word-level timestamps)
 *   and lights up each word in gold as it is spoken, sentence by sentence.
 *   Rendered as plain DOM (rAF → innerHTML) so word highlighting works in
 *   every browser, unlike native ::cue.
 * - Poster shows until the first frame loads; forest fallback underneath.
 *
 * Sound can be controlled (gallery enforces one-at-a-time) or internal.
 */
import { useEffect, useRef, useState } from 'react'

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
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const capRef = useRef<HTMLDivElement | null>(null)
  const cuesRef = useRef<Cue[]>([])
  const [loaded, setLoaded] = useState(false)
  const [internalSound, setInternalSound] = useState(false)

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

  // Karaoke render loop — word-follow highlight via direct DOM writes.
  useEffect(() => {
    let raf = 0
    let lastKey = ''
    const tick = () => {
      const v = videoRef.current
      const cap = capRef.current
      if (v && cap) {
        const t = v.currentTime
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

  function toggle() {
    if (onToggleSound) onToggleSound()
    else setInternalSound((s) => !s)
  }

  return (
    <div
      className={`fa-cvideo relative overflow-hidden ${className}`}
      style={{ aspectRatio: '16 / 9', background: 'var(--color-forest)', border: '1px solid rgba(200,169,110,0.2)' }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="fa-scrim" />
      <div ref={capRef} className="fa-cap" aria-hidden="true" />

      <button
        type="button"
        onClick={toggle}
        className="fa-soundbtn"
        aria-label={sound ? 'Sesi kapat' : 'Sesi aç'}
        aria-pressed={sound}
        data-on={sound}
      >
        {sound ? <UnmuteGlyph /> : <MuteGlyph />}
      </button>
    </div>
  )
}

function MuteGlyph() {
  return (
    <svg width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9 H9 L14 5 V19 L9 15 H5 Z" />
      <line x1="17" y1="9" x2="22" y2="14" />
      <line x1="22" y1="9" x2="17" y2="14" />
    </svg>
  )
}

function UnmuteGlyph() {
  return (
    <svg width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9 H9 L14 5 V19 L9 15 H5 Z" />
      <path d="M17 8 C19 10,19 14,17 16" />
      <path d="M19.5 6 C22.5 9,22.5 15,19.5 18" />
    </svg>
  )
}
