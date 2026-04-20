import type { PersonaIntelData } from '@/lib/types'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '8px' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

export function PersonaIntel({ data }: { data: PersonaIntelData }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderTop: '3px solid var(--gold)', padding: '24px', marginBottom: '16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--gold)', marginBottom: '16px' }}>
        Persona &amp; Competitive Intel
      </p>

      {data.missingDataNote && (
        <p style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <Section label="Pain Points">
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.painPoints.map((pt, i) => (
            <li key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', paddingLeft: '14px', borderLeft: '2px solid var(--border)', lineHeight: 1.5 }}>
              {pt}
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Likely Current Solution">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7 }}>
          {data.likelySolution}
        </p>
      </Section>

      <Section label="Displacement Angle">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7 }}>
          {data.displacementAngle}
        </p>
      </Section>
    </div>
  )
}
