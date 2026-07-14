import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'

const linkKeys = ['about', 'delivery', 'blog', 'contact'] as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

const WHATSAPP_NUMBER = '905015317748'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
// Second line for foreign (EN/RU) guests — Aliona Akar.
const ALIONA_TEL = '+905318448730'
const WHATSAPP_INTL_URL = 'https://wa.me/905318448730'
const INSTAGRAM_URL = 'https://www.instagram.com/floraart.fethiye/'
const FACEBOOK_URL = 'https://facebook.com/floraartfethiye'

// Inline gutter so it can't be dropped by Tailwind purge (matches the rest of
// the site): min 20px on mobile, up to 64px on desktop.
const X_PAD = {
  paddingLeft: 'clamp(20px, 5vw, 64px)',
  paddingRight: 'clamp(20px, 5vw, 64px)',
} as const

export default function Footer() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const year = new Date().getFullYear()

  return (
    <>
      <footer
        className="relative overflow-hidden"
        style={{ background: 'var(--color-forest)', color: 'var(--color-cream)' }}
      >
        {/* top gold hairline accent */}
        <div
          aria-hidden="true"
          className="h-px w-full"
          style={{
            background:
              'linear-gradient(to right, rgba(200,169,110,0) 0%, rgba(200,169,110,0.55) 50%, rgba(200,169,110,0) 100%)',
          }}
        />

        {/* faint botanical mark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 hidden h-[340px] w-[340px] opacity-[0.06] md:block"
          style={{ color: 'var(--color-gold)' }}
        >
          <BotanicalMark />
        </div>

        <div
          className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-y-12 py-20 md:grid-cols-12 md:gap-x-14 md:gap-y-12 md:py-24"
          style={X_PAD}
        >
          {/* brand + social */}
          <div className="md:col-span-4">
            <Link to={prefix || '/'} className="inline-flex flex-col leading-none">
              <span
                className="text-[30px] italic tracking-[0.16em]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}
              >
                FLORA ART
              </span>
              <span className="mt-1 text-[11px] tracking-[0.35em] uppercase" style={{ color: 'var(--color-gold)' }}>
                Fethiye · Florist
              </span>
            </Link>

            <p
              className="mt-5 max-w-[30ch] text-[14px] leading-relaxed opacity-80"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t('footer.tagline')}
            </p>
            <p
              className="mt-4 text-[11px] tracking-[0.3em] uppercase"
              style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
            >
              {t('footer.subtitle')}
            </p>

            {/* social — visible but understated outlined circles */}
            <p
              className="mt-8 mb-4 text-[10px] tracking-[0.32em] uppercase opacity-60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t('footer.followUs')}
            </p>
            <div className="flex items-center gap-3">
              <SocialCircle href={INSTAGRAM_URL} label="Instagram">
                <InstagramIcon />
              </SocialCircle>
              <SocialCircle href={FACEBOOK_URL} label="Facebook">
                <FacebookIcon />
              </SocialCircle>
            </div>
          </div>

          {/* quick links */}
          <div className="md:col-span-3">
            <h3
              className="mb-6 text-[11px] tracking-[0.35em] uppercase opacity-70"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-beige)' }}
            >
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {linkKeys.map((key) => (
                <li key={key}>
                  <Link
                    to={`${prefix}/${key}`}
                    className="block py-2 text-[15px] tracking-wide transition-colors hover:text-[var(--color-gold)]"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="md:col-span-5">
            <h3
              className="mb-6 text-[11px] tracking-[0.35em] uppercase opacity-70"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-beige)' }}
            >
              {t('footer.contactTitle')}
            </h3>
            <ul className="space-y-3 text-[14px] leading-relaxed opacity-90" style={{ fontFamily: 'var(--font-body)' }}>
              <li>{t('footer.address')}</li>
              <li>{t('footer.hours')}</li>
              <li>
                <a href={`tel:${WHATSAPP_NUMBER}`} className="transition-colors hover:text-[var(--color-gold)]">
                  {t('footer.phone')}
                </a>
              </li>
              <li className="pt-1">
                <span
                  className="mb-1 block text-[10px] tracking-[0.28em] uppercase"
                  style={{ color: 'var(--color-gold)', opacity: 0.85 }}
                >
                  {t('footer.phoneIntlLabel')}
                </span>
                <a href={`tel:${ALIONA_TEL}`} className="transition-colors hover:text-[var(--color-gold)]">
                  {t('footer.phoneIntl')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom bar: copyright + legal */}
        <div className="border-t" style={{ borderColor: 'rgba(255,239,179,0.12)' }}>
          <div
            className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 py-8 md:flex-row"
            style={X_PAD}
          >
            <p className="text-[12px] opacity-60" style={{ fontFamily: 'var(--font-body)' }}>
              © {year} Flora Art · Fethiye · {t('footer.rights')}
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Link
                to={`${prefix}/kvkk`}
                className="opacity-70 transition-colors hover:text-[var(--color-gold)] hover:opacity-100"
              >
                {t('footer.kvkk')}
              </Link>
              <span aria-hidden="true" className="opacity-30">·</span>
              <Link
                to={`${prefix}/kvkk`}
                className="opacity-70 transition-colors hover:text-[var(--color-gold)] hover:opacity-100"
              >
                {t('footer.privacy')}
              </Link>
            </nav>
          </div>
        </div>

        <style>{`
          .social-circle:hover {
            background: var(--color-gold);
            color: var(--color-forest);
            border-color: var(--color-gold) !important;
            transform: translateY(-2px);
          }
        `}</style>
      </footer>

      <ContactWidget />
    </>
  )
}

function SocialCircle({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="social-circle grid h-10 w-10 place-items-center rounded-full transition-all duration-300"
      style={{ border: '1px solid rgba(200,169,110,0.4)', color: 'var(--color-cream)' }}
    >
      {children}
    </a>
  )
}

/**
 * Premium contact widget — a glowing gold-ringed "+" button (dark-green) fixed
 * bottom-right. Tapping fans two WhatsApp number pills upward: TR line (green
 * accent) on top, EN·RU line (blue accent) below. Pills emerge from the button
 * as dots and expand into place; closing retracts them into the button with a
 * brief gold shimmer. Closes on outside click or Escape. On first load it plays
 * the reveal once as a teaser, then tucks itself away.
 */
function ContactWidget() {
  const [open, setOpen] = useState(false)

  // Escape closes.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // One-time teaser on first load: open ~1.5s in, auto-close ~3s later.
  useEffect(() => {
    const openT = setTimeout(() => setOpen(true), 1500)
    const closeT = setTimeout(() => setOpen(false), 4500)
    return () => {
      clearTimeout(openT)
      clearTimeout(closeT)
    }
  }, [])

  // Report a WhatsApp tap as a Google Ads conversion. Non-blocking — the wa.me
  // link still opens in a new tab as before.
  const trackWhatsAppConversion = () => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-18318204123/lVGACNvbp9AcENu55p5E',
      })
    }
  }

  const pills = [
    { key: 'tr', href: WHATSAPP_URL, badge: 'TR', accent: '#25D366', number: '+90 501 531 77 48' },
    { key: 'intl', href: WHATSAPP_INTL_URL, badge: 'EN · RU', accent: '#2E7DD1', number: '+90 531 844 87 30' },
  ]

  return (
    <>
      {/* click-outside backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="contact-backdrop"
            className="fixed inset-0 z-[79]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-3">
        {/* Number pills — emerge upward from the button as dots, then expand. */}
        <AnimatePresence>
          {open &&
            pills.map((p, i) => (
              <motion.a
                key={p.key}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${p.badge}: ${p.number}`}
                onClick={() => {
                  trackWhatsAppConversion()
                  setOpen(false)
                }}
                initial={{ opacity: 0, scale: 0.2, y: 56 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.15, y: 56, boxShadow: '0 0 22px 6px rgba(200,169,110,0.55)' }}
                transition={{ type: 'spring', stiffness: 420, damping: 30, delay: i * 0.08 }}
                className="flex items-center gap-3 rounded-full py-2 pl-2 pr-5"
                style={{
                  background: 'var(--color-cream)',
                  border: '1px solid var(--color-gold)',
                  boxShadow: '0 16px 34px -16px rgba(1,62,55,0.5)',
                  transformOrigin: 'bottom right',
                }}
              >
                <span
                  aria-hidden="true"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
                  style={{ background: p.accent }}
                >
                  <WhatsAppIcon size={18} />
                </span>
                <span className="flex flex-col leading-tight">
                  <span
                    className="text-[9px] tracking-[0.28em] uppercase"
                    style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-body)' }}
                  >
                    {p.badge}
                  </span>
                  <span
                    className="text-[14px] font-semibold"
                    style={{ color: 'var(--color-forest)', fontFamily: 'var(--font-body)' }}
                  >
                    {p.number}
                  </span>
                </span>
              </motion.a>
            ))}
        </AnimatePresence>

        {/* Glowing + button (rotates to × when open; pulses when closed). */}
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'İletişimi kapat' : 'İletişim / Contact'}
          aria-expanded={open}
          aria-haspopup="menu"
          data-cursor-large
          whileTap={{ scale: 0.94 }}
          animate={{
            boxShadow: open
              ? '0 12px 30px -10px rgba(1,62,55,0.6)'
              : [
                  '0 0 0 0 rgba(200,169,110,0.0)',
                  '0 0 0 6px rgba(200,169,110,0.30)',
                  '0 0 0 0 rgba(200,169,110,0.0)',
                ],
          }}
          transition={
            open
              ? { duration: 0.3 }
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative grid place-items-center w-14 h-14 rounded-full"
          style={{
            background: 'var(--color-forest)',
            border: '1px solid var(--color-gold)',
            color: 'var(--color-cream)',
          }}
        >
          <motion.span
            aria-hidden="true"
            className="grid place-items-center"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <PlusIcon />
          </motion.span>
        </motion.button>
      </div>
    </>
  )
}

function PlusIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ position: 'relative', zIndex: 1 }}>
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.18 0 6.167 1.24 8.413 3.488A11.82 11.82 0 0123.94 11.9c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.595 5.39l-.999 3.648 3.893-.937zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.41-.12-2.39 0-4.02 1.46-4.02 4.13V9.9H7.6V13h2.66v8h3.24z" />
    </svg>
  )
}

function BotanicalMark() {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="h-full w-full" aria-hidden="true">
      <g transform="translate(100 100)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <ellipse key={rot} cx="0" cy="-46" rx="16" ry="40" transform={`rotate(${rot})`} />
        ))}
        {[0, 60, 120, 180, 240, 300].map((rot) => (
          <ellipse key={`s-${rot}`} cx="0" cy="-26" rx="10" ry="22" transform={`rotate(${rot})`} />
        ))}
        <circle r="11" fill="currentColor" opacity="0.3" />
      </g>
    </svg>
  )
}
