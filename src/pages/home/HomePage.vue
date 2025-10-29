<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Languages, MapPinned, RefreshCcw, BookOpen } from 'lucide-vue-next'
import { useRepositories } from '../../app/providers'
import type { Language } from '../../entities/language/model'
import type { Situation } from '../../entities/situation/model'
import LoadingState from '../../dumb/feedback/LoadingState.vue'
import ErrorAlert from '../../dumb/feedback/ErrorAlert.vue'
import EmptyState from '../../dumb/feedback/EmptyState.vue'

interface SituationsState {
  items: Situation[]
  loading: boolean
  error: string | null
}

const { languages: languageRepository, situations: situationRepository } = useRepositories()

const languages = ref<Language[]>([])
const languagesLoading = ref(true)
const languagesError = ref<string | null>(null)
const activeLanguageCode = ref<string>('')
const nativeLanguageCode = ref<string>('')

const router = useRouter()

const situationsByLanguage = reactive<Record<string, SituationsState>>({})

const getState = (code: string) => {
  if (!situationsByLanguage[code]) {
    situationsByLanguage[code] = {
      items: [],
      loading: false,
      error: null,
    }
  }

  return situationsByLanguage[code]
}

const activeLanguage = computed(() =>
  languages.value.find((language) => language.code === activeLanguageCode.value),
)

const loadSituations = async (code: string) => {
  const state = getState(code)

  if (state.loading) {
    return
  }

  state.loading = true
  state.error = null

  try {
    state.items = await situationRepository.listByLanguage(code)
  } catch (error) {
    state.error = error instanceof Error ? error.message : 'Failed to load situations'
  } finally {
    state.loading = false
  }
}

const loadLanguages = async () => {
  languagesLoading.value = true
  languagesError.value = null

  try {
    const data = await languageRepository.list()
    languages.value = data

    if (data.length > 0) {
      const firstLanguage = data[0]

      if (!firstLanguage) {
        return
      }

      activeLanguageCode.value = firstLanguage.code

      const englishLanguage = data.find((item) => item.code === 'eng')
      nativeLanguageCode.value = englishLanguage?.code ?? firstLanguage.code
    }
  } catch (error) {
    languagesError.value = error instanceof Error ? error.message : 'Failed to load languages'
  } finally {
    languagesLoading.value = false
  }
}

watch(activeLanguageCode, (code) => {
  if (code) {
    void loadSituations(code)
  }
})

onMounted(() => {
  void loadLanguages()
})

const handleRetryLanguages = () => {
  void loadLanguages()
}

const handleRetrySituations = (code: string) => {
  void loadSituations(code)
}

const handlePractice = (situation: Situation) => {
  const language = activeLanguage.value

  if (!language) {
    return
  }

  const situationTitle = situation.description || 'Practice'

  void router.push({
    name: 'practice',
    params: {
      situationId: situation.id,
    },
    query: {
      target: language.code,
      native: nativeLanguageCode.value,
      languageName: language.name,
      situationTitle,
    },
  })
}
</script>

<template>
  <section class="space-y-10">
    <header class="flex flex-col gap-6 rounded-box border border-base-200 bg-base-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-start gap-4">
        <span class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Languages class="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h1 class="text-2xl font-semibold text-base-content">Pick a language to practice</h1>
          <p class="text-sm text-base-content/70">
            Choose your target language and browse situations tailored to real-world interactions.
          </p>
        </div>
      </div>
      <form class="w-full max-w-xs">
        <fieldset class="fieldset">
          <label for="native-language" class="label">Native language</label>
          <select
            id="native-language"
            name="native-language"
            class="select select-bordered"
            v-model="nativeLanguageCode"
          >
            <option
              v-for="language in languages"
              :key="language.id"
              :value="language.code"
            >
              {{ language.name }}
            </option>
          </select>
        </fieldset>
      </form>
    </header>

    <div
      v-if="languagesLoading"
      class="rounded-box border border-dashed border-base-200 bg-base-100/60"
    >
      <LoadingState />
    </div>
    <ErrorAlert v-else-if="languagesError">
      <div class="flex items-center justify-between gap-4">
        <span>{{ languagesError }}</span>
        <button class="btn btn-sm" type="button" @click="handleRetryLanguages">
          <RefreshCcw class="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      </div>
    </ErrorAlert>
    <template v-else>
      <div class="tabs tabs-lg tabs-lifted">
        <button
          v-for="language in languages"
          :key="language.id"
          role="tab"
          type="button"
          class="tab whitespace-nowrap"
          :class="{
            'tab-active [--tab-border-color:var(--tw-shadow-color)] shadow-inner shadow-base-200': activeLanguageCode === language.code,
          }"
          @click="activeLanguageCode = language.code"
        >
          {{ language.name }}
        </button>
      </div>

      <div v-if="activeLanguage">
        <div class="mt-6">
          <div
            v-if="getState(activeLanguage.code).loading"
            class="rounded-box border border-dashed border-base-200 bg-base-100/60"
          >
            <LoadingState />
          </div>

          <ErrorAlert v-else-if="getState(activeLanguage.code).error">
            <div class="flex items-center justify-between gap-4">
              <span>{{ getState(activeLanguage.code).error }}</span>
              <button
                class="btn btn-sm"
                type="button"
                @click="handleRetrySituations(activeLanguage.code)"
              >
                <RefreshCcw class="h-4 w-4" aria-hidden="true" />
                Retry
              </button>
            </div>
          </ErrorAlert>

          <EmptyState
            v-else-if="getState(activeLanguage.code).items.length === 0"
          >
            <div class="flex flex-col items-center gap-3">
              <MapPinned class="h-6 w-6 text-base-content/60" aria-hidden="true" />
              <p class="text-sm">No situations found yet. Try another language.</p>
            </div>
          </EmptyState>

          <div
            v-else
            class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <article
              v-for="situation in getState(activeLanguage.code).items"
              :key="situation.id"
              class="card card-bordered bg-base-100 shadow-sm"
            >
              <figure v-if="situation.imageUrl" class="overflow-hidden rounded-t-2xl">
                <img
                  :src="situation.imageUrl"
                  :alt="situation.description || 'Situation preview'"
                  class="h-40 w-full object-cover"
                />
              </figure>
              <div class="card-body gap-4">
                <div class="space-y-2">
                  <h2 class="card-title text-lg font-semibold">
                    {{ situation.description || 'Untitled situation' }}
                  </h2>
                  <p class="text-sm text-base-content/70">
                    Refine your response for this real-world scenario.
                  </p>
                </div>
                <div class="card-actions justify-end">
                  <button
                    class="btn btn-primary"
                    type="button"
                    @click="handlePractice(situation)"
                  >
                    <BookOpen class="h-4 w-4" aria-hidden="true" />
                    Practice
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>
