import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import {
  selectSubtotal,
  useCartStore,
  type CartItem,
} from '../store/cartStore'
import type { Order, OrderInput } from '../types'
import ProductMotif from '../components/ui/ProductMotif'

const EASE = [0.16, 1, 0.3, 1] as const

// WhatsApp routing by the customer's chosen contact language (NOT the site
// language): Turkish → Vahap's line, English / Russian → Aliona (international).
const WA_NUMBER_TR = '905015317748'
const WA_NUMBER_INTL = '905318448730'

// Endonyms — identical in every UI language, so kept here rather than in i18n.
const LANGS = [
  { id: 'tr', label: 'Türkçe' },
  { id: 'en', label: 'English' },
  { id: 'ru', label: 'Русский' },
] as const
type ContactLang = (typeof LANGS)[number]['id']

function normalizeLang(lang: string | undefined): ContactLang {
  if (lang?.startsWith('en')) return 'en'
  if (lang?.startsWith('ru')) return 'ru'
  return 'tr'
}

interface TimeOption {
  id: string
  label: string
}

interface FormState {
  ordererName: string
  contactLang: ContactLang
  isGift: boolean
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  cardNote: string
  orderNote: string
  date: string
  time: string
}

const EMPTY_FORM: FormState = {
  ordererName: '',
  contactLang: 'tr',
  isGift: false,
  recipientName: '',
  recipientPhone: '',
  recipientAddress: '',
  cardNote: '',
  orderNote: '',
  date: '',
  time: '',
}

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

function todayIso(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function Checkout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const prefix = langPrefix(location.pathname)

  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore(selectSubtotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const currency = t('featured.currency') as string

  // Default the contact language to the active site language; the customer can
  // still change it, and the WhatsApp routing follows their choice.
  const [form, setForm] = useState<FormState>(() => ({
    ...EMPTY_FORM,
    contactLang: normalizeLang(i18n.language),
  }))
  const [submitting, setSubmitting] = useState(false)

  const total = subtotal
  const canSubmit = form.ordererName.trim() !== ''
  const waNumber = form.contactLang === 'tr' ? WA_NUMBER_TR : WA_NUMBER_INTL

  const times = t('checkout.general.times', { returnObjects: true }) as TimeOption[]

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function timeLabel(): string {
    if (!form.time) return ''
    return times.find((s) => s.id === form.time)?.label ?? ''
  }

  function contactLangLabel(): string {
    return LANGS.find((l) => l.id === form.contactLang)?.label ?? form.contactLang
  }

  /** Map the cart + form into the API's OrderInput shape. */
  function buildOrderInput(): OrderInput {
    const region = form.isGift
      ? (t('checkout.wa.giftRegion') as string)
      : (t('checkout.wa.selfRegion') as string)
    return {
      customer: {
        name: form.ordererName.trim(),
        phone: '',
        email: '',
      },
      items: items.map((it) => ({
        productId: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      delivery: {
        region,
        date: form.date,
        timeSlot: timeLabel(),
        address: form.isGift ? form.recipientAddress.trim() : '',
        giftNote: form.isGift ? form.cardNote.trim() || undefined : undefined,
        recipientName: form.isGift ? form.recipientName.trim() || undefined : undefined,
        recipientPhone: form.isGift ? form.recipientPhone.trim() || undefined : undefined,
        note: form.orderNote.trim() || undefined,
      },
      subtotal,
      deliveryFee: 0,
      total,
      paymentMethod: 'whatsapp',
    }
  }

  /**
   * Persist to KV (best-effort) so the order shows up in the admin panel and we
   * can stamp #FA-XXXX into the message. Returns null if the API is unavailable
   * (e.g. plain `vite` dev with no functions) — WhatsApp still works either way.
   */
  async function persistOrder(): Promise<string | null> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildOrderInput()),
      })
      if (!res.ok) return null
      const order = (await res.json()) as Order
      return order.orderNumber ?? null
    } catch {
      return null
    }
  }

  /** Compose the single block message that gets handed to WhatsApp. */
  function buildMessage(orderNumber: string | null): string {
    const L = (k: string) => t(`checkout.wa.${k}`) as string
    const lines: string[] = []
    lines.push(`🌸 FLORA ART — ${L('newOrder')}`)
    lines.push('')
    lines.push(`👤 ${L('orderer')}: ${form.ordererName.trim()}`)
    lines.push(`🗣️ ${L('contactLang')}: ${contactLangLabel()}`)
    lines.push('')
    lines.push(`📦 ${L('products')}:`)
    for (const it of items) {
      lines.push(`• ${it.name} x${it.quantity} — ${it.price * it.quantity}₺`)
    }
    lines.push(`💰 ${L('total')}: ${total}₺`)

    if (form.isGift) {
      lines.push('')
      lines.push(
        `🎁 ${L('recipient')}: ${form.recipientName.trim() || '—'} — ${
          form.recipientPhone.trim() || '—'
        }`,
      )
      if (form.recipientAddress.trim())
        lines.push(`📍 ${L('address')}: ${form.recipientAddress.trim()}`)
      if (form.cardNote.trim())
        lines.push(`💌 ${L('cardNote')}: ${form.cardNote.trim()}`)
    }

    if (form.orderNote.trim()) {
      lines.push('')
      lines.push(`📝 ${L('orderNote')}: ${form.orderNote.trim()}`)
    }

    const tl = timeLabel()
    if (form.date || tl) {
      lines.push('')
      lines.push(`📅 ${L('schedule')}: ${[form.date, tl].filter(Boolean).join(' · ')}`)
    }

    if (orderNumber) {
      lines.push('')
      lines.push(`🔖 ${L('orderNo')}: ${orderNumber}`)
    }
    return lines.join('\n')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)

    const orderNumber = await persistOrder()
    const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(
      buildMessage(orderNumber),
    )}`

    clearCart()
    try {
      window.open(href, '_blank', 'noopener,noreferrer')
    } catch {
      /* popup blocked — order is already captured */
    }
    navigate(`${prefix}/order-success`, {
      state: { orderNumber: orderNumber ?? undefined },
    })
  }

  if (items.length === 0) {
    return <EmptyCheckout prefix={prefix} />
  }

  return (
    <section className="relative w-full" style={{ background: 'var(--color-cream)' }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-[110px] md:pt-[140px] pb-20 md:pb-28">
        <header className="mb-12 md:mb-16">
          <p
            className="text-[11px] tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-body)' }}
          >
            Flora Art
          </p>
          <h1
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--color-forest)',
              letterSpacing: '-0.015em',
              lineHeight: 1,
            }}
          >
            {t('checkout.title')}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
          <form onSubmit={handleSubmit} className="md:col-span-7">
            {/* Orderer */}
            <fieldset>
              <h2 className="form-section-title">{t('checkout.orderer.title')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label={t('checkout.orderer.name') as string} required>
                  <input
                    type="text"
                    required
                    value={form.ordererName}
                    onChange={(e) => update('ordererName', e.target.value)}
                    className="flora-input"
                  />
                </Field>

                <div>
                  <span className="form-label">
                    {t('checkout.contactLang.label')}
                    <span className="opacity-60"> *</span>
                  </span>
                  <div
                    className="flex gap-2"
                    role="radiogroup"
                    aria-label={t('checkout.contactLang.label') as string}
                  >
                    {LANGS.map((l) => {
                      const active = form.contactLang === l.id
                      return (
                        <button
                          key={l.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => update('contactLang', l.id)}
                          className="lang-pill flex-1 px-3 py-3 text-[12px] tracking-[0.06em] transition-colors duration-200"
                          style={{
                            background: active ? 'var(--color-forest)' : 'transparent',
                            color: active ? 'var(--color-cream)' : 'var(--color-forest)',
                            border: `1px solid ${
                              active ? 'var(--color-forest)' : 'rgba(1,62,55,0.2)'
                            }`,
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {l.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Gift toggle + recipient */}
            <div className="mt-14">
              <GiftToggle
                on={form.isGift}
                onToggle={() => update('isGift', !form.isGift)}
                label={t('checkout.gift.toggle') as string}
                hint={t('checkout.gift.hint') as string}
              />

              <AnimatePresence initial={false}>
                {form.isGift && (
                  <motion.div
                    key="recipient"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label={t('checkout.gift.recipientName') as string}>
                        <input
                          type="text"
                          value={form.recipientName}
                          onChange={(e) => update('recipientName', e.target.value)}
                          className="flora-input"
                        />
                      </Field>
                      <Field label={t('checkout.gift.recipientPhone') as string}>
                        <input
                          type="tel"
                          value={form.recipientPhone}
                          onChange={(e) => update('recipientPhone', e.target.value)}
                          className="flora-input"
                        />
                      </Field>
                    </div>
                    <div className="mt-6">
                      <Field label={t('checkout.gift.address') as string}>
                        <textarea
                          rows={3}
                          value={form.recipientAddress}
                          onChange={(e) => update('recipientAddress', e.target.value)}
                          placeholder={t('checkout.gift.addressPlaceholder') as string}
                          className="flora-input"
                          style={{ resize: 'none' }}
                        />
                      </Field>
                    </div>
                    <div className="mt-6">
                      <Field label={t('checkout.gift.cardNote') as string}>
                        <textarea
                          rows={3}
                          value={form.cardNote}
                          onChange={(e) => update('cardNote', e.target.value)}
                          placeholder={t('checkout.gift.cardNotePlaceholder') as string}
                          className="flora-input italic"
                          style={{
                            resize: 'none',
                            fontFamily: 'var(--font-display)',
                            fontSize: '1rem',
                          }}
                        />
                      </Field>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* General */}
            <fieldset className="mt-14">
              <h2 className="form-section-title">{t('checkout.general.title')}</h2>
              <Field label={t('checkout.general.orderNote') as string}>
                <textarea
                  rows={3}
                  value={form.orderNote}
                  onChange={(e) => update('orderNote', e.target.value)}
                  placeholder={t('checkout.general.orderNotePlaceholder') as string}
                  className="flora-input"
                  style={{ resize: 'none' }}
                />
              </Field>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label={t('checkout.general.date') as string}>
                  <input
                    type="date"
                    value={form.date}
                    min={todayIso()}
                    onChange={(e) => update('date', e.target.value)}
                    className="flora-input"
                  />
                </Field>
                <Field label={t('checkout.general.time') as string}>
                  <select
                    value={form.time}
                    onChange={(e) => update('time', e.target.value)}
                    className="flora-input"
                  >
                    <option value="">{t('checkout.general.timeAny')}</option>
                    {times.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </fieldset>

            {!canSubmit && (
              <p
                className="mt-12 text-[12px] tracking-[0.05em]"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-ink)',
                  opacity: 0.6,
                }}
              >
                {t('checkout.requiredHint')}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={`wa-submit mt-6 inline-flex items-center justify-center gap-3 w-full py-4 px-8 text-[12px] tracking-[0.3em] uppercase transition-all duration-300 ${
                !canSubmit || submitting ? 'cursor-not-allowed opacity-50' : ''
              }`}
              style={{
                background: '#25D366',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
              }}
            >
              <WhatsAppGlyph />
              {submitting ? t('checkout.submitting') : t('checkout.submit')}
            </button>

            <p
              className="mt-6 text-[11px] leading-relaxed max-w-[52ch]"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-ink)',
                opacity: 0.55,
              }}
            >
              {t('checkout.privacyNote')}
            </p>

            <FormStyles />
          </form>

          <aside className="md:col-span-5 md:sticky md:top-[100px]">
            <SummaryCard items={items} total={total} currency={currency} />
          </aside>
        </div>
      </div>
    </section>
  )
}

function GiftToggle({
  on,
  onToggle,
  label,
  hint,
}: {
  on: boolean
  onToggle: () => void
  label: string
  hint: string
}) {
  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className="inline-flex items-center gap-3"
      >
        <span
          className="relative inline-flex items-center w-12 h-7 rounded-full transition-colors duration-300 shrink-0"
          style={{
            background: on ? 'var(--color-forest)' : 'rgba(1,62,55,0.15)',
            border: '1px solid rgba(1,62,55,0.2)',
          }}
        >
          <span
            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-all duration-300"
            style={{
              left: on ? 'calc(100% - 23px)' : '3px',
              background: on ? 'var(--color-gold)' : 'var(--color-cream)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          />
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--color-forest)',
            fontWeight: 500,
          }}
        >
          {label}
        </span>
      </button>
      <p
        className="mt-3 text-[12px] leading-relaxed max-w-[46ch]"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-ink)',
          opacity: 0.55,
        }}
      >
        {hint}
      </p>
    </div>
  )
}

function SummaryCard({
  items,
  total,
  currency,
}: {
  items: CartItem[]
  total: number
  currency: string
}) {
  const { t } = useTranslation()
  const badges = t('checkout.trustBadges', { returnObjects: true }) as string[]

  return (
    <div
      className="p-6 md:p-8"
      style={{
        background: 'var(--color-beige)',
        border: '1px solid rgba(200, 169, 110, 0.4)',
      }}
    >
      <h2
        className="italic mb-6"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.65rem',
          color: 'var(--color-forest)',
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        {t('checkout.summary.title')}
      </h2>

      <ul className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-1">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3">
            <div
              className="relative shrink-0 w-[64px] h-[80px] overflow-hidden"
              style={{ background: 'rgba(1,62,55,0.06)' }}
            >
              <ProductMotif kind={it.motif} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="leading-snug truncate"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  color: 'var(--color-forest)',
                  letterSpacing: '-0.005em',
                }}
              >
                {it.name}
              </p>
              <p
                className="text-[11px] tracking-[0.18em] uppercase mt-1"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-ink)',
                  opacity: 0.6,
                }}
              >
                × {it.quantity}
              </p>
            </div>
            <span
              className="whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                color: 'var(--color-bronze)',
              }}
            >
              {currency}
              {it.price * it.quantity}
            </span>
          </li>
        ))}
      </ul>

      <div className="pt-4" style={{ borderTop: '1px solid rgba(1,62,55,0.18)' }}>
        <div className="flex items-baseline justify-between gap-3">
          <span
            className="text-[11px] tracking-[0.28em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-ink)',
              opacity: 0.65,
            }}
          >
            {t('checkout.summary.total')}
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
            {total}
          </span>
        </div>
      </div>

      <ul
        className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] tracking-[0.2em] uppercase pt-4"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-ink)',
          opacity: 0.7,
          borderTop: '1px solid rgba(1,62,55,0.12)',
        }}
      >
        {badges.map((b, i) => (
          <li key={i} className="flex items-center gap-2">
            <BadgeIcon idx={i} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <p
        className="mt-4 italic text-[12px] leading-relaxed"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-forest)',
          opacity: 0.7,
        }}
      >
        {t('checkout.summary.qualityNote')}
      </p>
    </div>
  )
}

function Field({
  label,
  children,
  required = false,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="form-label">
        {label}
        {required && <span className="opacity-60"> *</span>}
      </span>
      {children}
    </label>
  )
}

function FormStyles() {
  return (
    <style>{`
      .form-section-title {
        font-family: var(--font-display);
        font-size: clamp(1.5rem, 2.5vw, 2rem);
        font-style: italic;
        color: var(--color-forest);
        letter-spacing: -0.01em;
        margin-bottom: 1.75rem;
        line-height: 1;
      }
      .form-label {
        display: block;
        font-family: var(--font-body);
        color: var(--color-ink);
        opacity: 0.65;
        font-size: 10px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        margin-bottom: 0.6rem;
      }
      .flora-input {
        width: 100%;
        padding: 0.9rem 0.95rem;
        background: transparent;
        border: 1px solid rgba(1,62,55,0.18);
        outline: none;
        color: var(--color-forest);
        font-family: var(--font-body);
        font-size: 0.95rem;
        transition: border-color 0.25s ease;
      }
      .flora-input:focus {
        border-color: var(--color-gold);
      }
      .lang-pill:hover {
        border-color: var(--color-gold) !important;
      }
      .wa-submit:not(:disabled):hover {
        filter: brightness(0.94);
      }
    `}</style>
  )
}

function BadgeIcon({ idx }: { idx: number }) {
  const common = {
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
      <svg {...common}>
        <path d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z" />
        <path d="M9 12 l2 2 l4 -4" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M12 21 C12 21 4 14 4 8.5 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 20 8.5 C20 14 12 21 12 21 Z" />
    </svg>
  )
}

function WhatsAppGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.18 0 6.167 1.24 8.413 3.488A11.82 11.82 0 0123.94 11.9c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.595 5.39l-.999 3.648 3.893-.937z" />
    </svg>
  )
}

function EmptyCheckout({ prefix }: { prefix: string }) {
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
          {t('checkout.empty.title')}
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
          {t('checkout.empty.hint')}
        </p>
        <Link
          to={`${prefix}/shop`}
          className="inline-flex items-center gap-2 mt-10 px-7 py-3 text-[12px] tracking-[0.28em] uppercase transition-colors"
          style={{
            background: 'var(--color-forest)',
            color: 'var(--color-cream)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {t('checkout.empty.cta')} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
