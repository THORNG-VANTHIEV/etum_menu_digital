# Architecture — Restaurant/Cafe Menu Web App

**Version:** 1.1.0  
**Source requirements:** Approved PRD v0.3.0  
**Status:** Updated specification — pending final approval  
**Implementation:** Not started

## 1. Architecture Principles

- Public, responsive, static website.
- No custom backend, API server, or database server.
- Separate presentation, domain logic, data access, and configuration.
- Use local JSON and local image assets.
- Keep currency calculations and validation centralized.
- Deploy only after required checks succeed.
- Preserve unresolved business decisions as `TBD`.

## 2. Technology Stack

| Layer | Approved technology |
|---|---|
| UI | React |
| Language | TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Routing | React Router with HashRouter |
| Local data | JSON files |
| Runtime schema validation | Zod |
| Unit tests | Vitest |
| Component tests | React Testing Library |
| Version control | Git + GitHub |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages |

Playwright end-to-end testing remains optional until the project owner confirms it. Dependency versions must be selected and locked during implementation using compatible official documentation.

## 3. Architecture Layers

### Presentation
React pages, layouts, menu cards, filters, search, language controls, currency display, and variant selectors.

### Domain
Typed menu models, availability rules, currency calculations, localized text selection, and validation-independent business rules.

### Data
Local JSON parsing, Zod schema validation, category/item lookup, and mapping to typed application data.

### Configuration
Branding, locale defaults, exchange rate, currency formatting policy, and other public site settings.

Components must not duplicate domain rules or directly implement exchange-rate calculations.

## 4. Project Structure

```text
restaurant-menu/
├── public/
│   ├── images/
│   │   ├── menu/
│   │   └── branding/
│   └── favicon.ico
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── DATA_SCHEMA.md
│   ├── UI_UX_SPEC.md
│   ├── TASK_PACK.md
│   └── AGENTS.md
├── src/
│   ├── app/
│   ├── components/
│   │   ├── common/
│   │   ├── currency/
│   │   ├── layout/
│   │   └── menu/
│   ├── pages/
│   ├── features/
│   │   ├── language/
│   │   ├── menu-search/
│   │   └── menu-filter/
│   ├── domain/
│   │   ├── currency/
│   │   └── menu/
│   ├── data/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── styles/
│   └── main.tsx
├── scripts/
│   └── validate-menu-data.ts
├── tests/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── AGENTS.md
├── package.json
├── vite.config.ts
└── README.md
```

This is the target structure, not a request to create files now. Keep the architecture lightweight and avoid unnecessary abstractions.

## 5. Routes and GitHub Pages

Use `HashRouter` for initial deployment:

- `/#/` — Home.
- `/#/menu` — Menu listing.
- `/#/menu/:slug` — Item details.
- Unknown routes — Not Found.

Verify the Vite base path against the actual GitHub repository deployment URL. Assets must use paths that work when the site is hosted below a repository subpath.

Test direct navigation, browser refresh, back/forward navigation, and item links on the deployed site.

A custom domain is `TBD`.

## 6. Data Flow

```text
Local JSON and assets
        |
        v
Zod validation
        |
        v
Typed menu data
        |
        v
Domain rules
  |      |       |
  v      v       v
Search  Filter  Currency
        |
        v
React pages and components
        |
        v
Public customer browser
```

There is no live inventory service or external exchange-rate API.

## 7. Currency Rules

- USD is the source currency.
- Display USD and KHR together.
- Calculate KHR using a positive, finite, owner-configured KHR-per-USD rate.
- Use one centralized calculation and formatting service.
- Apply the same rule to standard prices and variants.
- Do not fetch live exchange rates.
- Exchange rate value and rounding rule are `TBD`.

**Production gate:** Until the rate and rounding policy are approved and configured, currency-dependent production validation must fail with an actionable error. Never silently substitute a rate or rounding rule.

## 8. Availability Rules

- If an item is unavailable, all its variants must be treated as unavailable for selection.
- If the item is available, each variant follows its own availability value.
- Items without variants use item-level availability.
- Unavailable status must be visible and must not rely on color alone.
- Availability represents the latest published JSON data, not live inventory.

## 9. Localization Rules

- Default locale: `km`.
- Supported locales: `km`, `en`.
- UI interface strings must have approved translations in both languages.
- For menu content, use the active locale first, then Khmer as fallback.
- Required Khmer content must not be blank.
- Missing optional English menu translations may fall back to Khmer and should be reported by validation as a warning.
- Persist locale across internal navigation. Session persistence beyond navigation is an implementation detail, provided it does not conflict with user expectations.

## 10. Branding

Use existing brand assets supplied by the owner. Restaurant name, logo, colors, fonts, favicon, and business contact details remain `TBD`.

Do not invent an official business identity from the note “អ៊ីទុំ លៀសអប់សៀមរាប”; ask the owner to clarify its intended use.

## 11. Validation and Deployment

Before production deployment, GitHub Actions must run:

1. Dependency installation from the committed lockfile.
2. JSON and Zod data validation.
3. TypeScript checks.
4. Unit and component tests.
5. Production build.
6. Deployment only if all required checks succeed.

Use `main` as the production deployment branch. Configure only the minimum permissions required for Pages deployment. Failed validation, tests, or build must block deployment.

## 12. Security and Reliability

- All shipped JSON and images are public.
- Never commit secrets or private credentials.
- Avoid unsafe HTML injection.
- Validate content before rendering.
- Detect broken local asset paths.
- Use a lockfile and review dependency updates.
- Report real test results; do not claim unexecuted checks passed.

## 13. Acceptance Criteria

- Builds as a static website.
- Requires no custom backend or database server.
- Currency logic is centralized and guarded by configuration validation.
- Item-level availability overrides variant availability.
- Localization follows the documented fallback.
- Item routes work on the actual GitHub Pages deployment.
- Failed checks block production deployment.
- Unresolved business decisions remain `TBD` until approved.