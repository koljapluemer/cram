
You see here a vue-next vite ts with daisy+tailwind ALREADY INSTALLED. Implement prototype according to the spec below.

## Basics

I want to make a language learning app. Core idea:

- outcome-based
- situation-specific ("how to haggle with a Cairo taxi driver" "how to politely open a business meeting in Japan")
- tight timeframe possible ("my plane goes in one week")
- actually works, not just fun engagement


## Data Model

- we have `Situation`s (e.g. "Surviving the Cairo Taxi")
- a `Situation` has a list of `Communication`s (ordered)
- a `Communication` has  a list of `Description`, which is a simple key-value map of `Language` (string ISO 639-3) and a str describing the situation "you greet the barista"
- a `Communication` has a many-to-many relationship to `Utterance`
- a `Communication` also has has two bools `shouldUnderstand` and `shouldExpress` 
- An `Utterance` has content "السلام عليكم", one `Language`, an array of audio file pronunications, and an array of `ExtraContext`, which each `ContextType` and `Content` (e.g. "politeness level"; "mid"). 

## General Structure

### Public User Stuff

- reasonable dashboard
- see the available dialoglessons, filterable by language and plain-text searchable

- practice situations. 
	- pick a random `Communication`, then based on it pick one possible exercise at random
		- for a `Communication` where `shouldUnderstand`, you can randomly pick an `Utterance`, simply display it as text and offer a text area where the user should try to describe what was said and a "Reveal" button then showing the `Communication` and the standard four ts-fsrs buttons
		- for a `Communication` where `shouldExpress`, show the situation context, show a `.join` element (daisy UI) to toggle between text/record/video where the user can try their best to express this situation, then a "show solutions" showing the utterances related to this situation, and again the ts-fsrs rating buttons
	- at the end of the dialog variation, show a recap of the lessons, show a textarea "what do you remember from this lesson" and a lickert scale from 1-7 rating how well the user got the lesson, used for ebisu.js rating

### Community Stuff

- this should be very very prototyp-y but I want to build some foundations
- allow to request new dialogs & situations (even for non-authenticated users)
- allow to propose-add new utterances for situations per language

- none of this is publically visible per default, we need a moderation queue visible for the roles below


### Admin Stuff

- use dexie roles https://dexie.org/cloud/docs/db.roles for three roles: admin, moderator, user
- admins/moderators get a well-contained view with the proposals/requests mentioned above which they can approve/disapprove
- understand dexie realms; public lessons should be in the public realm, before that in the user's realm, shared in a way that mods can access it, otherwise completely private (e.g. learning progress)
- (no further distincition between admins/mods for now)

### Supporter Account

- build a basic integration of lemonsqueezy, allowing a "supporter account" for $8/month. Allows your suggestion/reviews to show up on top of the queue.
- you need to understand lemonsqueezy hooks and the dexie-cloud user table. Make sure that works properly, we can't do hot garbage here!

## Learning Algorithms

- utilize `ts-fsrs` to track per-utterance progress
- use `ebisu.js` to track per-dialogvariation progress
- keep learning progress data cleanly separated in the data model so learning lessons can be shared without being entangled with the per-user learning progress data

## Essential Tech Stack


- vue3 (latest best practices) with typescript
- dexie with dexie-cloud (one db per user, cloud sync optional)
- tailwind + Daisy UI. Actually use daisy components. Avoid manual CSS when possible.
- lucide icons (via the vue package)
- vue router
- NO global store (dexie SSOt)

- Install + setup eslint with reasonable defaults for ts+vue. Establish lint and lint:fix script. Use them implement clean code.

## Architecture

Do NOT!! adhere to the classic folder-by-type architecture Vue comes with.
Instead, use the following folder structure (inspired by Feature-Sliced Design)

- `app`: Stuff that MUST be global, e.g. the vue boilerplate holding the router view. Can import from anywhere, if it must. Should contain little logic.
- `dumb`: collection of simple, reusable stuff. no business logic. may not import from ANY other high-level folder. may cross-import within the folder. put assets here (if needed)
- `entities`: models/entities. One entity, one folder. In that, specifiy how to interact with the dexie db in question. An entity folder may NOT, NOT EVER, import another entity folder. If entities refer to one another, do so via string references to their uid. Inject repositories into pages via a function in `app/`, then pass them to features or meta-features
- `features`: ways of interacting with entities. one folder per feature. may NOT import one another. may ONLY import from `dumb` or `entities`.
- `meta-features`: for complex features interacting in turn with multiple `features`. One folder per meta-feature. May only import from below, and not from other meta-features
- `pages`: One folder per page (a page is something used by the `router.ts` file). If functionality is ONLY used on a given page, put it in the page folder, do not create features or meta-features that are only used by one single page.

## Guidelines

- Keep design lean. Use cards, wrapper divs and containers ONLY when necessary
- Keep style consistent across the code base
- Setup eslint and ensure green linter (not by disabling it, but by writing clean code)
- Keep files, functions and classes short, with a single purpose, on one abstraction layer. Split complex functionality when called for.
- Do not hallucinate features I did not ask for
- Keep copy and micro-copy short and to the point. Avoid waffling, avoid marketing speak, and avoid labelling everything with triple redundancy.
- make sure UI looks neat. Always put a form input BELOW the label in a new line. Responsive design.

Use this pattern for form inputs:

```
<fieldset class="fieldset">
  <label for="page-title" class="label">Page title</label>
  <input
    type="text"
    name="page-title"
    class="input"
    placeholder="My awesome page"
  />
</fieldset>
```

## Clarification Questions

- For the random practice flow, should users practice within a specific Situation they picked, or can the system draw Communications from the entire catalog matching their filters?

only within situation. for now, pick 5 exercises (after another) for the situation, then redirect to dashboard. Establish a global toast system (using daisy toasts), and in this case show a toast "Practice Done"

- What exact labels or grading scale should we use for the four ts-fsrs buttons so they align with your spaced-repetition expectations?

check [this](https://raw.githubusercontent.com/open-spaced-repetition/ts-fsrs/refs/heads/main/README.md) for reference. Rename "Again" as "Wrong", but apart from that: "Hard", "Correct", "Easy"

- When users toggle between text/record/video during `shouldExpress` exercises, do we need to capture and persist their recordings, or is this purely for on-the-spot practice?

for now, capture only in local state so you can rewatch your video immediately after exercise for self-evaluation, no permanent persistence

- Where should audio pronunciations and any uploaded media live (e.g. Dexie attachments, external storage), and in what formats do you expect them?

KISS for now, just straight up in Dexie

- Do we have an initial language list or seed dataset, or should we scaffold empty data structures and sample entries for demonstration?

create some hardcoded JSON in public or whatever, to scaffold some data. keep this hacky and simple; I'm going to replace this real soon.

- For community submissions, what metadata (contact info, language, priority, etc.) must requesters provide, especially for unauthenticated users?

Take a best guess for a simple proof of concept here; we're going to enhance this soon anyways

- In the moderation queue, what actions and filtering capabilities are required beyond approve/decline (e.g. edit suggestions, leave notes, prioritize supporter items)?


nothing. just approve/decline for now, will be reworked soon

- For the Lemonsqueezy supporter tier, should the subscription status unlock any additional UI beyond queue prioritization (e.g. badges, dashboard sections), and do we need to handle failed or canceled payments differently?

no yet. do bare minimum payment handling, using as little custom logic as possible.