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
const WHATSAPP_NUMBER = '905335335380'

type Region = 'local' | 'turkey' | 'intl'
type TimeSlot = 'morning' | 'noon' | 'evening'

interface FormState {
  fullName: string
  phone: string
  email: string
  region: Region
  country: string
  city: string
  address: string
  date: string
  time: TimeSlot
  giftNote: string
  cardNumber: string
  cardName: string
  expiry: string
  cvv: string
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

function deliveryFeeFor(region: Region): number {
  if (region === 'turkey') return 150
  return 0
}

function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export default function Checkout() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const prefix = langPrefix(location.pathname)

  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore(selectSubtotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const currency = t('featured.currency') as string

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({
    fullName: '',
    phone: '',
    email: '',
    region: 'local',
    country: '',
    city: '',
    address: '',
    date: todayIso(),
    time: 'morning',
    giftNote: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  const deliveryFee = deliveryFeeFor(form.region)
  const total = subtotal + deliveryFee
  const stepLabels = t('checkout.steps', { returnObjects: true }) as string[]

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmitStep1(e: React.FormEvent) {
    e.preventDefault()
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSubmitStep2() {
    setStep(3)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const timesList = t('checkout.step1.times', { returnObjects: true }) as {
    id: TimeSlot
    label: string
  }[]

  /** Map the cart + form into the API's OrderInput shape. */
  function buildOrderInput(paymentMethod: 'card' | 'whatsapp'): OrderInput {
    const timeLabel = timesList.find((s) => s.id === form.time)?.label ?? form.time
    const fullAddress = [form.country, form.city, form.address].filter(Boolean).join(', ')
    const deliveryRegion =
      form.region === 'local'
        ? 'Fethiye'
        : form.region === 'turkey'
        ? form.city.trim() || 'Türkiye'
        : form.country.trim() || 'Uluslararası'
    return {
      customer: {
        name: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      items: items.map((it) => ({
        productId: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
      delivery: {
        region: deliveryRegion,
        date: form.date,
        timeSlot: timeLabel,
        address: fullAddress,
        giftNote: form.giftNote.trim() || undefined,
      },
      subtotal,
      deliveryFee,
      total,
      paymentMethod,
    }
  }

  async function postOrder(paymentMethod: 'card' | 'whatsapp'): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildOrderInput(paymentMethod)),
    })
    if (!res.ok) {
      let detail = ''
      try {
        const data = (await res.json()) as { error?: string }
        if (data?.error) detail = ` (${data.error})`
      } catch {
        /* non-JSON error body */
      }
      throw new Error(`${t('checkout.orderError')}${detail}`)
    }
    return (await res.json()) as Order
  }

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    setSubmitError(null)
    setSubmitting(true)
    try {
      const order = await postOrder('card')
      clearCart()
      navigate(`${prefix}/order-success`, { state: { orderNumber: order.orderNumber } })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : (t('checkout.orderError') as string))
      setSubmitting(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleWhatsAppComplete() {
    if (submitting) return
    setSubmitError(null)
    setSubmitting(true)

    let order: Order
    try {
      order = await postOrder('whatsapp')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : (t('checkout.orderError') as string))
      setSubmitting(false)
      return
    }

    // Order is persisted server-side — from here on never re-enable the button,
    // so a thrown side-effect can't trigger a duplicate POST. WhatsApp is best-effort.
    const itemsLine = items
      .map((it) => `• ${it.name} × ${it.quantity} — ${currency}${it.price * it.quantity}`)
      .join('\n')
    const timeLabel = timesList.find((s) => s.id === form.time)?.label ?? form.time
    const fullAddress = [form.country, form.city, form.address].filter(Boolean).join(', ')
    const msg = t('checkout.step3.whatsappTemplate', {
      items: itemsLine,
      name: form.fullName || '—',
      phone: form.phone || '—',
      address: fullAddress || '—',
      date: form.date,
      time: timeLabel,
      total,
    }) as string
    const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      `${order.orderNumber}\n${msg}`,
    )}`
    clearCart()
    try {
      window.open(href, '_blank', 'noopener,noreferrer')
    } catch {
      /* popup blocked — the order is already placed */
    }
    navigate(`${prefix}/order-success`, { state: { orderNumber: order.orderNumber } })
  }

  if (items.length === 0) {
    return <EmptyCheckout prefix={prefix} />
  }

  return (
    <section className="relative w-full" style={{ background: 'var(--color-cream)' }}>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-[110px] md:pt-[140px] pb-20 md:pb-28">
        <header className="mb-10 md:mb-14">
          <p
            className="text-[11px] tracking-[0.3em] uppercase mb-3"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
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

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
          <div className="md:col-span-7">
            <Stepper current={step} labels={stepLabels} onSelect={(s) => s < step && setStep(s)} />

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  onSubmit={handleSubmitStep1}
                  className="mt-8"
                >
                  <Step1 form={form} update={update} />
                </motion.form>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="mt-8"
                >
                  <Step2
                    form={form}
                    items={items}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    total={total}
                    currency={currency}
                    onEdit={() => setStep(1)}
                    onProceed={handleSubmitStep2}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  onSubmit={handleComplete}
                  className="mt-8"
                >
                  <Step3
                    form={form}
                    update={update}
                    onBack={() => setStep(2)}
                    onWhatsApp={handleWhatsAppComplete}
                    submitting={submitting}
                    submitError={submitError}
                  />
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <aside className="md:col-span-5 md:sticky md:top-[100px]">
            <SummaryCard
              items={items}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              region={form.region}
              currency={currency}
            />
          </aside>
        </div>
      </div>
    </section>
  )
}

function Stepper({
  current,
  labels,
  onSelect,
}: {
  current: 1 | 2 | 3
  labels: string[]
  onSelect: (step: 1 | 2 | 3) => void
}) {
  return (
    <ol className="flex items-center gap-3 md:gap-5">
      {labels.map((label, i) => {
        const idx = (i + 1) as 1 | 2 | 3
        const isActive = idx === current
        const isComplete = idx < current
        return (
          <li key={label} className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => onSelect(idx)}
              disabled={!isComplete}
              className={`grid place-items-center w-8 h-8 shrink-0 rounded-full text-[12px] transition-colors ${
                isComplete ? 'cursor-pointer' : 'cursor-default'
              }`}
              style={{
                background: isActive
                  ? 'var(--color-forest)'
                  : isComplete
                  ? 'var(--color-gold)'
                  : 'transparent',
                color: isActive
                  ? 'var(--color-cream)'
                  : 'var(--color-forest)',
                border:
                  !isActive && !isComplete ? '1px solid rgba(28,43,26,0.25)' : 'none',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
              }}
              aria-current={isActive ? 'step' : undefined}
            >
              {isComplete ? '✓' : idx}
            </button>
            <span
              className="text-[11px] tracking-[0.25em] uppercase truncate"
              style={{
                color: isActive
                  ? 'var(--color-forest)'
                  : isComplete
                  ? 'var(--color-gold)'
                  : 'var(--color-ink)',
                opacity: isActive || isComplete ? 1 : 0.5,
                fontFamily: 'var(--font-body)',
              }}
            >
              {label}
            </span>
            {i < labels.length - 1 && (
              <span
                aria-hidden="true"
                className="hidden md:block flex-1 h-px"
                style={{
                  background: isComplete ? 'var(--color-gold)' : 'rgba(28,43,26,0.18)',
                }}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

interface Step1Props {
  form: FormState
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void
}

function Step1({ form, update }: Step1Props) {
  const { t } = useTranslation()
  const times = t('checkout.step1.times', { returnObjects: true }) as {
    id: TimeSlot
    label: string
  }[]

  return (
    <>
      <h2 className="form-section-title">{t('checkout.step1.title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={t('checkout.step1.fullName') as string} required>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className="flora-input"
          />
        </Field>
        <Field label={t('checkout.step1.phone') as string} required>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="flora-input"
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label={t('checkout.step1.email') as string} required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="flora-input"
          />
        </Field>
      </div>

      <div className="mt-8">
        <p className="form-label">{t('checkout.step1.region')}</p>
        <div className="flex flex-wrap gap-2">
          {(['local', 'turkey', 'intl'] as Region[]).map((key) => {
            const active = form.region === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => update('region', key)}
                aria-pressed={active}
                className="px-4 py-2 text-[12px] tracking-[0.2em] uppercase rounded-full transition-colors"
                style={{
                  background: active ? 'var(--color-forest)' : 'transparent',
                  color: active ? 'var(--color-cream)' : 'var(--color-forest)',
                  border: `1px solid ${active ? 'var(--color-forest)' : 'rgba(28,43,26,0.2)'}`,
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span className="mr-2" aria-hidden="true">
                  {t(`product.regions.${key}.icon`)}
                </span>
                {t(`product.regions.${key}.label`)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        {form.region === 'intl' && (
          <Field label={t('checkout.step1.country') as string} required>
            <input
              type="text"
              required
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              className="flora-input"
            />
          </Field>
        )}
        {form.region !== 'local' && (
          <Field label={t('checkout.step1.city') as string} required>
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              className="flora-input"
            />
          </Field>
        )}
      </div>

      <div className="mt-5">
        <Field label={t('checkout.step1.address') as string} required>
          <textarea
            required
            rows={3}
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            placeholder={t('checkout.step1.addressPlaceholder') as string}
            className="flora-input"
            style={{ resize: 'none' }}
          />
        </Field>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={t('checkout.step1.date') as string} required>
          <input
            type="date"
            required
            value={form.date}
            min={todayIso()}
            onChange={(e) => update('date', e.target.value)}
            className="flora-input"
          />
        </Field>
        <Field label={t('checkout.step1.time') as string} required>
          <select
            required
            value={form.time}
            onChange={(e) => update('time', e.target.value as TimeSlot)}
            className="flora-input"
          >
            {times.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label={t('checkout.step1.giftNote') as string}>
          <textarea
            rows={3}
            value={form.giftNote}
            onChange={(e) => update('giftNote', e.target.value)}
            placeholder={t('checkout.step1.giftPlaceholder') as string}
            className="flora-input italic"
            style={{
              resize: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
            }}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="cta-primary mt-8 inline-flex items-center justify-center gap-2 w-full md:w-auto md:min-w-[260px] py-4 px-8 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
        style={{
          background: 'var(--color-gold)',
          color: 'var(--color-forest)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {t('checkout.step1.continue')}
        <span aria-hidden="true">→</span>
      </button>

      <FormStyles />
    </>
  )
}

interface Step2Props {
  form: FormState
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  currency: string
  onEdit: () => void
  onProceed: () => void
}

function Step2({
  form,
  items,
  subtotal,
  deliveryFee,
  total,
  currency,
  onEdit,
  onProceed,
}: Step2Props) {
  const { t } = useTranslation()
  const timeLabel =
    (t('checkout.step1.times', { returnObjects: true }) as { id: TimeSlot; label: string }[]).find(
      (s) => s.id === form.time,
    )?.label ?? form.time
  const fullAddress = [form.country, form.city, form.address].filter(Boolean).join(', ')

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="form-section-title m-0">{t('checkout.step2.title')}</h2>
        <button
          type="button"
          onClick={onEdit}
          className="text-[11px] tracking-[0.28em] uppercase transition-colors hover:text-[var(--color-gold)]"
          style={{
            color: 'var(--color-forest)',
            fontFamily: 'var(--font-body)',
            opacity: 0.75,
          }}
        >
          ← {t('checkout.step2.edit')}
        </button>
      </div>

      <ul
        className="border"
        style={{ borderColor: 'rgba(28,43,26,0.15)', background: 'transparent' }}
      >
        {items.map((it, i) => (
          <li
            key={it.id}
            className="flex items-center justify-between gap-4 px-5 py-4"
            style={{
              borderBottom:
                i < items.length - 1 ? '1px solid rgba(28,43,26,0.08)' : 'none',
            }}
          >
            <div className="min-w-0">
              <p
                className="truncate"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
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
                color: 'var(--color-gold)',
              }}
            >
              {currency}
              {it.price * it.quantity}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2">
        <Row label={t('checkout.summary.subtotal') as string} value={`${currency}${subtotal}`} />
        <Row
          label={t('checkout.summary.delivery') as string}
          value={
            form.region === 'intl'
              ? (t('product.regions.intl.fee') as string)
              : deliveryFee === 0
              ? (t('product.regions.local.fee') as string)
              : `${currency}${deliveryFee}`
          }
        />
        <div className="border-t pt-3 mt-3" style={{ borderColor: 'rgba(28,43,26,0.15)' }}>
          <Row label={t('checkout.summary.total') as string} value={`${currency}${total}`} big />
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <SnapshotBlock
          title={t('checkout.step2.deliveryTo') as string}
          lines={[form.fullName, form.phone, fullAddress].filter(Boolean) as string[]}
        />
        <SnapshotBlock
          title={t('checkout.step2.scheduledFor') as string}
          lines={[form.date, timeLabel]}
        />
      </section>

      <button
        type="button"
        onClick={onProceed}
        className="cta-primary mt-10 inline-flex items-center justify-center gap-2 w-full md:w-auto md:min-w-[280px] py-4 px-8 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
        style={{
          background: 'var(--color-gold)',
          color: 'var(--color-forest)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {t('checkout.step2.proceed')}
        <span aria-hidden="true">→</span>
      </button>

      <FormStyles />
    </>
  )
}

function Row({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span
        className="text-[11px] tracking-[0.28em] uppercase"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.65 }}
      >
        {label}
      </span>
      <span
        className={big ? 'italic' : ''}
        style={{
          fontFamily: big ? 'var(--font-display)' : 'var(--font-body)',
          fontSize: big ? '1.75rem' : '0.95rem',
          fontWeight: big ? 400 : 600,
          color: 'var(--color-forest)',
          letterSpacing: big ? '-0.01em' : '0.02em',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function SnapshotBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="p-5" style={{ border: '1px solid rgba(28,43,26,0.15)' }}>
      <p
        className="text-[10px] tracking-[0.32em] uppercase mb-3"
        style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
      >
        {title}
      </p>
      <ul className="space-y-1">
        {lines.map((l, i) => (
          <li
            key={i}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--color-forest)',
              lineHeight: 1.5,
            }}
          >
            {l}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface Step3Props {
  form: FormState
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onBack: () => void
  onWhatsApp: () => void
  submitting: boolean
  submitError: string | null
}

function Step3({ form, update, onBack, onWhatsApp, submitting, submitError }: Step3Props) {
  const { t } = useTranslation()
  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="form-section-title m-0">{t('checkout.step3.title')}</h2>
        <button
          type="button"
          onClick={onBack}
          className="text-[11px] tracking-[0.28em] uppercase transition-colors hover:text-[var(--color-gold)]"
          style={{
            color: 'var(--color-forest)',
            fontFamily: 'var(--font-body)',
            opacity: 0.75,
          }}
        >
          ← {t('checkout.back')}
        </button>
      </div>

      <Field label={t('checkout.step3.cardNumber') as string} required>
        <input
          type="text"
          inputMode="numeric"
          required
          value={form.cardNumber}
          onChange={(e) => update('cardNumber', formatCardNumber(e.target.value))}
          placeholder="0000 0000 0000 0000"
          className="flora-input"
          style={{ letterSpacing: '0.18em' }}
        />
      </Field>

      <div className="mt-5">
        <Field label={t('checkout.step3.cardName') as string} required>
          <input
            type="text"
            required
            value={form.cardName}
            onChange={(e) => update('cardName', e.target.value.toUpperCase())}
            className="flora-input"
            style={{ letterSpacing: '0.08em' }}
          />
        </Field>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <Field label={t('checkout.step3.expiry') as string} required>
          <input
            type="text"
            required
            inputMode="numeric"
            value={form.expiry}
            onChange={(e) => update('expiry', formatExpiry(e.target.value))}
            placeholder={t('checkout.step3.expiryPlaceholder') as string}
            className="flora-input"
          />
        </Field>
        <Field label={t('checkout.step3.cvv') as string} required>
          <input
            type="text"
            required
            inputMode="numeric"
            value={form.cvv}
            onChange={(e) =>
              update('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))
            }
            placeholder="123"
            className="flora-input"
          />
        </Field>
      </div>

      {submitError && (
        <p
          role="alert"
          className="mt-6 px-4 py-3 text-[0.85rem]"
          style={{
            background: 'rgba(138,59,48,0.08)',
            border: '1px solid rgba(138,59,48,0.3)',
            color: '#8A3B30',
            fontFamily: 'var(--font-body)',
          }}
        >
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`cta-primary mt-8 inline-flex items-center justify-center gap-2 w-full py-4 px-8 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300 ${
          submitting ? 'cursor-not-allowed opacity-60' : ''
        }`}
        style={{
          background: 'var(--color-gold)',
          color: 'var(--color-forest)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {submitting ? t('checkout.processing') : t('checkout.step3.complete')}
        {!submitting && <span aria-hidden="true">→</span>}
      </button>

      <div className="flex items-center gap-4 my-8">
        <span className="flex-1 h-px" style={{ background: 'rgba(28,43,26,0.18)' }} />
        <span
          className="text-[11px] tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.55 }}
        >
          {t('checkout.step3.or')}
        </span>
        <span className="flex-1 h-px" style={{ background: 'rgba(28,43,26,0.18)' }} />
      </div>

      <button
        type="button"
        onClick={onWhatsApp}
        disabled={submitting}
        className={`inline-flex items-center justify-center gap-3 w-full py-4 px-8 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300 ${
          submitting ? 'cursor-not-allowed opacity-60' : ''
        }`}
        style={{
          background: '#25D366',
          color: '#FFFFFF',
          fontFamily: 'var(--font-body)',
        }}
      >
        <WhatsAppGlyph />
        {t('checkout.step3.whatsappComplete')}
      </button>

      <FormStyles />
    </>
  )
}

function SummaryCard({
  items,
  subtotal,
  deliveryFee,
  total,
  region,
  currency,
}: {
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  region: Region
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
              style={{ background: 'rgba(28,43,26,0.06)' }}
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
                color: 'var(--color-gold)',
              }}
            >
              {currency}
              {it.price * it.quantity}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-2 pt-4" style={{ borderTop: '1px solid rgba(28,43,26,0.18)' }}>
        <Row label={t('checkout.summary.subtotal') as string} value={`${currency}${subtotal}`} />
        <Row
          label={t('checkout.summary.delivery') as string}
          value={
            region === 'intl'
              ? (t('product.regions.intl.fee') as string)
              : deliveryFee === 0
              ? (t('product.regions.local.fee') as string)
              : `${currency}${deliveryFee}`
          }
        />
        <div className="border-t pt-3 mt-3" style={{ borderColor: 'rgba(28,43,26,0.18)' }}>
          <Row label={t('checkout.summary.total') as string} value={`${currency}${total}`} big />
        </div>
      </div>

      <ul
        className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] tracking-[0.2em] uppercase pt-4"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-ink)',
          opacity: 0.7,
          borderTop: '1px solid rgba(28,43,26,0.12)',
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
        margin-bottom: 1.5rem;
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
        margin-bottom: 0.5rem;
      }
      .flora-input {
        width: 100%;
        padding: 0.85rem 0.9rem;
        background: transparent;
        border: 1px solid rgba(28,43,26,0.18);
        outline: none;
        color: var(--color-forest);
        font-family: var(--font-body);
        font-size: 0.95rem;
        transition: border-color 0.25s ease;
      }
      .flora-input:focus {
        border-color: var(--color-gold);
      }
      .cta-primary:hover {
        background: var(--color-forest) !important;
        color: var(--color-cream) !important;
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
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M3 12 A9 9 0 0 1 21 12" />
      <path d="M21 4 V12 H13" />
      <path d="M21 12 A9 9 0 0 1 3 12" />
      <path d="M3 20 V12 H11" />
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
