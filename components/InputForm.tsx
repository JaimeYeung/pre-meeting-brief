'use client'

import { useState } from 'react'
import type { BriefInput } from '@/lib/types'
import { GoldDivider } from './ui/GoldDivider'

interface InputFormProps {
  onSubmit: (input: BriefInput) => void
  isLoading: boolean
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [company, setCompany] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactTitle, setContactTitle] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company.trim()) {
      setError('Company name is required to generate a brief.')
      return
    }
    setError('')
    onSubmit({
      company: company.trim(),
      contactName: contactName.trim() || undefined,
      contactTitle: contactTitle.trim() || undefined,
    })
  }

  const fields = [
    { label: 'Company', value: company, setter: setCompany, required: true, placeholder: 'e.g. Salesforce' },
    { label: 'Contact', value: contactName, setter: setContactName, required: false, placeholder: 'Full name (optional)' },
    { label: 'Title', value: contactTitle, setter: setContactTitle, required: false, placeholder: 'Their role (optional)' },
  ]

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '11px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        textAlign: 'center',
        marginBottom: '14px',
      }}>
        B · R · I · E · F
      </p>

      <GoldDivider />

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(20px, 3vw, 26px)',
        fontWeight: 300,
        color: 'var(--ink)',
        textAlign: 'center',
        lineHeight: 1.25,
        margin: '14px 0 4px',
        letterSpacing: '-0.3px',
      }}>
        Your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>briefing</em><br />
        is being prepared.
      </h1>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        textAlign: 'center',
        marginBottom: '16px',
      }}>
        Pre-meeting intelligence
      </p>

      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderTop: '3px solid var(--gold)',
        padding: '20px',
      }}>
        {fields.map(({ label, value, setter, required, placeholder }, i) => (
          <div key={label} style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr',
            alignItems: 'center',
            borderBottom: i < fields.length - 1 ? '1px dashed var(--border-dashed)' : 'none',
            padding: '10px 0',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '8px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>
              {label}{required ? ' *' : ''}
            </span>
            <input
              type="text"
              value={value}
              onChange={e => setter(e.target.value)}
              placeholder={placeholder}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontStyle: value ? 'normal' : 'italic',
                color: value ? 'var(--ink)' : 'var(--muted)',
                width: '100%',
              }}
            />
          </div>
        ))}
      </div>

      {error && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: '#c0392b',
          marginTop: '10px',
          textAlign: 'center',
        }}>
          {error}
        </p>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '11px 36px',
            background: 'transparent',
            border: '1px solid var(--gold)',
            color: isLoading ? 'var(--muted)' : 'var(--gold)',
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isLoading ? 'Preparing your brief…' : 'Request Brief'}
        </button>
      </div>
    </form>
  )
}
