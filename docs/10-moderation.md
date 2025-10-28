@docs

# 10 – Moderation Workspace (`pages/moderation`)

1. Create a gated page that only loads for `admin`/`moderator` roles (check via `roles` helper). Redirect others with a toast.
2. Fetch pending `Request` and `UtteranceProposal` records from the moderation realm, sorted by supporter priority (supporter submissions first, then newest).
3. Present submissions in collapsible Daisy lists showing key metadata and contextual links (e.g., related situation). Provide `Approve` and `Decline` buttons that call repository helpers.
4. On approval:
   - Requests: mark as completed and optionally promote into a backlog table.
   - Utterance proposals: move records into the public realm (or the owning situation’s realm) and attach to the appropriate `Situation`/`Communication`.
5. On decline, record a short internal note (moderator-only string) explaining the decision; keep it stored in the moderation realm.
6. Trigger responsive toasts for each action and keep the queue live-updated via Dexie live queries so moderators can collaborate without page refreshes.
