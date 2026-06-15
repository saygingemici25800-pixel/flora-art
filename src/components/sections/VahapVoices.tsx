/**
 * "Çiçekçinin Sesi" — the founder (Vahap) interview gallery for the About page.
 *
 * One large featured CaptionedVideo (karaoke + sound) plus a strip of four
 * poster thumbnails. Tapping a thumbnail promotes that clip to the stage and
 * turns its sound on (a user gesture, so unmuting is allowed). Only the staged
 * clip plays, which keeps it light on desktop and mobile alike.
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import CaptionedVideo from '../ui/CaptionedVideo'

const EASE = [0.16, 1, 0.3, 1] as const

interface Clip {
  id: string
  base: string // file base under /videos
}

const CLIPS: Clip[] = [
  { id: 'tanitim', base: 'about-vahap-tanitim' },
  { id: 'mutluluk', base: 'about-vahap-mutluluk' },
  { id: 'turizm', base: 'about-vahap-turizm' },
  { id: 'cicekler', base: 'about-vahap-cicekler' },
]

export default function VahapVoices() {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState('tanitim')
  const [soundOn, setSoundOn] = useState(false)

  const active = CLIPS.find((c) => c.id === activeId) ?? CLIPS[0]
  const labels = t('about.voices.labels', { returnObjects: true }) as Record<string, string>

  function select(id: string) {
    if (id === activeId) {
      setSoundOn((s) => !s)
      return
    }
    setActiveId(id)
    setSoundOn(true)
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: 'var(--color-forest)', color: 'var(--color-cream)', paddingBlock: 'var(--spacing-section)' }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <header className="mb-10 md:mb-14 max-w-[60ch]">
          <p
            className="text-[11px] tracking-[0.32em] uppercase mb-4"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-display)', fontVariant: 'small-caps' }}
          >
            {t('about.voices.kicker')}
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
              {t('about.voices.title')}
            </motion.h2>
          </span>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mt-4 text-[14px] leading-relaxed max-w-[52ch]"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-cream)' }}
          >
            {t('about.voices.subtitle')}
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {/* featured stage — remounts per clip for a clean restart */}
          <CaptionedVideo
            key={active.id}
            src={`/videos/${active.base}.mp4`}
            poster={`/videos/${active.base}.webp`}
            wordsSrc={`/videos/${active.base}.words.json`}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((s) => !s)}
          />

          <p
            className="mt-4 text-[12px] tracking-[0.28em] uppercase"
            style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
          >
            {labels[active.id]}
          </p>
        </motion.div>

        {/* thumbnail selector */}
        <ul className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {CLIPS.map((clip) => {
            const isActive = clip.id === activeId
            return (
              <li key={clip.id}>
                <button
                  type="button"
                  onClick={() => select(clip.id)}
                  aria-pressed={isActive}
                  className="group relative block w-full overflow-hidden transition-all duration-300"
                  style={{
                    aspectRatio: '16 / 9',
                    border: isActive ? '1px solid var(--color-gold)' : '1px solid rgba(200,169,110,0.2)',
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  <img
                    src={`/videos/${clip.base}.webp`}
                    alt={labels[clip.id]}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className="absolute inset-0"
                    style={{ background: isActive ? 'rgba(28,43,26,0.15)' : 'rgba(28,43,26,0.45)' }}
                  />
                  <span
                    className="absolute left-2 bottom-2 right-2 text-left text-[10px] tracking-[0.18em] uppercase leading-tight"
                    style={{ color: 'var(--color-cream)', fontFamily: 'var(--font-body)' }}
                  >
                    {labels[clip.id]}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
