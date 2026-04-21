import type { BriefResponse } from './types'

export function toMarkdown(brief: BriefResponse, company: string, contactName?: string, contactTitle?: string): string {
  const lines: string[] = []

  const who = [contactName, contactTitle].filter(Boolean).join(', ')
  lines.push(`# Pre-Meeting Brief: ${company}${who ? ` — ${who}` : ''}`)
  lines.push(`*Generated ${new Date(brief.generatedAt).toLocaleString()}*`)
  lines.push('')

  // 1. Company Snapshot
  lines.push('## Company Snapshot')
  if (brief.companySnapshot.recentNews.length > 0) {
    lines.push('**Recent News**')
    brief.companySnapshot.recentNews.forEach(n => lines.push(`- ${n}`))
    lines.push('')
  }
  if (brief.companySnapshot.fundingSignals) lines.push(`**Funding:** ${brief.companySnapshot.fundingSignals}`, '')
  if (brief.companySnapshot.hiringTrends) lines.push(`**Hiring:** ${brief.companySnapshot.hiringTrends}`, '')
  if (brief.companySnapshot.keyInitiatives) lines.push(`**Initiatives:** ${brief.companySnapshot.keyInitiatives}`, '')

  // 2. ICP Score
  lines.push('## ICP Score · Deal Potential')
  lines.push(`**Score:** ${brief.icpScore.score}/10 — ${brief.icpScore.dealPotential}`)
  lines.push(`${brief.icpScore.rationale}`)
  lines.push(`${brief.icpScore.dealRationale}`)
  lines.push('')

  // 3. Persona & Competitive Intel
  if (brief.personaIntel) {
    lines.push('## Persona & Competitive Intel')
    lines.push('**Pain Points**')
    brief.personaIntel.painPoints.forEach(p => lines.push(`- ${p}`))
    lines.push('')
    lines.push(`**Likely Current Solution:** ${brief.personaIntel.likelySolution}`, '')
    lines.push(`**Displacement Angle:** ${brief.personaIntel.displacementAngle}`, '')
  }

  // 4. Meeting Prep
  lines.push('## Meeting Prep')
  lines.push('**Agenda**')
  brief.meetingPrep.agenda.forEach((a, i) => lines.push(`${i + 1}. ${a}`))
  lines.push('')
  lines.push('**Discovery Questions**')
  brief.meetingPrep.discoveryQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`))
  lines.push('')

  // 5. Objection Handling
  if (brief.objectionHandling) {
    lines.push('## Objection Handling')
    brief.objectionHandling.objections.forEach(o => {
      lines.push(`**"${o.objection}"**`)
      lines.push(`> ${o.response}`)
      lines.push('')
    })
  }

  return lines.join('\n')
}
