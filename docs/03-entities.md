@docs

# 03 – Entity Modules

1. For each domain object (`Situation`, `Communication`, `Utterance`, `ExtraContext`, `LearningProgress`, `DialogProgress`, `Request`, `UtteranceProposal`, `SupporterStatus`), create a folder inside `src/entities/<entity>/`.
2. Each folder exports:
   - TypeScript models/interfaces (`types.ts`).
   - Dexie table schema fragment (`schema.ts`) consumed by the central Dexie setup.
   - Repository functions (`repository.ts`) that read/write with realm awareness but never import other entities. Use ID strings to reference linked entities.
3. `Situation` entity: include metadata (title, summary, primary language, skill tags, estimated duration, published flag) and ordered list of communication IDs.
4. `Communication` entity: store `description` as `{ [languageIso639_3]: string }`, booleans `shouldUnderstand` + `shouldExpress`, list of related `utteranceIds`, and `situationId`.
5. `Utterance` entity: include content text, `language`, array of audio asset keys, and an `extraContext` array of `{ contextType: string; content: string }`. Provide helpers to resolve audio file URLs via Dexie attachments.
6. `LearningProgress` keeps spaced repetition data (`fsrsState`, `lastReviewed`, `stability`, etc.) keyed by `utteranceId` + user realm. Expose pure helpers to update state given ts-fsrs results.
7. `DialogProgress` tracks Ebisu parameters per situation practice session (likelihood, decay, last quiz timestamp) and saves recap notes + Likert score.
8. `Request` models community dialog/situation requests with submitter contact, language, free-form description, optional supporter flag.
9. `UtteranceProposal` captures crowd-sourced utterances tied to a situation + language, including example audio references if supplied.
10. `SupporterStatus` stores Lemonsqueezy subscription metadata (customer ID, subscription state, priority expiration). Keep schema minimal; more logic comes later.
