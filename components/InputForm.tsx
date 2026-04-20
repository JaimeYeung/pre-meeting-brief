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
    <div style={{ width: '100%' }}>
      {/* Hero photo block */}
      <div style={{
        width: '100%',
        height: '120px',
        background: 'linear-gradient(135deg, #d4c5b0 0%, #c8b89a 50%, #b8a888 100%)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: 'var(--space-4) var(--space-5)',
        marginBottom: 'var(--space-5)',
        position: 'relative',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'var(--text-sm)',
          color: 'rgba(255,255,255,0.75)',
          letterSpacing: '0.03em',
        }}>
          prepare like a professional
        </p>
        <span style={{
          background: 'var(--accent)',
          color: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '4px 10px',
        }}>
          AI-powered
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Kicker + headline */}
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
          fontWeight: 600,
          color: 'var(--ink)',
          lineHeight: 'var(--leading-tight)',
          marginBottom: 'var(--space-5)',
          letterSpacing: '-0.02em',
        }}>
          Walk into every<br />meeting prepared.
        </h1>

        {/* Input fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          {fields.map(({ id, label, value, setter, required, placeholder }) => (
            <div key={id} style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              padding: 'var(--space-3) var(--space-4)',
              gap: 'var(--space-4)',
            }}>
              <label htmlFor={id} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-xs)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                width: '60px',
                flexShrink: 0,
                fontWeight: 500,
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
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-display)',
                  fontStyle: value ? 'italic' : 'normal',
                  fontSize: 'var(--text-base)',
                  color: value ? 'var(--ink)' : 'var(--muted)',
                  flex: 1,
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
              padding: 'var(--space-3) var(--space-6)',
              background: btnActive ? '#1a1410' : btnHovered ? '#3a312a' : 'var(--ink)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              letterSpacing: '0.02em',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'background 0.15s ease',
              outline: 'none',
            }}
            onFocus={e => { e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)` }}
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
