import type { PersonaIntelData } from '@/lib/types'
import { CollapsibleCard } from '../ui/CollapsibleCard'

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '8px' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

export function PersonaIntel({ data }: { data: PersonaIntelData }) {
  return (
    <CollapsibleCard label="Research" title="Persona & Competitive Intel">
      {data.missingDataNote && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <Section label="Pain Points">
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.painPoints.map((pt, i) => (
            <li key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontStyle: 'italic', color: 'var(--ink-light)', paddingLeft: '14px', borderLeft: '2px solid var(--border)', lineHeight: 'var(--leading-snug)' }}>
              {pt}
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Likely Current Solution">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 'var(--leading-normal)' }}>
          {data.likelySolution}
        </p>
      </Section>

      <Section label="Displacement Angle">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 'var(--leading-normal)' }}>
          {data.displacementAngle}
        </p>
      </Section>
    </CollapsibleCard>
  )
}
