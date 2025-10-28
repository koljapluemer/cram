@docs

# 08 – Learning Algorithms Integration

1. Install `ts-fsrs` and `ebisu-js` packages if not already present. Create lightweight wrappers under `features/spaced-repetition/` and `features/ebisu/` to keep algorithm code isolated from UI concerns.
2. Implement a pure function `computeFsrsReview(previousState, rating, now)` that uses `ts-fsrs` defaults except the renamed “Wrong” button mapped to `Again`. Return the updated state plus scheduling metadata (`due`, `stability`).
3. Provide a composable `useUtteranceReviews` that repositories call to persist FSRS results into `LearningProgress`, tagging each update with timestamps and the practice session ID.
4. For dialog-level tracking, use `ebisu.js` to update recall probability after each session. Store posterior parameters in `DialogProgress`, and expose helpers to compute “due for refresh” thresholds.
5. Surface aggregated metrics (e.g., next review due counts) via simple selectors exported from these feature folders so pages can render dashboards without re-implementing algorithm math.
6. Add unit-style tests (Vitest) covering both wrappers to prevent regressions when tweaking algorithm settings.
