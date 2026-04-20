import { buildSearchQueries } from '@/lib/tavily'
import type { BriefInput } from '@/lib/types'

describe('buildSearchQueries', () => {
  it('always includes company news and hiring queries', () => {
    const input: BriefInput = { company: 'Salesforce' }
    const queries = buildSearchQueries(input)
    expect(queries.some(q => q.includes('Salesforce') && q.includes('news'))).toBe(true)
    expect(queries.some(q => q.includes('Salesforce') && q.includes('hiring'))).toBe(true)
  })

  it('adds contact query when name is provided', () => {
    const input: BriefInput = { company: 'Salesforce', contactName: 'John Smith', contactTitle: 'VP Sales' }
    const queries = buildSearchQueries(input)
    expect(queries.some(q => q.includes('John Smith'))).toBe(true)
  })

  it('adds persona query when title is provided', () => {
    const input: BriefInput = { company: 'Salesforce', contactTitle: 'VP Sales' }
    const queries = buildSearchQueries(input)
    expect(queries.some(q => q.includes('VP Sales') && q.includes('pain points'))).toBe(true)
  })

  it('does not include undefined in queries when name is missing', () => {
    const input: BriefInput = { company: 'Salesforce' }
    const queries = buildSearchQueries(input)
    expect(queries.every(q => !q.includes('undefined'))).toBe(true)
  })
})
