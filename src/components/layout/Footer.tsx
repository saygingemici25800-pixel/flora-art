import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const linkKeys = ['shop', 'delivery', 'about', 'contact'] as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

const WHATSAPP_NUMBER = '905335335380'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`
// Second line for foreign (EN/RU) guests — Aliona Akar.
const ALIONA_TEL = '+905318448730'

export default function Footer() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const year = new Date().getFullYear()

  return (
    <>
      <footer
        className="relative"
        style={{ background: 'var(--color-forest)', color: 'var(--color-cream)' }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          <div className="space-y-4">
            <Link to={prefix || '/'} className="inline-flex flex-col leading-none">
              <span
                className="text-[28px] italic tracking-[0.18em]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cream)' }}
              >
                FLORA ART
              </span>
              <span
                className="text-[11px] mt-1 tracking-[0.35em] uppercase"
                style={{ color: 'var(--color-gold)' }}
              >
                Fethiye · Florist
              </span>
            </Link>
            <p
              className="text-[14px] leading-relaxed max-w-[28ch] opacity-80"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {t('footer.tagline')}
            </p>
            <p
              className="text-[11px] tracking-[0.3em] uppercase"
              style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
            >
              {t('footer.subtitle')}
            </p>
          </div>

          <div>
            <h3
              className="text-[11px] tracking-[0.35em] uppercase mb-6 opacity-70"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-beige)' }}
            >
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-1">
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

          <div>
            <h3
              className="text-[11px] tracking-[0.35em] uppercase mb-6 opacity-70"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-beige)' }}
            >
              {t('footer.contactTitle')}
            </h3>
            <ul
              className="space-y-3 text-[14px] leading-relaxed opacity-90"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <li>{t('footer.address')}</li>
              <li>{t('footer.hours')}</li>
              <li>
                <a
                  href={`tel:${WHATSAPP_NUMBER}`}
                  className="hover:text-[var(--color-gold)] transition-colors"
                >
                  {t('footer.phone')}
                </a>
              </li>
              <li className="pt-1">
                <span
                  className="block text-[10px] tracking-[0.28em] uppercase mb-1"
                  style={{ color: 'var(--color-gold)', opacity: 0.85 }}
                >
                  {t('footer.phoneIntlLabel')}
                </span>
                <a href={`tel:${ALIONA_TEL}`} className="hover:text-[var(--color-gold)] transition-colors">
                  {t('footer.phoneIntl')}
                </a>
              </li>
            </ul>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 text-[12px] tracking-[0.25em] uppercase transition-transform hover:-translate-y-[1px]"
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-forest)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <WhatsAppIcon size={16} />
              {t('footer.whatsapp')}
            </a>
          </div>
        </div>

        <div
          className="border-t"
          style={{ borderColor: 'rgba(245,240,232,0.12)' }}
        >
          <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className="text-[12px] opacity-60"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              © {year} Flora Art · Fethiye · {t('footer.rights')}
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/floraartfethiye"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="opacity-70 hover:opacity-100 hover:text-[var(--color-gold)] transition"
              >
                <InstagramIcon />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="opacity-70 hover:opacity-100 hover:text-[var(--color-gold)] transition"
              >
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp />
    </>
  )
}

function FloatingWhatsApp() {
  const { t } = useTranslation()
  const label = t('footer.whatsapp') as string
  return (
    <div className="fixed bottom-6 right-6 z-[80] wa-float-group">
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        data-cursor-large
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative grid place-items-center w-14 h-14 rounded-full text-white shadow-lg"
        style={{ background: '#25D366' }}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ background: '#25D366' }}
          animate={{ scale: [1, 1.5, 1.8], opacity: [0.45, 0.1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        />
        <WhatsAppIcon size={26} />
      </motion.a>

      <span
        role="tooltip"
        className="wa-tooltip absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-2 text-[11px] tracking-[0.22em] uppercase pointer-events-none"
        style={{
          background: 'var(--color-cream)',
          color: 'var(--color-forest)',
          fontFamily: 'var(--font-body)',
          boxShadow: '0 12px 24px -10px rgba(28,43,26,0.25)',
        }}
      >
        {label}
        <span
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            right: '-5px',
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: '6px solid var(--color-cream)',
          }}
        />
      </span>

      <style>{`
        .wa-tooltip {
          opacity: 0;
          transform: translate(8px, -50%);
          transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        .wa-float-group:hover .wa-tooltip,
        .wa-float-group:focus-within .wa-tooltip {
          opacity: 1;
          transform: translate(0, -50%);
        }
      `}</style>
    </div>
  )
}

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ position: 'relative', zIndex: 1 }}
    >
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
