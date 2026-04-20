export function SkeletonCard({ height = 140 }: { height?: number }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--border)',
      padding: '24px',
      marginBottom: '16px',
      height,
      animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 2, width: '30%', marginBottom: 16 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '80%', marginBottom: 10 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '65%', marginBottom: 10 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '72%' }} />
    </div>
  )
}
