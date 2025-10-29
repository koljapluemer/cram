import type { SituationBundle } from './model'

export interface SituationBundleRecord {
  bundleKey: string
  situationId: number
  nativeLang: string
  targetLang: string
  bundle: SituationBundle
  syncedAt: string
}

export const createBundleKey = (params: {
  situationId: number
  nativeLang: string
  targetLang: string
}) => {
  return `${params.situationId}:${params.nativeLang}:${params.targetLang}`.toLowerCase()
}
