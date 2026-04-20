# SDR Pre-Meeting Brief Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js web app where users enter a company name + optional contact info and receive a structured, AI-generated pre-meeting sales brief in ~12 seconds.

**Architecture:** Next.js App Router with a single `/api/generate` route that validates inputs, runs adaptive Tavily searches, assembles a prompt, calls Claude (claude-sonnet-4-6), and returns structured JSON. The frontend renders the response as 5 module cards in a "Concierge" luxury aesthetic (cream + gold, Cormorant Garamond serif).

**Tech Stack:** Next.js 14+, TypeScript, @anthropic-ai/sdk, @tavily/core, Google Fonts (Cormorant Garamond + DM Sans), Vercel (deployment), Jest + React Testing Library (tests)

---

## File Structure

```
brief/
├── app/
│   ├── layout.tsx                  # Root layout — fonts, metadata
│   ├── page.tsx                    # Main page — form + brief display
│   ├── globals.css                 # CSS variables (cream/gold theme), base reset
│   └── api/
│       └── generate/
│           └── route.ts            # POST handler — validate → search → generate
├── components/
│   ├── InputForm.tsx               # Company/name/title fields + Generate button
│   ├── BriefDisplay.tsx            # Renders all 5 module cards or skeleton
│   ├── modules/
│   │   ├── CompanySnapshot.tsx     # Module 1
│   │   ├── IcpScore.tsx            # Module 2
│   │   ├── PersonaIntel.tsx        # Module 3
│   │   ├── MeetingPrep.tsx         # Module 4
│   │   └── ObjectionHandling.tsx   # Module 5
│   └── ui/
│       ├── SkeletonCard.tsx        # Loading placeholder
│       └── GoldDivider.tsx         # Decorative rule line with diamond
├── lib/
│   ├── types.ts                    # All shared TypeScript types
│   ├── tavily.ts                   # Adaptive search + retry logic
│   ├── prompts.ts                  # System prompt + user prompt builder
│   └── claude.ts                   # Claude API call + JSON parse
├── __tests__/
│   ├── lib/
│   │   ├── tavily.test.ts
│   │   ├── prompts.test.ts
│   │   └── claude.test.ts
│   └── api/
│       └── generate.test.ts
├── .env.local                      # API keys (gitignored)
├── .env.example                    # Key template committed to repo
└── next.config.ts
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json` (via create-next-app)
- Create: `.env.local`
- Create: `.env.example`
- Create: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Bootstrap Next.js project**

```bash
cd /Users/linghaoyang/Desktop/brief
npx create-next-app@latest . --typescript --app --tailwind --eslint --src-dir=no --import-alias="@/*"
```

When prompted: choose defaults (App Router, no Turbopack is fine).

- [ ] **Step 2: Install dependencies**

```bash
npm install @anthropic-ai/sdk @tavily/core
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest ts-jest
```

- [ ] **Step 3: Configure Jest**

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  testPathPattern: ['__tests__'],
}

export default config
```

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Create `.env.example`**

```bash
# .env.example
ANTHROPIC_API_KEY=your_anthropic_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

- [ ] **Step 5: Create `.env.local` with real keys**

```bash
# .env.local  ← DO NOT COMMIT
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
```

- [ ] **Step 6: Add `.env.local` to `.gitignore`**

Check `.gitignore` already contains `.env.local` (create-next-app adds it). If not:
```bash
echo ".env.local" >> .gitignore
```

- [ ] **Step 7: Set up Cormorant Garamond + DM Sans fonts in `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Brief — Pre-Meeting Intelligence',
  description: 'AI-powered SDR pre-meeting brief generator',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 8: Set up CSS variables in `app/globals.css`**

Replace the full contents of `app/globals.css` with:
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #faf7f0;
  --cream-dark: #f0ead8;
  --ink: #1a1914;
  --ink-light: #4a3c28;
  --gold: #c9a84c;
  --gold-light: #e0c878;
  --muted: #a09070;
  --border: #e0d8c8;
  --border-dashed: #d0c4a4;
  --card-bg: rgba(255, 255, 250, 0.7);
  --font-display: var(--font-cormorant), 'Georgia', serif;
  --font-body: var(--font-dm-sans), system-ui, sans-serif;
}

body {
  background: var(--cream);
  color: var(--ink);
  font-family: var(--font-body);
  min-height: 100vh;
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Server running at http://localhost:3000, no errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with concierge theme fonts and CSS variables"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/types.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/lib/types.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/types'"

- [ ] **Step 3: Create `lib/types.ts`**

```typescript
export type ModuleConfidence = 'high' | 'medium' | 'low'

export interface BriefInput {
  company: string
  contactName?: string
  contactTitle?: string
}

export interface CompanySnapshotData {
  recentNews: string[]
  fundingSignals: string
  hiringTrends: string
  keyInitiatives: string
  confidence: ModuleConfidence
  missingDataNote?: string
}

export interface IcpScoreData {
  score: number
  rationale: string
  dealPotential: 'Enterprise' | 'Mid-Market' | 'SMB'
  dealRationale: string
  confidence: ModuleConfidence
}

export interface PersonaIntelData {
  painPoints: string[]
  likelySolution: string
  displacementAngle: string
  confidence: ModuleConfidence
  missingDataNote?: string
}

export interface MeetingPrepData {
  agenda: string[]
  discoveryQuestions: string[]
  confidence: ModuleConfidence
  missingDataNote?: string
}

export interface ObjectionHandlingData {
  objections: Array<{ objection: string; response: string }>
  confidence: ModuleConfidence
  missingDataNote?: string
}

export interface BriefResponse {
  companySnapshot: CompanySnapshotData
  icpScore: IcpScoreData
  personaIntel: PersonaIntelData | null
  meetingPrep: MeetingPrepData
  objectionHandling: ObjectionHandlingData | null
  generatedAt: string
}

export interface GenerateApiResponse {
  brief: BriefResponse
  inputMode: 'full' | 'no-name' | 'no-title' | 'company-only'
}

export interface GenerateApiError {
  error: string
  code: 'MISSING_COMPANY' | 'TAVILY_ERROR' | 'CLAUDE_ERROR' | 'PARSE_ERROR'
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx jest __tests__/lib/types.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts __tests__/lib/types.test.ts
git commit -m "feat: add TypeScript types for brief input/output"
```

---

## Task 3: Tavily Search Library

**Files:**
- Create: `lib/tavily.ts`
- Create: `__tests__/lib/tavily.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/tavily.test.ts`:
```typescript
import { buildSearchQueries, searchWithRetry } from '@/lib/tavily'
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

  it('does not add contact query when name is missing', () => {
    const input: BriefInput = { company: 'Salesforce' }
    const queries = buildSearchQueries(input)
    expect(queries.every(q => !q.includes('undefined'))).toBe(true)
  })
})

describe('searchWithRetry', () => {
  it('returns empty string on error after retries', async () => {
    // Mock tavily to fail
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const result = await searchWithRetry('test query', { apiKey: 'invalid' })
    expect(typeof result).toBe('string')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/lib/tavily.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/tavily'"

- [ ] **Step 3: Create `lib/tavily.ts`**

```typescript
import { tavily } from '@tavily/core'
import type { BriefInput } from './types'

export function buildSearchQueries(input: BriefInput): string[] {
  const queries: string[] = [
    `${input.company} news funding 2025`,
    `${input.company} hiring growth recent`,
  ]

  if (input.contactName) {
    const titlePart = input.contactTitle ? ` ${input.contactTitle}` : ''
    queries.push(`${input.contactName}${titlePart} ${input.company}`)
  }

  if (input.contactTitle) {
    queries.push(`${input.contactTitle} pain points challenges 2025`)
  }

  return queries
}

export async function searchWithRetry(
  query: string,
  options: { apiKey: string },
  retries = 1
): Promise<string> {
  const client = tavily({ apiKey: options.apiKey })
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await client.search(query, {
        maxResults: 3,
        searchDepth: 'basic',
      })
      return response.results
        .map(r => `${r.title}: ${r.content}`)
        .join('\n\n')
    } catch (err) {
      if (attempt === retries) {
        console.error(`Tavily search failed for query "${query}":`, err)
        return ''
      }
    }
  }
  return ''
}

export async function runAdaptiveSearch(
  input: BriefInput,
  apiKey: string
): Promise<Record<string, string>> {
  const queries = buildSearchQueries(input)
  const keys = ['companyNews', 'companyHiring', 'contactBio', 'personaPainPoints']

  const results: Record<string, string> = {}
  await Promise.all(
    queries.map(async (query, i) => {
      results[keys[i]] = await searchWithRetry(query, { apiKey })
    })
  )
  return results
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx jest __tests__/lib/tavily.test.ts
```

Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add lib/tavily.ts __tests__/lib/tavily.test.ts
git commit -m "feat: add Tavily adaptive search with retry logic"
```

---

## Task 4: Claude Prompt Builder + API Call

**Files:**
- Create: `lib/prompts.ts`
- Create: `lib/claude.ts`
- Create: `__tests__/lib/prompts.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `__tests__/lib/prompts.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/lib/prompts.test.ts
```

Expected: FAIL — "Cannot find module '@/lib/prompts'"

- [ ] **Step 3: Create `lib/prompts.ts`**

```typescript
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
    `## Target`,
    `Company: ${input.company}`,
    `Contact Name: ${input.contactName ?? 'Not provided'}`,
    `Contact Title: ${input.contactTitle ?? 'Not provided'}`,
    '',
    `## Available Flags`,
    `- Contact name provided: ${!!input.contactName}`,
    `- Contact title provided: ${!!input.contactTitle}`,
    input.contactName ? '' : '- No contact name provided — set personaIntel confidence to medium or lower',
    input.contactTitle ? '' : '- No contact title provided — persona sections should be generic',
    '',
  ]

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
    lines.push('## Live Data', 'No live search data available — use training knowledge only. Set confidence to "low" for all modules.', '')
  }

  lines.push('Generate the brief JSON now.')
  return lines.filter(l => l !== undefined).join('\n')
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx jest __tests__/lib/prompts.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 5: Create `lib/claude.ts`**

```typescript
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
```

- [ ] **Step 6: Commit**

```bash
git add lib/prompts.ts lib/claude.ts __tests__/lib/prompts.test.ts
git commit -m "feat: add Claude prompt builder and API client"
```

---

## Task 5: API Route

**Files:**
- Create: `app/api/generate/route.ts`
- Create: `__tests__/api/generate.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/api/generate.test.ts`:
```typescript
// Integration-style test — mocks external calls
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest __tests__/api/generate.test.ts
```

Expected: FAIL — "Cannot find module '@/app/api/generate/route'"

- [ ] **Step 3: Create `app/api/generate/route.ts`**

```typescript
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx jest __tests__/api/generate.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Smoke test the API manually**

```bash
npm run dev
# In a new terminal:
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"company": "Stripe"}' | head -c 500
```

Expected: JSON response with `brief` and `inputMode: "company-only"`

- [ ] **Step 6: Commit**

```bash
git add app/api/generate/route.ts __tests__/api/generate.test.ts
git commit -m "feat: add /api/generate route with input validation and error handling"
```

---

## Task 6: UI — Input Form (Concierge Style)

**Files:**
- Create: `components/InputForm.tsx`
- Create: `components/ui/GoldDivider.tsx`

- [ ] **Step 1: Create `components/ui/GoldDivider.tsx`**

```tsx
export function GoldDivider() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '0 auto',
      width: '100%',
    }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      <div style={{
        width: '6px', height: '6px',
        background: 'var(--gold)',
        transform: 'rotate(45deg)',
        flexShrink: 0,
      }} />
      <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    </div>
  )
}
```

- [ ] **Step 2: Create `components/InputForm.tsx`**

```tsx
'use client'

import { useState } from 'react'
import type { BriefInput } from '@/lib/types'
import { GoldDivider } from './ui/GoldDivider'

interface InputFormProps {
  onSubmit: (input: BriefInput) => void
  isLoading: boolean
}

export function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [company, setCompany] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactTitle, setContactTitle] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company.trim()) {
      setError('Company name is required to generate a brief.')
      return
    }
    setError('')
    onSubmit({
      company: company.trim(),
      contactName: contactName.trim() || undefined,
      contactTitle: contactTitle.trim() || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '560px', margin: '0 auto' }}>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '11px',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        color: 'var(--gold)',
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        B · R · I · E · F
      </p>

      <GoldDivider />

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(28px, 4vw, 40px)',
        fontWeight: 300,
        color: 'var(--ink)',
        textAlign: 'center',
        lineHeight: 1.25,
        margin: '20px 0 6px',
        letterSpacing: '-0.3px',
      }}>
        Your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>briefing</em><br />
        is being prepared.
      </h1>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        textAlign: 'center',
        marginBottom: '28px',
      }}>
        Pre-meeting intelligence
      </p>

      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderTop: '3px solid var(--gold)',
        padding: '20px',
      }}>
        {[
          { label: 'Company', value: company, setter: setCompany, required: true, placeholder: 'e.g. Salesforce' },
          { label: 'Contact', value: contactName, setter: setContactName, required: false, placeholder: 'Full name (optional)' },
          { label: 'Title', value: contactTitle, setter: setContactTitle, required: false, placeholder: 'Their role (optional)' },
        ].map(({ label, value, setter, required, placeholder }, i) => (
          <div key={label} style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr',
            alignItems: 'center',
            borderBottom: i < 2 ? '1px dashed var(--border-dashed)' : 'none',
            padding: '10px 0',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '8px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--gold)',
            }}>
              {label}{required && ' *'}
            </span>
            <input
              type="text"
              value={value}
              onChange={e => setter(e.target.value)}
              placeholder={placeholder}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                fontStyle: 'italic',
                color: value ? 'var(--ink)' : 'var(--muted)',
                width: '100%',
              }}
            />
          </div>
        ))}
      </div>

      {error && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          color: '#c0392b',
          marginTop: '10px',
          textAlign: 'center',
        }}>
          {error}
        </p>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '11px 36px',
            background: 'transparent',
            border: '1px solid var(--gold)',
            color: isLoading ? 'var(--muted)' : 'var(--gold)',
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isLoading ? 'Preparing your brief…' : 'Request Brief'}
        </button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Verify it renders without errors**

In `app/page.tsx`, temporarily add:
```tsx
import { InputForm } from '@/components/InputForm'
export default function Page() {
  return <main style={{ padding: '60px 20px' }}><InputForm onSubmit={console.log} isLoading={false} /></main>
}
```

Run `npm run dev` and open http://localhost:3000 — verify form renders with gold borders, Cormorant Garamond italic placeholder text, and divider.

- [ ] **Step 4: Commit**

```bash
git add components/InputForm.tsx components/ui/GoldDivider.tsx app/page.tsx
git commit -m "feat: add concierge-style input form with gold divider"
```

---

## Task 7: Brief Module Components

**Files:**
- Create: `components/modules/CompanySnapshot.tsx`
- Create: `components/modules/IcpScore.tsx`
- Create: `components/modules/PersonaIntel.tsx`
- Create: `components/modules/MeetingPrep.tsx`
- Create: `components/modules/ObjectionHandling.tsx`
- Create: `components/ui/SkeletonCard.tsx`

Shared card style (use inline — no need for a separate file):
```
background: var(--card-bg)
border: 1px solid var(--border)
border-top: 3px solid var(--gold)
padding: 24px
margin-bottom: 16px
```

Module label style:
```
font-family: var(--font-body)
font-size: 8px
letter-spacing: 2px
text-transform: uppercase
color: var(--gold)
margin-bottom: 12px
```

- [ ] **Step 1: Create `components/ui/SkeletonCard.tsx`**

```tsx
export function SkeletonCard({ height = 140 }: { height?: number }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--border)',
      padding: '24px',
      marginBottom: '16px',
      height,
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 2, width: '30%', marginBottom: 16 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '80%', marginBottom: 10 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '65%', marginBottom: 10 }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 2, width: '72%' }} />
    </div>
  )
}
```

- [ ] **Step 2: Create `components/modules/CompanySnapshot.tsx`**

```tsx
import type { CompanySnapshotData } from '@/lib/types'

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const colors = { high: '#2d7a2d', medium: '#a07020', low: '#8b2c2c' }
  return (
    <span style={{
      fontSize: '8px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      color: colors[level],
      border: `1px solid ${colors[level]}`,
      padding: '2px 6px',
      marginLeft: '8px',
      opacity: 0.8,
    }}>
      {level} confidence
    </span>
  )
}

export function CompanySnapshot({ data }: { data: CompanySnapshotData }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--gold)',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)' }}>
          Company Snapshot
        </span>
        <ConfidenceBadge level={data.confidence} />
      </div>

      {data.missingDataNote && (
        <p style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {data.recentNews.length > 0 && (
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>Recent News</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {data.recentNews.map((item, i) => (
                <li key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '14px', color: 'var(--ink-light)', paddingLeft: '12px', borderLeft: '2px solid var(--gold)', lineHeight: 1.5 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.fundingSignals && (
          <Row label="Funding" value={data.fundingSignals} />
        )}
        {data.hiringTrends && (
          <Row label="Hiring" value={data.hiringTrends} />
        )}
        {data.keyInitiatives && (
          <Row label="Initiatives" value={data.keyInitiatives} />
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px', paddingTop: '10px', borderTop: '1px dashed var(--border-dashed)' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', paddingTop: '2px' }}>{label}</span>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.6 }}>{value}</p>
    </div>
  )
}
```

- [ ] **Step 3: Create `components/modules/IcpScore.tsx`**

```tsx
import type { IcpScoreData } from '@/lib/types'

export function IcpScore({ data }: { data: IcpScoreData }) {
  const tierColors = { Enterprise: 'var(--gold)', 'Mid-Market': 'var(--ink)', SMB: 'var(--muted)' }

  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--gold)',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
        ICP Score · Deal Potential
      </p>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '16px' }}>
        <div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 300, color: 'var(--ink)', lineHeight: 1 }}>
            {data.score}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--muted)', fontStyle: 'italic' }}>/10</span>
        </div>
        <div>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '9px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: tierColors[data.dealPotential] ?? 'var(--gold)',
            border: `1px solid ${tierColors[data.dealPotential] ?? 'var(--gold)'}`,
            padding: '4px 12px',
          }}>
            {data.dealPotential}
          </span>
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7, marginBottom: '8px' }}>
        {data.rationale}
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic', lineHeight: 1.6 }}>
        {data.dealRationale}
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/modules/PersonaIntel.tsx`**

```tsx
import type { PersonaIntelData } from '@/lib/types'

export function PersonaIntel({ data }: { data: PersonaIntelData }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--gold)',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
        Persona &amp; Competitive Intel
      </p>

      {data.missingDataNote && (
        <p style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <Section label="Pain Points">
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {data.painPoints.map((pt, i) => (
            <li key={i} style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', paddingLeft: '14px', borderLeft: '2px solid var(--border)', lineHeight: 1.5 }}>
              {pt}
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Likely Current Solution">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7 }}>
          {data.likelySolution}
        </p>
      </Section>

      <Section label="Displacement Angle">
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7 }}>
          {data.displacementAngle}
        </p>
      </Section>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
        {label}
      </p>
      {children}
    </div>
  )
}
```

- [ ] **Step 5: Create `components/modules/MeetingPrep.tsx`**

```tsx
import type { MeetingPrepData } from '@/lib/types'

export function MeetingPrep({ data }: { data: MeetingPrepData }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--gold)',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
        Meeting Prep
      </p>

      {data.missingDataNote && (
        <p style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>
          Agenda
        </p>
        <div style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
          {data.agenda.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', marginRight: '16px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--gold)', border: '1px solid var(--gold)', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-light)' }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '10px' }}>
          Discovery Questions
        </p>
        <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.discoveryQuestions.map((q, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: 'var(--gold)', marginTop: '3px', flexShrink: 0 }}>
                0{i + 1}
              </span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.6 }}>
                {q}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create `components/modules/ObjectionHandling.tsx`**

```tsx
import type { ObjectionHandlingData } from '@/lib/types'

export function ObjectionHandling({ data }: { data: ObjectionHandlingData }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderTop: '3px solid var(--gold)',
      padding: '24px',
      marginBottom: '16px',
    }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>
        Objection Handling
      </p>

      {data.missingDataNote && (
        <p style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '14px', fontFamily: 'var(--font-display)' }}>
          ⚠ {data.missingDataNote}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.objections.map((item, i) => (
          <div key={i} style={{ borderBottom: i < data.objections.length - 1 ? '1px dashed var(--border-dashed)' : 'none', paddingBottom: i < data.objections.length - 1 ? '16px' : '0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.5, marginBottom: '6px' }}>
              "{item.objection}"
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-light)', lineHeight: 1.7, paddingLeft: '12px', borderLeft: '2px solid var(--gold)' }}>
              {item.response}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add components/
git commit -m "feat: add all 5 brief module components and skeleton card in concierge style"
```

---

## Task 8: BriefDisplay + Main Page Assembly

**Files:**
- Create: `components/BriefDisplay.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/BriefDisplay.tsx`**

```tsx
import type { BriefResponse, GenerateApiResponse } from '@/lib/types'
import { CompanySnapshot } from './modules/CompanySnapshot'
import { IcpScore } from './modules/IcpScore'
import { PersonaIntel } from './modules/PersonaIntel'
import { MeetingPrep } from './modules/MeetingPrep'
import { ObjectionHandling } from './modules/ObjectionHandling'
import { SkeletonCard } from './ui/SkeletonCard'
import { GoldDivider } from './ui/GoldDivider'

interface BriefDisplayProps {
  brief: BriefResponse | null
  inputMode: GenerateApiResponse['inputMode'] | null
  isLoading: boolean
}

const INPUT_MODE_NOTES: Record<string, string> = {
  'company-only': 'Persona and objection modules require a contact name and title.',
  'no-title': 'Add a contact title for more precise persona analysis.',
  'no-name': 'Add a contact name for individual research.',
}

export function BriefDisplay({ brief, inputMode, isLoading }: BriefDisplayProps) {
  if (!isLoading && !brief) return null

  return (
    <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', paddingTop: '40px' }}>
      <GoldDivider />

      {inputMode && INPUT_MODE_NOTES[inputMode] && (
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '12px',
          fontStyle: 'italic',
          color: 'var(--muted)',
          textAlign: 'center',
          margin: '16px 0 24px',
        }}>
          {INPUT_MODE_NOTES[inputMode]}
        </p>
      )}

      {isLoading ? (
        <>
          <SkeletonCard height={180} />
          <SkeletonCard height={140} />
          <SkeletonCard height={200} />
          <SkeletonCard height={220} />
          <SkeletonCard height={180} />
        </>
      ) : brief ? (
        <>
          <CompanySnapshot data={brief.companySnapshot} />
          <IcpScore data={brief.icpScore} />
          {brief.personaIntel
            ? <PersonaIntel data={brief.personaIntel} />
            : <MissingModule label="Persona & Competitive Intel" note="Add a contact name and title to unlock persona analysis." />
          }
          <MeetingPrep data={brief.meetingPrep} />
          {brief.objectionHandling
            ? <ObjectionHandling data={brief.objectionHandling} />
            : <MissingModule label="Objection Handling" note="Add a contact name and title to unlock objection handling." />
          }
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'var(--muted)', textAlign: 'center', letterSpacing: '1px', marginTop: '24px', marginBottom: '40px' }}>
            Generated {new Date(brief.generatedAt).toLocaleString()}
          </p>
        </>
      ) : null}
    </div>
  )
}

function MissingModule({ label, note }: { label: string; note: string }) {
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px dashed var(--border)',
      padding: '24px',
      marginBottom: '16px',
      textAlign: 'center',
    }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontStyle: 'italic', color: 'var(--muted)' }}>
        {note}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Replace `app/page.tsx` with the full assembled page**

```tsx
'use client'

import { useState } from 'react'
import type { BriefInput, BriefResponse, GenerateApiResponse } from '@/lib/types'
import { InputForm } from '@/components/InputForm'
import { BriefDisplay } from '@/components/BriefDisplay'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [brief, setBrief] = useState<BriefResponse | null>(null)
  const [inputMode, setInputMode] = useState<GenerateApiResponse['inputMode'] | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

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
      backgroundImage: `
        linear-gradient(rgba(180,160,120,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(180,160,120,0.04) 1px, transparent 1px)
      `,
      backgroundSize: '24px 24px',
      padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 60px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Gold rule lines top and bottom of input area */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        paddingTop: '24px',
        paddingBottom: '24px',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold) 70%, transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold) 70%, transparent)' }} />
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {apiError && (
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '13px',
          fontStyle: 'italic',
          color: '#c0392b',
          marginTop: '20px',
          textAlign: 'center',
        }}>
          {apiError}
        </p>
      )}

      <BriefDisplay brief={brief} inputMode={inputMode} isLoading={isLoading} />
    </main>
  )
}
```

- [ ] **Step 3: Full end-to-end test**

```bash
npm run dev
```

Open http://localhost:3000. Enter "Stripe" as company, leave contact fields empty. Click "Request Brief". Expected:
- Button text changes to "Preparing your brief…"
- Skeleton cards appear
- Brief populates with 5 modules (modules 3 + 5 show "add contact" placeholder)

- [ ] **Step 4: Commit**

```bash
git add components/BriefDisplay.tsx app/page.tsx
git commit -m "feat: assemble main page with brief display, loading skeletons, and error states"
```

---

## Task 9: Deploy to Vercel

**Files:**
- Create: `.env.example` (already exists)
- Create: `README.md`

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/<your-username>/sdr-brief.git
git branch -M main
git push -u origin main
```

- [ ] **Step 2: Deploy on Vercel**

Go to https://vercel.com/new → Import your GitHub repo → Set environment variables:
- `ANTHROPIC_API_KEY` = your key
- `TAVILY_API_KEY` = your key

Click Deploy.

- [ ] **Step 3: Write `README.md`**

```markdown
# SDR Pre-Meeting Brief Generator

AI-powered pre-meeting intelligence for sales reps. Enter a company name and contact, get a structured brief in ~12 seconds.

**Live demo:** [your-app.vercel.app]

## What it generates
- Company snapshot (live news, funding, hiring signals via Tavily)
- ICP fit score + deal potential tier
- Persona pain points + competitive displacement angle
- Meeting agenda + 5 discovery questions
- Objection handling

## Stack
Next.js · Claude API (claude-sonnet-4-6) · Tavily Search API · Vercel

## Run locally
\`\`\`bash
cp .env.example .env.local
# Add your API keys to .env.local
npm install
npm run dev
\`\`\`
```

- [ ] **Step 4: Final commit**

```bash
git add README.md
git commit -m "docs: add README with setup instructions and live demo link"
git push
```

---

## Self-Review

**Spec coverage check:**
- ✅ Company Snapshot (Module 1) — Task 7
- ✅ ICP Fit Score + Deal Potential (Module 2) — Task 7
- ✅ Persona & Competitive Intel (Module 3) — Task 7
- ✅ Meeting Prep (Module 4) — Task 7
- ✅ Objection Handling (Module 5) — Task 7
- ✅ Graceful degradation (4 input combinations) — Task 5 + Task 8
- ✅ Tavily adaptive search — Task 3
- ✅ Claude structured JSON output — Task 4
- ✅ Input validation (company required) — Task 5
- ✅ Error states (API timeout, rate limit) — Task 5 + Task 8
- ✅ Concierge style G aesthetic — Tasks 6-8
- ✅ Skeleton loading — Task 7
- ✅ Vercel deployment — Task 9
- ✅ `confidence` field per module — Task 2 + Task 4
- ✅ `missingDataNote` per module — Task 2 + Task 4

**No placeholders detected.**

**Type consistency verified:** `BriefInput`, `BriefResponse`, `GenerateApiResponse` defined in Task 2, used consistently through Tasks 3–8.
