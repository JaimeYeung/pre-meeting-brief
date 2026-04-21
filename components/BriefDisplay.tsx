'use client'

import { useState } from 'react'
import type { BriefResponse, GenerateApiResponse } from '@/lib/types'
import { CompanySnapshot } from './modules/CompanySnapshot'
import { IcpScore } from './modules/IcpScore'
import { PersonaIntel } from './modules/PersonaIntel'
import { MeetingPrep } from './modules/MeetingPrep'
import { ObjectionHandling } from './modules/ObjectionHandling'
import { SkeletonCard } from './ui/SkeletonCard'
import { toMarkdown } from '@/lib/exportMarkdown'

interface BriefDisplayProps {
  brief: BriefResponse | null
  inputMode: GenerateApiResponse['inputMode'] | null
  isLoading: boolean
  company?: string
  contactName?: string
  contactTitle?: string
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

export function BriefDisplay({ brief, inputMode, isLoading, company = '', contactName, contactTitle }: BriefDisplayProps) {
  const [copied, setCopied] = useState(false)

  async function handleExport() {
    if (!brief) return
    const md = toMarkdown(brief, company, contactName, contactTitle)
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isLoading && !brief) return null

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', paddingTop: 'var(--space-8)' }}>
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
              : <MissingModule label="Persona & Competitive Intel" note="Add a contact name or title to unlock persona analysis." />
            }
            <MeetingPrep data={brief.meetingPrep} />
            {brief.objectionHandling
              ? <ObjectionHandling data={brief.objectionHandling} />
              : <MissingModule label="Objection Handling" note="Add a contact name or title to unlock objection handling." />
            }
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--space-6)',
            marginBottom: 'var(--space-16)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--border)',
          }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--muted)',
              letterSpacing: '0.1em',
            }}>
              Generated {new Date(brief.generatedAt).toLocaleString()}
            </p>
            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                background: 'transparent',
                border: '1px solid var(--border)',
                padding: 'var(--space-2) var(--space-4)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.1em',
                color: copied ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                borderColor: copied ? 'var(--accent)' : 'var(--border)',
              }}
            >
              {copied ? '✓ Copied' : 'Export as Markdown'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}
