---
name: etum-menu-dev
description: How to run, change, verify and deploy the E Tum Leas Ob Siem Reap digital menu (React + Vite + Tailwind, GitHub Pages at thorng-vanthiev.github.io/etum_menu_digital). Use this skill for ANY work in this repo — starting the dev server, editing menu items/prices/images/translations, UI or styling changes, fixing display bugs, running tests, checking the live site, or committing and pushing a deploy — even when the request is short or in Khmer (e.g. "run project", "កែ...", "commit and push", "ពិនិត្យមើលបញ្ហា").
---

# E Tum digital menu — development guide

A bilingual (Khmer default, English) restaurant menu. Static site: local JSON data, no backend.
Live: https://thorng-vanthiev.github.io/etum_menu_digital/ — repo `THORNG-VANTHIEV/etum_menu_digital`, branch `main`.
Pushing to `main` runs `.github/workflows/deploy.yml` (validate:prod → typecheck → test → build → deploy to Pages).

Read `AGENTS.md` at the repo root first; it is the owner's rulebook (stack, data/currency rules, task report format). This skill adds what was learned while actually working on the project.

## Working with the owner

- The owner writes mostly in Khmer; reply in Khmer, keep code/commands/file names as-is.
- Ask before every commit and every push ("commit and push?"). Approval for one push does not cover the next change. A push deploys to the public site.
- After pushing, verify the live site yourself (see "Deploy") and say so; tell the owner to hard-refresh (Cmd+Shift+R) because Pages caches `index.html` ~10 minutes.
- Report results honestly with Pass / Fail / Not Verified (AGENTS.md §10, §13). If a fix turns out not to work, say so plainly and find the real cause.
- Don't invent business info (hours, address, phone, prices). Copy must match what the menu actually sells: steamed/boiled clams, snails, cockles, crabs, prawns, fried/grilled snacks, water and Coca-Cola — not a café.

## Run the project

```bash
npm run dev -- --host 127.0.0.1      # http://127.0.0.1:5173/ (HashRouter: #/menu, #/menu/<slug>)
```

- If it fails with `Permission denied` on `node_modules/.bin/vite` or `Cannot find module @rollup/rollup-darwin-arm64`, `node_modules` was copied from another OS (it once came from Windows). Run `npm ci` to reinstall from the lockfile.
- **Restart the dev server after editing `tailwind.config.js`** — it does not pick up new keyframes/theme values otherwise (looks like "the animation does nothing").
- Stop it when the owner is done ("stop run project").

## Checks before reporting any change

```bash
npm run validate:prod   # Zod data validation incl. image files exist + currency config
npm run typecheck
npm test                # Vitest + RTL (64+ tests)
npm run build
```

All four must pass; CI runs the same and blocks deploy on failure. Add/adjust tests in `tests/` when behavior or visible text changes (tests often assert Khmer strings).

## Verify in a real browser

The Claude-in-Chrome extension is often not connected. Fall back to headless Chrome via the DevTools protocol (Node 22+ has global `WebSocket`/`fetch`):

- `scripts/qa-crawl.mjs` (in this skill) crawls every route × phone/tablet/desktop × km/en and reports JS errors, failed requests, broken/fallback/invisible images, horizontal overflow, off-screen elements, unnamed controls; it also exercises search, category tabs and variant pricing, and saves screenshots. Run it against the dev server or the live site:
  ```bash
  node .claude/skills/etum-menu-dev/scripts/qa-crawl.mjs http://127.0.0.1:5173 <outDir>
  node .claude/skills/etum-menu-dev/scripts/qa-crawl.mjs https://thorng-vanthiev.github.io/etum_menu_digital <outDir>
  ```
  The full matrix (174 page views) takes ~10 minutes — run it in the background, or add `--quick` (phone + desktop, Khmer only, ~3 minutes). Exit code 1 means issues were found. Then **look at the screenshots**: numbers miss things like mixed-language labels or a category bar with no scroll hint.
- For phone widths use `Emulation.setDeviceMetricsOverride` (a headless window can't be narrower than ~500px via `--window-size`).
- macOS uses overlay scrollbars, so screenshots can't prove scrollbar changes; check the built CSS instead.
- Timing bugs (flashes, transitions): sample `getComputedStyle` at 20/60/120/400 ms after a CDP click — that is how the "dark box on tap" was found.

## Deploy

1. Run the checks above, then ask the owner.
2. Commit on `main` with a conventional message (`fix(ui): …`, `feat(home): …`) ending with the Co-Authored-By line the session provides. Split unrelated changes into separate commits. Git author is already set locally to `THORNG-VANTHIEV <thorngvanthiev@gmail.com>`.
3. `git push origin main` (never force-push; history was already rewritten once before the first push).
4. Confirm the deploy by polling the **site**, not the GitHub API (anonymous API is limited to 60 requests/hour and fails mid-poll):
   ```bash
   bash .claude/skills/etum-menu-dev/scripts/wait-live.sh '<a string only the new build contains>'
   ```
   Then re-run the relevant browser check against the live URL.
5. If Actions fails at "Deploy to GitHub Pages", Pages must be enabled with Source = GitHub Actions (repo Settings → Pages); the owner does that.

## Where things live

| Thing | Location |
|---|---|
| Menu items, categories, site/currency config | `src/data/*.json` (validated by `src/domain/validation/`) |
| UI text (km + en) | `src/features/language/translations.ts` |
| Prices (USD + KHR) | `src/domain/currency/currencyService.ts` (`formatItemPrice`, `formatDualPrice`) |
| Images | `public/images/menu/*.webp`, logo `public/images/branding/e_tum_icon.webp` (favicon stays `.png`) |
| Hero slideshow | `src/components/home/HeroCarousel.tsx` (uses `featured: true` items) |
| Layout, header, footer | `src/components/layout/` |
| Animations | keyframes in `tailwind.config.js` |

## Conventions and pitfalls (learned the hard way)

- **Images**: serve WebP. Convert new photos with `cwebp -q 80 -m 6 in.png -o out.webp` (logo: `-resize 256 0`). Original PNGs and `leas_hal_e_tum_menu/` are git-ignored on purpose — keep them local, never commit them. JSON stores root paths (`/images/menu/x.webp`); always render through `ImageWithFallback`, which resolves them against `import.meta.env.BASE_URL` — a raw `<img src="/images/...">` 404s on Pages because the site lives under `/etum_menu_digital/`.
- **Text**: every visible string goes through translations. Components that take a `locale` prop read `uiTranslations.<key>[locale]`; others use `t()`. No hardcoded `locale === 'km' ? … : …` strings and no mixed Khmer/English labels like "ទាំងអស់ (All)".
- **Prices**: never format by hand (`$${x.toFixed(2)}`); use `CurrencyService.formatItemPrice` so home and menu cards match: the USD price, a middle dot, then the riel price (e.g. 2.50 USD shows as dollar-sign 2.50 · ៛10,000; variant items get the "ចាប់ពី" / "From" prefix). The exchange rate (4000) and rounding (`round_to_100`) in `site-config.json` are owner-set; don't change them without the owner.
- **Dark mode**: `darkMode: 'class'`; the header theme button toggles `dark` on `<html>` (`src/features/theme/useTheme.ts`, saved in `localStorage` as `restaurant_menu_theme`; an inline script in `index.html` applies it before first paint). Light is the default. Dark surfaces use the `palm` scale from `tailwind.config.js`, taken from the palm tree in the logo: page `palm-950` (#1C0E07), cards/header/footer `palm-900` (#341C10), borders/chips `palm-800`, `palm-700`/`600` for stronger chips/hover. Every new light surface or dark text color needs a `dark:` partner (e.g. `bg-white dark:bg-palm-900`, `border-stone-200 dark:border-palm-800`, `text-stone-900 dark:text-stone-100`); text stays stone/amber/cream. Already-dark elements (hero, brown/yellow buttons, dark badges) keep their colors. Check new UI in both themes.
- **Header**: only logo (= home link), theme toggle and language toggle. Home/Menu links were removed on purpose to save space; navigation happens through the hero/“View all” buttons, breadcrumbs and the logo.
- **Focus styles**: use `outline-none focus-visible:ring-2 focus-visible:ring-amber-500`. Never `focus:outline-none` together with `transition-all` — the outline fades from the dark text color on every tap, which shows as a dark box flash on phones.
- **Sticky header**: don't put `overflow-x-hidden` on an ancestor of the header (it becomes the scroll container and sticky stops working); use `overflow-x-clip`.
- **Animations**: animate only `opacity`/`transform`, keep them short (150–350 ms), wrap in `motion-safe:`, and use `backwards` fill so finished animations don't override hover/active transforms. Interval-driven motion (hero) needs pause controls and must respect `prefers-reduced-motion`.
- **Scroll**: page and category-bar scrollbars are hidden (`index.css`); the category bar shows edge fades instead. New pages scroll to top on PUSH navigation but keep position on Back (`AppLayout.tsx`).
- **Tailwind 3.4 facts**: preflight already sets `-webkit-tap-highlight-color: transparent`; `shadow-xs` does not exist in v3 (it's a no-op where used).
- **Tests on Node 25+**: Node's own `localStorage` global shadows jsdom's; `src/test/setup.ts` restores it and stubs `window.scrollTo`. Keep that file when upgrading tooling.
