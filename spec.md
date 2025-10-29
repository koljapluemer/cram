
You see here a vue-next vite ts with daisy+tailwind ALREADY INSTALLED. Implement prototype according to the spec below.

## Basics

I want to make a language learning app. Core idea:

- outcome-based
- situation-specific ("how to haggle with a Cairo taxi driver" "how to politely open a business meeting in Japan")
- tight timeframe possible ("my plane goes in one week")
- actually works, not just fun engagement


## Essential Tech Stack


- vue3 (latest best practices) with typescript
- dexie with dexie-cloud (one db per user, cloud sync optional)
- tailwind + Daisy UI. Actually use daisy components. Avoid manual CSS when possible.
- lucide icons (via the vue package)
- vue router
- NO local data yet; use API described below

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

## MVP Features

- check out the [API spec](./API.md). This is your source of truth.

- show a front page with a tabbed layout (daisy ui). Tabs = languages.
- on each tab, show a card grid with the situations available for this lang (image card if img url provided). add a "practice" button.
- for practice, generate 5 random exercises and go through them. in the following way:
    - for a `Communication` where `shouldUnderstand`, you can randomly pick an `Utterance`, simply display it as text and offer a text area where the user should try to describe what was said and a "Reveal" button then showing the `Communication` and the standard four ts-fsrs buttons (check [this](https://raw.githubusercontent.com/open-spaced-repetition/ts-fsrs/refs/heads/main/README.md) for reference. Rename "Again" as "Wrong", but apart from that: "Hard", "Correct", "Easy")
    - for a `Communication` where `shouldExpress`, show the situation context, show a `.join` element (daisy UI) to toggle between text/record/video where the user can try their best to express this situation, then a "show solutions" showing the utterances related to this situation, and again the ts-fsrs rating buttons
- don't try to persist learning progress in any way yet, that'll come later

