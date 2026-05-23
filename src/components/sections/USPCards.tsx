import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

type USPKey = 'holland' | 'fast' | 'world'

interface UspCardConfig {
  key: USPKey
  number: string
  videoSrc: string
  /** Card height in pixels — desktop only; mobile is uniform 480 */
  desktopHeight: number
}

const CARDS: UspCardConfig[] = [
  { key: 'holland', number: '01', videoSrc: '/videos/holland-source.mp4', desktopHeight: 520 },
  { key: 'fast',    number: '02', videoSrc: '/videos/fast-delivery.mp4',  desktopHeight: 620 },
  { key: 'world',   number: '03', videoSrc: '/videos/worldwide.mp4',      desktopHeight: 520 },
]

export default function USPCards() {
  const { t } = useTranslation()

  return (
    <section
      className="relative w-full"
      style={{
        background: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="text-center mb-14 md:mb-20">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.12em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {t('usp.title')}
            </motion.h2>
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className="block h-px w-16 mx-auto mt-8"
            style={{ background: 'var(--color-gold)', transformOrigin: 'center' }}
          />
        </div>

        <ul className="flex flex-col md:flex-row md:items-end gap-6 md:gap-6">
          {CARDS.map((card, i) => (
            <VideoCard key={card.key} card={card} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function VideoCard({ card, index }: { card: UspCardConfig; index: number }) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [muted, setMuted] = useState(true)
  const [loaded, setLoaded] = useState(false)

  const title = t(`usp.${card.key}.title`) as string
  const desc = t(`usp.${card.key}.desc`) as string
  const question = t(`usp.${card.key}.question`) as string

  function toggleMute() {
    const v = videoRef.current
    if (!v) {
      setMuted((m) => !m)
      return
    }
    const next = !v.muted
    v.muted = next
    setMuted(next)
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.15 }}
      className="usp-video-card group relative flex-1 overflow-hidden flex flex-col transition-transform duration-500 ease-out hover:scale-[1.01]"
      style={
        {
          background: 'var(--color-forest)',
          borderRadius: '4px',
          height: '480px',
          ['--card-md-height' as string]: `${card.desktopHeight}px`,
        } as React.CSSProperties
      }
    >
      <div className="relative overflow-hidden" style={{ height: '65%' }}>
        <div
          className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ background: 'var(--color-forest)' }}
          aria-hidden={loaded}
        >
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <CameraIcon />
            <p
              className="text-[11px] tracking-[0.32em] uppercase"
              style={{
                color: 'var(--color-cream)',
                opacity: 0.4,
                fontFamily: 'var(--font-body)',
              }}
            >
              {t('usp.videoSoon')}
            </p>
          </div>
        </div>

        <video
          ref={videoRef}
          src={card.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover' }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              'linear-gradient(to top, rgba(28,43,26,0.4) 0%, rgba(28,43,26,0) 100%)',
          }}
        />

        <motion.button
          type="button"
          onClick={toggleMute}
          whileTap={{ scale: 0.9 }}
          aria-label={t(muted ? 'usp.muteOn' : 'usp.muteOff') as string}
          aria-pressed={!muted}
          className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full transition-colors"
          style={{
            background: 'rgba(245, 240, 232, 0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: 'var(--color-gold)',
          }}
        >
          {muted ? <MuteIcon /> : <UnmuteIcon />}
        </motion.button>
      </div>

      <div className="flex flex-col flex-1 p-6" style={{ background: 'var(--color-forest)' }}>
        <span
          className="self-end italic leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            color: 'var(--color-gold)',
            opacity: 0.3,
            letterSpacing: '-0.02em',
          }}
        >
          {card.number}
        </span>

        <h3
          className="mt-1 mb-2"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.3rem',
            color: 'var(--color-cream)',
            letterSpacing: '-0.005em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h3>

        <p
          className="leading-snug"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--color-cream)',
            opacity: 0.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {desc}
        </p>

        <span
          aria-hidden="true"
          className="block h-px w-full my-4"
          style={{ background: 'var(--color-gold)', opacity: 0.2 }}
        />

        <p
          className="mt-auto italic flex items-start gap-2 leading-snug"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'var(--color-gold)',
            letterSpacing: '-0.005em',
          }}
        >
          <span aria-hidden="true" className="shrink-0" style={{ opacity: 0.7 }}>
            ?
          </span>
          <span>{question}</span>
        </p>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .usp-video-card {
            height: var(--card-md-height) !important;
          }
        }
      `}</style>
    </motion.li>
  )
}

function CameraIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: 'var(--color-gold)', opacity: 0.5 }}
    >
      <path d="M3 7 H8 L10 5 H14 L16 7 H21 V19 H3 Z" />
      <circle cx="12" cy="13" r="4" />
      <circle cx="12" cy="13" r="1.6" fill="currentColor" />
      <circle cx="18" cy="9.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function MuteIcon() {
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
      <path d="M5 9 H9 L14 5 V19 L9 15 H5 Z" />
      <line x1="17" y1="9" x2="22" y2="14" />
      <line x1="22" y1="9" x2="17" y2="14" />
    </svg>
  )
}

function UnmuteIcon() {
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
      <path d="M5 9 H9 L14 5 V19 L9 15 H5 Z" />
      <path d="M17 8 C19 10, 19 14, 17 16" />
      <path d="M19.5 6 C22.5 9, 22.5 15, 19.5 18" />
    </svg>
  )
}
