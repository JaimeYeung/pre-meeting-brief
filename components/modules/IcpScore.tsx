import type { IcpScoreData } from '@/lib/types'
import { CollapsibleCard } from '../ui/CollapsibleCard'

export function IcpScore({ data }: { data: IcpScoreData }) {
  const tierColors: Record<string, string> = {
    Enterprise: 'var(--gold)',
    'Mid-Market': 'var(--ink)',
    SMB: 'var(--muted)',
  }

  const badge = (
    <span style={{
      fontFamily: 'var(--font-body)',
      fontSize: '9px',
      letterSpacing: '2px',
      textTransform: 'uppercase' as const,
      color: tierColors[data.dealPotential] ?? 'var(--gold)',
      border: `1px solid ${tierColors[data.dealPotential] ?? 'var(--gold)'}`,
      padding: '3px 10px',
      whiteSpace: 'nowrap' as const,
    }}>
      {data.dealPotential}
    </span>
  )

  return (
    <CollapsibleCard label="Qualification" title="ICP Score · Deal Potential" badge={badge}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 300, color: 'var(--ink)', lineHeight: 1 }}>
            {data.score}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--muted)', fontStyle: 'italic' }}>/10</span>
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: '8px' }}>
        {data.rationale}
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
        {data.dealRationale}
      </p>
    </CollapsibleCard>
  )
}
