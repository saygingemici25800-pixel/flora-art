import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import type { MotifKind } from '../types'
import ProductMotif from '../components/ui/ProductMotif'
import VideoBackdrop from '../components/ui/VideoBackdrop'
import IntroLoader from '../components/ui/IntroLoader'

const EASE = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '905335335380'

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

/** The five headline categories of the homepage, in editorial order. */
interface HomeCategory {
  id: string
  motif: MotifKind
  video: string
}
const CATEGORIES: HomeCategory[] = [
  { id: 'bouquet', motif: 'rose', video: '/videos/category-bouquet.mp4' },
  { id: 'box', motif: 'box', video: '/videos/category-box.mp4' },
  { id: 'wedding', motif: 'wedding', video: '/videos/category-wedding.mp4' },
  { id: 'corporate', motif: 'orchid', video: '/videos/category-corporate.mp4' },
  { id: 'plant', motif: 'terrarium', video: '/videos/category-plant.mp4' },
]

/** Desktop = autoplay videos; mobile = static fallback (no multi-video autoplay). */
function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return desktop
}

export default function Home() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const desktop = useIsDesktop()

  useSEO({
    title: t('seo.home.title') as string,
    description: t('seo.home.description') as string,
  })

  const allCats = t('categories', { returnObjects: true }) as { id: string; name: string }[]
  const categories = CATEGORIES.map((c) => ({
    ...c,
    name: allCats.find((a) => a.id === c.id)?.name ?? c.id,
    desc: t(`homepage.categoryDesc.${c.id}`) as string,
  }))

  return (
    <>
      <IntroLoader />
      <Hero prefix={prefix} />
      {categories.map((cat, i) => (
        <CategorySection
          key={cat.id}
          index={i}
          name={cat.name}
          desc={cat.desc}
          motif={cat.motif}
          video={cat.video}
          to={`${prefix}/shop?category=${cat.id}`}
          flip={i % 2 === 1}
          enableVideo={desktop}
          label={t('homepage.sectionLabel') as string}
          cta={t('homepage.hero.cta') as string}
        />
      ))}
      <AboutSection prefix={prefix} enableVideo={desktop} />
      <ContactSection prefix={prefix} />
    </>
  )
}

/* ── Hero ──────────────────────────────────────────────────────── */

function Hero({ prefix }: { prefix: string }) {
  const { t } = useTranslation()
  const headline = (t('hero.headline') as string).split('\n')

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100dvh', background: 'var(--color-forest)', color: 'var(--color-cream)' }}
    >
      <VideoBackdrop
        src="/videos/hero-flowers.mp4"
        overlay={0.5}
        fallback={<HeroFallback />}
      />

      <div className="relative z-[2] mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-center px-6 pb-24 pt-[120px] md:px-10">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="mb-7 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
          style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
        >
          <span className="block h-px w-12" style={{ background: 'var(--color-gold)' }} />
          {t('homepage.hero.tagline')}
        </motion.span>

        <h1
          className="italic"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.75rem, 12vw, 10.5rem)',
            letterSpacing: '-0.02em',
            lineHeight: 0.92,
            color: 'var(--color-cream)',
          }}
        >
          {headline.map((line, i) => (
            <span key={i} className="block overflow-hidden" style={{ paddingBottom: '0.08em' }}>
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.14 }}
                style={{ fontWeight: i === 1 ? 200 : 400 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
          className="mt-8 max-w-[34ch] text-[16px] leading-relaxed md:text-[18px]"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
        >
          {t('hero.sub')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
          className="mt-11"
        >
          <Link
            to={`${prefix}/shop`}
            data-cursor-large
            className="hero-cta group inline-flex items-center gap-3 px-9 py-4 text-[12px] uppercase tracking-[0.22em] transition-colors duration-300 md:px-11 md:py-5 md:text-[13px]"
            style={{
              background: 'transparent',
              color: 'var(--color-cream)',
              border: '1px solid var(--color-gold)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span>{t('homepage.hero.cta')}</span>
            <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </motion.div>
      </div>

      {/* Editorial corner micro-labels */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-6 z-[2] hidden items-end justify-between px-10 sm:flex"
        style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.6)' }}
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">{t('homepage.hero.location')}</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em]"
        >
          {t('homepage.hero.scroll')}
          <span aria-hidden="true">↓</span>
        </motion.span>
        <span className="text-[10px] uppercase tracking-[0.35em]">Est. 2024</span>
      </div>

      <style>{`.hero-cta:hover { background: var(--color-gold) !important; color: var(--color-forest) !important; }`}</style>
    </section>
  )
}

function HeroFallback() {
  return (
    <div className="absolute inset-0" style={{ background: 'var(--color-forest)' }}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 70% 40%, rgba(200,169,110,0.12), rgba(28,43,26,0) 55%)',
        }}
      />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.16] md:block">
        <ProductMotif kind="rose" color="var(--color-gold)" opacity={1} />
      </div>
    </div>
  )
}

/* ── Category section ──────────────────────────────────────────── */

interface CategorySectionProps {
  index: number
  name: string
  desc: string
  motif: MotifKind
  video: string
  to: string
  flip: boolean
  enableVideo: boolean
  label: string
  cta: string
}

function CategorySection({
  index,
  name,
  desc,
  motif,
  video,
  to,
  flip,
  enableVideo,
  label,
  cta,
}: CategorySectionProps) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '88vh', background: 'var(--color-forest)', color: 'var(--color-cream)' }}
    >
      <VideoBackdrop
        src={video}
        enableVideo={enableVideo}
        overlay={0.55}
        fallback={<CategoryFallback motif={motif} />}
      />

      <Link
        to={to}
        data-cursor-large
        className={`group relative z-[2] mx-auto flex min-h-[88vh] max-w-[1400px] flex-col justify-center px-6 py-24 md:px-10 ${
          flip ? 'items-start md:items-end md:text-right' : 'items-start'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-18% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className={`flex max-w-[44ch] flex-col ${flip ? 'md:items-end' : ''}`}
        >
          <span
            className="mb-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em]"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
          >
            <span aria-hidden="true">{num}</span>
            <span className="block h-px w-10" style={{ background: 'rgba(200,169,110,0.5)' }} />
            <span style={{ opacity: 0.85 }}>{label}</span>
          </span>

          <h2
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.75rem, 7vw, 5.5rem)',
              letterSpacing: '-0.015em',
              lineHeight: 0.98,
              color: 'var(--color-cream)',
            }}
          >
            {name}
          </h2>

          <p
            className="mt-6 max-w-[42ch] text-[15px] leading-relaxed md:text-[16px]"
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.78)' }}
          >
            {desc}
          </p>

          <span
            className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.26em] transition-colors group-hover:text-[var(--color-cream)]"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
          >
            <span className="border-b border-current pb-1">{cta}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </motion.div>
      </Link>
    </section>
  )
}

function CategoryFallback({ motif }: { motif: MotifKind }) {
  return (
    <div className="absolute inset-0" style={{ background: 'var(--color-forest)' }}>
      <div className="absolute inset-0 grid place-items-center opacity-[0.18]">
        <div className="h-[80%] w-[80%]">
          <ProductMotif kind={motif} color="var(--color-gold)" opacity={1} />
        </div>
      </div>
    </div>
  )
}

/* ── About (Biz Kimiz) ─────────────────────────────────────────── */

function AboutSection({ prefix, enableVideo }: { prefix: string; enableVideo: boolean }) {
  const { t } = useTranslation()
  const titleLines = (t('story.title') as string).split('\n')

  return (
    <section
      className="relative w-full"
      style={{ background: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:gap-16 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="md:col-span-6"
        >
          <span
            className="mb-7 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em]"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
          >
            <span aria-hidden="true">06</span>
            <span className="block h-px w-10" style={{ background: 'rgba(200,169,110,0.5)' }} />
            {t('homepage.about.label')}
          </span>

          <h2
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              color: 'var(--color-forest)',
              letterSpacing: '-0.015em',
              lineHeight: 0.98,
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </h2>

          <p
            className="mt-8 max-w-[56ch] text-[15px] leading-relaxed md:text-[16px]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.85 }}
          >
            {t('story.p1')}
          </p>
          <p
            className="mt-4 max-w-[56ch] text-[14px] leading-relaxed md:text-[15px]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)', opacity: 0.7 }}
          >
            {t('story.p2')}
          </p>

          <Link
            to={`${prefix}/about`}
            className="group mt-10 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.26em]"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
          >
            <span className="block h-px w-12 transition-all duration-300 group-hover:w-16" style={{ background: 'var(--color-gold)' }} />
            <span className="border-b border-current pb-1">{t('homepage.about.cta')}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative overflow-hidden md:col-span-6 md:-mr-6"
          style={{ aspectRatio: '5 / 6', background: 'var(--color-beige)', borderRadius: 4 }}
        >
          <VideoBackdrop
            src="/videos/atelier.mp4"
            enableVideo={enableVideo}
            overlay={0}
            fallback={<AboutFallback />}
          />
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-5 z-[2] text-[10px] uppercase tracking-[0.4em]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-forest)', opacity: 0.5 }}
          >
            Aalsmeer · Holland
          </span>
        </motion.div>
      </div>
    </section>
  )
}

function AboutFallback() {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: 'var(--color-beige)' }}>
      <div className="h-[78%] w-[78%]">
        <ProductMotif kind="peony" color="var(--color-gold)" opacity={0.55} />
      </div>
    </div>
  )
}

/* ── Contact (closing) ─────────────────────────────────────────── */

function ContactSection({ prefix }: { prefix: string }) {
  const { t } = useTranslation()
  const titleLines = (t('homepage.contact.title') as string).split('\n')
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}`

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--color-forest)', color: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 opacity-[0.08] md:block"
        style={{ color: 'var(--color-gold)' }}
      >
        <ProductMotif kind="anemone" color="var(--color-gold)" opacity={1} />
      </div>

      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.85, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-7 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em]"
          style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
        >
          <span aria-hidden="true">07</span>
          <span className="block h-px w-10" style={{ background: 'rgba(200,169,110,0.5)' }} />
          {t('homepage.contact.label')}
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="italic"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.75rem, 8vw, 6rem)',
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            color: 'var(--color-cream)',
          }}
        >
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 0.78, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="mt-7 max-w-[46ch] text-[16px] leading-relaxed"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
        >
          {t('homepage.contact.sub')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 text-[12px] uppercase tracking-[0.22em] transition-transform duration-300 hover:-translate-y-[2px]"
            style={{ background: '#25D366', color: '#FFFFFF', fontFamily: 'var(--font-body)' }}
          >
            <WhatsAppGlyph />
            {t('homepage.contact.whatsapp')}
          </a>
          <Link
            to={`${prefix}/shop`}
            data-cursor-large
            className="contact-cta inline-flex items-center justify-center gap-2 px-8 py-4 text-[12px] uppercase tracking-[0.22em] transition-colors duration-300"
            style={{
              background: 'transparent',
              color: 'var(--color-cream)',
              border: '1px solid var(--color-gold)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {t('homepage.contact.order')}
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
          className="mt-14 flex flex-wrap gap-x-10 gap-y-3 text-[12px] tracking-[0.12em]"
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.7)' }}
        >
          <li>
            <a href={`tel:${WHATSAPP_NUMBER}`} className="transition-colors hover:text-[var(--color-gold)]">
              {t('footer.phone')}
            </a>
          </li>
          <li>{t('footer.address')}</li>
          <li>{t('footer.hours')}</li>
        </motion.ul>
      </div>

      <style>{`.contact-cta:hover { background: var(--color-gold) !important; color: var(--color-forest) !important; }`}</style>
    </section>
  )
}

function WhatsAppGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.18 0 6.167 1.24 8.413 3.488A11.82 11.82 0 0123.94 11.9c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.595 5.39l-.999 3.648 3.893-.937z" />
    </svg>
  )
}
