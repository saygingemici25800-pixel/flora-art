import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import MarqueeTicker from '../components/sections/MarqueeTicker'
import USPCards from '../components/sections/USPCards'
import CategoryGrid from '../components/sections/CategoryGrid'

const EASE = [0.16, 1, 0.3, 1] as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

export default function Home() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)

  const headline = (t('hero.headline') as string).split('\n')
  const stats = t('hero.stats', { returnObjects: true }) as string[]

  return (
    <>
      <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100dvh',
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
      }}
    >
      <BotanicalOverlay />
      <GrainTexture />

      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10 pt-[120px] md:pt-[140px] pb-24 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center min-h-[100dvh]">
        <div className="md:col-span-7 relative">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="flex items-center gap-4 mb-8"
          >
            <span
              className="block h-px w-12"
              style={{ background: 'var(--color-gold)' }}
            />
            <span
              className="text-[11px] md:text-[12px] tracking-[0.25em] uppercase"
              style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-display)',
                fontVariant: 'small-caps',
              }}
            >
              {t('hero.badge')}
            </span>
          </motion.div>

          <h1
            className="italic leading-[0.95] mb-8 md:mb-10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(4.25rem, 11vw, 9rem)',
              letterSpacing: '-0.015em',
              color: 'var(--color-cream)',
            }}
          >
            {headline.map((line, i) => (
              <span
                key={i}
                className="block overflow-hidden"
                style={{ paddingBottom: '0.08em' }}
              >
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{
                    duration: 0.8,
                    ease: EASE,
                    delay: 0.25 + i * 0.15,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            className="text-[16px] md:text-[18px] leading-relaxed max-w-[36ch] mb-10"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {t('hero.sub')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
          >
            <Link
              to={`${prefix}/shop`}
              className="group inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 text-[12px] md:text-[13px] tracking-[0.28em] uppercase transition-transform duration-300 ease-out hover:scale-[1.03]"
              style={{
                background: 'var(--color-gold)',
                color: 'var(--color-forest)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span>{t('hero.cta')}</span>
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.1 }}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] tracking-[0.12em]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {stats.map((s, i) => (
              <span key={i} className="flex items-center gap-5">
                <span>{s}</span>
                {i < stats.length - 1 && <span className="opacity-50">·</span>}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="md:col-span-5 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
              className="relative grid place-items-center rounded-full"
              style={{
                width: 'min(78vw, 460px)',
                aspectRatio: '1 / 1',
                border: '1px solid rgba(200, 169, 110, 0.3)',
                background:
                  'radial-gradient(circle at 40% 35%, rgba(200,169,110,0.10), rgba(28,43,26,0) 60%)',
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  inset: '14%',
                  border: '1px solid rgba(200, 169, 110, 0.18)',
                }}
              />
              <div className="relative text-center px-6">
                <p
                  className="italic"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(3.5rem, 9vw, 6rem)',
                    color: 'var(--color-gold)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  3D
                </p>
                <p
                  className="mt-4 text-[10px] tracking-[0.3em] uppercase"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'rgba(245, 240, 232, 0.55)',
                  }}
                >
                  Tripo AI asset gelecek
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ScrollIndicator />
      </section>

      <MarqueeTicker />
      <USPCards />
      <CategoryGrid />
    </>
  )
}

function BotanicalOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 z-[1] hidden md:block"
      style={{ width: '55%', opacity: 0.1, color: 'var(--color-gold)' }}
    >
      <svg
        viewBox="0 0 600 800"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 380 800 C 380 600, 420 420, 360 260 S 280 80, 320 0" />
        <path d="M 380 620 C 320 600, 250 580, 200 540" />
        <path d="M 372 500 C 440 480, 510 470, 560 440" />
        <path d="M 360 380 C 290 360, 220 340, 170 290" />
        <path d="M 345 250 C 410 230, 470 210, 520 170" />

        <g>
          <Leaf cx={200} cy={540} rx={48} ry={16} rot={-22} />
          <Leaf cx={160} cy={520} rx={40} ry={14} rot={-32} />
          <Leaf cx={560} cy={440} rx={52} ry={16} rot={18} />
          <Leaf cx={520} cy={420} rx={42} ry={14} rot={12} />
          <Leaf cx={170} cy={290} rx={46} ry={15} rot={-28} />
          <Leaf cx={130} cy={270} rx={38} ry={13} rot={-38} />
          <Leaf cx={520} cy={170} rx={50} ry={16} rot={22} />
          <Leaf cx={480} cy={150} rx={40} ry={14} rot={14} />
          <Leaf cx={320} cy={20} rx={36} ry={12} rot={-10} />
        </g>

        <g opacity="0.7">
          <circle cx="120" cy="120" r="3" fill="currentColor" />
          <circle cx="540" cy="280" r="2" fill="currentColor" />
          <circle cx="80" cy="380" r="2.5" fill="currentColor" />
          <circle cx="480" cy="640" r="2" fill="currentColor" />
          <circle cx="220" cy="720" r="3" fill="currentColor" />
        </g>
      </svg>
    </div>
  )
}

function Leaf({
  cx,
  cy,
  rx,
  ry,
  rot,
}: {
  cx: number
  cy: number
  rx: number
  ry: number
  rot: number
}) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      <line x1={cx - rx + 4} y1={cy} x2={cx + rx - 4} y2={cy} opacity="0.5" />
    </g>
  )
}

function GrainTexture() {
  const noise = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.96  0 0 0 0 0.94  0 0 0 0 0.91  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`,
  )}`
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[1]"
      style={{
        left: 0,
        bottom: 0,
        width: '55%',
        height: '55%',
        backgroundImage: `url("${noise}")`,
        backgroundSize: '200px 200px',
        opacity: 0.06,
        maskImage:
          'radial-gradient(ellipse at 0% 100%, #000 0%, transparent 70%)',
        WebkitMaskImage:
          'radial-gradient(ellipse at 0% 100%, #000 0%, transparent 70%)',
        mixBlendMode: 'overlay',
      }}
    />
  )
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.8 }}
      className="absolute left-6 md:left-10 bottom-6 md:bottom-10 z-[3] hidden sm:flex flex-col items-center gap-4"
      aria-hidden="true"
    >
      <motion.span
        className="text-[10px] tracking-[0.4em] uppercase"
        style={{
          color: 'var(--color-cream)',
          fontFamily: 'var(--font-body)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        Scroll
      </motion.span>
      <div
        className="relative h-[60px] w-px overflow-hidden"
        style={{ background: 'rgba(200,169,110,0.2)' }}
      >
        <motion.span
          className="absolute left-0 right-0 top-0 h-4"
          style={{ background: 'var(--color-gold)' }}
          animate={{ y: [-16, 60] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}
