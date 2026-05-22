import { useTranslation } from 'react-i18next'

export default function MarqueeTicker() {
  const { t } = useTranslation()
  const items = t('ticker.items', { returnObjects: true }) as string[]

  return (
    <div
      className="relative w-full overflow-hidden py-3"
      style={{ background: 'var(--color-gold)' }}
    >
      <div className="ticker-track flex w-max items-center">
        {[0, 1].map((dup) => (
          <ul
            key={dup}
            aria-hidden={dup === 1 ? 'true' : undefined}
            className="flex items-center shrink-0"
          >
            {items.map((item, i) => (
              <li
                key={`${dup}-${i}`}
                className="flex items-center shrink-0 px-8 md:px-12"
              >
                <span
                  className="uppercase whitespace-nowrap"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontVariant: 'small-caps',
                    letterSpacing: '0.32em',
                    color: 'var(--color-forest)',
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {item}
                </span>
                <span
                  aria-hidden="true"
                  className="ml-8 md:ml-12 inline-block"
                  style={{ color: 'var(--color-forest)', opacity: 0.55 }}
                >
                  ✦
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <style>{`
        @keyframes flora-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: flora-marquee 18s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
