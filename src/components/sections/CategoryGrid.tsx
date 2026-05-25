import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

interface Category {
  id: string
  name: string
}

type CategoryId =
  | 'bouquet'
  | 'box'
  | 'wedding'
  | 'corporate'
  | 'plant'
  | 'international'

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

const MOTIF_TINTS: Record<CategoryId, string> = {
  bouquet:       'rgba(200, 169, 110, 0.55)',
  box:           'rgba(28, 43, 26, 0.55)',
  wedding:       'rgba(245, 240, 232, 0.85)',
  corporate:     'rgba(28, 43, 26, 0.45)',
  plant:         'rgba(200, 169, 110, 0.45)',
  international: 'rgba(28, 43, 26, 0.55)',
}

export default function CategoryGrid() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const categories = t('categories', { returnObjects: true }) as Category[]

  return (
    <section
      className="relative w-full"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="mb-14 md:mb-20 max-w-[44ch]">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.12em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.75rem, 7vw, 5.25rem)',
                color: 'var(--color-cream)',
                letterSpacing: '-0.015em',
                lineHeight: 0.98,
              }}
            >
              {t('collection.title')}
            </motion.h2>
          </span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className="mt-6 text-[16px] md:text-[17px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {t('collection.sub')}
          </motion.p>
        </div>

        {/* Bento: Buket 2x2 dominant sol; sağda 4 küçük kart.
            Saksı bu grid'den çıkarıldı (data'da kalıyor — Shop'tan erişilebilir). */}
        <div
          className="grid grid-cols-1 gap-[2px] md:grid-cols-4"
          style={{
            background: 'var(--color-forest)',
            gridTemplateAreas: `
              "buket buket kutu dugum"
              "buket buket kurumsal uluslararasi"
            `,
            gridAutoRows: 'minmax(220px, 1fr)',
          }}
        >
          {categories
            .filter((c) => c.id !== 'plant')
            .map((cat, i) => {
              const id = cat.id as CategoryId
              const areaMap: Record<string, string> = {
                bouquet: 'buket',
                box: 'kutu',
                wedding: 'dugum',
                corporate: 'kurumsal',
                international: 'uluslararasi',
              }
              const area = areaMap[cat.id] ?? ''
              const isBig = cat.id === 'bouquet'
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-8% 0px' }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}
                  style={{ gridArea: area }}
                  className="min-h-[220px]"
                >
                  <CategoryCard
                    to={`${prefix}/shop`}
                    name={cat.name}
                    discoverLabel={t('collection.discover')}
                    id={id}
                    big={isBig}
                  />
                </motion.div>
              )
            })}
        </div>
      </div>
    </section>
  )
}

interface CardProps {
  to: string
  name: string
  discoverLabel: string
  id: CategoryId
  big: boolean
}

function CategoryCard({ to, name, discoverLabel, id, big }: CardProps) {
  return (
    <Link
      to={to}
      className="group relative block w-full h-full overflow-hidden transition-transform duration-500 ease-out hover:scale-[1.02]"
      style={{ background: 'var(--color-beige)' }}
    >
      <div className="absolute inset-0">
        <CategoryMotif id={id} tint={MOTIF_TINTS[id]} big={big} />
      </div>

      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(180deg, rgba(28,43,26,0.0) 30%, rgba(28,43,26,0.55) 100%)',
        }}
      />

      <span
        aria-hidden="true"
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        style={{ background: 'rgba(200, 169, 110, 0.85)', mixBlendMode: 'multiply' }}
      />

      <div
        className={`relative z-[1] flex flex-col justify-end h-full p-6 md:p-8 ${
          big ? 'md:p-10' : ''
        }`}
      >
        <h3
          className="transition-colors duration-500"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: big ? 'clamp(3rem, 5vw, 6rem)' : 'clamp(1.5rem, 2.5vw, 2.5rem)',
            color: 'var(--color-forest)',
            letterSpacing: '-0.01em',
            lineHeight: 1.05,
          }}
        >
          {name}
        </h3>
        <span
          className="mt-3 inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase opacity-0 -translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-forest)' }}
        >
          {discoverLabel} <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}

function CategoryMotif({
  id,
  tint,
  big,
}: {
  id: CategoryId
  tint: string
  big: boolean
}): ReactNode {
  const scale = big ? 1.3 : 1
  const common = {
    width: '100%',
    height: '100%',
    style: { color: tint, opacity: 0.7 } as React.CSSProperties,
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (id) {
    case 'bouquet':
      return (
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform={`translate(200 220) scale(${scale})`}>
            <path d="M 0 130 C -10 80, -30 30, -60 -20" />
            <path d="M 0 130 C 10 80, 30 30, 60 -20" />
            <path d="M 0 130 C 0 70, 0 10, 0 -50" />
            {[-60, -30, 0, 30, 60].map((x, idx) => (
              <g key={idx} transform={`translate(${x} ${-20 - Math.abs(x) / 2})`}>
                <circle r="22" />
                <circle r="10" opacity="0.5" />
                <circle r="3" fill="currentColor" />
              </g>
            ))}
            <path d="M -45 130 L 45 130" />
          </g>
        </svg>
      )
    case 'box':
      return (
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(200 200)">
            <rect x="-90" y="-50" width="180" height="110" rx="4" />
            <line x1="-90" y1="-20" x2="90" y2="-20" />
            {[-50, -20, 10, 40].map((x, idx) => (
              <g key={idx} transform={`translate(${x} -50)`}>
                <ellipse cx="0" cy="-18" rx="14" ry="20" />
                <circle cx="0" cy="-18" r="5" opacity="0.5" />
                <line x1="0" y1="0" x2="0" y2="-10" />
              </g>
            ))}
          </g>
        </svg>
      )
    case 'wedding':
      return (
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(200 200)">
            <circle cx="-30" cy="0" r="55" />
            <circle cx="30" cy="0" r="55" />
            <g transform="translate(-30 -80)">
              {[0, 72, 144, 216, 288].map((rot) => (
                <ellipse
                  key={rot}
                  cx="0"
                  cy="-14"
                  rx="6"
                  ry="14"
                  transform={`rotate(${rot})`}
                />
              ))}
              <circle r="4" fill="currentColor" />
            </g>
          </g>
        </svg>
      )
    case 'corporate':
      return (
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(200 200)">
            <rect x="-80" y="-90" width="160" height="180" rx="2" />
            {[-50, -10, 30].map((y, idx) => (
              <line key={idx} x1="-60" y1={y} x2="60" y2={y} />
            ))}
            <g transform="translate(0 80)">
              <path d="M -50 0 C -50 -30, -20 -50, 0 -50 C 20 -50, 50 -30, 50 0" />
              <line x1="-50" y1="0" x2="50" y2="0" />
            </g>
          </g>
        </svg>
      )
    case 'plant':
      return (
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(200 240)">
            <path d="M -50 60 L 50 60 L 40 120 L -40 120 Z" />
            <line x1="-50" y1="60" x2="50" y2="60" />
            <g transform="translate(0 60)">
              <path d="M 0 0 C 0 -40, -30 -70, -60 -90" />
              <path d="M 0 0 C 0 -40, 30 -70, 60 -90" />
              <path d="M 0 0 C 0 -60, 0 -110, 0 -140" />
              <ellipse cx="-60" cy="-90" rx="20" ry="8" transform="rotate(-30 -60 -90)" />
              <ellipse cx="60" cy="-90" rx="20" ry="8" transform="rotate(30 60 -90)" />
              <ellipse cx="-30" cy="-110" rx="18" ry="7" transform="rotate(-20 -30 -110)" />
              <ellipse cx="30" cy="-110" rx="18" ry="7" transform="rotate(20 30 -110)" />
              <ellipse cx="0" cy="-140" rx="16" ry="7" />
            </g>
          </g>
        </svg>
      )
    case 'international':
      return (
        <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(200 200)">
            <circle r="100" />
            <ellipse rx="100" ry="40" />
            <ellipse rx="40" ry="100" />
            <path d="M -100 -20 L 100 -20" opacity="0.5" />
            <path d="M -100 20 L 100 20" opacity="0.5" />
            <g>
              <circle cx="-70" cy="-30" r="3" fill="currentColor" />
              <circle cx="40" cy="20" r="3" fill="currentColor" />
              <circle cx="60" cy="-60" r="3" fill="currentColor" />
              <path d="M -70 -30 Q -15 -80, 60 -60" strokeDasharray="3 4" />
              <path d="M 60 -60 Q 60 -10, 40 20" strokeDasharray="3 4" />
            </g>
          </g>
        </svg>
      )
  }
}
