import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import type { MotifKind } from '../types'
import ProductMotif from '../components/ui/ProductMotif'
import VideoBackdrop from '../components/ui/VideoBackdrop'
import CaptionedVideo from '../components/ui/CaptionedVideo'
import IntroLoader from '../components/ui/IntroLoader'

const EASE = [0.16, 1, 0.3, 1] as const
const WHATSAPP_NUMBER = '905015317748'

// Shared horizontal gutter for every section's content wrapper. Applied inline
// so it can't be dropped by Tailwind purge (arbitrary px classes have bitten
// us before): min 20px on mobile, up to 64px on desktop.
const SECTION_X_PAD = {
  paddingLeft: 'clamp(20px, 5vw, 64px)',
  paddingRight: 'clamp(20px, 5vw, 64px)',
} as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

/** The five headline categories, each paired with a Vahap interview clip and a
 *  flower motif for its 3D placeholder. */
interface HomeCategory {
  id: string
  motif: MotifKind
  clip: string // file base under /videos
}
const CATEGORIES: HomeCategory[] = [
  { id: 'bouquet', motif: 'rose', clip: 'about-vahap-tanitim' },
  { id: 'box', motif: 'peony', clip: 'about-vahap-mutluluk' },
  { id: 'wedding', motif: 'anemone', clip: 'process-vahap-emek' },
  { id: 'corporate', motif: 'orchid', clip: 'about-vahap-turizm' },
  { id: 'plant', motif: 'tulip', clip: 'about-vahap-cicekler' },
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
      <Hero prefix={prefix} desktop={desktop} />
      {categories.map((cat, i) => (
        <CategorySection
          key={cat.id}
          index={i}
          name={cat.name}
          desc={cat.desc}
          motif={cat.motif}
          clip={cat.clip}
          to={`${prefix}/shop?category=${cat.id}`}
          flip={i % 2 === 1}
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

function Hero({ prefix, desktop }: { prefix: string; desktop: boolean }) {
  const { t } = useTranslation()
  const titleLines = (t('homepage.header.title') as string).split('\n')

  // Asymmetric staircase: each video a different width, alternating edge,
  // stepped down with a slight overlap for an editorial, layered feel.
  const videos: { base: string; w: string; align: 'flex-start' | 'flex-end'; mt: string }[] = [
    { base: 'about-vahap-tanitim', w: '64%', align: 'flex-end', mt: '0' },
    { base: 'contact-vahap-mesaj', w: '48%', align: 'flex-start', mt: '-12%' },
    { base: 'about-vahap-cicekler', w: '56%', align: 'flex-end', mt: '-8%' },
  ]

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100dvh', background: 'var(--color-forest)', color: 'var(--color-cream)' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 80% 28%, rgba(200,169,110,0.12), rgba(1,62,55,0) 55%)' }}
      />

      <div
        className="relative z-[2] mx-auto w-full max-w-[1500px]"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: desktop ? '132px' : '104px',
          paddingBottom: '56px',
          ...SECTION_X_PAD,
        }}
      >
        <div
          className="w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: desktop ? '42fr 58fr' : '1fr',
            gap: desktop ? '56px' : '40px',
            alignItems: 'center',
          }}
        >
          {/* LEFT — brand text + bouquet slot + CTA */}
          <div className="flex flex-col">
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
                fontSize: 'clamp(2.85rem, 6vw, 5.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 0.98,
                color: 'var(--color-cream)',
              }}
            >
              {titleLines.map((line, i) => (
                <span key={i} className="block overflow-hidden" style={{ paddingBottom: '0.08em' }}>
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.3 + i * 0.14 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 0.78, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
              className="mt-7 max-w-[42ch] text-[15px] leading-relaxed md:text-[16px]"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
            >
              {t('homepage.header.sub')}
            </motion.p>

            <div className="mt-9 flex flex-wrap items-center gap-7">
              <BouquetSlot />
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 1 }}
              >
                <Link
                  to={`${prefix}/shop`}
                  data-cursor-large
                  className="hero-cta group inline-flex items-center gap-3 px-8 py-4 text-[12px] uppercase tracking-[0.22em] transition-colors duration-300 md:px-10 md:py-5 md:text-[13px]"
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
          </div>

          {/* RIGHT — asymmetric staircase of three captioned videos */}
          <div className="flex flex-col" style={{ width: '100%' }}>
            {videos.map((v, i) => (
              <motion.div
                key={v.base}
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.35 + i * 0.16 }}
                style={{
                  width: desktop ? v.w : '100%',
                  alignSelf: desktop ? v.align : 'stretch',
                  marginTop: i === 0 ? '0' : desktop ? v.mt : '20px',
                  zIndex: i,
                }}
              >
                <CaptionedVideo
                  src={`/videos/${v.base}.mp4`}
                  poster={`/videos/${v.base}.webp`}
                  wordsSrc={`/videos/${v.base}.words.json`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style>{`.hero-cta:hover { background: var(--color-gold) !important; color: var(--color-forest) !important; }`}</style>
    </section>
  )
}

// 3D flower slot — placeholder for a future Tripo 3D asset. Swap the inner
// ProductMotif for the <model-viewer>/canvas when the real model lands; the
// motif + size props let each category show its own bloom.
function BouquetSlot({ motif = 'rose', size = 116 }: { motif?: MotifKind; size?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1, ease: EASE }}
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 38% 32%, rgba(200,169,110,0.20), rgba(1,62,55,0) 66%)',
          border: '1px solid rgba(200,169,110,0.28)',
        }}
      />
      <motion.div
        className="absolute inset-0 grid place-items-center"
        animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{ width: '64%', height: '64%' }}>
          <ProductMotif kind={motif} color="var(--color-gold)" opacity={1} />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ── Category section ──────────────────────────────────────────── */

interface CategorySectionProps {
  index: number
  name: string
  desc: string
  motif: MotifKind
  clip: string
  to: string
  flip: boolean
  label: string
  cta: string
}

function CategorySection({ index, name, desc, motif, clip, to, flip, label, cta }: CategorySectionProps) {
  const num = String(index + 1).padStart(2, '0')
  // Zigzag: odd sections (index 1, 3) put the video on the right.
  const videoRight = flip

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--color-forest)', color: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div
        className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
        style={SECTION_X_PAD}
      >
        {/* video half — always first in DOM so mobile stacks the video on top */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className={videoRight ? 'md:order-2' : 'md:order-1'}
        >
          <CaptionedVideo
            src={`/videos/${clip}.mp4`}
            poster={`/videos/${clip}.webp`}
            wordsSrc={`/videos/${clip}.words.json`}
          />
        </motion.div>

        {/* title + short text (top) + 3D flower placeholder (below) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12% 0px' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className={`flex flex-col ${videoRight ? 'md:order-1' : 'md:order-2'}`}
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
              fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
              letterSpacing: '-0.015em',
              lineHeight: 1,
              color: 'var(--color-cream)',
            }}
          >
            {name}
          </h2>

          <p
            className="mt-5 max-w-[46ch] text-[15px] leading-relaxed md:text-[16px]"
            style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,239,179,0.78)' }}
          >
            {desc}
          </p>

          {/* 3D flower placeholder — swap the BouquetSlot for the Tripo model when ready */}
          <div className="mt-9">
            <BouquetSlot motif={motif} size={150} />
          </div>

          <Link
            to={to}
            data-cursor-large
            className="group mt-9 inline-flex w-fit items-center gap-2 text-[12px] uppercase tracking-[0.26em] transition-colors hover:text-[var(--color-cream)]"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
          >
            <span className="border-b border-current pb-1">{cta}</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
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
      <div
        className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16"
        style={SECTION_X_PAD}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="md:col-span-6"
        >
          <span
            className="mb-7 flex items-center gap-4 text-[11px] uppercase tracking-[0.3em]"
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-body)' }}
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
            style={{ color: 'var(--color-bronze)', fontFamily: 'var(--font-body)' }}
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

      <div
        className="relative z-[2] mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center"
        style={SECTION_X_PAD}
      >
        <div className="md:col-span-6">
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
          style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,239,179,0.7)' }}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.95, ease: EASE }}
          className="md:col-span-6"
        >
          <CaptionedVideo
            src="/videos/contact-vahap-mesaj.mp4"
            poster="/videos/contact-vahap-mesaj.webp"
            wordsSrc="/videos/contact-vahap-mesaj.words.json"
          />
        </motion.div>
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
