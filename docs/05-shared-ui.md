@docs

# 05 – Shared UI Primitives (`dumb/`)

1. Build typography and layout primitives: `dumb/layout/PageSection.vue`, `dumb/layout/Card.vue`, `dumb/layout/AppHeader.vue`, all using DaisyUI classes; keep props minimal and avoid business logic.
2. Create input components aligned with the provided form pattern: `dumb/forms/TextField.vue`, `dumb/forms/TextArea.vue`, `dumb/forms/SelectField.vue`, `dumb/forms/LikertScale.vue` (1–7). Each renders a `<fieldset>` with label and input stacked per spec.
3. Implement `dumb/feedback/TsFsrsButtons.vue` exposing four buttons labeled `Wrong`, `Hard`, `Correct`, `Easy` with icon slots. Emit typed events so higher layers can map to ts-fsrs responses.
4. Add `dumb/navigation/FilterChips.vue` to display language filters and active search tokens using DaisyUI chip styles.
5. Provide `dumb/feedback/ToastHost.vue` tied into the global toast system created earlier; the component should render DaisyUI toasts and accept an array of messages.
6. Export all components via `dumb/index.ts` so features can import them without drilling through folders, while keeping cross-slice boundaries intact.
