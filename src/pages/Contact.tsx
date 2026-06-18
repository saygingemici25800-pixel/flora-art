import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'

const EASE = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '905015317748'
const MAP_QUERY = 'Atatürk Cd. 98/a, Kesikkapı, Fethiye, Muğla'

interface SubjectOption {
  id: string
  label: string
}

interface FormState {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
}

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

function buildMapEmbed(query: string): string {
  const q = encodeURIComponent(query)
  return `https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed`
}

export default function Contact() {
  const { t } = useTranslation()
  useSEO({
    title: t('seo.contact.title') as string,
    description: t('seo.contact.description') as string,
  })
  return (
    <>
      <ContactHero />
      <ContactBody />
      <MapBlock />
    </>
  )
}

function ContactHero() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        minHeight: '40vh',
      }}
    >
      <HeroBotanical />

      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10 pt-[120px] md:pt-[140px] pb-12 md:pb-16 min-h-[40vh] flex flex-col justify-end">
        <nav
          aria-label="Breadcrumb"
          className="text-[11px] tracking-[0.25em] uppercase mb-6 flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-gold)',
            opacity: 0.9,
          }}
        >
          <Link to={prefix || '/'} className="hover:opacity-100 opacity-80 transition-opacity">
            {t('shop.breadcrumbHome')}
          </Link>
          <span aria-hidden="true" style={{ opacity: 0.55 }}>·</span>
          <span style={{ color: 'var(--color-cream)', opacity: 0.85 }}>
            {t('contact.breadcrumb')}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="italic md:col-span-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              color: 'var(--color-cream)',
              letterSpacing: '-0.02em',
              lineHeight: 0.98,
            }}
          >
            {t('contact.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="md:col-span-4 max-w-[40ch] text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

function ContactBody() {
  const { t } = useTranslation()
  const info = t('contact.info', { returnObjects: true }) as {
    title: string
    addressLabel: string
    address: string
    phoneLabel: string
    phone: string
    phoneTel: string
    phoneIntlLabel: string
    phoneIntl: string
    phoneIntlTel: string
    hoursLabel: string
    hours: string
    whatsappLabel: string
    whatsappCta: string
    instagramLabel: string
    instagramHandle: string
    instagramUrl: string
  }

  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="md:col-span-4 md:border-r md:pr-10"
          style={{ borderColor: 'var(--color-gold)' }}
        >
          <span className="block overflow-hidden" style={{ paddingBottom: '0.1em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ duration: 0.85, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {info.title}
            </motion.h2>
          </span>

          <ul className="mt-10 space-y-9">
            <InfoRow iconKind="pin" label={info.addressLabel}>
              <a
                href={`https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="info-link"
              >
                {info.address}
              </a>
            </InfoRow>
            <InfoRow iconKind="phone" label={info.phoneLabel}>
              <a href={`tel:${info.phoneTel}`} className="info-link">
                {info.phone}
              </a>
            </InfoRow>
            <InfoRow iconKind="phone" label={info.phoneIntlLabel}>
              <a href={`tel:${info.phoneIntlTel}`} className="info-link">
                {info.phoneIntl}
              </a>
            </InfoRow>
            <InfoRow iconKind="clock" label={info.hoursLabel}>
              <span>{info.hours}</span>
            </InfoRow>
            <InfoRow iconKind="instagram" label={info.instagramLabel}>
              <a
                href={info.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-link"
                style={{ color: 'var(--color-bronze)' }}
              >
                {info.instagramHandle}
              </a>
            </InfoRow>
          </ul>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-whatsapp mt-10 inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
            style={{
              background: 'var(--color-forest)',
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <WhatsAppGlyph />
            {info.whatsappCta}
          </a>

          <style>{`
            .info-link {
              color: var(--color-forest);
              transition: color 0.25s ease;
            }
            .info-link:hover {
              color: var(--color-bronze);
            }
            .instagram-link {
              position: relative;
              padding-bottom: 2px;
              transition: color 0.25s ease;
            }
            .instagram-link::after {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              height: 1px;
              background: currentColor;
              transform: scaleX(0);
              transform-origin: left center;
              transition: transform 0.35s ease;
            }
            .instagram-link:hover::after {
              transform: scaleX(1);
            }
            .contact-whatsapp:hover {
              background: var(--color-gold) !important;
              color: var(--color-forest) !important;
            }
          `}</style>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="md:col-span-8 md:mt-10"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  )
}

type ContactIconKind = 'pin' | 'phone' | 'clock' | 'instagram'

function InfoRow({
  iconKind,
  label,
  children,
}: {
  iconKind: ContactIconKind
  label: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-5">
      <span
        aria-hidden="true"
        className="grid place-items-center w-12 h-12 rounded-full shrink-0"
        style={{
          background: 'var(--color-beige)',
          color: 'var(--color-gold)',
        }}
      >
        <ContactIcon kind={iconKind} />
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] tracking-[0.3em] uppercase mb-2"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bronze)' }}
        >
          {label}
        </p>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.97rem',
            color: 'var(--color-forest)',
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      </div>
    </li>
  )
}

function ContactForm() {
  const { t } = useTranslation()
  const form = t('contact.form', { returnObjects: true }) as {
    title: string
    fullName: string
    email: string
    phone: string
    subject: string
    subjects: SubjectOption[]
    message: string
    messagePlaceholder: string
    submit: string
    languageNote: string
    successMessage: string
  }
  const [state, setState] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    subject: form.subjects[0]?.id ?? 'order',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!submitted) return
    const timer = setTimeout(() => setSubmitted(false), 4500)
    return () => clearTimeout(timer)
  }, [submitted])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('[contact-form]', state)
    setSubmitted(true)
    setState({
      fullName: '',
      email: '',
      phone: '',
      subject: form.subjects[0]?.id ?? 'order',
      message: '',
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-7 md:p-9 relative"
      style={{
        background: 'var(--color-beige)',
        border: '1px solid rgba(1,62,55,0.10)',
      }}
    >
      <h3
        className="italic mb-7"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.65rem',
          color: 'var(--color-forest)',
          letterSpacing: '-0.005em',
          lineHeight: 1,
        }}
      >
        {form.title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={form.fullName} required>
          <input
            type="text"
            required
            value={state.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            className="contact-input"
          />
        </Field>
        <Field label={form.email} required>
          <input
            type="email"
            required
            value={state.email}
            onChange={(e) => update('email', e.target.value)}
            className="contact-input"
          />
        </Field>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={form.phone}>
          <input
            type="tel"
            value={state.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="contact-input"
          />
        </Field>
        <Field label={form.subject} required>
          <select
            required
            value={state.subject}
            onChange={(e) => update('subject', e.target.value)}
            className="contact-input"
          >
            {form.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field label={form.message} required>
          <textarea
            required
            rows={5}
            value={state.message}
            onChange={(e) => update('message', e.target.value)}
            placeholder={form.messagePlaceholder}
            className="contact-input"
            style={{ resize: 'vertical', minHeight: '120px' }}
          />
        </Field>
      </div>

      <p
        className="mt-5 text-[12px]"
        style={{
          fontFamily: 'var(--font-body)',
          color: 'var(--color-ink)',
          opacity: 0.7,
        }}
      >
        {form.languageNote}
      </p>

      <button
        type="submit"
        className="contact-submit mt-6 inline-flex items-center justify-center gap-2 w-full py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
        style={{
          background: 'var(--color-gold)',
          color: 'var(--color-forest)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {form.submit}
        <span aria-hidden="true">→</span>
      </button>

      <AnimatePresence>
        {submitted && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-5 p-4 text-center text-[12px] tracking-[0.25em] uppercase"
            style={{
              background: 'var(--color-forest)',
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-body)',
            }}
            role="status"
            aria-live="polite"
          >
            {form.successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .contact-input {
          width: 100%;
          padding: 0.85rem 0.9rem;
          background: var(--color-cream);
          border: 1px solid rgba(1,62,55,0.18);
          outline: none;
          color: var(--color-forest);
          font-family: var(--font-body);
          font-size: 0.95rem;
          transition: border-color 0.25s ease;
        }
        .contact-input:focus {
          border-color: var(--color-gold);
        }
        .contact-submit:hover {
          background: var(--color-forest) !important;
          color: var(--color-cream) !important;
        }
      `}</style>
    </form>
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
      <span
        className="block mb-2 text-[10px] tracking-[0.3em] uppercase"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-bronze)' }}
      >
        {label}
        {required && <span className="opacity-60"> *</span>}
      </span>
      {children}
    </label>
  )
}

function MapBlock() {
  const { t } = useTranslation()
  const map = t('contact.map', { returnObjects: true }) as {
    title: string
    subtitle: string
  }
  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--color-beige)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
          <span
            className="md:col-span-7 block overflow-hidden"
            style={{ paddingBottom: '0.1em' }}
          >
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.85, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {map.title}
            </motion.h2>
          </span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.75, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="md:col-span-5 max-w-[40ch] text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
          >
            {map.subtitle}
          </motion.p>
        </div>
      </div>

      <div className="px-0 md:px-10 pb-20 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-[1380px] overflow-hidden"
          style={{
            border: '1px solid var(--color-gold)',
            borderRadius: '6px',
            background: 'var(--color-forest)',
          }}
        >
          <iframe
            title={map.title}
            src={buildMapEmbed(MAP_QUERY)}
            width="100%"
            height="400"
            loading="lazy"
            style={{ border: 0, display: 'block', filter: 'sepia(15%) saturate(85%)' }}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  )
}

function ContactIcon({ kind }: { kind: ContactIconKind }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (kind === 'pin') {
    return (
      <svg {...common}>
        <path d="M12 22 C 6 14, 4 11, 4 8 A 8 8 0 0 1 20 8 C 20 11, 18 14, 12 22 Z" />
        <circle cx="12" cy="8.5" r="2.4" fill="currentColor" />
      </svg>
    )
  }
  if (kind === 'phone') {
    return (
      <svg {...common}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    )
  }
  if (kind === 'clock') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M12 7 V12 L15 14" />
      </svg>
    )
  }
  // instagram
  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" />
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

function HeroBotanical() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden md:block"
      style={{ width: '50%', opacity: 0.1, color: 'var(--color-gold)' }}
    >
      <svg
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="translate(420 220)">
          <circle r="20" fill="currentColor" opacity="0.25" />
          <circle r="80" />
          <circle r="120" opacity="0.5" />
          <path d="M -100 0 Q 0 -80, 100 0 Q 0 80, -100 0 Z" opacity="0.4" />
          {[0, 60, 120, 180, 240, 300].map((rot) => (
            <ellipse key={rot} cx="0" cy="-110" rx="14" ry="22" transform={`rotate(${rot})`} />
          ))}
        </g>
        <g opacity="0.6">
          <circle cx="80" cy="60" r="3" fill="currentColor" />
          <circle cx="160" cy="340" r="2.5" fill="currentColor" />
          <circle cx="540" cy="60" r="3" fill="currentColor" />
          <circle cx="520" cy="370" r="2" fill="currentColor" />
        </g>
      </svg>
    </div>
  )
}
