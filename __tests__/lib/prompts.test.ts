import { buildUserPrompt, SYSTEM_PROMPT } from '@/lib/prompts'
import type { BriefInput } from '@/lib/types'

describe('SYSTEM_PROMPT', () => {
  it('contains JSON schema instructions', () => {
    expect(SYSTEM_PROMPT).toContain('companySnapshot')
    expect(SYSTEM_PROMPT).toContain('icpScore')
    expect(SYSTEM_PROMPT).toContain('confidence')
  })
})

describe('buildUserPrompt', () => {
  it('includes company name', () => {
    const input: BriefInput = { company: 'Salesforce' }
    const prompt = buildUserPrompt(input, {})
    expect(prompt).toContain('Salesforce')
  })

  it('flags missing contact info', () => {
    const input: BriefInput = { company: 'Salesforce' }
    const prompt = buildUserPrompt(input, {})
    expect(prompt).toContain('No contact name provided')
  })

  it('includes search results when provided', () => {
    const input: BriefInput = { company: 'Salesforce' }
    const searchResults = { companyNews: 'Salesforce raised $500M in Series D' }
    const prompt = buildUserPrompt(input, searchResults)
    expect(prompt).toContain('Series D')
  })

  it('includes contact details when provided', () => {
    const input: BriefInput = { company: 'Salesforce', contactName: 'John Smith', contactTitle: 'VP Sales' }
    const prompt = buildUserPrompt(input, {})
    expect(prompt).toContain('John Smith')
    expect(prompt).toContain('VP Sales')
  })
})
