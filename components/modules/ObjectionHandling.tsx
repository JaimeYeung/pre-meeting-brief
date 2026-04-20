import type { ObjectionHandlingData } from '@/lib/types'
import { CollapsibleCard } from '../ui/CollapsibleCard'

export function ObjectionHandling({ data }: { data: ObjectionHandlingData }) {
  return (
    <CollapsibleCard label="Tactics" title="Objection Handling">
      {data.missingDataNote && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.objections.map((item, i) => (
          <div key={i} style={{
            borderBottom: i < data.objections.length - 1 ? '1px dashed var(--border-dashed)' : 'none',
            paddingBottom: i < data.objections.length - 1 ? '16px' : '0',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)', lineHeight: 'var(--leading-snug)', marginBottom: '8px' }}>
              "{item.objection}"
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 'var(--leading-normal)', paddingLeft: '12px', borderLeft: '2px solid var(--accent)' }}>
              {item.response}
            </p>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  )
}
