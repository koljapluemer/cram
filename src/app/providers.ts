import { inject, provide } from 'vue'

import { API_BASE_URL } from './config'
import { getDatabase } from './database'
import {
  createLanguageRepository,
  type LanguageRepository,
} from '../entities/language/repository'
import {
  createSituationRepository,
  type SituationRepository,
} from '../entities/situation/repository'

export interface Repositories {
  languages: LanguageRepository
  situations: SituationRepository
}

const repositoriesKey = Symbol('repositories')

export const provideRepositories = () => {
  const db = getDatabase()
  const repositories: Repositories = {
    languages: createLanguageRepository({
      apiBaseUrl: API_BASE_URL,
    }),
    situations: createSituationRepository({
      apiBaseUrl: API_BASE_URL,
      bundleTable: db.situationBundles,
    }),
  }

  provide(repositoriesKey, repositories)

  return repositories
}

export const useRepositories = () => {
  const repositories = inject<Repositories>(repositoriesKey)

  if (!repositories) {
    throw new Error('Repositories have not been provided')
  }

  return repositories
}
