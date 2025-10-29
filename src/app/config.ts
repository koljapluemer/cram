const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL

const normalizeUrl = (value: string | undefined, fallback: string) => {
  const candidate = value?.trim() || fallback

  if (candidate === '/') {
    return fallback
  }

  return candidate.endsWith('/') ? candidate.slice(0, -1) : candidate
}

export const API_BASE_URL = normalizeUrl(envApiBaseUrl, '/api')

export const DEXIE_CLOUD_DATABASE_URL = normalizeUrl(
  import.meta.env.VITE_DEXIE_CLOUD_URL,
  '',
)
