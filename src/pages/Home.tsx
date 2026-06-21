import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import { useProducts, type StoreProduct } from '../hooks/useProducts'
import type { CategoryId } from '../types'
import CaptionedVideo from '../components/ui/CaptionedVideo'
import IntroLoader from '../components/ui/IntroLoader'
import ProductCard from '../components/ui/ProductCard'
import QuickViewModal from '../components/ui/QuickViewModal'
import { ProductGridSkeleton } from '../components/ui/ProductSkeleton'

const EASE = [0.16, 1, 0.3, 1] as const

// Shared horizontal gutter for every section's content wrapper. Applied inline
// so it can't be dropped by Tailwind purge (arbitrary px classes have bitten
// us before): min 20px on mobile, up to 64px on desktop.
const SECTION_X_PAD = {
  paddingLeft: 'clamp(20px, 5vw, 64px)',
  paddingRight: 'clamp(20px, 5vw, 64px)',
} as const

const CATEGORY_ORDER: CategoryId[] = [
  'bouquet',
  'box',
  'wedding',
  'corporate',
  'plant',
  'international',
]

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

// Aspect-ratio rotation across the product grid for editorial rhythm (mirrors
// the Shop grid): 3/4, 4/5 (taller), 1/1 (square), 3/4, 3/4.
function cardAspect(index: number): string {
  switch (index % 5) {
    case 1:
      return '4 / 5'
    case 2:
      return '1 / 1'
    default:
      return '3 / 4'
  }
}

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

  return (
    <>
      <IntroLoader />
      <Hero prefix={prefix} desktop={desktop} />
      <HomeCatalog />
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
              <HeroBouquet3D />
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 1 }}
              >
                <Link
                  to={prefix || '/'}
                  data-cursor-large
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('urunler')?.scrollIntoView({ behavior: 'smooth' })
                  }}
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

/**
 * Hero 3D bouquet — Google <model-viewer> built imperatively so we sidestep
 * custom-element JSX typing and pull three.js in via a dynamic import only
 * (code-split, off the main bundle). A real buket photo shows until the GLB has
 * loaded, then crossfades in; on any failure the photo simply stays.
 */
function HeroBouquet3D() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let mv: HTMLElement | null = null

    import('@google/model-viewer')
      .then(() => {
        if (cancelled || !hostRef.current) return
        mv = document.createElement('model-viewer')
        const attrs: Record<string, string> = {
          src: '/models/floral-bouquet.glb',
          alt: 'Flora Art — 3D çiçek buketi',
          'auto-rotate': '',
          'auto-rotate-delay': '0',
          'rotation-per-second': '18deg',
          'camera-controls': '',
          'disable-zoom': '',
          'interaction-prompt': 'none',
          'shadow-intensity': '1',
          exposure: '1',
          // Pull the camera ~15% closer so the bouquet fills the (now 3× larger)
          // frame instead of sitting small / distant.
          'camera-orbit': '0deg 80deg 85%',
          reveal: 'auto',
          loading: 'lazy',
        }
        for (const [k, v] of Object.entries(attrs)) mv.setAttribute(k, v)
        mv.style.width = '100%'
        mv.style.height = '100%'
        mv.style.background = 'transparent'
        mv.addEventListener('load', () => {
          if (!cancelled) setReady(true)
        })
        hostRef.current.appendChild(mv)
      })
      .catch(() => {
        /* model-viewer unavailable — keep the photo fallback */
      })

    return () => {
      cancelled = true
      if (mv) mv.remove()
    }
  }, [])

  return (
    <div
      className="relative shrink-0"
      style={{ width: 'clamp(260px, 30vw, 460px)', aspectRatio: '1 / 1' }}
    >
      <div
        ref={hostRef}
        aria-hidden={!ready}
        className="absolute inset-0"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease' }}
      />
      {/* Buket fotoğrafı = görsel slotunun poster'ı: 3D yüklenene kadar (ve
          yüklenmezse kalıcı olarak) bu gerçek fotoğraf görünür. eager: kategori
          görsellerindeki native lazy-load tetiklenmeme bug'ını yaşamayalım. */}
      {!ready && (
        <div
          className="absolute inset-0 overflow-hidden rounded-2xl"
          style={{
            border: '2px solid rgba(200,169,110,0.4)',
            boxShadow: '0 24px 56px -26px rgba(0,0,0,0.55)',
          }}
        >
          <img
            src="/images/categories/buket.webp"
            alt="Flora Art — el yapımı buket"
            loading="eager"
            decoding="async"
            className="block h-full w-full object-cover"
          />
        </div>
      )}
    </div>
  )
}

/* ── Product catalogue (homepage showroom) ─────────────────────── */

function HomeCatalog() {
  const { t } = useTranslation()
  const { products: allProducts, loading, error } = useProducts()
  const [filter, setFilter] = useState<'all' | CategoryId>('all')
  const [quickView, setQuickView] = useState<StoreProduct | null>(null)

  const visible = useMemo(
    () =>
      filter === 'all'
        ? allProducts
        : allProducts.filter((p) => p.category === filter),
    [allProducts, filter],
  )

  const emptyStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    color: 'var(--color-forest)',
    opacity: 0.7,
  } as const

  return (
    <>
      {/* Category filter bar — sticks under the navbar while browsing */}
      <div
        id="urunler"
        className="sticky top-[78px] z-[50] w-full"
        style={{ background: 'var(--color-cream)', borderBottom: '1px solid var(--color-beige)', scrollMarginTop: '90px' }}
      >
        <ul
          className="no-scrollbar mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto py-4"
          style={SECTION_X_PAD}
        >
          <FilterPill
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label={t('shop.filterAll') as string}
          />
          {CATEGORY_ORDER.map((cat, i) => (
            <FilterPill
              key={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
              label={t(`categories.${i}.name`) as string}
            />
          ))}
        </ul>
        <style>{`
          .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
      </div>

      {/* Product grid — the homepage is now the storefront */}
      <section
        className="relative w-full"
        style={{ background: 'var(--color-cream)', paddingBlock: 'clamp(48px, 7vh, 96px)' }}
      >
        <div className="mx-auto max-w-[1400px]" style={SECTION_X_PAD}>
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <p className="py-20 text-center" style={emptyStyle}>
              {error}
            </p>
          ) : visible.length === 0 ? (
            <p className="py-20 text-center" style={emptyStyle}>
              {t('shop.empty')}
            </p>
          ) : (
            <div className="grid grid-cols-2 items-start gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
              {visible.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  onQuickView={setQuickView}
                  aspectRatio={cardAspect(i)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  )
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <li className="shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className="rounded-full px-4 py-2 text-[12px] uppercase tracking-[0.2em] transition-colors duration-300"
        style={{
          background: active ? 'var(--color-gold)' : 'transparent',
          color: 'var(--color-forest)',
          fontFamily: 'var(--font-body)',
          border: active ? '1px solid var(--color-gold)' : '1px solid transparent',
        }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = 'var(--color-beige)'
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = 'transparent'
        }}
      >
        {label}
      </button>
    </li>
  )
}
