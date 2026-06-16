import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

interface Testimonial {
  quote: string
  author: string
}

export default function Testimonials() {
  const { t } = useTranslation()
  const items = t('testimonials.items', { returnObjects: true }) as Testimonial[]

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-forest)',
        color: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      {/* Ghost "5.0" — devasa arka plan, sol-ortada, opacity 0.15 */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 0.15, x: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute italic leading-none select-none pointer-events-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(8rem, 20vw, 18rem)',
          color: 'var(--color-gold)',
          letterSpacing: '-0.04em',
          left: '2vw',
          top: '50%',
          transform: 'translateY(-50%)',
          fontWeight: 200,
        }}
      >
        {t('testimonials.rating')}
      </motion.span>

      <div className="relative z-[2] mx-auto max-w-[1400px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
        {/* Sol %60 boş — sadece ghost rakam görünür */}
        <div className="hidden md:block md:col-span-5" />

        {/* Sağ %40 — gerçek rating header + yorumlar */}
        <div className="md:col-span-7 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-10"
          >
            <p
              className="flex items-baseline gap-3 mb-3"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <span
                className="italic"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--color-gold)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                {t('testimonials.rating')}
              </span>
              <span
                aria-hidden="true"
                className="text-[14px] tracking-[0.25em]"
                style={{ color: 'var(--color-gold)' }}
              >
                {t('testimonials.stars')}
              </span>
              <span
                className="text-[12px] tracking-[0.18em]"
                style={{ color: 'var(--color-cream)', opacity: 0.85 }}
              >
                {t('testimonials.count')}
              </span>
            </p>
            <p
              className="max-w-[44ch] text-[13px] leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-cream)',
                opacity: 0.6,
              }}
            >
              {t('testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="flex flex-col gap-5">
          {items.map((item, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.12 }}
              className="relative p-6 md:p-8"
              style={{
                background: 'rgba(255, 239, 179, 0.05)',
                border: '1px solid rgba(255, 239, 179, 0.1)',
              }}
            >
              <span
                aria-hidden="true"
                className="absolute top-6 right-6 italic leading-none opacity-25 select-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '4rem',
                  color: 'var(--color-gold)',
                }}
              >
                “
              </span>

              <p
                className="text-[14px] tracking-[0.2em] mb-4"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
              >
                ★★★★★
              </p>

              <blockquote
                className="italic text-[17px] md:text-[18px] leading-relaxed max-w-[62ch]"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-cream)',
                  letterSpacing: '0',
                }}
              >
                “{item.quote}”
              </blockquote>

              <figcaption
                className="mt-5 text-[11px] tracking-[0.3em] uppercase"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-gold)',
                  opacity: 0.85,
                }}
              >
                — {item.author}
              </figcaption>
            </motion.figure>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
