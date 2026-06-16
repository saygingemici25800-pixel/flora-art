import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'

const EASE = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '905335335380'

interface Step {
  id: 'order' | 'source' | 'pack' | 'deliver'
  number: string
  title: string
  description: string
}

interface Zone {
  id: 'local' | 'turkey' | 'intl'
  icon: string
  title: string
  eta: string
  fee: string
  scope: string
  highlighted?: boolean
}

interface FaqItem {
  q: string
  a: string
}

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

function whatsappHref(topic: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(topic)}`
}

export default function Delivery() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  useSEO({
    title: t('seo.delivery.title') as string,
    description: t('seo.delivery.description') as string,
  })

  const steps = t('delivery.howItWorks.steps', { returnObjects: true }) as Step[]
  const zones = t('delivery.zones.items', { returnObjects: true }) as Zone[]
  const zoneLabels = t('delivery.zones.labels', { returnObjects: true }) as {
    eta: string
    fee: string
    scope: string
  }
  const faqItems = t('delivery.faq.items', { returnObjects: true }) as FaqItem[]

  return (
    <>
      <DeliveryHero prefix={prefix} />
      <HowItWorks steps={steps} />
      <Zones items={zones} labels={zoneLabels} />
      <Faq items={faqItems} />
      <BottomCta prefix={prefix} />
    </>
  )
}

function DeliveryHero({ prefix }: { prefix: string }) {
  const { t } = useTranslation()
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
      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10 pt-[110px] md:pt-[130px] pb-10 md:pb-12 min-h-[40vh] flex flex-col justify-end">
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
            {t('delivery.breadcrumb')}
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
            {t('delivery.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="md:col-span-4 max-w-[40ch] text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {t('delivery.subtitle')}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

function HowItWorks({ steps }: { steps: Step[] }) {
  const { t } = useTranslation()
  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--color-cream)', paddingBlock: 'calc(var(--spacing-section) * 0.7)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <header className="mb-12 md:mb-16 max-w-[44ch]">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.12em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {t('delivery.howItWorks.title')}
            </motion.h2>
          </span>
        </header>

        <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-y-10 md:gap-x-8">
          <span
            aria-hidden="true"
            className="hidden md:block absolute left-[10%] right-[10%] top-[40px] h-px"
            style={{ background: 'rgba(200,169,110,0.4)' }}
          />

          {steps.map((step, i) => (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8% 0px' }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
              className="relative flex flex-col items-start md:items-center md:text-center"
            >
              <div className="flex items-center md:flex-col md:items-center gap-4 md:gap-6 mb-5 md:mb-6">
                <span
                  className="italic leading-none"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(4.5rem, 7vw, 6rem)',
                    color: 'var(--color-gold)',
                    opacity: 0.12,
                    letterSpacing: '-0.025em',
                  }}
                >
                  {step.number}
                </span>
                <span
                  className="relative grid place-items-center w-14 h-14 rounded-full shrink-0"
                  style={{
                    background: 'var(--color-cream)',
                    border: '1px solid var(--color-gold)',
                    color: 'var(--color-forest)',
                    zIndex: 1,
                  }}
                >
                  <StepIcon kind={step.id} />
                </span>
              </div>

              <h3
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  color: 'var(--color-forest)',
                  letterSpacing: '-0.005em',
                  lineHeight: 1.15,
                }}
              >
                {step.title}
              </h3>
              <p
                className="md:max-w-[26ch] leading-relaxed"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.92rem',
                  color: 'var(--color-ink)',
                  opacity: 0.75,
                }}
              >
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Zones({
  items,
  labels,
}: {
  items: Zone[]
  labels: { eta: string; fee: string; scope: string }
}) {
  const { t } = useTranslation()
  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--color-beige)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <header className="mb-12 md:mb-16 max-w-[44ch]">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.12em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {t('delivery.zones.title')}
            </motion.h2>
          </span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.75, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="mt-5 text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
          >
            {t('delivery.zones.subtitle')}
          </motion.p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 md:items-end">
          {items.map((zone, i) => {
            const highlighted = !!zone.highlighted
            // Asimetrik yükseklikler: Fethiye 280, Türkiye 240 (en kısa),
            // Uluslararası 320 (en yüksek)
            const desktopMinHeights = ['280px', '240px', '320px']
            return (
              <motion.li
                key={zone.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                whileHover={{ y: -4 }}
                className="zone-card group p-7 md:p-8 transition-all duration-500 md:min-h-[var(--zone-h)]"
                style={
                  {
                    background: 'var(--color-beige)',
                    borderTop: '3px solid var(--color-gold)',
                    boxShadow: highlighted
                      ? '0 30px 60px -30px rgba(200,169,110,0.4)'
                      : undefined,
                    ['--zone-h' as string]: desktopMinHeights[i] ?? '280px',
                  } as React.CSSProperties
                }
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <span
                    aria-hidden="true"
                    className="grid place-items-center"
                    style={{ color: 'var(--color-gold)' }}
                  >
                    <ZoneIcon kind={zone.icon} />
                  </span>
                  {highlighted && (
                    <span
                      className="text-[10px] tracking-[0.3em] uppercase px-3 py-1"
                      style={{
                        background: 'var(--color-gold)',
                        color: 'var(--color-forest)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                      }}
                    >
                      ★
                    </span>
                  )}
                </div>

                <h3
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)',
                    color: 'var(--color-forest)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  {zone.title}
                </h3>

                <p
                  className="italic leading-none mb-6"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                    color: 'var(--color-bronze)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {zone.eta}
                </p>

                <dl className="space-y-3">
                  <ZoneRow label={labels.fee} value={zone.fee} accent />
                  <div>
                    <dt
                      className="text-[10px] tracking-[0.3em] uppercase mb-1"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.6 }}
                    >
                      {labels.scope}
                    </dt>
                    <dd
                      className="leading-relaxed"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.92rem',
                        color: 'var(--color-forest)',
                      }}
                    >
                      {zone.scope}
                    </dd>
                  </div>
                </dl>

                <span
                  aria-hidden="true"
                  className="block mt-6 h-px w-full origin-left transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100"
                  style={{ background: 'var(--color-gold)' }}
                />
              </motion.li>
            )
          })}
        </ul>
      </div>

      <style>{`
        .zone-card:hover {
          background: var(--color-cream) !important;
          box-shadow: 0 30px 60px -30px rgba(200,169,110,0.45);
        }
      `}</style>
    </section>
  )
}

function ZoneIcon({ kind }: { kind: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (kind === 'pin') {
    return (
      <svg {...common}>
        <path d="M12 22 C 6 14, 4 11, 4 8 A 8 8 0 0 1 20 8 C 20 11, 18 14, 12 22 Z" />
        <circle cx="12" cy="8.5" r="2.6" fill="currentColor" />
      </svg>
    )
  }
  if (kind === 'tr') {
    return (
      <span
        aria-hidden="true"
        className="inline-grid place-items-center"
        style={{
          width: '34px',
          height: '22px',
          border: '1px solid var(--color-gold)',
          color: 'var(--color-forest)',
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          letterSpacing: '0.18em',
          fontWeight: 600,
        }}
      >
        TR
      </span>
    )
  }
  // globe
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12 L21.5 12" />
      <path d="M12 2.5 C 16 7, 16 17, 12 21.5" />
      <path d="M12 2.5 C 8 7, 8 17, 12 21.5" />
    </svg>
  )
}

function ZoneRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3 py-2 border-b"
      style={{ borderColor: 'rgba(1,62,55,0.08)' }}
    >
      <dt
        className="text-[10px] tracking-[0.3em] uppercase"
        style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.6 }}
      >
        {label}
      </dt>
      <dd
        className="text-[14px]"
        style={{
          fontFamily: 'var(--font-body)',
          color: accent ? 'var(--color-gold)' : 'var(--color-forest)',
          fontWeight: accent ? 600 : 400,
        }}
      >
        {value}
      </dd>
    </div>
  )
}

function Faq({ items }: { items: FaqItem[] }) {
  const { t } = useTranslation()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div className="mx-auto max-w-[900px] px-6 md:px-10">
        <header className="mb-12 md:mb-14 text-center">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.12em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {t('delivery.faq.title')}
            </motion.h2>
          </span>
        </header>

        <ul>
          {items.map((item, i) => {
            const isOpen = openIdx === i
            return (
              <li
                key={i}
                className="border-b"
                style={{ borderColor: 'rgba(1,62,55,0.12)' }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left transition-colors"
                  style={{
                    color: isOpen ? 'var(--color-gold)' : 'var(--color-forest)',
                  }}
                >
                  <span
                    className="italic"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                      letterSpacing: '-0.005em',
                      lineHeight: 1.25,
                    }}
                  >
                    {item.q}
                  </span>
                  <motion.span
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="shrink-0 grid place-items-center w-9 h-9 rounded-full"
                    style={{
                      border: '1px solid currentColor',
                      color: isOpen ? 'var(--color-gold)' : 'var(--color-forest)',
                    }}
                  >
                    <PlusGlyph />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p
                        className="pb-6 max-w-[60ch] leading-relaxed"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.95rem',
                          color: 'var(--color-ink)',
                          opacity: 0.78,
                        }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function BottomCta({ prefix }: { prefix: string }) {
  const { t } = useTranslation()
  const cta = t('delivery.bottomCta', { returnObjects: true }) as {
    title: string
    subtitle: string
    whatsappCta: string
    or: string
    shopCta: string
  }
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        <span className="block overflow-hidden" style={{ paddingBottom: '0.1em' }}>
          <motion.h2
            initial={{ y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: 'var(--color-cream)',
              letterSpacing: '-0.015em',
              lineHeight: 1,
            }}
          >
            {cta.title}
          </motion.h2>
        </span>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.75, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="mt-5 max-w-[48ch] mx-auto text-[15px] leading-relaxed"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {cta.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={whatsappHref(t('services.banner.whatsappTopic') as string)}
            target="_blank"
            rel="noopener noreferrer"
            className="del-cta inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
            style={{
              background: 'var(--color-gold)',
              color: 'var(--color-forest)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <WhatsAppGlyph />
            <span>{cta.whatsappCta}</span>
          </a>

          <span
            className="text-[11px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-cream)',
              opacity: 0.5,
            }}
          >
            {cta.or}
          </span>

          <Link
            to={`${prefix}/shop`}
            className="del-cta-secondary inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300 border"
            style={{
              background: 'transparent',
              color: 'var(--color-cream)',
              borderColor: 'rgba(255,239,179,0.4)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span>{cta.shopCta}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        <style>{`
          .del-cta:hover {
            background: var(--color-cream) !important;
            color: var(--color-forest) !important;
          }
          .del-cta-secondary:hover {
            background: var(--color-cream) !important;
            color: var(--color-forest) !important;
            border-color: var(--color-cream) !important;
          }
        `}</style>
      </div>
    </section>
  )
}

function StepIcon({ kind }: { kind: Step['id'] }) {
  const props = {
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
  if (kind === 'order') {
    return (
      <svg {...props}>
        <path d="M3 6h2l2 12h12l2-8H7" />
        <circle cx="9" cy="20" r="1.4" />
        <circle cx="18" cy="20" r="1.4" />
      </svg>
    )
  }
  if (kind === 'source') {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="2" />
        <ellipse cx="12" cy="6" rx="2.2" ry="3.6" />
        <ellipse cx="12" cy="18" rx="2.2" ry="3.6" />
        <ellipse cx="6" cy="12" rx="3.6" ry="2.2" />
        <ellipse cx="18" cy="12" rx="3.6" ry="2.2" />
      </svg>
    )
  }
  if (kind === 'pack') {
    return (
      <svg {...props}>
        <path d="M3 8 L12 4 L21 8 L21 17 L12 21 L3 17 Z" />
        <path d="M3 8 L12 12 L21 8" />
        <path d="M12 12 V21" />
        <path d="M9 6 L9 9" />
      </svg>
    )
  }
  return (
    <svg {...props}>
      <path d="M4 21 V11 L12 5 L20 11 V21" />
      <path d="M9 21 V14 H15 V21" />
      <circle cx="14.5" cy="17" r="0.8" fill="currentColor" />
    </svg>
  )
}

function PlusGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
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
        viewBox="0 0 600 500"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="translate(420 260)" opacity="0.85">
          <circle r="120" />
          <circle r="90" opacity="0.5" />
          <line x1="-120" y1="0" x2="120" y2="0" />
          <line x1="0" y1="-120" x2="0" y2="120" />
          <line x1="-85" y1="-85" x2="85" y2="85" opacity="0.5" />
          <line x1="-85" y1="85" x2="85" y2="-85" opacity="0.5" />
          <path d="M 0 -50 L 8 0 L 0 50 L -8 0 Z" fill="currentColor" opacity="0.4" />
          <circle r="6" fill="currentColor" />
        </g>
        <g opacity="0.7">
          <circle cx="120" cy="100" r="3" fill="currentColor" />
          <circle cx="200" cy="380" r="2.5" fill="currentColor" />
          <circle cx="500" cy="60" r="3" fill="currentColor" />
          <circle cx="540" cy="430" r="2" fill="currentColor" />
        </g>
        <path d="M 120 100 Q 250 200, 420 260" strokeDasharray="3 5" />
        <path d="M 500 60 Q 480 160, 420 260" strokeDasharray="3 5" />
        <path d="M 200 380 Q 300 320, 420 260" strokeDasharray="3 5" />
      </svg>
    </div>
  )
}

function WhatsAppGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.18 0 6.167 1.24 8.413 3.488A11.82 11.82 0 0123.94 11.9c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.595 5.39l-.999 3.648 3.893-.937z" />
    </svg>
  )
}
