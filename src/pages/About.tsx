import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSEO } from '../hooks/useSEO'
import VahapVoices from '../components/sections/VahapVoices'

const EASE = [0.16, 1, 0.3, 1] as const

export default function About() {
  const { t } = useTranslation()
  useSEO({
    title: t('seo.about.title') as string,
    description: t('seo.about.description') as string,
  })
  return (
    <>
      <Founder />
      <VahapVoices />
    </>
  )
}

function Founder() {
  const { t } = useTranslation()
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        paddingTop: 'clamp(120px, 16vh, 180px)',
        paddingBottom: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 1, ease: EASE }}
          className="md:col-span-5 md:order-2 flex justify-center md:justify-end"
        >
          <div
            className="relative grid place-items-center"
            style={{
              width: 'min(78vw, 420px)',
              aspectRatio: '1 / 1',
              borderRadius: '50%',
              border: '1px solid rgba(200, 169, 110, 0.45)',
              background:
                'radial-gradient(circle at 40% 35%, rgba(200,169,110,0.12), rgba(1,62,55,0) 60%)',
            }}
          >
            <div
              className="absolute rounded-full"
              style={{ inset: '12%', border: '1px solid rgba(200, 169, 110, 0.2)' }}
            />
            <div className="relative text-center px-6">
              <FounderGlyph />
              <p
                className="mt-5 text-[10px] tracking-[0.3em] uppercase"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'rgba(255,239,179, 0.55)',
                }}
              >
                {t('about.founder.imagePlaceholder')}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="md:col-span-7 md:order-1"
        >
          <p
            className="text-[11px] tracking-[0.32em] uppercase mb-4"
            style={{
              color: 'var(--color-gold)',
              fontFamily: 'var(--font-display)',
              fontVariant: 'small-caps',
            }}
          >
            {t('about.founder.kicker')}
          </p>

          <h2
            className="italic mb-8"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              color: 'var(--color-cream)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {t('about.founder.name')}
          </h2>

          <p
            className="text-[16px] leading-relaxed max-w-[58ch] mb-5"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-cream)',
              opacity: 0.85,
            }}
          >
            {t('about.founder.p1')}
          </p>
          <p
            className="text-[15px] leading-relaxed max-w-[58ch] mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-cream)',
              opacity: 0.7,
            }}
          >
            {t('about.founder.p2')}
          </p>

          <p
            className="text-[11px] tracking-[0.3em] uppercase pt-6 border-t"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-gold)',
              borderColor: 'rgba(200, 169, 110, 0.35)',
            }}
          >
            {t('about.founder.stats')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function FounderGlyph() {
  return (
    <svg
      width="84"
      height="84"
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mx-auto"
      style={{ color: 'var(--color-gold)', opacity: 0.85 }}
    >
      <g transform="translate(50 50)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <ellipse key={rot} cx="0" cy="-22" rx="10" ry="20" transform={`rotate(${rot})`} />
        ))}
        <circle r="9" fill="currentColor" opacity="0.18" />
        <circle r="4" />
        <path d="M 0 22 C -6 36, -6 46, -6 50" />
        <path d="M 0 22 C 6 36, 6 46, 6 50" />
        <ellipse cx="-15" cy="40" rx="10" ry="4" transform="rotate(-25 -15 40)" />
        <ellipse cx="15" cy="40" rx="10" ry="4" transform="rotate(25 15 40)" />
      </g>
    </svg>
  )
}
