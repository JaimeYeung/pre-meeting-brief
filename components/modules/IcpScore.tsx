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
      letterSpacing: '0.18em',
      textTransform: 'uppercase' as const,
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
      padding: '3px 10px',
      whiteSpace: 'nowrap' as const,
    }}>
      {data.dealPotential}
    </span>
  )

  return (
    <CollapsibleCard label="Qualification" title="ICP Score · Deal Potential" badge={badge}>
      {/* 2-column layout: big score left, rationale right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 'var(--space-8)',
        alignItems: 'start',
      }}>
        {/* Left: score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ lineHeight: 1, marginBottom: 'var(--space-2)' }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3.5rem',
              fontWeight: 300,
              color: 'var(--ink)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {data.score}
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.375rem',
              color: 'var(--muted)',
              fontStyle: 'italic',
            }}>/10</span>
          </div>
          <div style={{
            height: '2px',
            width: `${data.score * 10}%`,
            background: 'var(--accent)',
            transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            marginBottom: 'var(--space-2)',
          }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: 'var(--muted)',
          }}>
            ICP fit
          </span>
        </div>

        {/* Right: rationale */}
        <div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-base)',
            fontStyle: 'italic',
            color: 'var(--ink-light)',
            lineHeight: 'var(--leading-normal)',
            marginBottom: 'var(--space-4)',
            maxWidth: '55ch',
          }}>
            {data.rationale}
          </p>
          <div style={{
            paddingTop: 'var(--space-4)',
            borderTop: '1px dashed var(--border-dashed)',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase' as const,
              color: 'var(--muted)',
              marginBottom: 'var(--space-2)',
            }}>
              Deal signal
            </p>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-light)',
              fontStyle: 'italic',
              lineHeight: 'var(--leading-snug)',
            }}>
              {data.dealRationale}
            </p>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  )
}
