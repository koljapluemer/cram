import type { Communication, Utterance } from '../../entities/situation/model'

export type PracticeExercise =
  | {
      id: string
      kind: 'understand'
      communication: Communication
      utterance: Utterance
    }
  | {
      id: string
      kind: 'express'
      communication: Communication
    }

const pickRandom = <T>(items: T[]): T | null => {
  if (items.length === 0) {
    return null
  }

  const index = Math.floor(Math.random() * items.length)
  const value = items[index]

  return value ?? null
}

const shuffle = <T>(items: T[]): T[] => {
  const result = [...items]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const j = Math.floor(Math.random() * (index + 1))
    const temp = result[index]!

    result[index] = result[j]!
    result[j] = temp
  }

  return result
}

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export const buildExercises = (communications: Communication[]): PracticeExercise[] => {
  const pool: PracticeExercise[] = []

  communications.forEach((communication) => {
    if (communication.shouldUnderstand) {
      const utterance = pickRandom(communication.utterances)

      if (utterance) {
        pool.push({
          id: `${communication.id}-understand-${utterance.id}-${createId()}`,
          kind: 'understand',
          communication,
          utterance,
        })
      }
    }

    if (communication.shouldExpress) {
      pool.push({
        id: `${communication.id}-express-${createId()}`,
        kind: 'express',
        communication,
      })
    }
  })

  if (pool.length === 0) {
    return []
  }

  const shuffled = shuffle(pool)

  const exercises: PracticeExercise[] = []

  while (exercises.length < 5) {
    const next = shuffled[exercises.length]

    if (next) {
      exercises.push(next)
    } else {
      const fallback = pickRandom(pool)

      if (!fallback) {
        break
      }

      exercises.push({
        ...fallback,
        id: `${fallback.id}-repeat-${createId()}`,
      })
    }
  }

  return exercises
}
