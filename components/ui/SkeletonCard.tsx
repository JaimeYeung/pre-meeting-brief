export function SkeletonCard({ height = 140 }: { height?: number }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--border)',
      padding: '24px',
      marginBottom: '16px',
      height,
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 2, width: '30%', marginBottom: 16 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '80%', marginBottom: 10 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '65%', marginBottom: 10 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '72%' }} />
    </div>
  )
}
