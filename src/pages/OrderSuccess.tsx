import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useCartStore } from '../store/cartStore'

const EASE = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '905015317748'

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

function generateOrderId(): string {
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `FA-${rand}`
}

export default function OrderSuccess() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const clearCart = useCartStore((s) => s.clearCart)

  // Real order number from checkout (router state); fall back to a placeholder
  // for direct visits / hard refresh where the navigation state is gone.
  const stateOrderNumber = (location.state as { orderNumber?: string } | null)?.orderNumber
  const [fallbackId] = useState(() => generateOrderId())
  const orderNumber = stateOrderNumber ?? `#${fallbackId}`

  // Clear the cart only on a genuine completion (arrived with an order number),
  // never on a direct visit / refresh that would otherwise empty an in-progress cart.
  useEffect(() => {
    if (stateOrderNumber) clearCart()
  }, [stateOrderNumber, clearCart])

  const confetti = useMemo(() => buildConfetti(), [])

  return (
    <section
      className="relative w-full overflow-hidden grid place-items-center px-6"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        minHeight: 'calc(100dvh - 78px)',
        paddingTop: '120px',
        paddingBottom: '120px',
      }}
    >
      <ConfettiLayer pieces={confetti} />

      <div className="relative z-[2] flex flex-col items-center text-center max-w-[640px]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative grid place-items-center w-32 h-32 md:w-40 md:h-40 mb-10"
        >
          <CheckCircle />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
          className="italic mb-5"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            color: 'var(--color-cream)',
            letterSpacing: '-0.015em',
            lineHeight: 1,
          }}
        >
          {t('orderSuccess.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
          className="flex items-center gap-3 mb-6 text-[12px] tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gold)' }}
        >
          <span style={{ opacity: 0.7 }}>{t('orderSuccess.orderNoLabel')}</span>
          <span style={{ fontSize: '16px', fontWeight: 600, letterSpacing: '0.1em' }}>
            {orderNumber}
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.85 }}
          className="max-w-[42ch] leading-relaxed mb-10"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--color-cream)',
          }}
        >
          {t('orderSuccess.message')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
        >
          <Link
            to={prefix || '/'}
            className="success-cta-primary inline-flex items-center justify-center gap-2 py-4 px-7 text-[12px] tracking-[0.3em] uppercase transition-colors"
            style={{
              background: 'var(--color-gold)',
              color: 'var(--color-forest)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {t('orderSuccess.homeCta')}
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              `Sipariş No: ${orderNumber}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="success-cta-secondary inline-flex items-center justify-center gap-2 py-4 px-7 text-[12px] tracking-[0.3em] uppercase transition-colors border"
            style={{
              background: 'transparent',
              color: 'var(--color-cream)',
              borderColor: 'rgba(255,239,179,0.4)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <WhatsAppGlyph />
            {t('orderSuccess.whatsappCta')}
          </a>
        </motion.div>
      </div>

      <style>{`
        .success-cta-primary:hover {
          background: var(--color-cream) !important;
          color: var(--color-forest) !important;
        }
        .success-cta-secondary:hover {
          background: var(--color-cream) !important;
          color: var(--color-forest) !important;
          border-color: var(--color-cream) !important;
        }
      `}</style>
    </section>
  )
}

function CheckCircle() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: 'var(--color-gold)' }}
    >
      <motion.circle
        cx="50"
        cy="50"
        r="44"
        strokeWidth="1.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      />
      <motion.path
        d="M 30 52 L 45 67 L 72 38"
        strokeWidth="2.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.1 }}
      >
        {[0, 60, 120, 180, 240, 300].map((rot) => (
          <circle
            key={rot}
            cx="50"
            cy="50"
            r="2"
            fill="currentColor"
            transform={`rotate(${rot} 50 50) translate(0 -48)`}
            opacity="0.7"
          />
        ))}
      </motion.g>
    </svg>
  )
}

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  rotate: number
  size: number
  color: string
  shape: 'petal' | 'dot'
}

function buildConfetti(): ConfettiPiece[] {
  const colors = ['var(--color-gold)', 'var(--color-cream)', '#C8A96E', 'rgba(255,239,179,0.85)']
  const pieces: ConfettiPiece[] = []
  for (let i = 0; i < 28; i++) {
    pieces.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      duration: 3.6 + Math.random() * 2.4,
      rotate: (Math.random() - 0.5) * 720,
      size: 4 + Math.random() * 7,
      color: colors[i % colors.length],
      shape: Math.random() > 0.45 ? 'petal' : 'dot',
    })
  }
  return pieces
}

function ConfettiLayer({ pieces }: { pieces: ConfettiPiece[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '110vh',
            opacity: [0, 1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: `${p.left}%`,
            width: p.shape === 'petal' ? p.size : p.size * 0.6,
            height: p.shape === 'petal' ? p.size * 1.8 : p.size * 0.6,
            background: p.color,
            borderRadius: p.shape === 'petal' ? '50% 50% 50% 0' : '50%',
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  )
}

function WhatsAppGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.18 0 6.167 1.24 8.413 3.488A11.82 11.82 0 0123.94 11.9c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.595 5.39l-.999 3.648 3.893-.937z" />
    </svg>
  )
}
