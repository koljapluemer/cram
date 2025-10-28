@docs

# 06 – Dashboard Page (`pages/dashboard`)

1. Build a dashboard page module with a Vue route component plus any local composables. Use `PageShell` + `AppHeader` to keep layout consistent.
2. Fetch published `Situation` summaries from the repositories injected via app setup. Provide language filter checkboxes/chips and a plain-text search box that filters client-side for now.
3. Display situations in Daisy cards with key metadata: title, primary language, outcome summary, and count of communications. Include a CTA button to “Practice this situation” linking to the practice route.
4. Surface recent learning stats by aggregating `LearningProgress` (e.g., due utterances count) and `DialogProgress` (latest Ebisu score). Keep visuals simple (e.g., Daisy stat blocks).
5. Add a small panel promoting community submissions and supporter upgrade, linking to the respective pages. Keep copy short per guidelines.
