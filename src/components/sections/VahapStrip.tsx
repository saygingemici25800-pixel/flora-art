/**
 * "Çiçekçinin Sesi" strip on the homepage — a band of five small clips between
 * the category sections and the contact/footer.
 *
 * Three are live CaptionedVideo players (lightbox, seek, gradient sound, and
 * lazy-load all come for free). Two are "coming soon" placeholders for the
 * Russian / English-language clips; drop `vahap-ru.mp4` / `vahap-en.mp4` into
 * public/videos and swap the placeholder for a CaptionedVideo when ready.
 */
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { MotifKind } from '../../types'
import ProductMotif from '../ui/ProductMotif'
import CaptionedVideo from '../ui/CaptionedVideo'

const EASE = [0.16, 1, 0.3, 1] as const

interface StripItem {
  id: string
  base?: string // present → live video; absent → placeholder
  motif: MotifKind
}

const ITEMS: StripItem[] = [
  { id: 'mutluluk', base: 'about-vahap-mutluluk', motif: 'peony' },
  { id: 'emek', base: 'process-vahap-emek', motif: 'rose' },
  { id: 'turizm', base: 'about-vahap-turizm', motif: 'orchid' },
  { id: 'ru', motif: 'anemone' },
  { id: 'en', motif: 'peony' },
]

export default function VahapStrip() {
  const { t } = useTranslation()
  const items = t('homepage.strip.items', { returnObjects: true }) as Record<
    string,
    { title: string; desc: string }
  >

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--color-forest)', color: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <header className="mb-12 md:mb-16 max-w-[60ch]">
          <p
            className="mb-4 text-[11px] tracking-[0.32em] uppercase"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-display)', fontVariant: 'small-caps' }}
          >
            {t('homepage.strip.kicker')}
          </p>
          <span className="block overflow-hidden" style={{ paddingBottom: '0.1em' }}>
            <motion.h2
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.85, ease: EASE }}
              className="italic"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                color: 'var(--color-cream)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {t('homepage.strip.title')}
            </motion.h2>
          </span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mt-4 max-w-[52ch] text-[14px] leading-relaxed"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {t('homepage.strip.subtitle')}
          </motion.p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {ITEMS.map((item, i) => {
            const label = items[item.id] ?? { title: item.id, desc: '' }
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8% 0px' }}
                transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.1 }}
              >
                {item.base ? (
                  <CaptionedVideo
                    src={`/videos/${item.base}.mp4`}
                    poster={`/videos/${item.base}.webp`}
                    wordsSrc={`/videos/${item.base}.words.json`}
                  />
                ) : (
                  <PlaceholderCard motif={item.motif} badge={t('homepage.strip.comingSoon') as string} />
                )}

                <h3
                  className="mt-4 italic"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    color: 'var(--color-cream)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  {label.title}
                </h3>
                <p
                  className="mt-2 max-w-[40ch] text-[13.5px] leading-relaxed"
                  style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,240,232,0.72)' }}
                >
                  {label.desc}
                </p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** Forest box with a faint motif and a "coming soon" pill — stand-in until the
 *  RU / EN clip is dropped into public/videos. */
function PlaceholderCard({ motif, badge }: { motif: MotifKind; badge: string }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: '16 / 9',
        background: 'var(--color-forest)',
        border: '1px solid rgba(200,169,110,0.2)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(200,169,110,0.10), rgba(28,43,26,0) 60%)',
        }}
      />
      <div className="absolute inset-0 grid place-items-center opacity-[0.5]">
        <div style={{ width: '34%', height: '60%' }}>
          <ProductMotif kind={motif} color="var(--color-gold)" opacity={1} />
        </div>
      </div>
      <span
        className="absolute right-3 top-3 px-3 py-1 text-[9px] tracking-[0.3em] uppercase"
        style={{
          background: 'rgba(200,169,110,0.16)',
          border: '1px solid rgba(200,169,110,0.45)',
          color: 'var(--color-gold)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {badge}
      </span>
    </div>
  )
}
