import type { BriefResponse, GenerateApiResponse } from '@/lib/types'
import { CompanySnapshot } from './modules/CompanySnapshot'
import { IcpScore } from './modules/IcpScore'
import { PersonaIntel } from './modules/PersonaIntel'
import { MeetingPrep } from './modules/MeetingPrep'
import { ObjectionHandling } from './modules/ObjectionHandling'
import { SkeletonCard } from './ui/SkeletonCard'

interface BriefDisplayProps {
  brief: BriefResponse | null
  inputMode: GenerateApiResponse['inputMode'] | null
  isLoading: boolean
}

const INPUT_MODE_NOTES: Record<string, string> = {
  'company-only': 'Add a contact name and title for persona analysis and objection handling.',
  'no-title': 'Add a contact title for more precise persona analysis.',
  'no-name': 'Add a contact name for individual research.',
}

function MissingModule({ label, note }: { label: string; note: string }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px dashed var(--border)',
      padding: 'var(--space-6)',
      marginBottom: 'var(--space-5)',
      textAlign: 'center' as const,
    }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.18em',
        textTransform: 'uppercase' as const,
        color: 'var(--muted)',
        marginBottom: 'var(--space-2)',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-sm)',
        fontStyle: 'italic',
        color: 'var(--muted)',
      }}>
        {note}
      </p>
    </div>
  )
}

export function BriefDisplay({ brief, inputMode, isLoading }: BriefDisplayProps) {
  if (!isLoading && !brief) return null

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', paddingTop: 'var(--space-8)' }}>
      <div style={{ height: '1px', background: 'var(--border)', width: '100%' }} />

      {inputMode && INPUT_MODE_NOTES[inputMode] && (
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-sm)',
          fontStyle: 'italic',
          color: 'var(--muted)',
          textAlign: 'center',
          margin: 'var(--space-4) 0 var(--space-6)',
        }}>
          {INPUT_MODE_NOTES[inputMode]}
        </p>
      )}

      {isLoading ? (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <SkeletonCard height={180} />
          <SkeletonCard height={160} />
          <SkeletonCard height={200} />
          <SkeletonCard height={220} />
          <SkeletonCard height={180} />
        </div>
      ) : brief ? (
        <>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <CompanySnapshot data={brief.companySnapshot} />
            <IcpScore data={brief.icpScore} />
            {brief.personaIntel
              ? <PersonaIntel data={brief.personaIntel} />
              : <MissingModule label="Persona & Competitive Intel" note="Add a contact name and title to unlock persona analysis." />
            }
            <MeetingPrep data={brief.meetingPrep} />
            {brief.objectionHandling
              ? <ObjectionHandling data={brief.objectionHandling} />
              : <MissingModule label="Objection Handling" note="Add a contact name and title to unlock objection handling." />
            }
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            color: 'var(--muted)',
            textAlign: 'center',
            letterSpacing: '0.1em',
            marginTop: 'var(--space-4)',
            marginBottom: 'var(--space-16)',
          }}>
            Generated {new Date(brief.generatedAt).toLocaleString()}
          </p>
        </>
      ) : null}
    </div>
  )
}
