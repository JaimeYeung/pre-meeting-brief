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
      padding: 'clamp(var(--space-8), 6vw, var(--space-16)) clamp(var(--space-5), 5vw, var(--space-10))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: '720px' }}>
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {apiError && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          color: 'var(--error)',
          marginTop: 'var(--space-4)',
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
