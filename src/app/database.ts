import Dexie, { type Table } from 'dexie'
import dexieCloud from 'dexie-cloud-addon'

import { DEXIE_CLOUD_DATABASE_URL } from './config'
import type { SituationBundleRecord } from '../entities/situation/storage'

class CramDatabase extends Dexie {
  situationBundles!: Table<SituationBundleRecord, string>

  constructor() {
    super('cram-client', { addons: [dexieCloud] })

    this.version(1).stores({
      situationBundles: '&bundleKey, situationId, nativeLang, targetLang, syncedAt',
    })

    if (DEXIE_CLOUD_DATABASE_URL) {
      this.cloud.configure({
        databaseUrl: DEXIE_CLOUD_DATABASE_URL,
        requireAuth: false,
      })
    }
  }
}

let databaseSingleton: CramDatabase | null = null

export const getDatabase = () => {
  if (!databaseSingleton) {
    databaseSingleton = new CramDatabase()
  }

  return databaseSingleton
}

export type Database = ReturnType<typeof getDatabase>
