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
