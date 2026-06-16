/**
 * Loading placeholder for product cards — beige block with a soft gold pulse,
 * matching the storefront palette. Used while product data is in flight.
 */
import { motion } from 'framer-motion'

const PULSE = {
  animate: { opacity: [0.5, 0.85, 0.5] },
  transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
}

export default function ProductCardSkeleton({ aspectRatio = '3 / 4' }: { aspectRatio?: string }) {
  return (
    <div className="flex flex-col" aria-hidden="true">
      <motion.div
        {...PULSE}
        className="w-full"
        style={{
          aspectRatio,
          background:
            'linear-gradient(135deg, var(--color-beige) 0%, rgba(200,169,110,0.18) 50%, var(--color-beige) 100%)',
        }}
      />
      <div className="px-5 pt-4 pb-6">
        <motion.div
          {...PULSE}
          className="mb-3 h-3 w-1/3"
          style={{ background: 'rgba(200,169,110,0.25)' }}
        />
        <motion.div
          {...PULSE}
          className="mb-4 h-4 w-3/4"
          style={{ background: 'rgba(1, 62, 55,0.12)' }}
        />
        <motion.div
          {...PULSE}
          className="h-9 w-full"
          style={{ background: 'rgba(1, 62, 55,0.08)' }}
        />
      </div>
    </div>
  )
}

/** A responsive grid of card skeletons. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 items-start">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} aspectRatio={i % 5 === 1 ? '4 / 5' : i % 5 === 2 ? '1 / 1' : '3 / 4'} />
      ))}
    </div>
  )
}
