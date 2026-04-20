/**
 * @jest-environment node
 */
import { POST } from '@/app/api/generate/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/tavily', () => ({
  runAdaptiveSearch: jest.fn().mockResolvedValue({ companyNews: 'mock news' }),
}))

jest.mock('@/lib/claude', () => ({
  generateBrief: jest.fn().mockResolvedValue({
    companySnapshot: { recentNews: ['news'], fundingSignals: '', hiringTrends: '', keyInitiatives: '', confidence: 'high' },
    icpScore: { score: 7, rationale: 'Good fit.', dealPotential: 'Mid-Market', dealRationale: 'Mid-size.', confidence: 'high' },
    personaIntel: null,
    meetingPrep: { agenda: ['Open', 'Discover'], discoveryQuestions: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'], confidence: 'medium' },
    objectionHandling: null,
    generatedAt: '2026-01-01T00:00:00.000Z',
  }),
}))

describe('POST /api/generate', () => {
  it('returns 400 when company is missing', async () => {
    const req = new NextRequest('http://localhost/api/generate', {
      method: 'POST',
      body: JSON.stringify({ contactName: 'John' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.code).toBe('MISSING_COMPANY')
  })

  it('returns 200 with brief when company is provided', async () => {
    const req = new NextRequest('http://localhost/api/generate', {
      method: 'POST',
      body: JSON.stringify({ company: 'Salesforce' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.brief).toBeDefined()
    expect(body.inputMode).toBe('company-only')
  })

  it('sets inputMode to full when all fields present', async () => {
    const req = new NextRequest('http://localhost/api/generate', {
      method: 'POST',
      body: JSON.stringify({ company: 'Salesforce', contactName: 'John', contactTitle: 'VP Sales' }),
    })
    const res = await POST(req)
    const body = await res.json()
    expect(body.inputMode).toBe('full')
  })
})
