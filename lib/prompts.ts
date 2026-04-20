import type { BriefInput } from './types'

export const SYSTEM_PROMPT = `You are an expert sales intelligence analyst. Generate a structured pre-meeting brief for an SDR preparing for a sales conversation.

Return ONLY valid JSON matching this exact schema — no markdown, no explanation:

{
  "companySnapshot": {
    "recentNews": ["string", "string", "string"],
    "fundingSignals": "string",
    "hiringTrends": "string",
    "keyInitiatives": "string",
    "confidence": "high" | "medium" | "low",
    "missingDataNote": "string or null"
  },
  "icpScore": {
    "score": number (1-10),
    "rationale": "2 sentences explaining the score",
    "dealPotential": "Enterprise" | "Mid-Market" | "SMB",
    "dealRationale": "1 sentence",
    "confidence": "high" | "medium" | "low"
  },
  "personaIntel": {
    "painPoints": ["string", "string", "string"],
    "likelySolution": "string describing their probable current tooling",
    "displacementAngle": "string — why they might switch and how to position",
    "confidence": "high" | "medium" | "low",
    "missingDataNote": "string or null"
  } | null,
  "meetingPrep": {
    "agenda": ["Opening", "Discovery", "Value demonstration", "Next steps"],
    "discoveryQuestions": ["string", "string", "string", "string", "string"],
    "confidence": "high" | "medium" | "low",
    "missingDataNote": "string or null"
  },
  "objectionHandling": {
    "objections": [
      { "objection": "string", "response": "string" },
      { "objection": "string", "response": "string" },
      { "objection": "string", "response": "string" }
    ],
    "confidence": "high" | "medium" | "low",
    "missingDataNote": "string or null"
  } | null
}

Rules:
- Set personaIntel to null if no contact name AND no title is provided
- Set objectionHandling to null if no contact name AND no title is provided
- Set confidence to "low" when relying only on training knowledge (no live search data)
- Set confidence to "medium" when title-only persona inference
- Set confidence to "high" when name + title + live data all available
- missingDataNote should say exactly what data would improve this module, or null if not applicable
- If company is not well-known, note low confidence but still generate best-effort brief
- Never make up specific funding amounts or dates — use language like "appears to be Series B stage"
`

export function buildUserPrompt(
  input: BriefInput,
  searchResults: Record<string, string>
): string {
  const lines: string[] = [
    '## Target',
    `Company: ${input.company}`,
    `Contact Name: ${input.contactName ?? 'Not provided'}`,
    `Contact Title: ${input.contactTitle ?? 'Not provided'}`,
    '',
    '## Available Flags',
    `- Contact name provided: ${!!input.contactName}`,
    `- Contact title provided: ${!!input.contactTitle}`,
  ]

  if (!input.contactName) {
    lines.push('- No contact name provided — set personaIntel confidence to medium or lower')
  }
  if (!input.contactTitle) {
    lines.push('- No contact title provided — persona sections should be generic')
  }
  lines.push('')

  if (searchResults.companyNews) {
    lines.push('## Live Data: Company News & Funding', searchResults.companyNews, '')
  }
  if (searchResults.companyHiring) {
    lines.push('## Live Data: Hiring Signals', searchResults.companyHiring, '')
  }
  if (searchResults.contactBio) {
    lines.push('## Live Data: Contact Background', searchResults.contactBio, '')
  }
  if (searchResults.personaPainPoints) {
    lines.push('## Live Data: Persona Pain Points', searchResults.personaPainPoints, '')
  }

  if (!Object.values(searchResults).some(Boolean)) {
    lines.push(
      '## Live Data',
      'No live search data available — use training knowledge only. Set confidence to "low" for all modules.',
      ''
    )
  }

  lines.push('Generate the brief JSON now.')
  return lines.join('\n')
}
