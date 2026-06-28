import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useProducts, type StoreProduct } from '../hooks/useProducts'
import { useCartStore } from '../store/cartStore'
import { useSEO } from '../hooks/useSEO'
import ProductMotif from '../components/ui/ProductMotif'
import ProductCard from '../components/ui/ProductCard'
import TiltCard from '../components/ui/TiltCard'
import { MagneticButton } from '../components/ui/magnetic-button'

const EASE = [0.16, 1, 0.3, 1] as const

interface ImageVariant {
  color: string
  opacity: number
}

const VARIANTS: ImageVariant[] = [
  { color: 'var(--color-forest)', opacity: 0.55 },
  { color: 'var(--color-gold)',   opacity: 0.6 },
  { color: 'var(--color-forest)', opacity: 0.85 },
]

const CATEGORY_ORDER = [
  'bouquet',
  'box',
  'plant',
  'wreath',
  'weddingcar',
] as const

function categoryIndex(id: string): number {
  const idx = (CATEGORY_ORDER as readonly string[]).indexOf(id)
  return idx === -1 ? 0 : idx
}

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const addItem = useCartStore((s) => s.addItem)
  const { products, loading, error } = useProducts()

  const product = useMemo(() => products.find((p) => p.id === id), [products, id])
  const similar = useMemo(
    () =>
      product
        ? products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
        : [],
    [products, product],
  )

  if (loading) {
    return <ProductDetailSkeleton />
  }
  // A fetch failure must not be reported as a non-existent product.
  if (error) {
    return <LoadError prefix={prefix} message={error} />
  }
  if (!product) {
    return <NotFound prefix={prefix} />
  }

  return (
    <ProductDetailContent
      key={product.id}
      product={product}
      similar={similar}
      prefix={prefix}
      addItem={addItem}
      t={t}
    />
  )
}

interface ContentProps {
  product: StoreProduct
  similar: StoreProduct[]
  prefix: string
  addItem: (p: StoreProduct) => void
  t: ReturnType<typeof useTranslation>['t']
}

function ProductDetailContent({ product, similar, prefix, addItem, t }: ContentProps) {
  useSEO({
    title: t('seo.product.titleTemplate', { name: product.name }) as string,
    description: t('seo.product.description') as string,
  })

  const [variant, setVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const currency = t('featured.currency') as string
  const features = t('product.features', { returnObjects: true }) as string[]
  const trustBadges = t('product.trustBadges', { returnObjects: true }) as string[]
  const categoryName = t(`categories.${categoryIndex(product.category)}.name`) as string

  return (
    <>
      <section className="relative w-full" style={{ background: 'var(--color-cream)' }}>
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-[110px] md:pt-[140px] pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="md:col-span-7"
          >
            <TiltCard
              className="relative"
              style={{ background: 'var(--color-beige)', aspectRatio: '4 / 5' }}
            >
              {/* Motif layer — clipped HERE (not on the tilting card, which must
                  stay overflow:visible so preserve-3d isn't flattened). */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ transform: 'translateZ(40px)' }}
              >
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={variant}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="absolute inset-0"
                    >
                      <ProductMotif
                        kind={product.motif}
                        color={VARIANTS[variant].color}
                        opacity={VARIANTS[variant].opacity}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {product.badge && (
                <span
                  className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase z-[2]"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontVariant: 'small-caps',
                    background: 'var(--color-gold)',
                    color: 'var(--color-forest)',
                    fontWeight: 500,
                    transform: 'translateZ(60px)',
                  }}
                >
                  {t(`featured.badges.${product.badge}`)}
                </span>
              )}
              <span
                aria-hidden="true"
                className="absolute bottom-4 right-4 italic"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-gold)',
                  opacity: 0.6,
                  fontSize: '1.2rem',
                  transform: 'translateZ(50px)',
                }}
              >
                ✦
              </span>
            </TiltCard>

            {!product.images[0] && (
              <div className="mt-4 flex gap-3">
                {VARIANTS.map((v, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setVariant(i)}
                    aria-label={`Variant ${i + 1}`}
                    aria-pressed={variant === i}
                    className="relative w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all"
                    style={{
                      background: 'var(--color-beige)',
                      outline:
                        variant === i ? '2px solid var(--color-gold)' : '2px solid transparent',
                      outlineOffset: '2px',
                    }}
                  >
                    <ProductMotif kind={product.motif} color={v.color} opacity={v.opacity} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="md:col-span-5 flex flex-col"
          >
            <nav
              aria-label="Breadcrumb"
              className="text-[11px] tracking-[0.22em] uppercase mb-5 flex items-center gap-2 flex-wrap"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.65 }}
            >
              <Link to={prefix || '/'} className="hover:text-[var(--color-gold)] transition-colors">
                {t('shop.breadcrumbHome')}
              </Link>
              <span aria-hidden="true">·</span>
              <Link to={prefix || '/'} className="hover:text-[var(--color-gold)] transition-colors">
                {t('shop.title')}
              </Link>
              <span aria-hidden="true">·</span>
              <span style={{ color: 'var(--color-forest)', opacity: 0.85 }}>{product.name}</span>
            </nav>

            <p
              className="text-[11px] tracking-[0.32em] uppercase mb-3"
              style={{
                color: 'var(--color-bronze)',
                fontFamily: 'var(--font-display)',
                fontVariant: 'small-caps',
              }}
            >
              {categoryName}
            </p>

            <h1
              className="italic mb-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1.02,
              }}
            >
              {product.name}
            </h1>

            <p
              className="mb-6 flex items-baseline gap-3"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '2rem',
                fontWeight: 700,
                color: 'var(--color-bronze)',
                letterSpacing: '0.01em',
              }}
            >
              <span>
                {currency}
                {product.price}
              </span>
              {product.oldPrice != null && (
                <span
                  className="line-through"
                  style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--color-ink)', opacity: 0.45 }}
                >
                  {currency}
                  {product.oldPrice}
                </span>
              )}
            </p>

            <span
              aria-hidden="true"
              className="block h-px w-full mb-6"
              style={{ background: 'var(--color-gold)', opacity: 0.4 }}
            />

            <ul className="space-y-2 mb-8">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-[14px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
                >
                  <span aria-hidden="true" className="leading-none mt-[2px]" style={{ color: 'var(--color-gold)' }}>
                    ✦
                  </span>
                  <span style={{ opacity: 0.85 }}>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mb-7">
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-2"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.6 }}
              >
                {t('product.quantity')}
              </p>
              <div
                className="inline-flex items-center"
                style={{ border: '1px solid var(--color-gold)' }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label={t('cart.decrement') as string}
                  className="w-10 h-10 grid place-items-center transition-colors hover:bg-[var(--color-beige)]"
                  style={{ color: 'var(--color-forest)' }}
                >
                  −
                </button>
                <span
                  className="w-12 text-center text-[15px]"
                  style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-body)' }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label={t('cart.increment') as string}
                  className="w-10 h-10 grid place-items-center transition-colors hover:bg-[var(--color-beige)]"
                  style={{ color: 'var(--color-forest)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Delivery fees now live in the cart/checkout zone selector and on
                the Delivery page — here we only point the customer to them. */}
            <div
              className="mb-7 flex items-start gap-3 px-4 py-3"
              style={{ border: '1px solid rgba(1,62,55,0.14)', background: 'rgba(1,62,55,0.03)' }}
            >
              <span
                aria-hidden="true"
                className="mt-[1px] text-[14px] leading-none"
                style={{ color: 'var(--color-gold)' }}
              >
                ✦
              </span>
              <p
                className="text-[13px] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.8 }}
              >
                {t('product.deliveryNote')}
              </p>
            </div>

            <div className="mb-6">
              <button
                type="button"
                disabled={!product.available}
                onClick={() => {
                  if (!product.available) return
                  for (let i = 0; i < quantity; i++) addItem(product)
                }}
                className={`pd-cta-primary w-full py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                  product.available ? '' : 'cursor-not-allowed opacity-50'
                }`}
                style={{
                  background: 'var(--color-gold)',
                  color: 'var(--color-forest)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {product.available ? t('product.addToCart') : t('featured.soldOut')}
              </button>
            </div>

            <ul
              className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[11px] tracking-[0.18em] uppercase"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.65 }}
            >
              {trustBadges.map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  <TrustIcon idx={i} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <style>{`
              .pd-cta-primary:hover:not(:disabled) {
                background: var(--color-forest) !important;
                color: var(--color-cream) !important;
              }
            `}</style>
          </motion.div>
        </div>
      </section>

      <section
        className="relative w-full"
        style={{
          background: 'var(--color-cream)',
          paddingBlock: 'var(--spacing-component)',
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          <div className="md:col-span-7">
            <h2
              className="italic mb-5"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {t('product.descriptionTitle')}
            </h2>
            <p
              className="leading-relaxed max-w-[58ch]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--color-ink)',
                opacity: 0.8,
              }}
            >
              {t('product.descriptionBody')}
            </p>
          </div>

          <div className="md:col-span-5">
            <div
              className="p-6 md:p-8 relative"
              style={{ border: '1px solid var(--color-gold)', background: 'transparent' }}
            >
              <span
                aria-hidden="true"
                className="absolute top-4 right-5 italic text-[20px]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-gold)', opacity: 0.7 }}
              >
                ✦
              </span>
              <p
                className="text-[10px] tracking-[0.32em] uppercase mb-3"
                style={{
                  color: 'var(--color-bronze)',
                  fontFamily: 'var(--font-display)',
                  fontVariant: 'small-caps',
                }}
              >
                {t('product.certTitle')}
              </p>
              <p
                className="leading-relaxed mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  color: 'var(--color-forest)',
                  fontStyle: 'italic',
                  letterSpacing: '-0.005em',
                }}
              >
                {t('product.certBody')}
              </p>
              <p
                className="text-[11px] tracking-[0.22em] uppercase"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-ink)',
                  opacity: 0.6,
                }}
              >
                {t('product.certNote')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section
          className="relative w-full"
          style={{
            background: 'var(--color-cream)',
            paddingBlock: 'var(--spacing-section)',
          }}
        >
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="mb-10 md:mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <h2
                className="italic"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  color: 'var(--color-forest)',
                  letterSpacing: '-0.015em',
                  lineHeight: 1,
                }}
              >
                {t('product.similarTitle')}
              </h2>
              <MagneticButton distance={0.4}>
                <Link
                  to={prefix || '/'}
                  className="back-to-collection group inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-4 text-sm tracking-[0.22em] uppercase transition-colors duration-300 sm:w-auto"
                  style={{
                    background: 'transparent',
                    color: 'var(--color-forest)',
                    border: '1.5px solid var(--color-gold)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="inline-flex transition-transform duration-300 group-hover:-translate-x-1"
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  </span>
                  <span>{t('product.backToCollection')}</span>
                </Link>
              </MagneticButton>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
              {similar.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
            <style>{`
              .back-to-collection:hover {
                background: var(--color-gold) !important;
                color: var(--color-forest) !important;
                border-color: var(--color-gold) !important;
              }
            `}</style>
          </div>
        </section>
      )}
    </>
  )
}

function LoadError({ prefix, message }: { prefix: string; message: string }) {
  const { t } = useTranslation()
  return (
    <section
      className="relative w-full grid place-items-center px-6 text-center"
      style={{
        background: 'var(--color-cream)',
        minHeight: 'calc(100dvh - 78px)',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div>
        <p
          className="italic"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            color: 'var(--color-forest)',
            letterSpacing: '-0.015em',
            lineHeight: 1.05,
          }}
        >
          {message}
        </p>
        <Link
          to={prefix || '/'}
          className="inline-flex items-center gap-2 mt-10 px-7 py-3 text-[12px] tracking-[0.28em] uppercase transition-colors"
          style={{
            background: 'var(--color-forest)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {t('product.notFoundCta')} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

function ProductDetailSkeleton() {
  const pulse = {
    animate: { opacity: [0.5, 0.85, 0.5] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
  }
  return (
    <section className="relative w-full" style={{ background: 'var(--color-cream)' }} aria-hidden="true">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-[110px] md:pt-[140px] pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        <div className="md:col-span-7">
          <motion.div {...pulse} className="w-full" style={{ aspectRatio: '4 / 5', background: 'var(--color-beige)' }} />
        </div>
        <div className="md:col-span-5 flex flex-col gap-4 pt-6">
          <motion.div {...pulse} className="h-3 w-1/4" style={{ background: 'rgba(200,169,110,0.3)' }} />
          <motion.div {...pulse} className="h-10 w-3/4" style={{ background: 'rgba(1,62,55,0.12)' }} />
          <motion.div {...pulse} className="h-8 w-1/3" style={{ background: 'rgba(200,169,110,0.25)' }} />
          <motion.div {...pulse} className="h-px w-full" style={{ background: 'rgba(200,169,110,0.3)' }} />
          <motion.div {...pulse} className="h-24 w-full" style={{ background: 'rgba(1,62,55,0.06)' }} />
          <motion.div {...pulse} className="h-12 w-full" style={{ background: 'rgba(1,62,55,0.1)' }} />
        </div>
      </div>
    </section>
  )
}

function NotFound({ prefix }: { prefix: string }) {
  const { t } = useTranslation()
  return (
    <section
      className="relative w-full grid place-items-center px-6 text-center"
      style={{
        background: 'var(--color-cream)',
        minHeight: 'calc(100dvh - 78px)',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <div>
        <p
          className="italic"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: 'var(--color-forest)',
            letterSpacing: '-0.015em',
            lineHeight: 1,
          }}
        >
          {t('product.notFoundTitle')}
        </p>
        <p
          className="mt-4 max-w-[40ch] mx-auto"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--color-ink)',
            opacity: 0.65,
          }}
        >
          {t('product.notFoundHint')}
        </p>
        <Link
          to={prefix || '/'}
          className="inline-flex items-center gap-2 mt-10 px-7 py-3 text-[12px] tracking-[0.28em] uppercase transition-colors"
          style={{
            background: 'var(--color-forest)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {t('product.notFoundCta')} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

function TrustIcon({ idx }: { idx: number }) {
  const props = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    style: { color: 'var(--color-gold)' } as React.CSSProperties,
  }
  if (idx === 0) {
    return (
      <svg {...props}>
        <path d="M12 2 L20 6 V12 C20 17, 16 21, 12 22 C8 21, 4 17, 4 12 V6 Z" />
        <path d="M9 12 L11 14 L15 10" />
      </svg>
    )
  }
  if (idx === 1) {
    return (
      <svg {...props}>
        <path d="M3 12 A9 9 0 0 1 21 12" />
        <path d="M21 4 V12 H13" />
        <path d="M21 12 A9 9 0 0 1 3 12" />
        <path d="M3 20 V12 H11" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7 V12 L15 14" />
    </svg>
  )
}
