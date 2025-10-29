<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  RefreshCcw,
  Brain,
  Quote,
  Keyboard,
  Mic,
  Video,
  Lightbulb,
} from 'lucide-vue-next'
import { useRepositories } from '../../app/providers'
import type { SituationBundle, Communication } from '../../entities/situation/model'
import { buildExercises, type PracticeExercise } from '../../features/practice/session'
import LoadingState from '../../dumb/feedback/LoadingState.vue'
import ErrorAlert from '../../dumb/feedback/ErrorAlert.vue'
import EmptyState from '../../dumb/feedback/EmptyState.vue'

const props = defineProps<{
  situationId: number
  targetLang: string
  nativeLang: string
  languageName?: string
  situationTitle?: string
}>()

const router = useRouter()

const { situations: situationRepository } = useRepositories()

const loading = ref(true)
const error = ref<string | null>(null)
const bundle = ref<SituationBundle | null>(null)
const exercises = ref<PracticeExercise[]>([])
const currentIndex = ref(0)
const currentInput = ref('')
const revealState = reactive({
  revealed: false,
  solutionsVisible: false,
})
const expressionMode = ref<'text' | 'record' | 'video'>('text')

const fsrsLabels = ['Wrong', 'Hard', 'Correct', 'Easy'] as const

const currentExercise = computed(() => exercises.value[currentIndex.value])

const isFinished = computed(() => currentIndex.value >= exercises.value.length)

const hasValidParams = computed(() => Boolean(props.nativeLang && props.targetLang && props.situationId))

const loadBundle = async () => {
  if (!hasValidParams.value) {
    error.value = 'Missing practice parameters.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const data = await situationRepository.getBundle({
      situationId: props.situationId,
      nativeLang: props.nativeLang,
      targetLang: props.targetLang,
    })
    bundle.value = data
    exercises.value = buildExercises(data.communications)
    currentIndex.value = 0
    currentInput.value = ''
    revealState.revealed = false
    revealState.solutionsVisible = false
  } catch (caughtError) {
    error.value =
      caughtError instanceof Error ? caughtError.message : 'Unable to start practice.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void loadBundle()
})

watch(
  () => [props.situationId, props.nativeLang, props.targetLang],
  () => {
    void loadBundle()
  },
)

const handleReveal = () => {
  revealState.revealed = true
  revealState.solutionsVisible = true
}

const handleFsrsSelection = () => {
  if (currentIndex.value < exercises.value.length - 1) {
    currentIndex.value += 1
    currentInput.value = ''
    revealState.revealed = false
    revealState.solutionsVisible = false
    expressionMode.value = 'text'
  } else {
    currentIndex.value = exercises.value.length
  }
}

const handleRestart = () => {
  if (!bundle.value) {
    return
  }

  exercises.value = buildExercises(bundle.value.communications)
  currentIndex.value = 0
  currentInput.value = ''
  revealState.revealed = false
  revealState.solutionsVisible = false
  expressionMode.value = 'text'
}

const describeCommunication = (communication: Communication) =>
  communication.description || 'Review this communication.'
</script>

<template>
  <section class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <button class="btn btn-ghost gap-2" type="button" @click="router.back()">
        <ArrowLeft class="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <div class="text-right">
        <p class="text-sm font-medium text-base-content/70">
          Practicing in {{ languageName ?? targetLang.toUpperCase() }}
        </p>
        <h1 class="text-xl font-semibold">
          {{ situationTitle ?? 'Situation practice' }}
        </h1>
      </div>
    </header>

    <ErrorAlert v-if="error">
      <div class="flex items-center justify-between gap-4">
        <span>{{ error }}</span>
        <button type="button" class="btn btn-sm" @click="loadBundle">
          <RefreshCcw class="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      </div>
    </ErrorAlert>

    <div v-else-if="loading" class="rounded-box border border-dashed border-base-200 bg-base-100/60">
      <LoadingState />
    </div>

    <section v-else-if="bundle" class="space-y-6">
      <div
        v-if="bundle.prompts.length > 0"
        class="rounded-box border border-base-200 bg-base-100 p-4"
      >
        <h2 class="mb-2 text-sm font-semibold text-base-content/70">Prompts</h2>
        <ul class="space-y-2 text-sm">
          <li
            v-for="prompt in bundle.prompts"
            :key="prompt.id"
            class="flex items-start gap-2"
          >
            <span class="mt-1 h-2 w-2 rounded-full bg-primary" />
            <span>{{ prompt.description || 'Practice this scenario.' }}</span>
          </li>
        </ul>
      </div>

      <EmptyState v-if="exercises.length === 0">
        <div class="flex flex-col items-center gap-3">
          <Brain class="h-6 w-6 text-base-content/60" aria-hidden="true" />
          <p class="text-sm">
            No communications available yet. Check back soon or try another situation.
          </p>
          <button class="btn btn-sm" type="button" @click="loadBundle">
            <RefreshCcw class="h-4 w-4" aria-hidden="true" />
            Reload
          </button>
        </div>
      </EmptyState>

      <section v-else class="space-y-6">
        <div class="flex items-center justify-between">
          <span class="badge badge-soft-primary badge-lg">
            Exercise {{ Math.min(currentIndex + 1, exercises.length) }} of {{ exercises.length }}
          </span>
          <button class="btn btn-outline btn-sm" type="button" @click="handleRestart">
            <RefreshCcw class="h-4 w-4" aria-hidden="true" />
            Shuffle again
          </button>
        </div>

        <article v-if="!isFinished" class="card card-bordered bg-base-100 shadow-sm">
          <div class="card-body space-y-6">
            <div
              v-if="currentExercise?.kind === 'understand'"
              class="space-y-4"
            >
              <header class="space-y-1">
                <p class="flex items-center gap-2 text-sm font-medium text-primary">
                  <Quote class="h-4 w-4" aria-hidden="true" />
                  Listen & understand
                </p>
                <p class="text-lg font-semibold">
                  {{ currentExercise.utterance.content }}
                </p>
                <p
                  v-if="currentExercise.utterance.transliteration"
                  class="text-sm text-base-content/60"
                >
                  {{ currentExercise.utterance.transliteration }}
                </p>
              </header>

              <fieldset class="fieldset">
                <label for="understanding" class="label">What do you think this means?</label>
                <textarea
                  id="understanding"
                  name="understanding"
                  v-model="currentInput"
                  class="textarea textarea-bordered min-h-32"
                  placeholder="Describe the message in your own words"
                />
              </fieldset>

              <button
                v-if="!revealState.revealed"
                class="btn btn-primary"
                type="button"
                @click="handleReveal"
              >
                Reveal
              </button>
            </div>

            <div
              v-else-if="currentExercise?.kind === 'express'"
              class="space-y-5"
            >
              <header class="space-y-1">
                <p class="flex items-center gap-2 text-sm font-medium text-secondary">
                  <Lightbulb class="h-4 w-4" aria-hidden="true" />
                  Express yourself
                </p>
                <p class="text-lg font-semibold">
                  {{ describeCommunication(currentExercise.communication) }}
                </p>
              </header>

              <div class="space-y-3">
                <p class="text-sm text-base-content/70">
                  Choose how you want to rehearse this situation.
                </p>
                <div class="join">
                  <button
                    class="btn join-item"
                    type="button"
                    :class="expressionMode === 'text' ? 'btn-active btn-primary' : 'btn-outline'"
                    @click="expressionMode = 'text'"
                  >
                    <Keyboard class="h-4 w-4" aria-hidden="true" />
                    Text
                  </button>
                  <button
                    class="btn join-item"
                    type="button"
                    :class="expressionMode === 'record' ? 'btn-active btn-primary' : 'btn-outline'"
                    @click="expressionMode = 'record'"
                  >
                    <Mic class="h-4 w-4" aria-hidden="true" />
                    Record
                  </button>
                  <button
                    class="btn join-item"
                    type="button"
                    :class="expressionMode === 'video' ? 'btn-active btn-primary' : 'btn-outline'"
                    @click="expressionMode = 'video'"
                  >
                    <Video class="h-4 w-4" aria-hidden="true" />
                    Video
                  </button>
                </div>
              </div>

              <fieldset v-if="expressionMode === 'text'" class="fieldset">
                <label for="expression" class="label">Draft your response</label>
                <textarea
                  id="expression"
                  name="expression"
                  v-model="currentInput"
                  class="textarea textarea-bordered min-h-32"
                  placeholder="Write how you would respond in this scenario"
                />
              </fieldset>

              <p v-else class="rounded-box border border-dashed border-base-300 bg-base-100/70 p-4 text-sm text-base-content/70">
                Imagine practicing this out loud{{ expressionMode === 'video' ? ' on camera.' : '.' }} Take a moment to rehearse before checking the solutions.
              </p>

              <button
                v-if="!revealState.solutionsVisible"
                class="btn btn-primary"
                type="button"
                @click="revealState.solutionsVisible = true"
              >
                Show solutions
              </button>
            </div>

            <div
              v-if="(revealState.revealed || revealState.solutionsVisible) && currentExercise"
              class="space-y-4"
            >
              <div class="rounded-box border border-base-200 bg-base-200/50 p-4">
                <h3 class="mb-2 text-sm font-semibold text-base-content/70">
                  Suggested approach
                </h3>
                <p class="text-sm text-base-content">
                  {{ describeCommunication(currentExercise.communication) }}
                </p>
              </div>

              <div class="space-y-3">
                <h4 class="text-sm font-semibold text-base-content/70">
                  Utterances to study
                </h4>
                <ul class="space-y-3">
                  <li
                    v-for="utterance in currentExercise.communication.utterances"
                    :key="utterance.id"
                    class="rounded-box border border-base-200 bg-base-100 p-3"
                  >
                    <p class="font-medium">{{ utterance.content }}</p>
                    <p
                      v-if="utterance.transliteration"
                      class="text-xs text-base-content/60"
                    >
                      {{ utterance.transliteration }}
                    </p>
                    <ul class="mt-2 space-y-1 text-xs text-base-content/70">
                      <li
                        v-for="context in utterance.contexts"
                        :key="context.id"
                      >
                        {{ context.description || context.context_type }}
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div
              v-if="(revealState.revealed || revealState.solutionsVisible) && currentExercise"
              class="card-actions justify-end"
            >
              <div class="join">
                <button
                  v-for="label in fsrsLabels"
                  :key="label"
                  class="btn join-item"
                  type="button"
                  @click="handleFsrsSelection"
                >
                  {{ label }}
                </button>
              </div>
            </div>
          </div>
        </article>

        <EmptyState v-else>
          <div class="flex flex-col items-center gap-3">
            <Brain class="h-6 w-6 text-base-content/60" aria-hidden="true" />
            <p class="text-sm">Great work! You completed this round of practice.</p>
            <button class="btn btn-primary btn-sm" type="button" @click="handleRestart">
              Practice again
            </button>
          </div>
        </EmptyState>
      </section>
    </section>

    <EmptyState v-else>
      <div class="flex flex-col items-center gap-3">
        <Brain class="h-6 w-6 text-base-content/60" aria-hidden="true" />
        <p class="text-sm">
          Something went wrong while loading this practice session.
        </p>
        <button class="btn btn-sm" type="button" @click="loadBundle">
          <RefreshCcw class="h-4 w-4" aria-hidden="true" />
          Try again
        </button>
      </div>
    </EmptyState>
  </section>
</template>
