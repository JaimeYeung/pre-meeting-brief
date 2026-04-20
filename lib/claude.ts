import OpenAI from 'openai'
import type { BriefInput, BriefResponse } from './types'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts'

const client = new OpenAI()

export async function generateBrief(
  input: BriefInput,
  searchResults: Record<string, string>
): Promise<BriefResponse> {
  const userPrompt = buildUserPrompt(input, searchResults)

  const message = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 2048,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  })

  const text = message.choices[0]?.message?.content ?? ''

  // Strip markdown code fences if model wrapped the JSON
  const cleaned = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim()

  let parsed: BriefResponse
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error(`Model returned invalid JSON: ${cleaned.slice(0, 200)}`)
  }

  return {
    ...parsed,
    generatedAt: new Date().toISOString(),
  }
}
