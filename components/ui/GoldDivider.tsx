export function GoldDivider() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      width: '100%',
    }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      <div style={{
        width: '6px',
        height: '6px',
        background: 'var(--gold)',
        transform: 'rotate(45deg)',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}
