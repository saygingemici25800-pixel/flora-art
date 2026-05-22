import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

type USPKey = 'holland' | 'fast' | 'world'

interface UspItem {
  key: USPKey
  number: string
  Icon: () => ReactNode
}

const ITEMS: UspItem[] = [
  { key: 'holland', number: '01', Icon: FlowerIcon },
  { key: 'fast',    number: '02', Icon: BoltIcon },
  { key: 'world',   number: '03', Icon: GlobeIcon },
]

export default function USPCards() {
  const { t } = useTranslation()

  return (
    <section
      className="relative w-full"
      style={{
        background: 'var(--color-cream)',
        paddingBlock: 'var(--spacing-section)',
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="text-center mb-16 md:mb-20">
          <span className="block overflow-hidden" style={{ paddingBottom: '0.12em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                color: 'var(--color-forest)',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              {t('usp.title')}
            </motion.h2>
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
            className="block h-px w-16 mx-auto mt-8"
            style={{ background: 'var(--color-gold)', transformOrigin: 'center' }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {ITEMS.map((item, i) => (
            <motion.article
              key={item.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.15 }}
              className="group relative pt-2"
            >
              <span
                className="italic block leading-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 6vw, 5rem)',
                  color: 'var(--color-gold)',
                  opacity: 0.3,
                  letterSpacing: '-0.02em',
                }}
              >
                {item.number}
              </span>

              <div className="mt-6 mb-6" style={{ color: 'var(--color-forest)' }}>
                <item.Icon />
              </div>

              <h3
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  color: 'var(--color-forest)',
                  letterSpacing: '-0.005em',
                  lineHeight: 1.15,
                }}
              >
                {t(`usp.${item.key}.title`)}
              </h3>

              <p
                className="max-w-[34ch] mb-6"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--color-ink)',
                  opacity: 0.7,
                  lineHeight: 1.65,
                }}
              >
                {t(`usp.${item.key}.desc`)}
              </p>

              <span
                aria-hidden="true"
                className="block h-px w-full origin-left transition-transform duration-500 ease-out scale-x-0 group-hover:scale-x-100"
                style={{ background: 'var(--color-gold)' }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FlowerIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16" cy="16" r="2.4" />
      <ellipse cx="16" cy="8.5" rx="3" ry="4.5" />
      <ellipse cx="16" cy="23.5" rx="3" ry="4.5" />
      <ellipse cx="8.5" cy="16" rx="4.5" ry="3" />
      <ellipse cx="23.5" cy="16" rx="4.5" ry="3" />
      <ellipse cx="10.8" cy="10.8" rx="2.6" ry="3.8" transform="rotate(-45 10.8 10.8)" />
      <ellipse cx="21.2" cy="21.2" rx="2.6" ry="3.8" transform="rotate(-45 21.2 21.2)" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 3 L7 18 L15 18 L14 29 L25 14 L17 14 Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16" cy="16" r="12" />
      <path d="M4 16 L28 16" />
      <path d="M16 4 C 21 9, 21 23, 16 28" />
      <path d="M16 4 C 11 9, 11 23, 16 28" />
      <path d="M5.5 10 L26.5 10" />
      <path d="M5.5 22 L26.5 22" />
    </svg>
  )
}
