import type { MotifKind } from '../../data/products'

interface Props {
  kind: MotifKind
  color?: string
  opacity?: number
}

export default function ProductMotif({ kind, color, opacity = 0.5 }: Props) {
  const common = {
    width: '100%',
    height: '100%',
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style: { color: color ?? 'var(--color-forest)', opacity } as React.CSSProperties,
    'aria-hidden': true,
  }

  switch (kind) {
    case 'rose':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 170)">
            <circle r="14" />
            <circle r="26" />
            <circle r="40" />
            <circle r="54" />
            <path d="M 0 60 C -10 100, -40 130, -50 150" />
            <path d="M 0 60 C 10 100, 40 130, 50 150" />
            <ellipse cx="-40" cy="120" rx="22" ry="9" transform="rotate(-35 -40 120)" />
            <ellipse cx="40" cy="120" rx="22" ry="9" transform="rotate(35 40 120)" />
          </g>
        </svg>
      )
    case 'tulip':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 200)">
            <path d="M -30 -50 C -30 -90, -10 -110, 0 -110 C 10 -110, 30 -90, 30 -50 L 30 -10 C 30 0, 20 10, 0 10 C -20 10, -30 0, -30 -10 Z" />
            <path d="M -16 -50 C -16 -90, 0 -110, 0 -110" opacity="0.5" />
            <path d="M 16 -50 C 16 -90, 0 -110, 0 -110" opacity="0.5" />
            <path d="M 0 10 L 0 110" />
            <path d="M 0 40 C -25 50, -50 70, -70 110" />
            <path d="M 0 70 C 25 80, 50 100, 65 130" />
          </g>
        </svg>
      )
    case 'peony':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 160)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
              <ellipse key={rot} cx="0" cy="-32" rx="22" ry="34" transform={`rotate(${rot})`} />
            ))}
            <circle r="20" fill="currentColor" opacity="0.15" />
            <circle r="8" />
            <path d="M 0 60 C -8 100, -8 130, -8 160" />
            <path d="M 0 60 C 8 100, 8 130, 8 160" />
          </g>
        </svg>
      )
    case 'box':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 180)">
            <rect x="-110" y="-30" width="220" height="120" rx="4" />
            <line x1="-110" y1="0" x2="110" y2="0" />
            <g transform="translate(0 -30)">
              {[-80, -40, 0, 40, 80].map((x, idx) => (
                <g key={idx} transform={`translate(${x} -20)`}>
                  <circle r="14" />
                  <circle r="6" opacity="0.5" />
                  <circle r="2" fill="currentColor" />
                </g>
              ))}
            </g>
          </g>
        </svg>
      )
    case 'wedding':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 170)">
            {[0, 60, 120, 180, 240, 300].map((rot) => (
              <g key={rot} transform={`rotate(${rot})`}>
                <ellipse cx="0" cy="-48" rx="16" ry="26" />
              </g>
            ))}
            <circle r="14" fill="currentColor" opacity="0.2" />
            <path d="M 0 30 C -5 70, -5 110, -5 150" />
            <path d="M 0 30 C 5 70, 5 110, 5 150" />
            <path d="M -30 130 C -20 140, 20 140, 30 130" />
          </g>
        </svg>
      )
    case 'orchid':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 160)">
            <ellipse cx="-25" cy="-30" rx="22" ry="40" transform="rotate(-25 -25 -30)" />
            <ellipse cx="25" cy="-30" rx="22" ry="40" transform="rotate(25 25 -30)" />
            <ellipse cx="0" cy="-50" rx="18" ry="34" />
            <ellipse cx="-12" cy="10" rx="14" ry="22" transform="rotate(-30 -12 10)" />
            <ellipse cx="12" cy="10" rx="14" ry="22" transform="rotate(30 12 10)" />
            <circle r="6" fill="currentColor" opacity="0.4" />
            <path d="M 0 30 L 0 130" />
            <ellipse cx="-40" cy="120" rx="40" ry="14" />
            <ellipse cx="40" cy="120" rx="40" ry="14" />
          </g>
        </svg>
      )
    case 'anemone':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 165)">
            {[0, 51, 102, 153, 204, 255, 306].map((rot) => (
              <ellipse key={rot} cx="0" cy="-40" rx="18" ry="30" transform={`rotate(${rot})`} />
            ))}
            <circle r="14" fill="currentColor" opacity="0.7" />
            <g opacity="0.65">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot) => (
                <line key={rot} x1="0" y1="-2" x2="0" y2="-12" transform={`rotate(${rot})`} />
              ))}
            </g>
            <path d="M 0 30 C -10 70, -15 110, -10 150" />
            <path d="M 0 30 C 10 70, 15 110, 10 150" />
            <ellipse cx="-30" cy="110" rx="20" ry="8" transform="rotate(-30 -30 110)" />
            <ellipse cx="30" cy="110" rx="20" ry="8" transform="rotate(30 30 110)" />
          </g>
        </svg>
      )
    case 'terrarium':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 175)">
            <path d="M -100 50 C -100 -40, -60 -90, 0 -90 C 60 -90, 100 -40, 100 50 Z" />
            <line x1="-100" y1="50" x2="100" y2="50" />
            <line x1="-110" y1="60" x2="110" y2="60" />
            <path d="M -90 50 L 90 50 L 80 35 L -80 35 Z" opacity="0.6" />
            <g transform="translate(-40 25)">
              <path d="M 0 0 C 0 -25, -15 -45, -25 -55" />
              <ellipse cx="-25" cy="-55" rx="12" ry="6" transform="rotate(-30 -25 -55)" />
              <path d="M 0 0 C 0 -30, 10 -50, 18 -60" />
              <ellipse cx="18" cy="-60" rx="10" ry="5" transform="rotate(20 18 -60)" />
            </g>
            <g transform="translate(35 30)">
              <path d="M 0 0 C 0 -20, 0 -40, 0 -55" />
              <ellipse cx="-12" cy="-40" rx="10" ry="5" transform="rotate(-25 -12 -40)" />
              <ellipse cx="12" cy="-50" rx="10" ry="5" transform="rotate(25 12 -50)" />
              <circle cx="0" cy="-60" r="6" />
            </g>
            <circle cx="-30" cy="45" r="3" fill="currentColor" />
            <circle cx="10" cy="45" r="2" fill="currentColor" />
            <circle cx="50" cy="45" r="2.5" fill="currentColor" />
          </g>
        </svg>
      )
    case 'premium':
      return (
        <svg viewBox="0 0 300 320" preserveAspectRatio="xMidYMid slice" {...common}>
          <g transform="translate(150 175)">
            <circle r="90" opacity="0.5" />
            <circle r="70" opacity="0.7" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot) => (
              <ellipse key={rot} cx="0" cy="-44" rx="14" ry="22" transform={`rotate(${rot})`} />
            ))}
            {[0, 60, 120, 180, 240, 300].map((rot) => (
              <ellipse key={`s-${rot}`} cx="0" cy="-26" rx="9" ry="14" transform={`rotate(${rot})`} />
            ))}
            <circle r="10" fill="currentColor" opacity="0.5" />
            {[45, 135, 225, 315].map((rot) => (
              <g key={rot} transform={`rotate(${rot}) translate(0 -90)`}>
                <path d="M 0 -6 L 5 0 L 0 6 L -5 0 Z" fill="currentColor" opacity="0.8" />
              </g>
            ))}
          </g>
        </svg>
      )
  }
}
