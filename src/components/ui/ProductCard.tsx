import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useCartStore } from '../../store/cartStore'
import type { StoreProduct } from '../../hooks/useProducts'
import ProductMotif from './ProductMotif'

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

const EASE = [0.16, 1, 0.3, 1] as const

const CATEGORY_ORDER = [
  'bouquet',
  'box',
  'wedding',
  'corporate',
  'plant',
  'international',
] as const

function categoryIndex(id: string): number {
  const idx = (CATEGORY_ORDER as readonly string[]).indexOf(id)
  return idx === -1 ? 0 : idx
}

interface Props {
  product: StoreProduct
  index?: number
  onQuickView?: (product: StoreProduct) => void
  /** Override the default 3/4 image aspect-ratio (e.g. '4 / 5', '1 / 1') */
  aspectRatio?: string
}

export default function ProductCard({
  product,
  index = 0,
  onQuickView,
  aspectRatio = '3 / 4',
}: Props) {
  const { t } = useTranslation()
  const location = useLocation()
  const addItem = useCartStore((s) => s.addItem)
  const [wished, setWished] = useState(false)

  const prefix = langPrefix(location.pathname)
  const productHref = `${prefix}/product/${product.id}`
  const currency = t('featured.currency') as string
  const soldOut = !product.available
  const badgeLabel = product.badge
    ? (t(`featured.badges.${product.badge}`) as string)
    : undefined
  const categoryName = t(`categories.${categoryIndex(product.category)}.name`) as string

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.05 * (index % 8) }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col transition-shadow duration-500 hover:shadow-[0_24px_60px_-24px_rgba(1, 62, 55,0.32)]"
    >
      <Link
        to={productHref}
        className="relative block overflow-hidden"
        style={{
          background: 'var(--color-beige)',
          aspectRatio,
        }}
      >
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          style={soldOut ? { filter: 'grayscale(0.4)', opacity: 0.8 } : undefined}
        >
          <ProductMotif kind={product.motif} />
        </div>

        <button
          type="button"
          aria-label="Wishlist"
          aria-pressed={wished}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setWished((v) => !v)
          }}
          className="absolute top-4 left-4 grid place-items-center w-10 h-10 rounded-full transition-colors"
          style={{
            background: 'rgba(255, 239, 179, 0.85)',
            color: wished ? 'var(--color-gold)' : 'var(--color-forest)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <HeartIcon filled={wished} />
        </button>

        {soldOut ? (
          <span
            className="absolute top-4 right-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontVariant: 'small-caps',
              background: 'var(--color-forest)',
              color: 'var(--color-cream)',
              fontWeight: 500,
            }}
          >
            {t('featured.soldOut')}
          </span>
        ) : (
          badgeLabel && (
            <span
              className="absolute top-4 right-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase"
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

        {onQuickView && !soldOut && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onQuickView(product)
            }}
            className="absolute left-1/2 bottom-3 -translate-x-1/2 px-4 py-2 text-[10px] tracking-[0.28em] uppercase opacity-0 translate-y-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0"
            style={{
              background: 'rgba(1, 62, 55, 0.92)',
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-body)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {t('shop.quickView')}
          </button>
        )}
      </Link>

      <div className="px-5 pt-4 pb-6 flex flex-col flex-1">
        <p
          className="text-[0.75rem] tracking-[0.3em] uppercase mb-2"
          style={{
            color: 'var(--color-bronze)',
            fontFamily: 'var(--font-display)',
            fontVariant: 'small-caps',
          }}
        >
          {categoryName}
        </p>

        <h3 className="mb-3">
          <Link
            to={productHref}
            className="transition-colors hover:text-[var(--color-gold)]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--color-forest)',
              letterSpacing: '-0.005em',
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </Link>
        </h3>

        <p
          className="mb-4 whitespace-nowrap flex items-baseline gap-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'var(--color-gold)',
            letterSpacing: '0.02em',
          }}
        >
          <span>
            {currency}
            {product.price}
          </span>
          {product.oldPrice != null && (
            <span
              className="line-through"
              style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-ink)', opacity: 0.45 }}
            >
              {currency}
              {product.oldPrice}
            </span>
          )}
        </p>

        <button
          type="button"
          disabled={soldOut}
          onClick={(e) => {
            e.preventDefault()
            if (!soldOut) addItem(product)
          }}
          className={`add-to-cart-btn w-full py-3 text-[0.8rem] tracking-[0.12em] uppercase transition-colors duration-300 border mt-auto ${
            soldOut ? 'cursor-not-allowed opacity-50' : ''
          }`}
          style={{
            background: 'transparent',
            color: 'var(--color-forest)',
            borderColor: 'var(--color-forest)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {soldOut ? t('featured.soldOut') : t('featured.addToCart')}
        </button>
      </div>

      <style>{`
        .add-to-cart-btn:hover:not(:disabled) {
          background: var(--color-gold) !important;
          border-color: var(--color-gold) !important;
          color: var(--color-forest) !important;
        }
      `}</style>
    </motion.article>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  )
}
