import type { BriefResponse, GenerateApiResponse } from '@/lib/types'
import { CompanySnapshot } from './modules/CompanySnapshot'
import { IcpScore } from './modules/IcpScore'
import { PersonaIntel } from './modules/PersonaIntel'
import { MeetingPrep } from './modules/MeetingPrep'
import { ObjectionHandling } from './modules/ObjectionHandling'
import { SkeletonCard } from './ui/SkeletonCard'
import { GoldDivider } from './ui/GoldDivider'

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
    <div style={{ background: 'var(--card-bg)', border: '1px dashed var(--border)', padding: '24px', marginBottom: '16px', textAlign: 'center' as const }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase' as const, color: 'var(--muted)', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontStyle: 'italic', color: 'var(--muted)' }}>
        {note}
      </p>
    </div>
  )
}

export function BriefDisplay({ brief, inputMode, isLoading }: BriefDisplayProps) {
  if (!isLoading && !brief) return null

  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '0 auto', paddingTop: '24px' }}>
      <GoldDivider />

      {inputMode && INPUT_MODE_NOTES[inputMode] && (
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontStyle: 'italic',
          color: 'var(--muted)',
          textAlign: 'center',
          margin: '16px 0 24px',
        }}>
          {INPUT_MODE_NOTES[inputMode]}
        </p>
      )}

      {isLoading ? (
        <>
          <SkeletonCard height={180} />
          <SkeletonCard height={140} />
          <SkeletonCard height={200} />
          <SkeletonCard height={220} />
          <SkeletonCard height={180} />
        </>
      ) : brief ? (
        <>
          <div style={{ marginTop: '24px' }}>
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
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--muted)', textAlign: 'center', letterSpacing: '1px', marginTop: '8px', marginBottom: '60px' }}>
            Generated {new Date(brief.generatedAt).toLocaleString()}
          </p>
        </>
      ) : null}
    </div>
  )
}
