@docs

# 07 – Situation Practice Flow (`meta-features/practice`)

1. Create a meta-feature that accepts a `situationId`, loads the `Situation` with its ordered `Communication` IDs, and orchestrates five exercises chosen sequentially from that situation (wrap around if fewer than five communications).
2. For each communication, randomly select an exercise type compatible with its flags:
   - `shouldUnderstand`: pick a related `Utterance`, show the text, capture the learner’s free-text explanation, and reveal the original communication + ts-fsrs buttons on demand.
   - `shouldExpress`: show the situation descriptions (across languages), provide a Daisy `.join` toggle for text input / audio record / video record. Persist recordings in local component state only and display playback controls for self-review.
3. After each exercise, emit the ts-fsrs rating (`Wrong`, `Hard`, `Correct`, `Easy`) and update `LearningProgress` via the entity helper. Trigger a toast confirming the review was logged.
4. Track session-level progress (exercise counter, selected communications) in the meta-feature store so the practice page remains declarative.
5. Once five exercises complete, present a recap view summarizing which communications were practiced, include a textarea ("What do you remember?") and a `LikertScale` component (1–7). Save results into `DialogProgress` and show a global toast “Practice Done” before redirecting back to the dashboard.
6. Guard the route so users can only start practice from a known `situationId`; fall back to dashboard with a toast if the ID is invalid or unpublished.
