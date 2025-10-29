import type { Table } from 'dexie'

import type {
  Communication,
  CommunicationDto,
  Prompt,
  PromptDto,
  Situation,
  SituationBundle,
  SituationBundleDto,
  SituationDto,
  Utterance,
  UtteranceDto,
} from './model'
import type { SituationBundleRecord } from './storage'
import { createBundleKey } from './storage'

export interface SituationRepositoryDeps {
  apiBaseUrl: string
  bundleTable: Table<SituationBundleRecord, string>
}

export interface SituationRepository {
  listByLanguage: (languageCode: string) => Promise<Situation[]>
  getBundle: (params: {
    situationId: number
    nativeLang: string
    targetLang: string
  }) => Promise<SituationBundle>
}

const mapSituation = (dto: SituationDto): Situation => ({
  id: dto.id,
  lastUpdated: dto.last_updated,
  imageUrl: dto.image_url ?? null,
  languageCode: dto.language_code ?? dto.language ?? '',
  description: dto.description,
})

const toPrompt = (dto: PromptDto): Prompt => ({
  id: dto.id,
  lastUpdated: dto.last_updated,
  description: dto.description,
})

const toUtterance = (dto: UtteranceDto): Utterance => ({
  id: dto.id,
  lastUpdated: dto.last_updated,
  language: dto.language,
  transliteration: dto.transliteration ?? null,
  content: dto.content,
  contexts: dto.contexts,
})

const toCommunication = (dto: CommunicationDto): Communication => ({
  id: dto.id,
  lastUpdated: dto.last_updated,
  shouldExpress:
    dto.shouldExpress ??
    dto.shouldBeExpressed ??
    false,
  shouldUnderstand:
    dto.shouldUnderstand ??
    dto.shouldBeUnderstood ??
    false,
  description: dto.description,
  utterances: dto.utterances.map(toUtterance),
})

const toSituationBundle = (dto: SituationBundleDto): SituationBundle => ({
  situation: mapSituation(dto.situation),
  prompts: dto.prompts.map(toPrompt),
  communications: dto.communications.map(toCommunication),
})

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const raw = await response.text()

  if (!raw) {
    throw new Error('Received an empty response from the server')
  }

  try {
    return JSON.parse(raw) as T
  } catch (error) {
    const message =
      error instanceof Error
        ? `Unable to parse server response: ${error.message}`
        : 'Unable to parse server response.'

    throw new Error(`${message} Check that VITE_API_BASE_URL points at the backend API.`)
  }
}

export const createSituationRepository = (
  deps: SituationRepositoryDeps,
): SituationRepository => {
  const { apiBaseUrl, bundleTable } = deps

  const listByLanguage = async (languageCode: string) => {
    const response = await fetch(
      `${apiBaseUrl}/languages/${encodeURIComponent(languageCode)}/situations/`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    if (!response.ok) {
      throw new Error('Unable to load situations')
    }

    const payload = await parseJsonResponse<SituationDto[]>(response)

    return payload.map(mapSituation)
  }

  const getBundle: SituationRepository['getBundle'] = async ({
    situationId,
    nativeLang,
    targetLang,
  }) => {
    const query = new URLSearchParams({
      native_lang: nativeLang,
      target_lang: targetLang,
    })

    const requestUrl = `${apiBaseUrl}/situations/${encodeURIComponent(String(situationId))}/?${query.toString()}`

    const bundleKey = createBundleKey({ situationId, nativeLang, targetLang })

    try {
      const response = await fetch(requestUrl, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Unable to load practice bundle')
      }

      const payload = await parseJsonResponse<SituationBundleDto>(response)
      const bundle = toSituationBundle(payload)

      await bundleTable.put({
        bundleKey,
        situationId,
        nativeLang,
        targetLang,
        syncedAt: new Date().toISOString(),
        bundle,
      })

      return bundle
    } catch (error) {
      const cached = await bundleTable.get(bundleKey)

      if (cached) {
        return cached.bundle
      }

      throw error
    }
  }

  return {
    listByLanguage,
    getBundle,
  }
}
