import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useCartStore } from '../../store/cartStore'
import type { StoreProduct } from '../../hooks/useProducts'
import ProductMotif from './ProductMotif'

const EASE = [0.16, 1, 0.3, 1] as const

interface Props {
  product: StoreProduct | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: Props) {
  const { t } = useTranslation()
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="qv-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-[200] grid place-items-center px-4 py-6"
          style={{ background: 'rgba(1,62,55, 0.55)', backdropFilter: 'blur(6px)' }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[920px] grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-auto"
            style={{ background: 'var(--color-cream)' }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t('cart.close')}
              className="absolute top-4 right-4 z-10 grid place-items-center w-10 h-10 rounded-full transition-colors"
              style={{
                background: 'rgba(255,239,179, 0.92)',
                color: 'var(--color-forest)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <CloseIcon />
            </button>

            <div
              className="relative aspect-[3/4] md:aspect-auto md:min-h-[480px]"
              style={{ background: 'var(--color-beige)' }}
            >
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <ProductMotif kind={product.motif} />
              )}
              {!product.available ? (
                <span
                  className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase"
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
                product.badge && (
                  <span
                    className="absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.25em] uppercase"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontVariant: 'small-caps',
                      background: 'var(--color-gold)',
                      color: 'var(--color-forest)',
                      fontWeight: 500,
                    }}
                  >
                    {t(`featured.badges.${product.badge}`)}
                  </span>
                )
              )}
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-3"
                style={{
                  color: 'var(--color-gold)',
                  fontFamily: 'var(--font-display)',
                  fontVariant: 'small-caps',
                }}
              >
                Flora Art
              </p>

              <h2
                className="italic leading-tight mb-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  color: 'var(--color-forest)',
                  letterSpacing: '-0.01em',
                }}
              >
                {product.name}
              </h2>

              <p
                className="mb-8 flex items-baseline gap-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.02em',
                }}
              >
                <span>
                  {t('featured.currency') as string}
                  {product.price}
                </span>
                {product.oldPrice != null && (
                  <span
                    className="line-through"
                    style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--color-ink)', opacity: 0.45 }}
                  >
                    {t('featured.currency') as string}
                    {product.oldPrice}
                  </span>
                )}
              </p>

              <p
                className="mb-8 leading-relaxed"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--color-ink)',
                  opacity: 0.75,
                }}
              >
                {t('story.p1')}
              </p>

              <button
                type="button"
                disabled={!product.available}
                onClick={() => {
                  if (!product.available) return
                  addItem(product)
                  onClose()
                }}
                className={`qv-add-btn w-full py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                  product.available ? '' : 'cursor-not-allowed opacity-50'
                }`}
                style={{
                  background: 'var(--color-forest)',
                  color: 'var(--color-cream)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {product.available ? t('featured.addToCart') : t('featured.soldOut')}
              </button>

              <style>{`
                .qv-add-btn:hover:not(:disabled) {
                  background: var(--color-gold) !important;
                  color: var(--color-forest) !important;
                }
              `}</style>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
