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
  const [btnHovered, setBtnHovered] = useState(false)
  const [btnActive, setBtnActive] = useState(false)

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
    { id: 'company', label: 'Company', value: company, setter: setCompany, required: true, placeholder: 'e.g. Salesforce' },
    { id: 'contact', label: 'Contact', value: contactName, setter: setContactName, required: false, placeholder: 'Full name (optional)' },
    { id: 'title', label: 'Title', value: contactTitle, setter: setContactTitle, required: false, placeholder: 'Their role (optional)' },
  ]

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.25em',
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
        fontSize: 'var(--text-xl)',
        fontWeight: 300,
        color: 'var(--ink)',
        textAlign: 'center',
        lineHeight: 'var(--leading-tight)',
        margin: '14px 0 4px',
        letterSpacing: '-0.02em',
      }}>
        Your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>briefing</em><br />
        is being prepared.
      </h1>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        letterSpacing: '0.18em',
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
        {fields.map(({ id, label, value, setter, required, placeholder }, i) => (
          <div key={id} style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr',
            alignItems: 'center',
            borderBottom: i < fields.length - 1 ? '1px dashed var(--border-dashed)' : 'none',
            padding: '10px 0',
          }}>
            <label
              htmlFor={id}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                cursor: 'text',
              }}
            >
              {label}{required ? ' *' : ''}
            </label>
            <input
              id={id}
              name={id}
              type="text"
              value={value}
              onChange={e => setter(e.target.value)}
              placeholder={placeholder}
              aria-required={required}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-base)',
                fontStyle: value ? 'normal' : 'italic',
                color: value ? 'var(--ink)' : 'var(--muted)',
                width: '100%',
              }}
              onFocus={e => { e.currentTarget.style.borderBottom = '1px solid var(--gold)' }}
              onBlur={e => { e.currentTarget.style.borderBottom = 'none' }}
            />
          </div>
        ))}
      </div>

      {error && (
        <p role="alert" style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: 'var(--error)',
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
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => { setBtnHovered(false); setBtnActive(false) }}
          onMouseDown={() => setBtnActive(true)}
          onMouseUp={() => setBtnActive(false)}
          style={{
            padding: '12px 40px',
            background: btnActive && !isLoading ? 'var(--ink)' : btnHovered && !isLoading ? 'var(--gold)' : 'transparent',
            border: '1px solid var(--gold)',
            color: (btnHovered || btnActive) && !isLoading ? 'var(--cream)' : isLoading ? 'var(--muted)' : 'var(--gold)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease, color 0.2s ease',
            borderColor: isLoading ? 'var(--muted)' : 'var(--gold)',
          }}
        >
          {isLoading ? 'Preparing your brief…' : 'Request Brief'}
        </button>
      </div>
    </form>
  )
}
