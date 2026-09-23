# PocketPet website

**Live:** <https://pocketpet-web.vercel.app/>

The download and landing page for [PocketPet](https://github.com/vigneshcj001/Pocketpet),
a desktop pet for Windows, macOS and Linux. The page runs the app's own
animal sprites and animations, alongside a blue pixel droplet created for the website companion preview.

| | |
|---|---|
| Website (this repo) | <https://github.com/vigneshcj001/Pocketpet-web> |
| App (Tauri / Rust) | <https://github.com/vigneshcj001/Pocketpet> |
| Downloads | <https://github.com/vigneshcj001/Pocketpet/releases/latest> |

**Stack:** React 19 · TypeScript · Tailwind CSS v4 · Vite. No backend — a
static `dist/` folder that talks to the GitHub API from the browser.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173 with HMR
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
npm run lint       # oxlint
```

Requires Node 20+. No environment variables.

---

## What the page does

### The pet

The hero opens in **Companion** view: a blue pixel droplet with new-chat,
voice-input and collapse controls. Try an example or type a task to see
**Starting your task → Thinking → Completed**, then click the result to read
the full sample answer. This is a local interaction preview with sample
answers, not a live AI connection. Voice dictation uses browser speech
recognition where available and requires microphone permission.

Switch to **Playground** for the original interactive pet demo. The droplet
is selected by default, with all four original animals still available.
Playground keyboard shortcuts apply only while that view is active; keys
`1`–`5` select the five pets.

| Where | What |
|---|---|
| **Hero stage** | The pet follows your cursor (walks near, runs far), sits, dozes off after 18 s, does random antics (yawn, stretch, look around, wander). Click → hearts. Double-click → spin. Drag and release → it flies, falls and squashes on landing. |
| **Toolbar** | 🐱 🦆 🐼 🐧 pick an animal · 🍪 **Feed** drops its food and it walks over to eat · 🪁 **Toss** throws it · 📦 **Hide** runs behind the notes window and peeks back out · 🎨 opens the dress-up drawer. |
| **Dress-up** | The app's real colour picker (`src/pet/tint.ts` is a port of `appearance.js`) and eight emoji accessories in hat / face / neck / back / paw slots — one per slot, four at most, same rules as the app. |
| **Keyboard** | `F` feed · `T` toss · `S` spin · `H` hide · `1`–`4` switch pets (ignored while typing in a field). |
| **Site buddy** | Scroll past the hero and the same pet — colour and hat included — walks along the bottom of the window, follows the cursor page-wide, and comments on whichever section you're reading. Click to pat, double-click to jump back to the stage, "Hide pet" to send it away (the app's `Ctrl+Alt+P`). |
| **Feature cards** | Each card is a button: click "Follows your cursor" and the stage pet dashes; "Stands on your windows" and it hides; "Knows when to hush" and it sleeps. |
| **Footer** | Your pet, asleep. |

All motion respects `prefers-reduced-motion`.

### Downloads

- Three cards: **Windows** (`.exe` installer), **macOS** (Apple Silicon and
  Intel `.dmg`), **Linux** (`.AppImage` and `.deb`).
- The visitor's OS is detected from the user agent; that card is marked
  *Recommended for you* and the hero button becomes "Download for …".
- On load the page asks the GitHub Releases API for the latest release and
  points every button at the exact asset (with file size). Assets are matched
  by suffix:

  | Button | Suffix |
  |---|---|
  | Windows installer | `-setup.exe` |
  | macOS Apple Silicon | `_aarch64.dmg` |
  | macOS Intel | `_x64.dmg` |
  | Linux AppImage | `.AppImage` |
  | Linux deb | `.deb` |

  These are what Tauri's bundler produces in the app's CI workflow. No release
  yet, offline, or rate-limited → buttons fall back to the releases page.
- Clicking a download makes the stage pet celebrate.
- On phones a sticky download bar appears once the hero scrolls away.

### Other sections

- **What it does all day** — nine feature cards.
- **Same pet, three homes** — a Windows / macOS / Linux feature matrix
  (✓ full, ◐ partial, — not available) with footnotes.
- **It runs errands, too** — the task agent, with a looping demo of a typed
  task, a plan ticking off, and an approval card.
- **What's new** — the last four GitHub releases as a timeline. Hidden until
  a release exists.
- **Questions** — FAQ accordion.
- Hero **stats strip** — live stars, forks, licence and last-push date from
  the repo API.
- Light / dark theme: follows the OS, 🌙 toggle overrides, saved in
  `localStorage`, applied before first paint (no flash).

---

## Project layout

```
index.html                 meta, fonts, JSON-LD, theme bootstrap
public/                    icon.png, icon-256.png
src/
  main.tsx                 React root
  App.tsx                  page assembly, OS detection, GitHub data, reveal
  index.css                Tailwind import, theme tokens, sprite keyframes
  data/pets.ts             generated: sprites + dialogue for all four animals
  pet/
    PetContext.tsx         chosen pet, colour, accessories, action bus
    Sprite.tsx             SVG + accessory slots
    tint.ts                recolouring (port of the app's appearance.js)
  hooks/
    useRelease.ts          latest release, asset lookup, OS detection
    useRepo.ts             repo stats + recent releases
    useReveal.ts           scroll-reveal observer
    useTheme.ts            light/dark
  components/
    Header.tsx  Hero.tsx  PetStage.tsx  SiteBuddy.tsx  Stats.tsx
    Download.tsx  Features.tsx  Compare.tsx  Agent.tsx
    Changelog.tsx  Faq.tsx  Footer.tsx  MobileBar.tsx
```

### How the pet works

`PetStage` and `SiteBuddy` each run a small brain on `requestAnimationFrame`
with a mutable ref (position, velocity, facing, state), writing `transform`
straight to the DOM. React owns only the chrome — bubble text, hearts, the
`data-state` attribute that drives the CSS animations, the picker. Animations
are the app's own keyframes, keyed on `data-state` (`idle`, `walk`, `run`,
`sleep`, `fly`, `happy`, `eat`, `spin`, …) and the shared SVG part classes
(`p-head`, `p-arm`, `p-leg-f`, `p-leg-b`, `p-tail`, `p-eye`).

`PetContext` holds the chosen animal, colour and accessories so the stage,
the buddy and the footer stay in sync, and exposes `perform(action)` —
`"feed" | "toss" | "spin" | "dash" | "sleep" | "wave" | "hide" | "celebrate"` —
which the feature cards and download buttons use to drive the stage.

### Theme tokens

Colours are CSS variables on `:root`, switched by `[data-theme]` or the OS,
and exposed to Tailwind through `@theme inline`, so components use
`bg-bg`, `bg-card`, `text-ink`, `text-muted`, `border-line`, `bg-accent`,
`bg-accent-soft`, `text-green`, `shadow-soft`, `rounded-card`. A `dark`
variant is defined on `[data-theme="dark"]`.

---

## Regenerating the sprites

The original animal entries in `src/data/pets.ts` are generated from the app repo's `src/pets/*.js`.
The website's droplet is maintained separately in `src/data/droplet.ts`, with
expressions in `src/pet/droplet.css`. The companion UI lives in
`src/components/CompanionDemo.tsx` and `src/components/companion.css`.
The legacy command below overwrites `pets.ts`: preserve its `DROPLET` import,
record entry, `PetId` member, and `PET_IDS` entry when regenerating. After
changing a pet there, run from the **PetExt** repo root:

```bash
node -e "const fs=require('fs');(async()=>{const o={};for(const id of ['cat','duck','panda','penguin']){const m=(await import('./src/pets/'+id+'.js')).default;o[id]={id:m.id,name:m.name,emoji:m.emoji,food:m.food,tint:m.tint,svg:m.svg.trim(),lines:m.lines||{}};}const ts='// Generated from PetExt/src/pets/*.js\nexport type PetId = \"cat\" | \"duck\" | \"panda\" | \"penguin\";\nexport interface Pet { id: PetId; name: string; emoji: string; food: string; tint: string[]; svg: string; lines: Record<string, string[]>; }\nexport const PETS: Record<PetId, Pet> = '+JSON.stringify(o,null,1)+';\nexport const PET_IDS: PetId[] = [\"cat\", \"duck\", \"panda\", \"penguin\"];\n';fs.writeFileSync('D:/PocketPet_web/src/data/pets.ts',ts);})()"
```

---

## Deploying

Hosted on **Vercel** at <https://pocketpet-web.vercel.app/>. Every push to
`main` on [Pocketpet-web](https://github.com/vigneshcj001/Pocketpet-web)
triggers a production deploy; pull requests get preview URLs.

Vercel settings (auto-detected from the Vite template):

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node | 20+ |

No environment variables. `npm run build` produces a static `dist/` that
also hosts fine on Netlify, Cloudflare Pages or GitHub Pages (for a sub-path
set `base` in `vite.config.ts` and update `<link rel="canonical">` /
`og:url` / `og:image` in `index.html`).

## Notes

- The GitHub API is called unauthenticated (60 requests/hour per visitor
  IP). Every fetch fails soft: the page still works, buttons open the
  releases page.
- Assets only resolve once a `v*` tag has been pushed to the app repo and
  its CI has attached the packages to the release.
- `vite.config.ts` includes the React Compiler Babel preset from the Vite
  template. It works; remove the `babel(...)` plugin for faster builds if you
  prefer.
- Everything is in-repo: no analytics, no cookies, only `localStorage` for
  the theme choice.
