import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

function langPrefix(pathname: string): string {
  if (pathname.startsWith('/en')) return '/en'
  if (pathname.startsWith('/ru')) return '/ru'
  return ''
}

export default function HollandStory() {
  const { t } = useTranslation()
  const location = useLocation()
  const prefix = langPrefix(location.pathname)
  const titleLines = (t('story.title') as string).split('\n')

  return (
    <section
      className="relative w-full"
      style={{
        background: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
        <div className="md:col-span-7">
          <h2
            className="italic mb-10 md:mb-12"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7.5vw, 6rem)',
              color: 'var(--color-forest)',
              letterSpacing: '-0.02em',
              lineHeight: 0.95,
            }}
          >
            {titleLines.map((line, i) => (
              <span
                key={i}
                className="block overflow-hidden"
                style={{ paddingBottom: '0.08em' }}
              >
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  whileInView={{ y: '0%' }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.85, ease: EASE, delay: i * 0.15 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 0.85, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
            className="text-[16px] md:text-[17px] leading-relaxed max-w-[58ch] mb-5"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
          >
            {t('story.p1')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            className="text-[15px] md:text-[16px] leading-relaxed max-w-[58ch] mb-10"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
          >
            {t('story.p2')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            className="flex items-center gap-5"
          >
            <span
              aria-hidden="true"
              className="block h-px w-16"
              style={{ background: 'var(--color-gold)' }}
            />
            <Link
              to={`${prefix}/delivery`}
              className="group inline-flex items-center gap-2 text-[12px] tracking-[0.28em] uppercase"
              style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span className="border-b border-current pb-1">{t('story.cta')}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </motion.div>
        </div>

        <div className="md:col-span-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative overflow-hidden"
            style={{
              background: 'var(--color-beige)',
              borderRadius: '4px',
              aspectRatio: '4 / 5',
            }}
          >
            <BotanicalArtwork />

            <span
              aria-hidden="true"
              className="absolute bottom-5 left-5 text-[10px] tracking-[0.4em] uppercase"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-forest)',
                opacity: 0.45,
              }}
            >
              Aalsmeer · Holland
            </span>
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function BotanicalArtwork() {
  return (
    <svg
      viewBox="0 0 500 600"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ color: 'var(--color-gold)', opacity: 0.55 }}
    >
      <g transform="translate(250 540)">
        <path d="M 0 0 C 0 -120, -10 -240, -5 -340 C 0 -440, 30 -500, 20 -540" />

        <path d="M -3 -200 C -50 -210, -100 -200, -150 -220" />
        <path d="M 0 -300 C 60 -300, 120 -300, 180 -320" />
        <path d="M 8 -380 C -50 -380, -110 -400, -160 -430" />
        <path d="M 14 -460 C 60 -470, 110 -470, 160 -490" />

        <g>
          <Leaf cx={-110} cy={-215} rx={50} ry={16} rot={-15} />
          <Leaf cx={-150} cy={-220} rx={42} ry={14} rot={-25} />
          <Leaf cx={140} cy={-310} rx={55} ry={18} rot={20} />
          <Leaf cx={180} cy={-320} rx={45} ry={15} rot={12} />
          <Leaf cx={-120} cy={-395} rx={48} ry={16} rot={-22} />
          <Leaf cx={-160} cy={-430} rx={42} ry={14} rot={-32} />
          <Leaf cx={130} cy={-480} rx={52} ry={17} rot={20} />
          <Leaf cx={160} cy={-490} rx={42} ry={14} rot={12} />
        </g>

        <g>
          <Flower cx={0} cy={-540} r={26} />
          <Flower cx={-30} cy={-510} r={18} />
          <Flower cx={30} cy={-505} r={16} />
        </g>

        <g>
          <circle cx="-150" cy="-220" r="3" fill="currentColor" />
          <circle cx="180" cy="-320" r="3" fill="currentColor" />
          <circle cx="-160" cy="-430" r="3" fill="currentColor" />
          <circle cx="160" cy="-490" r="3" fill="currentColor" />
        </g>

        <path d="M -80 0 L 80 0" />
        <path d="M -70 8 L 70 8" opacity="0.5" />
      </g>

      <g opacity="0.6">
        <circle cx="60" cy="100" r="3" fill="currentColor" />
        <circle cx="420" cy="150" r="2.5" fill="currentColor" />
        <circle cx="80" cy="350" r="2" fill="currentColor" />
        <circle cx="440" cy="380" r="3" fill="currentColor" />
        <circle cx="100" cy="500" r="2.5" fill="currentColor" />
      </g>
    </svg>
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

function Flower({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {[0, 60, 120, 180, 240, 300].map((rot) => (
        <ellipse
          key={rot}
          cx="0"
          cy={-r * 0.55}
          rx={r * 0.32}
          ry={r * 0.55}
          transform={`rotate(${rot})`}
        />
      ))}
      <circle r={r * 0.18} fill="currentColor" opacity="0.5" />
    </g>
  )
}
