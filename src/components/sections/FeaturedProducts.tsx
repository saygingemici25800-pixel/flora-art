import { useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useCartStore } from '../../store/cartStore'
import { useProducts, type StoreProduct } from '../../hooks/useProducts'
import ProductMotif from '../ui/ProductMotif'

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
  const { products: featured, loading } = useProducts({ featured: true })

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
    // Re-measure once products load and the track width changes.
  }, [loading, featured.length])

  return (
    <section
      className="relative w-full"
      style={{
        background: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] pl-6 md:pl-10 pr-6 md:pr-10 relative z-[2]">
        <div className="flex items-end justify-between gap-6">
          <h2
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4rem, 8vw, 7rem)',
              color: 'var(--color-forest)',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
            }}
          >
            {(() => {
              const words = (t('featured.title') as string).split(' ')
              const lines = words.length > 1 ? words : [t('featured.title') as string]
              return lines.map((word, i) => (
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
                    transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}
                    style={lines.length > 1 && i === 1 ? { fontWeight: 200 } : undefined}
                  >
                    {word}
                  </motion.span>
                </span>
              ))
            })()}
          </h2>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
            className="pb-2"
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

      {/* Slider overlap: negative margin-top başlık alt kenarına girer */}
      <div
        className="relative w-full overflow-hidden md:-mt-12"
        ref={viewportRef}
      >
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
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <FeaturedSkeletonCard key={i} />)
            : featured.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  addLabel={t('featured.addToCart')}
                  soldOutLabel={t('featured.soldOut') as string}
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
  soldOutLabel,
  currency,
  badgeLabel,
  index,
}: {
  product: StoreProduct
  addLabel: string
  soldOutLabel: string
  currency: string
  badgeLabel?: string
  index: number
}) {
  const addItem = useCartStore((s) => s.addItem)
  const soldOut = !product.available
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
        <div
          className="absolute inset-0"
          style={soldOut ? { filter: 'grayscale(0.4)', opacity: 0.8 } : undefined}
        >
          <ProductMotif kind={product.motif} />
        </div>

        {soldOut ? (
          <span
            className="absolute top-3 right-3 px-3 py-1 text-[10px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontVariant: 'small-caps',
              background: 'var(--color-forest)',
              color: 'var(--color-cream)',
              fontWeight: 500,
            }}
          >
            {soldOutLabel}
          </span>
        ) : (
          badgeLabel && (
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
          )
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
          disabled={soldOut}
          onClick={() => {
            if (!soldOut) addItem(product)
          }}
          className={`add-btn w-full py-3 text-[11px] tracking-[0.28em] uppercase transition-colors duration-300 border ${
            soldOut ? 'cursor-not-allowed opacity-50' : ''
          }`}
          style={{
            background: 'transparent',
            color: 'var(--color-forest)',
            borderColor: 'var(--color-forest)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {soldOut ? soldOutLabel : addLabel}
        </button>
      </div>

      <style>{`
        .add-btn:hover:not(:disabled) {
          background: var(--color-gold) !important;
          border-color: var(--color-gold) !important;
          color: var(--color-forest) !important;
        }
      `}</style>
    </motion.article>
  )
}

function FeaturedSkeletonCard() {
  return (
    <motion.div
      animate={{ opacity: [0.5, 0.85, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="shrink-0 w-[280px]"
      aria-hidden="true"
    >
      <div className="h-[320px]" style={{ background: 'var(--color-beige)' }} />
      <div className="pt-5">
        <div className="mb-4 h-4 w-2/3" style={{ background: 'rgba(28,43,26,0.12)' }} />
        <div className="h-9 w-full" style={{ background: 'rgba(28,43,26,0.08)' }} />
      </div>
    </motion.div>
  )
}

