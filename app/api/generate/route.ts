import { NextRequest, NextResponse } from 'next/server'
import type { BriefInput, GenerateApiResponse, GenerateApiError } from '@/lib/types'
import { runAdaptiveSearch } from '@/lib/tavily'
import { generateBrief } from '@/lib/claude'

function getInputMode(input: BriefInput): GenerateApiResponse['inputMode'] {
  if (input.contactName && input.contactTitle) return 'full'
  if (input.contactName && !input.contactTitle) return 'no-title'
  if (!input.contactName && input.contactTitle) return 'no-name'
  return 'company-only'
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Partial<BriefInput>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json<GenerateApiError>(
      { error: 'Invalid request body', code: 'MISSING_COMPANY' },
      { status: 400 }
    )
  }

  if (!body.company?.trim()) {
    return NextResponse.json<GenerateApiError>(
      { error: 'Company name is required', code: 'MISSING_COMPANY' },
      { status: 400 }
    )
  }

  const input: BriefInput = {
    company: body.company.trim(),
    contactName: body.contactName?.trim() || undefined,
    contactTitle: body.contactTitle?.trim() || undefined,
    ourProduct: body.ourProduct?.trim() || undefined,
  }

  const tavilyKey = process.env.TAVILY_API_KEY ?? ''
  let searchResults: Record<string, string> = {}

  try {
    searchResults = await runAdaptiveSearch(input, tavilyKey)
  } catch (err) {
    console.error('Tavily search error:', err)
    // Proceed without live data — Claude will note low confidence
  }

  let brief
  try {
    brief = await generateBrief(input, searchResults)
  } catch (err) {
    console.error('Claude generation error:', err)
    return NextResponse.json<GenerateApiError>(
      { error: 'Brief generation failed. Please try again.', code: 'CLAUDE_ERROR' },
      { status: 500 }
    )
  }

  return NextResponse.json<GenerateApiResponse>({
    brief,
    inputMode: getInputMode(input),
  })
}
