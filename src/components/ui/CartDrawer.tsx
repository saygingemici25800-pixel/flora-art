import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import {
  selectItemCount,
  selectSubtotal,
  useCartStore,
  type CartItem,
} from '../../store/cartStore'
import ProductMotif from './ProductMotif'

const EASE = [0.16, 1, 0.3, 1] as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

export default function CartDrawer() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  const isOpen = useCartStore((s) => s.isOpen)
  const items = useCartStore((s) => s.items)
  const close = useCartStore((s) => s.close)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const itemCount = useCartStore(selectItemCount)
  const subtotal = useCartStore(selectSubtotal)
  const currency = t('featured.currency') as string

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={close}
            className="fixed inset-0 z-[150]"
            style={{ background: 'rgba(28, 43, 26, 0.45)', backdropFilter: 'blur(4px)' }}
            aria-hidden="true"
          />

          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed top-0 right-0 bottom-0 z-[151] w-full sm:w-[440px] max-w-full flex flex-col shadow-[-30px_0_80px_-30px_rgba(28,43,26,0.45)]"
            style={{ background: 'var(--color-cream)' }}
            role="dialog"
            aria-modal="true"
            aria-label={t('cart.title')}
          >
            <div
              className="flex items-center justify-between px-6 md:px-8 py-5 border-b"
              style={{
                borderColor: 'rgba(28,43,26,0.10)',
                background: 'var(--color-cream)',
              }}
            >
              <h2
                className="italic flex items-baseline gap-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--color-forest)',
                  letterSpacing: '-0.005em',
                }}
              >
                {t('cart.title')}
                {itemCount > 0 && (
                  <span
                    className="text-[14px] not-italic"
                    style={{
                      color: 'var(--color-gold)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    ({itemCount})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={t('cart.close')}
                className="grid place-items-center w-9 h-9 rounded-full transition-colors hover:bg-[var(--color-beige)]"
                style={{ color: 'var(--color-forest)' }}
              >
                <CloseIcon />
              </button>
            </div>

            {items.length === 0 ? (
              <EmptyCart
                prefix={prefix}
                onBrowse={close}
                title={t('cart.empty')}
                hint={t('cart.emptyHint')}
                cta={t('cart.browseCta')}
              />
            ) : (
              <>
                <ul
                  className="flex-1 overflow-y-auto px-6 md:px-8 py-4"
                  style={{ background: 'var(--color-cream)' }}
                >
                  {items.map((item) => (
                    <CartRow
                      key={item.id}
                      item={item}
                      currency={currency}
                      onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                      onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                      onRemove={() => removeItem(item.id)}
                      removeLabel={t('cart.remove') as string}
                      incLabel={t('cart.increment') as string}
                      decLabel={t('cart.decrement') as string}
                    />
                  ))}
                </ul>

                <div
                  className="px-6 md:px-8 py-6 border-t"
                  style={{
                    borderColor: 'rgba(28,43,26,0.10)',
                    background: 'var(--color-cream)',
                  }}
                >
                  <div className="flex items-baseline justify-between mb-5">
                    <span
                      className="text-[11px] tracking-[0.3em] uppercase"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.7 }}
                    >
                      {t('cart.subtotal')}
                    </span>
                    <span
                      className="italic"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.75rem',
                        color: 'var(--color-forest)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {currency}
                      {subtotal}
                    </span>
                  </div>

                  <Link
                    to={`${prefix}/checkout`}
                    onClick={close}
                    className="checkout-cta group inline-flex items-center justify-center gap-2 w-full py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
                    style={{
                      background: 'var(--color-gold)',
                      color: 'var(--color-forest)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <span>{t('cart.checkout')}</span>
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  <style>{`
                    .checkout-cta:hover {
                      background: var(--color-forest) !important;
                      color: var(--color-cream) !important;
                    }
                  `}</style>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function CartRow({
  item,
  currency,
  onIncrement,
  onDecrement,
  onRemove,
  removeLabel,
  incLabel,
  decLabel,
}: {
  item: CartItem
  currency: string
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
  removeLabel: string
  incLabel: string
  decLabel: string
}) {
  return (
    <li
      className="flex gap-4 py-5 border-b"
      style={{ borderColor: 'rgba(28,43,26,0.08)' }}
    >
      <div
        className="relative shrink-0 w-[88px] h-[112px] overflow-hidden"
        style={{ background: 'var(--color-beige)' }}
      >
        <ProductMotif kind={item.motif} />
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className="leading-snug mb-1 truncate"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            color: 'var(--color-forest)',
            letterSpacing: '-0.005em',
          }}
        >
          {item.name}
        </h3>
        <p
          className="mb-3"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--color-gold)',
          }}
        >
          {currency}
          {item.price * item.quantity}
        </p>

        <div className="flex items-center justify-between">
          <div
            className="inline-flex items-center"
            style={{ border: '1px solid rgba(28,43,26,0.15)' }}
          >
            <button
              type="button"
              onClick={onDecrement}
              aria-label={decLabel}
              className="w-8 h-8 grid place-items-center transition-colors hover:bg-[var(--color-beige)]"
              style={{ color: 'var(--color-forest)' }}
            >
              −
            </button>
            <span
              className="w-8 text-center text-[14px]"
              style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-body)' }}
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              aria-label={incLabel}
              className="w-8 h-8 grid place-items-center transition-colors hover:bg-[var(--color-beige)]"
              style={{ color: 'var(--color-forest)' }}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={removeLabel}
            className="text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-[var(--color-gold)]"
            style={{ color: 'var(--color-ink)', opacity: 0.6, fontFamily: 'var(--font-body)' }}
          >
            {removeLabel}
          </button>
        </div>
      </div>
    </li>
  )
}

function EmptyCart({
  prefix,
  onBrowse,
  title,
  hint,
  cta,
}: {
  prefix: string
  onBrowse: () => void
  title: string
  hint: string
  cta: string
}) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center text-center px-8"
      style={{ background: 'var(--color-cream)' }}
    >
      <div className="w-32 h-32 mb-6 opacity-70">
        <EmptyBotanical />
      </div>
      <p
        className="italic mb-3"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          color: 'var(--color-forest)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </p>
      <p
        className="max-w-[28ch] mb-8"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: 'var(--color-ink)',
          opacity: 0.65,
        }}
      >
        {hint}
      </p>
      <Link
        to={`${prefix}/shop`}
        onClick={onBrowse}
        className="px-7 py-3 text-[11px] tracking-[0.28em] uppercase transition-colors"
        style={{
          background: 'var(--color-forest)',
          color: 'var(--color-cream)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {cta}
      </Link>
    </div>
  )
}

function EmptyBotanical() {
  return (
    <svg viewBox="0 0 120 140" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: 'var(--color-gold)' }}>
      <g transform="translate(60 120)">
        <path d="M 0 0 C 0 -30, -5 -60, -3 -90 C 0 -110, 15 -120, 10 -135" />
        <path d="M -3 -60 C -25 -65, -45 -55, -55 -70" />
        <path d="M 0 -90 C 20 -90, 40 -90, 50 -100" />
        <ellipse cx="-40" cy="-65" rx="18" ry="6" transform="rotate(-15 -40 -65)" />
        <ellipse cx="40" cy="-95" rx="20" ry="6" transform="rotate(15 40 -95)" />
        <g transform="translate(10 -135)">
          {[0, 60, 120, 180, 240, 300].map((rot) => (
            <ellipse key={rot} cx="0" cy="-7" rx="3" ry="7" transform={`rotate(${rot})`} />
          ))}
          <circle r="2" fill="currentColor" />
        </g>
        <path d="M -25 0 L 25 0" />
      </g>
    </svg>
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
