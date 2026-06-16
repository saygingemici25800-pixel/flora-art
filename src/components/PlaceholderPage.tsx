interface PlaceholderPageProps {
  name: string
}

export default function PlaceholderPage({ name }: PlaceholderPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        fontFamily: 'var(--font-display)',
        background: 'var(--color-cream)',
      }}
    >
      <p style={{ color: 'var(--color-bronze)', fontSize: '0.875rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Flora Art
      </p>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-forest)' }}>
        {name}
      </h1>
      <p style={{ color: 'var(--color-ink)', opacity: 0.5, fontFamily: 'var(--font-body)' }}>
        Bu sayfa yapım aşamasında.
      </p>
    </div>
  )
}
