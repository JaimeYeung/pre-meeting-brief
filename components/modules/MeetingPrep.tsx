import type { MeetingPrepData } from '@/lib/types'
import { CollapsibleCard } from '../ui/CollapsibleCard'

export function MeetingPrep({ data }: { data: MeetingPrepData }) {
  return (
    <CollapsibleCard label="Preparation" title="Meeting Prep">
      {data.missingDataNote && (
        <p style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '10px' }}>
          Agenda
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' as const }}>
          {data.agenda.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--gold)', border: '1px solid var(--gold)', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-light)' }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '10px' }}>
          Discovery Questions
        </p>
        <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.discoveryQuestions.map((q, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: 'var(--gold)', marginTop: '3px', flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.6 }}>
                {q}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </CollapsibleCard>
  )
}
