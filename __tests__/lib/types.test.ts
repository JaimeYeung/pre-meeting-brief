import type { BriefInput, BriefResponse, ModuleConfidence } from '@/lib/types'

describe('types', () => {
  it('BriefInput requires only company', () => {
    const input: BriefInput = { company: 'Salesforce' }
    expect(input.company).toBe('Salesforce')
    expect(input.contactName).toBeUndefined()
    expect(input.contactTitle).toBeUndefined()
  })

  it('BriefInput accepts all fields', () => {
    const input: BriefInput = {
      company: 'Salesforce',
      contactName: 'John Smith',
      contactTitle: 'VP Sales',
    }
    expect(input.contactName).toBe('John Smith')
  })

  it('ModuleConfidence values are valid', () => {
    const values: ModuleConfidence[] = ['high', 'medium', 'low']
    expect(values).toHaveLength(3)
  })
})
