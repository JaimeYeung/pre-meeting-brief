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
      fontSize: 'var(--text-xs)',
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
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '3.5rem', fontWeight: 300, color: 'var(--ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {data.score}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', color: 'var(--muted)', fontStyle: 'italic' }}>/10</span>
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 'var(--leading-normal)', marginBottom: '8px', maxWidth: '65ch' }}>
        {data.rationale}
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 'var(--leading-snug)', maxWidth: '65ch' }}>
        {data.dealRationale}
      </p>
    </CollapsibleCard>
  )
}
