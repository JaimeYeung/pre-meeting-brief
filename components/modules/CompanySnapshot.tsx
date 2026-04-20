import type { CompanySnapshotData } from '@/lib/types'
import { CollapsibleCard } from '../ui/CollapsibleCard'

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const colors = { high: '#2d7a2d', medium: '#a07020', low: '#8b2c2c' }
  return (
    <span style={{
      fontSize: 'var(--text-xs)',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const,
      color: colors[level],
      border: `1px solid ${colors[level]}`,
      padding: '2px 6px',
      opacity: 0.8,
      whiteSpace: 'nowrap' as const,
    }}>
      {level}
    </span>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border-dashed)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--muted)', paddingTop: '2px' }}>{label}</span>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 'var(--leading-normal)' }}>{value}</p>
    </div>
  )
}

export function CompanySnapshot({ data }: { data: CompanySnapshotData }) {
  return (
    <CollapsibleCard
      label="Intelligence"
      title="Company Snapshot"
      badge={<ConfidenceBadge level={data.confidence} />}
    >
      {data.missingDataNote && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {data.recentNews.length > 0 && (
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '8px' }}>Recent News</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {data.recentNews.map((item, i) => (
                <li key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: 'var(--ink-light)', paddingLeft: '12px', borderLeft: '2px solid var(--gold)', lineHeight: 'var(--leading-snug)' }}>
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
    </CollapsibleCard>
  )
}
