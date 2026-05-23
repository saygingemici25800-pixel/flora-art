export default function PageLoader() {
  return (
    <div
      className="w-full grid place-items-center"
      style={{
        background: 'var(--color-cream)',
        minHeight: 'calc(100dvh - 78px)',
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <span
        className="block w-3 h-3 rounded-full"
        style={{
          background: 'var(--color-gold)',
          animation: 'flora-pulse 1.2s cubic-bezier(0.4,0,0.6,1) infinite',
        }}
      />
      <style>{`
        @keyframes flora-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.6); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="flora-pulse"] { animation: none !important; opacity: 0.6 !important; }
        }
      `}</style>
    </div>
  )
}
