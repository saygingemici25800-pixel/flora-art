import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  featuredProducts,
  type MotifKind,
  type Product,
} from '../../data/products'

const EASE = [0.16, 1, 0.3, 1] as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

export default function FeaturedProducts() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [maxDrag, setMaxDrag] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      const v = viewportRef.current
      const tr = trackRef.current
      if (!v || !tr) return
      setMaxDrag(Math.max(0, tr.scrollWidth - v.offsetWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section
      className="relative w-full"
      style={{
        background: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
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
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {t('featured.title')}
            </motion.h2>
          </span>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          >
            <Link
              to={`${prefix}/shop`}
              className="group inline-flex items-center gap-2 text-[12px] tracking-[0.28em] uppercase transition-colors"
              style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span className="border-b border-current pb-1">{t('featured.viewAll')}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden" ref={viewportRef}>
        <motion.div
          ref={trackRef}
          className="flex gap-5 md:gap-6 pl-6 md:pl-10 pr-6 md:pr-10 cursor-grab active:cursor-grabbing select-none"
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.08}
          dragMomentum={true}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {featuredProducts.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              addLabel={t('featured.addToCart')}
              currency={t('featured.currency') as string}
              badgeLabel={p.badge ? (t(`featured.badges.${p.badge}`) as string) : undefined}
              index={i}
            />
          ))}
          <span aria-hidden="true" className="shrink-0 w-2 md:w-6" />
        </motion.div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
  addLabel,
  currency,
  badgeLabel,
  index,
}: {
  product: Product
  addLabel: string
  currency: string
  badgeLabel?: string
  index: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.05 * index }}
      whileHover={{ scale: 1.02 }}
      className="group shrink-0 w-[280px] transition-shadow duration-500 hover:shadow-[0_20px_50px_-20px_rgba(28,43,26,0.35)]"
    >
      <div
        className="relative h-[320px] overflow-hidden"
        style={{ background: 'var(--color-beige)' }}
      >
        <ProductMotif kind={product.motif} />

        {badgeLabel && (
          <span
            className="absolute top-3 right-3 px-3 py-1 text-[10px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontVariant: 'small-caps',
              background: 'var(--color-gold)',
              color: 'var(--color-forest)',
              fontWeight: 500,
            }}
          >
            {badgeLabel}
          </span>
        )}
      </div>

      <div className="pt-5 pb-1">
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <h3
            className="leading-snug"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              color: 'var(--color-forest)',
              letterSpacing: '-0.005em',
            }}
          >
            {product.name}
          </h3>
          <span
            className="whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--color-gold)',
              letterSpacing: '0.02em',
            }}
          >
            {product.price}
            {currency}
          </span>
        </div>

        <button
          type="button"
          className="add-btn w-full py-3 text-[11px] tracking-[0.28em] uppercase transition-colors duration-300 border"
          style={{
            background: 'transparent',
            color: 'var(--color-forest)',
            borderColor: 'var(--color-forest)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {addLabel}
        </button>
      </div>

      <style>{`
        .add-btn:hover {
          background: var(--color-gold) !important;
          border-color: var(--color-gold) !important;
          color: var(--color-forest) !important;
        }
      `}</style>
    </motion.article>
  )
}

function ProductMotif({ kind }: { kind: MotifKind }) {
  const common = {
    width: '100%',
    height: '100%',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: { color: 'var(--color-forest)', opacity: 0.5 } as React.CSSProperties,
    'aria-hidden': true,
  }
  switch (kind) {
    case 'rose':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 170)">
            <circle r="14" />
            <circle r="26" />
            <circle r="40" />
            <circle r="54" />
            <path d="M 0 60 C -10 100, -40 130, -50 150" />
            <path d="M 0 60 C 10 100, 40 130, 50 150" />
            <ellipse cx="-40" cy="120" rx="22" ry="9" transform="rotate(-35 -40 120)" />
            <ellipse cx="40" cy="120" rx="22" ry="9" transform="rotate(35 40 120)" />
          </g>
        </svg>
      )
    case 'tulip':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 200)">
            <path d="M -30 -50 C -30 -90, -10 -110, 0 -110 C 10 -110, 30 -90, 30 -50 L 30 -10 C 30 0, 20 10, 0 10 C -20 10, -30 0, -30 -10 Z" />
            <path d="M -16 -50 C -16 -90, 0 -110, 0 -110" opacity="0.5" />
            <path d="M 16 -50 C 16 -90, 0 -110, 0 -110" opacity="0.5" />
            <path d="M 0 10 L 0 110" />
            <path d="M 0 40 C -25 50, -50 70, -70 110" />
            <path d="M 0 70 C 25 80, 50 100, 65 130" />
          </g>
        </svg>
      )
    case 'peony':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 160)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
              <ellipse key={rot} cx="0" cy="-32" rx="22" ry="34" transform={`rotate(${rot})`} />
            ))}
            <circle r="20" fill="currentColor" opacity="0.15" />
            <circle r="8" />
            <path d="M 0 60 C -8 100, -8 130, -8 160" />
            <path d="M 0 60 C 8 100, 8 130, 8 160" />
          </g>
        </svg>
      )
    case 'box':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 180)">
            <rect x="-110" y="-30" width="220" height="120" rx="4" />
            <line x1="-110" y1="0" x2="110" y2="0" />
            <g transform="translate(0 -30)">
              {[-80, -40, 0, 40, 80].map((x, idx) => (
                <g key={idx} transform={`translate(${x} -20)`}>
                  <circle r="14" />
                  <circle r="6" opacity="0.5" />
                  <circle r="2" fill="currentColor" />
                </g>
              ))}
            </g>
          </g>
        </svg>
      )
    case 'wedding':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 170)">
            {[0, 60, 120, 180, 240, 300].map((rot) => (
              <g key={rot} transform={`rotate(${rot})`}>
                <ellipse cx="0" cy="-48" rx="16" ry="26" />
              </g>
            ))}
            <circle r="14" fill="currentColor" opacity="0.2" />
            <path d="M 0 30 C -5 70, -5 110, -5 150" />
            <path d="M 0 30 C 5 70, 5 110, 5 150" />
            <path d="M -30 130 C -20 140, 20 140, 30 130" />
          </g>
        </svg>
      )
    case 'orchid':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 160)">
            <ellipse cx="-25" cy="-30" rx="22" ry="40" transform="rotate(-25 -25 -30)" />
            <ellipse cx="25" cy="-30" rx="22" ry="40" transform="rotate(25 25 -30)" />
            <ellipse cx="0" cy="-50" rx="18" ry="34" />
            <ellipse cx="-12" cy="10" rx="14" ry="22" transform="rotate(-30 -12 10)" />
            <ellipse cx="12" cy="10" rx="14" ry="22" transform="rotate(30 12 10)" />
            <circle r="6" fill="currentColor" opacity="0.4" />
            <path d="M 0 30 L 0 130" />
            <ellipse cx="-40" cy="120" rx="40" ry="14" />
            <ellipse cx="40" cy="120" rx="40" ry="14" />
          </g>
        </svg>
      )
  }
}
