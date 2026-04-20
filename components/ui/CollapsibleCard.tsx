'use client'

import { useState } from 'react'

interface CollapsibleCardProps {
  label: string
  title: string
  badge?: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleCard({
  label,
  title,
  badge,
  defaultOpen = true,
  children,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--gold)',
      marginBottom: 'var(--space-5)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          padding: 'var(--space-6)',
          background: hovered ? 'rgba(201,168,76,0.04)' : 'transparent',
          border: 'none',
          borderBottom: open ? '1px solid var(--border)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-3)',
          textAlign: 'left',
          transition: 'background 0.15s ease',
          outline: 'none',
        }}
        onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--gold)' }}
        onBlur={e => { e.currentTarget.style.boxShadow = 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
          <div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: 'var(--space-1)',
            }}>
              {label}
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              color: 'var(--ink)',
              lineHeight: 'var(--leading-tight)',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h2>
          </div>
          {badge && <div style={{ marginLeft: 'var(--space-2)' }}>{badge}</div>}
        </div>

        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            color: 'var(--gold)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div style={{
        display: 'grid',
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-6)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
