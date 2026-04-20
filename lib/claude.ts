import Anthropic from '@anthropic-ai/sdk'
import type { BriefInput, BriefResponse } from './types'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts'

const client = new Anthropic()

export async function generateBrief(
  input: BriefInput,
  searchResults: Record<string, string>
): Promise<BriefResponse> {
  const userPrompt = buildUserPrompt(input, searchResults)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = message.content
    .filter(block => block.type === 'text')
    .map(block => (block as { type: 'text'; text: string }).text)
    .join('')

  // Strip markdown code fences if Claude wrapped the JSON
  const cleaned = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim()

  let parsed: BriefResponse
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error(`Claude returned invalid JSON: ${cleaned.slice(0, 200)}`)
  }

  return {
    ...parsed,
    generatedAt: new Date().toISOString(),
  }
}
