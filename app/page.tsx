'use client'

import { useState, useRef } from 'react'
import type { BriefInput, BriefResponse, GenerateApiResponse } from '@/lib/types'
import { InputForm } from '@/components/InputForm'
import { BriefDisplay } from '@/components/BriefDisplay'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [brief, setBrief] = useState<BriefResponse | null>(null)
  const [inputMode, setInputMode] = useState<GenerateApiResponse['inputMode'] | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const briefRef = useRef<HTMLDivElement>(null)

  async function handleSubmit(input: BriefInput) {
    setIsLoading(true)
    setBrief(null)
    setApiError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      const response = data as GenerateApiResponse
      setBrief(response.brief)
      setInputMode(response.inputMode)
      setTimeout(() => briefRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch {
      setApiError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--cream)',
      backgroundImage: `
        linear-gradient(rgba(180,160,120,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(180,160,120,0.04) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
      padding: 'clamp(var(--space-8), 6vw, var(--space-16)) clamp(var(--space-5), 5vw, var(--space-10))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '960px',
        paddingTop: 'var(--space-6)',
        paddingBottom: 'var(--space-6)',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold) 70%, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold) 70%, transparent)' }} />
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {apiError && (
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontStyle: 'italic',
          color: '#c0392b',
          marginTop: '20px',
          textAlign: 'center',
        }}>
          {apiError}
        </p>
      )}

      <div ref={briefRef} style={{ width: '100%' }}>
        <BriefDisplay brief={brief} inputMode={inputMode} isLoading={isLoading} />
      </div>
    </main>
  )
}
