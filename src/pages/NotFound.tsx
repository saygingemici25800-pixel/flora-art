import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'

const EASE = [0.16, 1, 0.3, 1] as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

export default function NotFound() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  useSEO({
    title: t('seo.notFound.title') as string,
    description: t('seo.notFound.description') as string,
  })

  return (
    <section
      className="relative w-full grid place-items-center overflow-hidden text-center"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        minHeight: 'calc(100dvh - 78px)',
        paddingTop: 'clamp(120px, 18vh, 200px)',
        paddingBottom: 'clamp(80px, 12vh, 160px)',
        paddingLeft: 'clamp(20px, 5vw, 64px)',
        paddingRight: 'clamp(20px, 5vw, 64px)',
      }}
    >
      <Botanical />

      <motion.div
        className="relative z-[2] max-w-[640px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <p
          className="leading-none italic"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4.5rem, 16vw, 9rem)',
            color: 'var(--color-gold)',
            letterSpacing: '-0.02em',
          }}
        >
          {t('notFound.kicker')}
        </p>

        <h1
          className="mt-4 italic"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            color: 'var(--color-cream)',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
        >
          {t('notFound.title')}
        </h1>

        <p
          className="mt-6 mx-auto max-w-[44ch] leading-relaxed"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.98rem',
            color: 'var(--color-cream)',
            opacity: 0.7,
          }}
        >
          {t('notFound.text')}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={prefix || '/'}
            className="nf-primary inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 text-[12px] tracking-[0.28em] uppercase transition-colors duration-300"
            style={{
              background: 'var(--color-gold)',
              color: 'var(--color-forest)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {t('notFound.home')}
          </Link>
          <Link
            to={prefix || '/'}
            className="nf-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-[12px] tracking-[0.28em] uppercase border transition-colors duration-300"
            style={{
              background: 'transparent',
              color: 'var(--color-cream)',
              borderColor: 'rgba(255,239,179,0.4)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {t('notFound.shop')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </motion.div>

      <style>{`
        .nf-primary:hover { background: var(--color-cream) !important; }
        .nf-secondary:hover {
          background: rgba(255,239,179,0.08) !important;
          border-color: var(--color-gold) !important;
        }
      `}</style>
    </section>
  )
}

/** Faint floral mandala behind the message for atmosphere. */
function Botanical() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] grid place-items-center"
      style={{ opacity: 0.07, color: 'var(--color-gold)' }}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-[min(120vw,820px)] h-auto"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="translate(200 200)">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot) => (
            <ellipse key={`o${rot}`} cx="0" cy="-92" rx="26" ry="82" transform={`rotate(${rot})`} />
          ))}
          {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((rot) => (
            <ellipse key={`i${rot}`} cx="0" cy="-56" rx="17" ry="50" transform={`rotate(${rot})`} />
          ))}
          <circle r="34" />
          <circle r="14" />
        </g>
      </svg>
    </div>
  )
}
