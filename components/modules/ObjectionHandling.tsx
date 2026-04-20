import type { ObjectionHandlingData } from '@/lib/types'

export function ObjectionHandling({ data }: { data: ObjectionHandlingData }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: '3px solid var(--gold)', padding: '24px', marginBottom: '16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: '16px' }}>
        Objection Handling
      </p>

      {data.missingDataNote && (
        <p style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.objections.map((item, i) => (
          <div key={i} style={{
            borderBottom: i < data.objections.length - 1 ? '1px dashed var(--border-dashed)' : 'none',
            paddingBottom: i < data.objections.length - 1 ? '16px' : '0',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5, marginBottom: '6px' }}>
              "{item.objection}"
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7, paddingLeft: '12px', borderLeft: '2px solid var(--gold)' }}>
              {item.response}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
