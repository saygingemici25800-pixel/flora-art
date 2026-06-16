/**
 * Full-bleed video background with a graceful fallback.
 *
 * The fallback (a forest/beige motif) always renders underneath; the <video>
 * fades in only once it actually loads. So a missing src (no file in
 * public/videos yet) simply never fires onLoadedData and the fallback stays —
 * no crash, and dropping the file in later activates the video automatically.
 *
 * `enableVideo={false}` (mobile) skips the <video> entirely so multiple
 * autoplay videos never run on a phone — the fallback motif shows instead.
 */
import { useState } from 'react'
import type { ReactNode } from 'react'

interface Props {
  src?: string
  /** Render the autoplay video. Pass `false` on mobile to show only the fallback. */
  enableVideo?: boolean
  /** 0–1 dark forest overlay for text legibility over the video. */
  overlay?: number
  /** Always-rendered layer beneath the video (forest/beige + motif art). */
  fallback: ReactNode
  className?: string
}

export default function VideoBackdrop({
  src,
  enableVideo = true,
  overlay = 0.45,
  fallback,
  className = '',
}: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0">{fallback}</div>

      {enableVideo && src && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[900ms] ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {overlay > 0 && (
        <div className="absolute inset-0" style={{ background: `rgba(1,62,55,${overlay})` }} />
      )}
    </div>
  )
}
