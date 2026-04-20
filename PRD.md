# SDR Pre-Meeting Brief Generator — PRD

## Background

A portfolio demo targeting GTM-focused roles (early AI startups, enterprise RevOps/GTM Ops). Demonstrates the ability to design and build AI-native sales workflows — specifically the kind of work described in resume experience: partnering with GTM stakeholders, building internal AI workflows, and driving adoption.

The demo is self-serve: a visitor inputs a company name and contact, and receives a structured, research-backed sales brief in seconds.

---

## Problem

SDRs spend 20–30 minutes manually researching a prospect before each meeting — piecing together company news, guessing at pain points, and preparing talking points from scratch. This is repetitive, inconsistent, and scales poorly.

---

## Solution

A web app that takes a company name, contact name, and title, then automatically generates a personalized pre-meeting brief using real-time web search (Tavily) and AI reasoning (Claude).

---

## User

**Primary:** Portfolio visitors (hiring managers, recruiters at GTM-focused companies)
**Secondary:** SDRs who could use this in their actual workflow

---

## Input

| Field | Required | Notes |
|-------|----------|-------|
| Company name | **Required** | e.g. "Salesforce" — brief cannot be generated without this |
| Contact name | Optional | e.g. "John Smith" — enables individual research; if absent, persona sections use title only |
| Contact title | Optional | e.g. "VP Sales" — enables persona-specific pain points; if absent, persona sections are generic |

### Input Combinations & Graceful Degradation

The app adapts the brief based on what's available:

| Company | Name | Title | Behavior |
|---------|------|-------|----------|
| ✓ | ✓ | ✓ | Full brief — all 5 modules at maximum specificity |
| ✓ | ✓ | ✗ | Modules 1–2 full; Module 3 uses name for research but pain points are generic; Modules 4–5 less tailored |
| ✓ | ✗ | ✓ | Modules 1–2 full; Module 3 based on title persona only (no individual research); Modules 4–5 persona-level |
| ✓ | ✗ | ✗ | Modules 1–2 only (company intel + ICP score); Modules 3–5 skipped or flagged as "add contact details for persona analysis" |
| ✗ | any | any | Blocked — company name required, show inline error |

---

## Output — Brief Structure (5 Modules)

### 1. Company Snapshot
Real-time intelligence pulled via Tavily search:
- Recent news (last 90 days)
- Funding rounds / financial signals
- Hiring trends (rapid expansion = growth signal)
- Key initiatives or product launches

### 2. ICP Fit Score + Deal Potential Signal
- **ICP Fit Score:** 1–10 with 2-sentence rationale (company size, industry, growth stage match)
- **Deal Potential:** Recommended tier (Enterprise / Mid-Market / SMB) based on funding, headcount signals, and expansion indicators

### 3. Persona & Competitive Intel
- Likely pain points for this persona/title
- Probable current solution or tooling they use
- Displacement angle: why they might switch, and how to position

### 4. Meeting Prep
- Suggested meeting agenda (opening → discovery → value → next steps)
- 5 tailored discovery questions specific to this company and persona

### 5. Objection Handling
- 3 most likely objections from this persona
- Suggested responses for each

---

## Technical Architecture

### Stack
- **Frontend + Backend:** Next.js (App Router)
- **Deployment:** Vercel (free tier)
- **Search:** Tavily API — fetches real-time company news, contact background
- **Generation:** Anthropic Claude API (claude-sonnet-4-6) — structured JSON output

### Data Flow
```
User input (company required; contact name + title optional)
  ↓
Input validation
  - No company → block, show error
  - Missing name/title → flag which modules will be degraded
  ↓
Tavily search queries (adaptive based on available inputs):
  - Always: "{company} news funding 2025"
  - Always: "{company} hiring growth recent"
  - If name provided: "{contact name} {company} {title}"
  - If title provided: "{title} pain points challenges 2025"
  ↓
Search results + available inputs assembled into prompt
  ↓
Claude API call → structured JSON response
  (modules omitted or marked low-confidence if inputs missing)
  ↓
Frontend renders brief cards
  (missing-data modules show a prompt: "Add contact name for persona analysis")
```

### API Keys Required
- `ANTHROPIC_API_KEY`
- `TAVILY_API_KEY` (free tier: 1,000 searches/month)

### Claude Prompt Design
- System prompt: defines brief structure, JSON schema, and explicit rules for handling missing fields
- User prompt: injects Tavily results + available inputs + flags for what's missing
- Response format: structured JSON — each module includes a `confidence` field (`high` / `medium` / `low`) and optional `missing_data_note`
- Model: claude-sonnet-4-6

### Edge Cases

| Scenario | Handling |
|----------|----------|
| Company name not found by Tavily | Claude falls back to training knowledge; brief includes a `⚠ Limited live data` badge on Company Snapshot |
| Very obscure / private company | Same as above — Claude notes low confidence, still generates best-effort brief |
| Tavily API timeout / error | Retry once; if still failing, proceed with Claude-only (no search context), show `⚠ Running without live data` |
| Claude API timeout | Show error state with retry button; do not show partial output |
| Contact name is ambiguous (common name) | Tavily may return wrong person — Claude instructed to caveat with "based on available public information" |
| Non-English company name | Pass through as-is; Tavily and Claude both handle multilingual input |
| Rate limit hit (Tavily free tier) | Show friendly message: "Search quota reached — brief generated from AI knowledge only" |

---

## UI Layout

**Layout:** Top-down flow
- Top: compact input bar (company / contact / title + Generate button)
- Below: full-width brief rendered as 5 section cards, each with clear heading and content
- Loading state: skeleton cards while generating

**Design Direction:** "Concierge" — luxury service aesthetic (Style G). Cream + gold rule lines, Cormorant Garamond display serif, ceremonial language framing brief generation as a curated service. Unexpected in sales tech; maximizes memorability.

**Design tools:** `impeccable:frontend-design` for initial build, `impeccable:polish` + `impeccable:audit` for refinement.

---

## Success Criteria

- Visitor inputs a real company name and receives a believable, useful brief in under 15 seconds
- Brief content is visually distinct per company (not templated-looking)
- All 5 modules render clearly without requiring explanation
- App is deployed and accessible via a public Vercel URL

---

## Out of Scope

- User authentication
- Saving / history of past briefs
- Follow-up email drafts (post-meeting, not pre-meeting)
- CRM integration
- Mobile optimization (desktop-first is sufficient for portfolio)
