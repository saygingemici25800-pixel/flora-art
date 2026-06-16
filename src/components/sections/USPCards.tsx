import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

type USPKey = 'holland' | 'fast' | 'world'
type EnterDir = 'left' | 'up' | 'right'

interface UspCardConfig {
  key: USPKey
  number: string
  videoSrc: string
  /** Desktop card height, e.g. "85vh" */
  desktopHeight: string
  /** Desktop top offset to create the triptych offset */
  desktopMarginTop: string
  enter: EnterDir
}

const CARDS: UspCardConfig[] = [
  {
    key: 'holland',
    number: '01',
    videoSrc: '/videos/holland-source.mp4',
    desktopHeight: '85vh',
    desktopMarginTop: '0vh',
    enter: 'left',
  },
  {
    key: 'fast',
    number: '02',
    videoSrc: '/videos/fast-delivery.mp4',
    desktopHeight: '70vh',
    desktopMarginTop: '8vh',
    enter: 'up',
  },
  {
    key: 'world',
    number: '03',
    videoSrc: '/videos/worldwide.mp4',
    desktopHeight: '78vh',
    desktopMarginTop: '4vh',
    enter: 'right',
  },
]

export default function USPCards() {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState<number | null>(null)
  const sectionTitle = t('usp.title') as string

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-cream)',
        paddingBlock: '80px',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 text-center mb-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="italic"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--color-forest)',
            letterSpacing: '-0.01em',
            lineHeight: 1,
          }}
        >
          {sectionTitle}
        </motion.h2>
      </div>

      <div
        className="
          w-full
          flex flex-col gap-[2px]
          md:grid md:gap-[3px] md:items-start
          md:grid-cols-[1.2fr_0.9fr_1fr]
        "
        style={{ background: 'var(--color-beige)' }}
      >
        {CARDS.map((card, i) => (
          <VideoCard
            key={card.key}
            card={card}
            index={i}
            isHovered={hovered === i}
            isDimmed={hovered !== null && hovered !== i}
            onEnter={() => setHovered(i)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>
    </section>
  )
}

interface CardProps {
  card: UspCardConfig
  index: number
  isHovered: boolean
  isDimmed: boolean
  onEnter: () => void
  onLeave: () => void
}

function VideoCard({
  card,
  index,
  isHovered,
  isDimmed,
  onEnter,
  onLeave,
}: CardProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [muted, setMuted] = useState(true)
  const [loaded, setLoaded] = useState(false)

  const cardDelay = index * 0.15
  const titleLines = (t(`usp.${card.key}.title`) as string).split('\n')

  const enterInitial =
    card.enter === 'left'
      ? { x: -60, opacity: 0 }
      : card.enter === 'right'
      ? { x: 60, opacity: 0 }
      : { y: 60, opacity: 0 }

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
    <motion.article
      initial={enterInitial}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay: cardDelay }}
      animate={{
        opacity: isDimmed ? 0.7 : 1,
        scale: isDimmed ? 0.99 : 1,
      }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="usp-card relative overflow-hidden"
      style={
        {
          background: '#013e37',
          ['--h' as string]: card.desktopHeight,
          ['--mt' as string]: card.desktopMarginTop,
        } as React.CSSProperties
      }
    >
      {/* Subtle botanical pattern — visible until video loads */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
        aria-hidden="true"
        style={{ background: '#013e37' }}
      >
        <SubtleBotanical />
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        src={card.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        className="usp-video absolute inset-0 w-full h-full"
        style={{ objectFit: 'cover' }}
      />

      {/* Bottom forest gradient — first 50% from bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            'linear-gradient(to top, rgba(1,62,55,1) 0%, rgba(1,62,55,0) 100%)',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(1,62,55,0.4) 100%)',
        }}
      />

      {/* Hover dark overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        style={{ background: '#013e37' }}
      />

      {/* Number — top-left */}
      <span
        className="absolute italic leading-none select-none"
        style={{
          top: '32px',
          left: '36px',
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          color: 'var(--color-gold)',
          opacity: 0.5,
          letterSpacing: '0.05em',
        }}
      >
        {card.number}
      </span>

      {/* Mute toggle — top-right */}
      <motion.button
        type="button"
        onClick={toggleMute}
        whileTap={{ scale: 0.9 }}
        aria-label={t(muted ? 'usp.muteOn' : 'usp.muteOff') as string}
        aria-pressed={!muted}
        className="absolute grid place-items-center rounded-full transition-colors"
        style={{
          top: '24px',
          right: '24px',
          width: '40px',
          height: '40px',
          background: 'rgba(255,239,179, 0.1)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(200, 169, 110, 0.3)',
          color: 'var(--color-gold)',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = 'rgba(255,239,179, 0.2)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = 'rgba(255,239,179, 0.1)')
        }
      >
        {muted ? <MuteIcon /> : <UnmuteIcon />}
      </motion.button>

      {/* Title block — bottom */}
      <motion.div
        className="absolute"
        style={{ bottom: '48px', left: '40px', right: '40px' }}
        animate={{ y: isHovered ? -6 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <motion.div
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.9, ease: EASE, delay: cardDelay + 0.4 }}
        >
          <h3
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
              color: 'var(--color-cream)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              fontWeight: 300,
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h3>

          <motion.span
            aria-hidden="true"
            className="block"
            animate={{ width: isHovered ? 80 : 40 }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              marginTop: '16px',
              height: '1px',
              background: 'var(--color-gold)',
            }}
          />
        </motion.div>
      </motion.div>

      <style>{`
        .usp-card {
          height: 60vh;
        }
        .usp-card .usp-video {
          transition: transform 6s ease;
        }
        .usp-card:hover .usp-video {
          transform: scale(1.04);
        }
        @media (min-width: 768px) {
          .usp-card {
            height: var(--h);
            margin-top: var(--mt);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .usp-card .usp-video,
          .usp-card:hover .usp-video {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </motion.article>
  )
}

function SubtleBotanical() {
  return (
    <svg
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: 'var(--color-gold)', opacity: 0.04 }}
    >
      <g transform="translate(280 540)">
        <path d="M 0 0 C 0 -120, -10 -240, 5 -380 C 20 -480, 50 -520, 40 -540" />
        <path d="M -3 -180 C -50 -190, -100 -180, -150 -200" />
        <path d="M 5 -300 C 60 -310, 110 -300, 160 -320" />
        <path d="M 8 -420 C -50 -430, -110 -440, -160 -470" />
        <ellipse cx="-110" cy="-195" rx="44" ry="12" transform="rotate(-18 -110 -195)" />
        <ellipse cx="120" cy="-310" rx="48" ry="14" transform="rotate(15 120 -310)" />
        <ellipse cx="-110" cy="-450" rx="42" ry="12" transform="rotate(-25 -110 -450)" />
      </g>
      <g>
        <circle cx="60"  cy="80"  r="2" fill="currentColor" />
        <circle cx="350" cy="120" r="2" fill="currentColor" />
        <circle cx="80"  cy="430" r="2" fill="currentColor" />
        <circle cx="380" cy="500" r="2" fill="currentColor" />
      </g>
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
