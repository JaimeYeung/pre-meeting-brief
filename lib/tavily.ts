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
