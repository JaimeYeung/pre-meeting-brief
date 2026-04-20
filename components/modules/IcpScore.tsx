import type { IcpScoreData } from '@/lib/types'

export function IcpScore({ data }: { data: IcpScoreData }) {
  const tierColors: Record<string, string> = {
    Enterprise: 'var(--gold)',
    'Mid-Market': 'var(--ink)',
    SMB: 'var(--muted)',
  }

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: '3px solid var(--gold)', padding: '24px', marginBottom: '16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: '16px' }}>
        ICP Score · Deal Potential
      </p>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 300, color: 'var(--ink)', lineHeight: 1 }}>
            {data.score}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--muted)', fontStyle: 'italic' }}>/10</span>
        </div>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '9px',
          letterSpacing: '2px',
          textTransform: 'uppercase' as const,
          color: tierColors[data.dealPotential] ?? 'var(--gold)',
          border: `1px solid ${tierColors[data.dealPotential] ?? 'var(--gold)'}`,
          padding: '4px 12px',
        }}>
          {data.dealPotential}
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: '8px' }}>
        {data.rationale}
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
        {data.dealRationale}
      </p>
    </div>
  )
}
