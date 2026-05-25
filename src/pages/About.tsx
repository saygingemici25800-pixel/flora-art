import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'

const EASE = [0.16, 1, 0.3, 1] as const

interface ValueItem {
  icon: string
  title: string
  description: string
}

interface NumberItem {
  value: number
  suffix: string
  label: string
}

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

export default function About() {
  const { t } = useTranslation()
  useSEO({
    title: t('seo.about.title') as string,
    description: t('seo.about.description') as string,
  })
  return (
    <>
      <AboutHero />
      <Story />
      <Values />
      <Founder />
      <Numbers />
    </>
  )
}

function AboutHero() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        minHeight: '60vh',
      }}
    >
      <HeroBotanical />

      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10 pt-[120px] md:pt-[140px] pb-14 md:pb-20 min-h-[60vh] flex flex-col justify-end">
        <nav
          aria-label="Breadcrumb"
          className="text-[11px] tracking-[0.25em] uppercase mb-6 flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-gold)',
            opacity: 0.9,
          }}
        >
          <Link to={prefix || '/'} className="hover:opacity-100 opacity-80 transition-opacity">
            {t('shop.breadcrumbHome')}
          </Link>
          <span aria-hidden="true" style={{ opacity: 0.55 }}>·</span>
          <span style={{ color: 'var(--color-cream)', opacity: 0.85 }}>
            {t('about.breadcrumb')}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="italic md:col-span-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              color: 'var(--color-cream)',
              letterSpacing: '-0.02em',
              lineHeight: 0.98,
            }}
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="md:col-span-4 max-w-[40ch] text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {t('about.subtitle')}
          </motion.p>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}

function Story() {
  const { t } = useTranslation()
  const story = t('about.story', { returnObjects: true }) as {
    badge: string
    title: string
    p1: string
    p2: string
    quote: string
    quoteAuthor: string
  }
  const lines = story.title.split('\n')

  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex items-center gap-4 mb-7"
          >
            <span
              aria-hidden="true"
              className="block h-px w-12"
              style={{ background: 'var(--color-gold)' }}
            />
            <span
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-display)',
                fontVariant: 'small-caps',
              }}
            >
              {story.badge}
            </span>
          </motion.div>

          <h2
            className="italic mb-10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              color: 'var(--color-forest)',
              letterSpacing: '-0.02em',
              lineHeight: 0.98,
            }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                className="block overflow-hidden"
                style={{ paddingBottom: '0.06em' }}
              >
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.85, ease: EASE, delay: i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 0.85, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
            className="text-[16px] leading-relaxed max-w-[60ch] mb-5"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
          >
            {story.p1}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
            className="text-[15px] leading-relaxed max-w-[60ch]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
          >
            {story.p2}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="md:col-span-5 relative md:pl-10"
        >
          <span
            aria-hidden="true"
            className="hidden md:block absolute left-0 top-2 bottom-2 w-px"
            style={{ background: 'var(--color-gold)' }}
          />
          <blockquote
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
              color: 'var(--color-forest)',
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
            }}
          >
            “{story.quote}”
          </blockquote>
          <p
            className="mt-6 text-[11px] tracking-[0.3em] uppercase"
            style={{
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {story.quoteAuthor}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function ValueIcon({ kind }: { kind: string }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (kind === 'flower') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="1.8" />
        <ellipse cx="12" cy="6.4" rx="2.2" ry="3.4" />
        <ellipse cx="12" cy="17.6" rx="2.2" ry="3.4" />
        <ellipse cx="6.4" cy="12" rx="3.4" ry="2.2" />
        <ellipse cx="17.6" cy="12" rx="3.4" ry="2.2" />
        <ellipse cx="8.2" cy="8.2" rx="2" ry="2.8" transform="rotate(-45 8.2 8.2)" />
        <ellipse cx="15.8" cy="15.8" rx="2" ry="2.8" transform="rotate(-45 15.8 15.8)" />
      </svg>
    )
  }
  if (kind === 'bolt') {
    return (
      <svg {...common}>
        <path d="M14 2 L5 14 L11 14 L10 22 L19 10 L13 10 Z" />
      </svg>
    )
  }
  // 'star' — 4-point star (compass rose)
  return (
    <svg {...common}>
      <path d="M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z" />
    </svg>
  )
}

function Values() {
  const { t } = useTranslation()
  const items = t('about.values.items', { returnObjects: true }) as ValueItem[]
  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--color-beige)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <header className="text-center mb-14 md:mb-20">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.1em' }}>
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
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {t('about.values.title')}
            </motion.h2>
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className="block h-px w-16 mx-auto mt-7"
            style={{ background: 'var(--color-gold)', transformOrigin: 'center' }}
          />
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className="group p-7 md:p-9 text-center transition-all duration-500"
              style={{
                background: 'var(--color-cream)',
                border: '1px solid rgba(28,43,26,0.10)',
              }}
            >
              <span
                aria-hidden="true"
                className="inline-grid place-items-center mb-6"
                style={{ color: 'var(--color-gold)' }}
              >
                <ValueIcon kind={item.icon} />
              </span>
              <h3
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--color-forest)',
                  letterSpacing: '-0.005em',
                  lineHeight: 1.15,
                }}
              >
                {item.title}
              </h3>
              <p
                className="leading-relaxed max-w-[28ch] mx-auto"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                  color: 'var(--color-ink)',
                  opacity: 0.75,
                }}
              >
                {item.description}
              </p>
              <span
                aria-hidden="true"
                className="block h-px w-16 mx-auto mt-7 origin-center transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100"
                style={{ background: 'var(--color-gold)' }}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Founder() {
  const { t } = useTranslation()
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease: EASE }}
          className="md:col-span-5 flex justify-center md:justify-start"
        >
          <div
            className="relative grid place-items-center"
            style={{
              width: 'min(78vw, 420px)',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              border: '1px solid rgba(200, 169, 110, 0.45)',
              background:
                'radial-gradient(circle at 40% 35%, rgba(200,169,110,0.12), rgba(28,43,26,0) 60%)',
            }}
          >
            <div
              className="absolute rounded-full"
              style={{ inset: '12%', border: '1px solid rgba(200, 169, 110, 0.2)' }}
            />
            <div className="relative text-center px-6">
              <FounderGlyph />
              <p
                className="mt-5 text-[10px] tracking-[0.3em] uppercase"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'rgba(245, 240, 232, 0.55)',
                }}
              >
                {t('about.founder.imagePlaceholder')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="md:col-span-7"
        >
          <p
            className="text-[11px] tracking-[0.32em] uppercase mb-4"
            style={{
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-display)',
              fontVariant: 'small-caps',
            }}
          >
            {t('about.founder.kicker')}
          </p>

          <h2
            className="italic mb-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--color-cream)',
              letterSpacing: '-0.015em',
              lineHeight: 1,
            }}
          >
            {t('about.founder.name')}
          </h2>

          <p
            className="text-[16px] leading-relaxed max-w-[58ch] mb-5"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-cream)',
              opacity: 0.85,
            }}
          >
            {t('about.founder.p1')}
          </p>
          <p
            className="text-[15px] leading-relaxed max-w-[58ch] mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-cream)',
              opacity: 0.7,
            }}
          >
            {t('about.founder.p2')}
          </p>

          <p
            className="text-[11px] tracking-[0.3em] uppercase pt-6 border-t"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-gold)',
              borderColor: 'rgba(200, 169, 110, 0.35)',
            }}
          >
            {t('about.founder.stats')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function Numbers() {
  const { t } = useTranslation()
  const items = t('about.numbers.items', { returnObjects: true }) as NumberItem[]
  return (
    <section
      className="relative w-full"
      style={{
        background: 'var(--color-gold)',
        paddingBlock: 'calc(var(--spacing-section) * 0.85)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: i * 0.1 }}
            className="text-center md:text-left"
          >
            <p
              className="italic leading-none mb-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.025em',
              }}
            >
              <CountUp to={item.value} suffix={item.suffix} />
            </p>
            <p
              className="text-[11px] tracking-[0.28em] uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-forest)',
                opacity: 0.75,
              }}
            >
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function CountUp({
  to,
  suffix = '',
  duration = 2,
}: {
  to: number
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const [val, setVal] = useState(0)
  const isDecimal = /^\.\d+/.test(suffix)
  const decimals = isDecimal ? suffix.replace('.', '').length : 0

  useEffect(() => {
    if (!inView) return
    let start: number | null = null
    let raf = 0
    const tick = (t: number) => {
      if (start === null) start = t
      const elapsed = (t - start) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * to
      setVal(decimals > 0 ? current : Math.floor(current))
      if (progress < 1) raf = requestAnimationFrame(tick)
      else setVal(to)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, decimals])

  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString()
  const trailing = decimals > 0 ? suffix.slice(decimals + 1) : suffix

  return (
    <span ref={ref}>
      {display}
      {trailing}
    </span>
  )
}

function FounderGlyph() {
  return (
    <svg
      width="84"
      height="84"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mx-auto"
      style={{ color: 'var(--color-gold)', opacity: 0.85 }}
    >
      <g transform="translate(50 50)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <ellipse key={rot} cx="0" cy="-22" rx="10" ry="20" transform={`rotate(${rot})`} />
        ))}
        <circle r="9" fill="currentColor" opacity="0.18" />
        <circle r="4" />
        <path d="M 0 22 C -6 36, -6 46, -6 50" />
        <path d="M 0 22 C 6 36, 6 46, 6 50" />
        <ellipse cx="-15" cy="40" rx="10" ry="4" transform="rotate(-25 -15 40)" />
        <ellipse cx="15" cy="40" rx="10" ry="4" transform="rotate(25 15 40)" />
      </g>
    </svg>
  )
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute left-6 md:left-10 bottom-6 md:bottom-10 z-[3] hidden sm:flex flex-col items-center gap-4"
      aria-hidden="true"
    >
      <motion.span
        className="text-[10px] tracking-[0.4em] uppercase"
        style={{
          color: 'var(--color-cream)',
          fontFamily: 'var(--font-body)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll
      </motion.span>
      <div
        className="relative h-[60px] w-px overflow-hidden"
        style={{ background: 'rgba(200,169,110,0.2)' }}
      >
        <motion.span
          className="absolute left-0 right-0 top-0 h-4"
          style={{ background: 'var(--color-gold)' }}
          animate={{ y: [-16, 60] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

function HeroBotanical() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden md:block"
      style={{ width: '50%', opacity: 0.12, color: 'var(--color-gold)' }}
    >
      <svg
        viewBox="0 0 600 600"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="translate(380 330)">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot) => (
            <ellipse key={rot} cx="0" cy="-110" rx="34" ry="80" transform={`rotate(${rot})`} />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
            <ellipse key={`m-${rot}`} cx="0" cy="-70" rx="24" ry="48" transform={`rotate(${rot})`} />
          ))}
          {[0, 60, 120, 180, 240, 300].map((rot) => (
            <ellipse key={`s-${rot}`} cx="0" cy="-40" rx="14" ry="28" transform={`rotate(${rot})`} />
          ))}
          <circle r="22" fill="currentColor" opacity="0.3" />
          <circle r="8" />
          <path d="M 0 0 C 0 80, 0 180, 0 260" />
          <ellipse cx="-50" cy="180" rx="40" ry="14" transform="rotate(-20 -50 180)" />
          <ellipse cx="50" cy="220" rx="40" ry="14" transform="rotate(20 50 220)" />
        </g>
        <g opacity="0.6">
          <circle cx="80" cy="100" r="3" fill="currentColor" />
          <circle cx="120" cy="430" r="2.5" fill="currentColor" />
          <circle cx="510" cy="510" r="2" fill="currentColor" />
        </g>
      </svg>
    </div>
  )
}
