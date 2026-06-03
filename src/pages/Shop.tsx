import { useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { CategoryId } from '../types'
import { useProducts, type StoreProduct } from '../hooks/useProducts'
import { useSEO } from '../hooks/useSEO'
import ProductCard from '../components/ui/ProductCard'
import { ProductGridSkeleton } from '../components/ui/ProductSkeleton'
import QuickViewModal from '../components/ui/QuickViewModal'

const EASE = [0.16, 1, 0.3, 1] as const

// Aspect-ratio rotation across the product grid for editorial rhythm.
// Pattern repeats every 5 cards: 3/4, 4/5 (taller), 1/1 (square), 3/4, 3/4.
function cardAspect(index: number): string {
  switch (index % 5) {
    case 1: return '4 / 5'
    case 2: return '1 / 1'
    default: return '3 / 4'
  }
}

type SortKey = 'newest' | 'priceAsc' | 'priceDesc'
type Filter = 'all' | CategoryId

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

export default function Shop() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  useSEO({
    title: t('seo.shop.title') as string,
    description: t('seo.shop.description') as string,
  })

  const { products: allProducts, loading, error } = useProducts()
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [quickView, setQuickView] = useState<StoreProduct | null>(null)

  const visible = useMemo(() => {
    let list = filter === 'all' ? allProducts : allProducts.filter((p) => p.category === filter)
    if (sort === 'priceAsc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'priceDesc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [allProducts, filter, sort])

  return (
    <>
      <section
        className="relative w-full overflow-hidden"
        style={{
          minHeight: '40vh',
          background: 'var(--color-forest)',
          color: 'var(--color-cream)',
        }}
      >
        <ShopBotanical />

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
              {t('shop.title')}
            </span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="italic md:-ml-10"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.25rem, 12vw, 10rem)',
                  color: 'var(--color-cream)',
                  letterSpacing: '-0.025em',
                  lineHeight: 0.95,
                }}
              >
                {t('shop.title')}
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="md:col-span-4 max-w-[40ch] text-[15px] leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-cream)',
              }}
            >
              {t('shop.subtitle')}
            </motion.p>
          </div>
        </div>
      </section>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />

      <section
        className="relative w-full"
        style={{
          background: 'var(--color-cream)',
          paddingBlock: 'var(--spacing-section)',
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : error ? (
            <p
              className="text-center py-20"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'var(--color-forest)',
                opacity: 0.7,
              }}
            >
              {error}
            </p>
          ) : visible.length === 0 ? (
            <p
              className="text-center py-20"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'var(--color-forest)',
                opacity: 0.7,
              }}
            >
              {t('shop.empty')}
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 items-start">
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

      <HowMade />

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  )
}

interface HowMadeItem {
  id: string
  src: string
  caption: string
}

function HowMade() {
  const { t } = useTranslation()
  const data = t('shop.howMade', { returnObjects: true }) as {
    title: string
    subtitle: string
    muteOn: string
    muteOff: string
    items: HowMadeItem[]
  }

  return (
    <section
      className="relative w-full"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        paddingBlock: '64px',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <header className="mb-10 md:mb-12 max-w-[60ch]">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.1em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.85, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                color: 'var(--color-cream)',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {data.title}
            </motion.h2>
          </span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mt-3 text-[14px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {data.subtitle}
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data.items.map((item, i) => (
            <ProcessVideo
              key={item.id}
              item={item}
              index={i}
              muteOn={data.muteOn}
              muteOff={data.muteOff}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessVideo({
  item,
  index,
  muteOn,
  muteOff,
}: {
  item: HowMadeItem
  index: number
  muteOn: string
  muteOff: string
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [muted, setMuted] = useState(true)
  const [loaded, setLoaded] = useState(false)

  function toggleMute() {
    const v = videoRef.current
    if (!v) {
      setMuted((m) => !m)
      return
    }
    const next = !v.muted
    v.muted = next
    setMuted(next)
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          aspectRatio: '9 / 16',
          maxHeight: '280px',
          maxWidth: 'calc(280px * 9 / 16)',
          background: '#2d4420',
          border: '1px solid rgba(200, 169, 110, 0.18)',
        }}
      >
        <div
          className={`absolute inset-0 grid place-items-center transition-opacity duration-500 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden={loaded}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ color: 'var(--color-gold)', opacity: 0.55 }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M10 8 L16 12 L10 16 Z" fill="currentColor" />
          </svg>
        </div>

        <video
          ref={videoRef}
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover' }}
        />

        <motion.button
          type="button"
          onClick={toggleMute}
          whileTap={{ scale: 0.9 }}
          aria-label={muted ? muteOn : muteOff}
          aria-pressed={!muted}
          className="absolute top-3 left-3 grid place-items-center w-8 h-8 rounded-full"
          style={{
            background: 'rgba(245, 240, 232, 0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            color: 'var(--color-gold)',
          }}
        >
          {muted ? <ProcessMuteIcon /> : <ProcessUnmuteIcon />}
        </motion.button>
      </div>

      <figcaption
        className="mt-4 text-center italic"
        style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--color-cream)',
          fontSize: '0.9rem',
        }}
      >
        {item.caption}
      </figcaption>
    </motion.figure>
  )
}

function ProcessMuteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9 H9 L14 5 V19 L9 15 H5 Z" />
      <line x1="17" y1="9" x2="22" y2="14" />
      <line x1="22" y1="9" x2="17" y2="14" />
    </svg>
  )
}

function ProcessUnmuteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9 H9 L14 5 V19 L9 15 H5 Z" />
      <path d="M17 8 C19 10, 19 14, 17 16" />
      <path d="M19.5 6 C22.5 9, 22.5 15, 19.5 18" />
    </svg>
  )
}

function FilterBar({
  filter,
  setFilter,
  sort,
  setSort,
}: {
  filter: Filter
  setFilter: (f: Filter) => void
  sort: SortKey
  setSort: (s: SortKey) => void
}) {
  const { t } = useTranslation()
  const [sortOpen, setSortOpen] = useState(false)

  const sortLabel =
    sort === 'priceAsc'
      ? t('shop.sortPriceAsc')
      : sort === 'priceDesc'
      ? t('shop.sortPriceDesc')
      : t('shop.sortNewest')

  return (
    <div
      className="sticky top-[78px] z-[50] w-full"
      style={{
        background: 'var(--color-cream)',
        borderBottom: '1px solid var(--color-beige)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-4 flex items-center gap-4">
        <ul className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 -mx-2 px-2">
          <FilterPill
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label={t('shop.filterAll')}
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

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.25em] uppercase border transition-colors"
            style={{
              borderColor: 'var(--color-forest)',
              color: 'var(--color-forest)',
              fontFamily: 'var(--font-body)',
              background: sortOpen ? 'var(--color-beige)' : 'transparent',
            }}
            aria-expanded={sortOpen}
            aria-haspopup="listbox"
          >
            <span>{sortLabel}</span>
            <span aria-hidden="true" className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`}>
              ▾
            </span>
          </button>

          {sortOpen && (
            <>
              <button
                type="button"
                aria-label="Close"
                tabIndex={-1}
                onClick={() => setSortOpen(false)}
                className="fixed inset-0 z-[1] cursor-default"
                style={{ background: 'transparent' }}
              />
              <ul
                role="listbox"
                className="absolute right-0 top-full mt-2 min-w-[160px] py-2 z-[2] shadow-[0_20px_40px_-20px_rgba(28,43,26,0.35)]"
                style={{
                  background: 'var(--color-cream)',
                  border: '1px solid var(--color-beige)',
                }}
              >
                {(['newest', 'priceAsc', 'priceDesc'] as SortKey[]).map((key) => (
                  <li key={key}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={sort === key}
                      onClick={() => {
                        setSort(key)
                        setSortOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-[12px] tracking-[0.18em] uppercase transition-colors hover:bg-[var(--color-beige)]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: sort === key ? 'var(--color-gold)' : 'var(--color-forest)',
                      }}
                    >
                      {key === 'newest'
                        ? t('shop.sortNewest')
                        : key === 'priceAsc'
                        ? t('shop.sortPriceAsc')
                        : t('shop.sortPriceDesc')}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <style>{`
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
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
        className="px-4 py-2 text-[12px] tracking-[0.2em] uppercase rounded-full transition-colors duration-300"
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

function ShopBotanical() {
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
          <path d="M 0 0 C 0 -100, -10 -200, -5 -300 C 5 -400, 40 -460, 30 -480" />
          <path d="M -3 -150 C -50 -160, -100 -150, -150 -170" />
          <path d="M 0 -250 C 60 -260, 110 -250, 160 -270" />
          <path d="M 8 -350 C -50 -360, -110 -380, -160 -400" />
          <ellipse cx="-110" cy="-160" rx="48" ry="14" transform="rotate(-15 -110 -160)" />
          <ellipse cx="-150" cy="-170" rx="40" ry="12" transform="rotate(-30 -150 -170)" />
          <ellipse cx="120" cy="-260" rx="52" ry="16" transform="rotate(18 120 -260)" />
          <ellipse cx="160" cy="-270" rx="42" ry="14" transform="rotate(10 160 -270)" />
          <ellipse cx="-120" cy="-380" rx="48" ry="14" transform="rotate(-25 -120 -380)" />
          <g transform="translate(30 -490)">
            {[0, 60, 120, 180, 240, 300].map((rot) => (
              <ellipse key={rot} cx="0" cy="-18" rx="9" ry="16" transform={`rotate(${rot})`} />
            ))}
            <circle r="6" fill="currentColor" opacity="0.5" />
          </g>
        </g>
        <g opacity="0.6">
          <circle cx="60" cy="100" r="3" fill="currentColor" />
          <circle cx="120" cy="320" r="2" fill="currentColor" />
          <circle cx="450" cy="80" r="3" fill="currentColor" />
        </g>
      </svg>
    </div>
  )
}
