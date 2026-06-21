import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import ProductMotif from '../components/ui/ProductMotif'
import type { MotifKind } from '../data/products'

const EASE = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '905015317748'

interface ServiceItem {
  id: 'wedding' | 'corporate' | 'hotel' | 'daily'
  title: string
  description: string
  features: string[]
  cta: string
  whatsappTopic?: string
  linkType?: 'shop' | 'whatsapp' | 'contact'
}

const VISUAL_CONFIG: Record<ServiceItem['id'], { motif: MotifKind; bg: 'cream' | 'beige' }> = {
  wedding:   { motif: 'wedding', bg: 'cream' },
  corporate: { motif: 'box',     bg: 'beige' },
  hotel:     { motif: 'orchid',  bg: 'cream' },
  daily:     { motif: 'rose',    bg: 'beige' },
}

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

function whatsappHref(topic: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(topic)}`
}

export default function Services() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  useSEO({
    title: t('seo.services.title') as string,
    description: t('seo.services.description') as string,
  })

  const items = t('services.items', { returnObjects: true }) as ServiceItem[]
  const banner = t('services.banner', { returnObjects: true }) as {
    title: string
    subtitle: string
    cta: string
    whatsappTopic: string
  }

  return (
    <>
      <ServicesHero prefix={prefix} />

      {items.map((item, i) => (
        <ServiceSection
          key={item.id}
          item={item}
          reverse={i % 2 === 1}
          prefix={prefix}
        />
      ))}

      <CtaBanner banner={banner} />
    </>
  )
}

function ServicesHero({ prefix }: { prefix: string }) {
  const { t } = useTranslation()
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        minHeight: '50vh',
      }}
    >
      <HeroBotanical />
      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10 pt-[120px] md:pt-[140px] pb-12 md:pb-16 min-h-[50vh] flex flex-col justify-end">
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
            {t('services.breadcrumb')}
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
            {t('services.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="md:col-span-4 max-w-[40ch] text-[15px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {t('services.subtitle')}
          </motion.p>
        </div>
      </div>
    </section>
  )
}

interface SectionProps {
  item: ServiceItem
  reverse: boolean
  prefix: string
}

function ServiceSection({ item, reverse, prefix }: SectionProps) {
  const { t } = useTranslation()
  const visual = VISUAL_CONFIG[item.id]
  const bg = visual.bg === 'cream' ? 'var(--color-cream)' : 'var(--color-beige)'

  const ctaHref =
    item.linkType === 'shop'
      ? prefix || '/'
      : whatsappHref(item.whatsappTopic ?? (t('services.banner.whatsappTopic') as string))
  const ctaTargetBlank = item.linkType !== 'shop'

  return (
    <section
      className="relative w-full"
      style={{
        background: bg,
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: reverse ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className={`md:col-span-5 ${reverse ? 'md:order-1' : 'md:order-2'}`}
        >
          <div
            className="relative overflow-hidden"
            style={{
              background:
                visual.bg === 'cream' ? 'var(--color-beige)' : 'var(--color-cream)',
              aspectRatio: '4 / 5',
            }}
          >
            <ProductMotif kind={visual.motif} color="var(--color-forest)" opacity={0.55} />
            <span
              aria-hidden="true"
              className="absolute top-5 right-5 italic text-[16px]"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-gold)',
                opacity: 0.7,
              }}
            >
              ✦
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-5 left-5 text-[10px] tracking-[0.4em] uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-forest)',
                opacity: 0.4,
              }}
            >
              Flora Art
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className={`md:col-span-7 ${reverse ? 'md:order-2' : 'md:order-1'}`}
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
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {item.title}
            </motion.h2>
          </span>

          <p
            className="mt-6 leading-relaxed max-w-[58ch]"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.97rem',
              color: 'var(--color-ink)',
              opacity: 0.8,
            }}
          >
            {item.description}
          </p>

          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 max-w-[40em]">
            {item.features.map((f, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[14px] leading-snug"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
              >
                <span
                  aria-hidden="true"
                  className="mt-[2px] leading-none"
                  style={{ color: 'var(--color-gold)' }}
                >
                  ✦
                </span>
                <span style={{ opacity: 0.85 }}>{f}</span>
              </li>
            ))}
          </ul>

          {item.linkType === 'shop' ? (
            <Link
              to={ctaHref}
              className="svc-cta mt-10 inline-flex items-center gap-3 px-8 py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-forest)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span>{item.cta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <a
              href={ctaHref}
              target={ctaTargetBlank ? '_blank' : undefined}
              rel={ctaTargetBlank ? 'noopener noreferrer' : undefined}
              className="svc-cta mt-10 inline-flex items-center gap-3 px-8 py-4 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-forest)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span>{item.cta}</span>
              <span aria-hidden="true">→</span>
            </a>
          )}

          <style>{`
            .svc-cta:hover {
              background: var(--color-forest) !important;
              color: var(--color-cream) !important;
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  )
}

function CtaBanner({
  banner,
}: {
  banner: { title: string; subtitle: string; cta: string; whatsappTopic: string }
}) {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-gold)',
        paddingBlock: 'calc(var(--spacing-section) * 0.7)',
      }}
    >
      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-8">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.1em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.015em',
                lineHeight: 1,
              }}
            >
              {banner.title}
            </motion.h2>
          </span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.85, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            className="mt-4 text-[15px] leading-relaxed max-w-[52ch]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-forest)' }}
          >
            {banner.subtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="md:col-span-4 md:text-right"
        >
          <a
            href={whatsappHref(banner.whatsappTopic)}
            target="_blank"
            rel="noopener noreferrer"
            className="banner-cta inline-flex items-center gap-3 px-8 py-5 text-[12px] tracking-[0.3em] uppercase transition-colors duration-300"
            style={{
              background: 'var(--color-forest)',
              color: 'var(--color-cream)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <WhatsAppGlyph />
            <span>{banner.cta}</span>
          </a>
          <style>{`
            .banner-cta:hover {
              background: var(--color-cream) !important;
              color: var(--color-forest) !important;
            }
          `}</style>
        </motion.div>
      </div>

      <BannerBotanical />
    </section>
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
        <g transform="translate(420 480)">
          <path d="M 0 0 C 0 -120, 10 -250, -10 -380 C -20 -430, 30 -470, 20 -490" />
          {[0, 60, 120, 180, 240, 300].map((rot) => (
            <ellipse
              key={rot}
              cx="0"
              cy="-470"
              rx="20"
              ry="34"
              transform={`rotate(${rot} 0 -490)`}
            />
          ))}
          <circle cx="0" cy="-490" r="12" fill="currentColor" opacity="0.4" />
          <path d="M -5 -300 C -60 -300, -120 -320, -160 -340" />
          <path d="M 5 -200 C 60 -200, 110 -210, 160 -240" />
          <path d="M -10 -100 C -50 -100, -100 -110, -140 -130" />
          <ellipse cx="-110" cy="-330" rx="50" ry="14" transform="rotate(-15 -110 -330)" />
          <ellipse cx="120" cy="-220" rx="48" ry="14" transform="rotate(15 120 -220)" />
          <ellipse cx="-100" cy="-120" rx="44" ry="14" transform="rotate(-20 -100 -120)" />
        </g>
        <g opacity="0.6">
          <circle cx="60" cy="80" r="3" fill="currentColor" />
          <circle cx="120" cy="320" r="2" fill="currentColor" />
          <circle cx="430" cy="60" r="3" fill="currentColor" />
        </g>
      </svg>
    </div>
  )
}

function BannerBotanical() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-[0] hidden md:block"
      style={{ width: '40%', opacity: 0.12, color: 'var(--color-forest)' }}
    >
      <svg
        viewBox="0 0 500 400"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g transform="translate(380 380)">
          <path d="M 0 0 C 0 -100, -10 -200, 5 -300 C 20 -360, 50 -380, 40 -400" />
          <path d="M 0 -200 C -50 -210, -100 -200, -160 -220" />
          <path d="M 5 -100 C 60 -110, 110 -100, 160 -120" />
          <ellipse cx="-120" cy="-215" rx="46" ry="14" transform="rotate(-15 -120 -215)" />
          <ellipse cx="120" cy="-115" rx="50" ry="15" transform="rotate(15 120 -115)" />
        </g>
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
