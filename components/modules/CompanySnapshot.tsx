import type { CompanySnapshotData } from '@/lib/types'

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const colors = { high: '#2d7a2d', medium: '#a07020', low: '#8b2c2c' }
  return (
    <span style={{
      fontSize: '8px',
      letterSpacing: '1px',
      textTransform: 'uppercase' as const,
      color: colors[level],
      border: `1px solid ${colors[level]}`,
      padding: '2px 6px',
      marginLeft: '8px',
      opacity: 0.8,
    }}>
      {level} confidence
    </span>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-dashed)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', paddingTop: '2px' }}>{label}</span>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.6 }}>{value}</p>
    </div>
  )
}

export function CompanySnapshot({ data }: { data: CompanySnapshotData }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: '3px solid var(--gold)', padding: '24px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--gold)' }}>
          Company Snapshot
        </span>
        <ConfidenceBadge level={data.confidence} />
      </div>

      {data.missingDataNote && (
        <p style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {data.recentNews.length > 0 && (
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '6px' }}>Recent News</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data.recentNews.map((item, i) => (
                <li key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--ink-light)', paddingLeft: '12px', borderLeft: '2px solid var(--gold)', lineHeight: 1.5 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.fundingSignals && <Row label="Funding" value={data.fundingSignals} />}
        {data.hiringTrends && <Row label="Hiring" value={data.hiringTrends} />}
        {data.keyInitiatives && <Row label="Initiatives" value={data.keyInitiatives} />}
      </div>
    </div>
  )
}
