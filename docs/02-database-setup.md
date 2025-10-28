@docs

# 02 – Dexie Cloud Setup & Access Control

1. Create `src/app/dexie.ts` that instantiates Dexie Cloud with the project app ID (use env-based placeholder) and exports helpers for opening the database and subscribing to sync/auth events.
2. Define Dexie tables for `situations`, `communications`, `utterances`, `learningProgress`, `dialogProgress`, `requests`, and `supporterStatus`. Include compound indexes for foreign key lookups (`situationId`, `communicationId`, `language`).
3. Model Dexie Cloud realms: 
   - Public realm for approved lessons (`situations`, `communications`, `utterances` marked as published).
   - Per-user private realm for progress (`learningProgress`, `dialogProgress`).
   - Shared moderation realm (`requests`, pending lesson content) accessible to roles `admin` and `moderator`.
4. Wire Dexie roles (`admin`, `moderator`, `user`) using the official `db.roles` guidance. Ensure role checks go through a typed guard exported from `src/app/security/roles.ts`.
5. Add bootstrap logic that, on login, ensures the user has dedicated realms created and linked. Expose utilities to move records from private realm into public or moderation realms.
6. Provide a typed repository interface (`src/app/repositories.ts`) that pages/meta-features will receive via dependency injection, keeping Dexie calls out of higher slices.
