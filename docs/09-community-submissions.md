@docs

# 09 – Community Submission Flows (`features/community`)

1. Implement two features: `request-dialog` and `propose-utterance`, each with their own folder under `features/community/` and exposing Vue components that can be embedded on the community page.
2. `request-dialog` collects language, scenario description, learner goal, contact (email or social handle), and optional urgency toggle (for supporter priority). Validate basic fields client-side and store submissions in the moderation realm as `Request` records.
3. `propose-utterance` allows contributors to select an existing situation, choose a language, provide utterance text, optional audio upload (store via Dexie attachment), and contextual notes (e.g., politeness level). Save drafts to the contributor’s private realm until submission, then copy into the moderation realm with metadata about the submitting user.
4. Provide confirmation toasts on submission and show lightweight status feedback (e.g., “Pending moderator review”) based on realm flags.
5. Ensure unauthenticated visitors can still submit by creating temporary local records and prompting an auth flow only if Dexie Cloud requires it. Store minimal identity (e.g., provided contact info) alongside the submission.
6. Keep UI lean with Daisy cards and the standard form pattern. Avoid marketing copy and stick to actionable wording.
