@docs

# 04 – Seed Data & Bootstrap

1. Create `public/seed/situations.json` with a concise sample dataset covering at least two languages and both `shouldUnderstand`/`shouldExpress` communications. Include utterance audio placeholders (file names) and extra context examples.
2. Add a bootstrap script in `src/app/bootstrap/seed.ts` that loads the JSON via `fetch`, normalizes IDs, and imports records into the user's Dexie DB if the tables are empty. Run it once during app startup after Dexie initialization.
3. When inserting seed data, ensure communications reference utterances via IDs exactly as stored in Dexie and mark them as published so the public dashboard has content.
4. Store seed audio assets under `public/audio/` with matching file names referenced in the JSON. Use lightweight placeholder files if needed.
5. Expose a developer-only flag (e.g., `import.meta.env.VITE_FORCE_SEED`) to reset and reseed the database for testing without wiping user-specific realms by accident.
