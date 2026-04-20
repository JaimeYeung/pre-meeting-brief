'use client'

import { useState } from 'react'
import type { BriefInput } from '@/lib/types'

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
  const [focusedField, setFocusedField] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company.trim()) {
      setError('Company name is required.')
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

  const btnBg = btnActive ? 'var(--ink-active)' : btnHovered ? 'var(--ink-hover)' : 'var(--ink)'

  return (
    <div style={{ width: '100%' }}>
      {/* Hero photo block */}
      <div style={{
        width: '100%',
        height: '160px',
        background: 'linear-gradient(135deg, var(--cream-dark) 0%, #c8b89a 60%, #b0a07a 100%)',
        marginBottom: 'var(--space-6)',
      }} />

      <form onSubmit={handleSubmit}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: 'var(--space-2)',
          fontWeight: 500,
        }}>
          Pre-meeting brief
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 'var(--leading-tight)',
          marginBottom: 'var(--space-6)',
          letterSpacing: '-0.01em',
        }}>
          Walk into every<br />meeting prepared.
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
          {fields.map(({ id, label, value, setter, required, placeholder }) => (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--card-bg)',
                border: '1px solid',
                borderColor: focusedField === id ? 'var(--accent)' : 'var(--border)',
                padding: 'var(--space-3) var(--space-4)',
                gap: 'var(--space-4)',
                transition: 'border-color 0.15s ease',
                boxShadow: focusedField === id ? 'inset 3px 0 0 var(--accent)' : 'none',
              }}
            >
              <label htmlFor={id} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: focusedField === id ? 'var(--accent)' : 'var(--muted)',
                width: '60px',
                flexShrink: 0,
                fontWeight: 500,
                transition: 'color 0.15s ease',
                cursor: 'text',
              }}>
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
                onFocus={() => setFocusedField(id)}
                onBlur={() => setFocusedField(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  fontFamily: value ? 'var(--font-display)' : 'var(--font-body)',
                  fontStyle: value ? 'italic' : 'normal',
                  fontSize: 'var(--text-base)',
                  color: value ? 'var(--ink)' : 'var(--muted)',
                  flex: 1,
                  lineHeight: 'var(--leading-snug)',
                }}
              />
            </div>
          ))}
        </div>

        {error && (
          <p role="alert" style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            color: 'var(--error)',
            marginBottom: 'var(--space-3)',
          }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button
            type="submit"
            disabled={isLoading}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => { setBtnHovered(false); setBtnActive(false) }}
            onMouseDown={() => setBtnActive(true)}
            onMouseUp={() => setBtnActive(false)}
            style={{
              padding: 'var(--space-3) var(--space-8)',
              background: isLoading ? 'var(--muted)' : btnBg,
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              letterSpacing: '0.04em',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s ease',
              minWidth: '160px',
            }}
            onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent)' }}
            onBlur={e => { e.currentTarget.style.boxShadow = 'none' }}
          >
            {isLoading ? 'Generating…' : 'Generate Brief'}
          </button>
          {!isLoading && (
            <span style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'var(--text-sm)',
              color: 'var(--muted)',
            }}>
              ready in ~12 seconds
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
