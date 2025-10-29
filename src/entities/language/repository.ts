import type { Language, LanguageDto } from './model'

export interface LanguageRepositoryDeps {
  apiBaseUrl: string
}

export interface LanguageRepository {
  list: () => Promise<Language[]>
}

const mapDtoToLanguage = (dto: LanguageDto): Language => ({
  id: dto.id,
  code: dto.code,
  name: dto.name,
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

const fetchLanguages = async (apiBaseUrl: string): Promise<Language[]> => {
  const response = await fetch(`${apiBaseUrl}/languages/`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Unable to load languages')
  }

  const payload = await parseJsonResponse<LanguageDto[]>(response)

  return payload.map(mapDtoToLanguage)
}

export const createLanguageRepository = (
  deps: LanguageRepositoryDeps,
): LanguageRepository => {
  const { apiBaseUrl } = deps

  const list = async (): Promise<Language[]> => {
    return fetchLanguages(apiBaseUrl)
  }

  return {
    list,
  }
}
