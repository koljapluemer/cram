export interface SituationDto {
  id: number
  last_updated: string
  image_url?: string | null
  language_code?: string
  language?: string
  description: string
}

export interface Situation
  extends Omit<SituationDto, 'last_updated' | 'image_url' | 'language_code' | 'language'> {
  lastUpdated: string
  imageUrl?: string | null
  languageCode: string
  description: string
}

export interface SituationRecord extends Situation {}

export interface Prompt {
  id: number
  lastUpdated: string
  description: string
}

export interface PromptDto {
  id: number
  last_updated: string
  description: string
}

export interface ContextTypeDetails {
  id: number
  name: string
  description: string
}

export interface UtteranceContext {
  id: number
  context_type: string
  context_type_details: ContextTypeDetails | null
  description: string
}

export interface Utterance {
  id: number
  lastUpdated: string
  language: string
  transliteration?: string | null
  content: string
  contexts: UtteranceContext[]
}

export interface UtteranceDto {
  id: number
  last_updated: string
  language: string
  transliteration?: string | null
  content: string
  contexts: UtteranceContext[]
}

export interface Communication {
  id: number
  lastUpdated: string
  shouldExpress: boolean
  shouldUnderstand: boolean
  description: string
  utterances: Utterance[]
}

export interface CommunicationDto {
  id: number
  last_updated: string
  shouldBeExpressed?: boolean
  shouldExpress?: boolean
  shouldBeUnderstood?: boolean
  shouldUnderstand?: boolean
  description: string
  utterances: UtteranceDto[]
}

export interface SituationBundleDto {
  situation: SituationDto
  prompts: PromptDto[]
  communications: CommunicationDto[]
}

export interface SituationBundle {
  situation: Situation
  prompts: Prompt[]
  communications: Communication[]
}
