# Restaurant/Cafe Menu Web App

**Version:** 1.1.0  
**Specification:** Approved System Specification v1.1.0 (PRD v0.3.0 + Review corrections R-01 through R-07)  
**Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router (HashRouter), Zod, Vitest, React Testing Library.

A modern, accessible, customer-facing Restaurant & Cafe Menu Web App with full bilingual support (Khmer default, English alternate), dual-currency presentation (USD source, owner-configured KHR conversion), category and search filtering, variant size selection, and strict availability inheritance rules.

---

## 1. Key Features

- **Public Static Menu**: Fast static website with zero backend or database dependency.
- **HashRouter Navigation**: Fully compatible with GitHub Pages repository subpaths (`/#/`, `/#/menu`, `/#/menu/:slug`).
- **Bilingual Interface & Content**:
  - Default locale: Khmer (`km`).
  - Alternate locale: English (`en`).
  - Active-locale first with graceful fallback to Khmer for missing optional English translations.
  - UI interface strings translated in both languages.
- **Strict Data Contracts & Validation**:
  - Runtime and CLI validation via Zod (`scripts/validate-menu-data.ts`).
  - Price-mode consistency: Each item strictly uses either a standard `priceUsd` or a non-empty `variants` list (never both, never neither).
  - Unique ID and slug validation across categories and menu items.
  - Category existence verification.
  - Local asset path verification.
- **Centralized Currency Service**:
  - USD is the source currency.
  - Dual price display: `$X.XX · ៛XX,XXX`.
  - Calculates KHR using configured positive exchange rate and approved rounding rule (`round_to_100`, `round_to_500`, etc.).
  - **Critical Currency Production Gate**: Blocks deployment if rate or rounding policy is unapproved or invalid.
- **Availability Semantics**:
  - Parent item availability strictly overrides variants: if parent item is unavailable, all variants are disabled.
  - If parent item is available, each variant follows its own availability flag.
  - Clearly marked with accessible text and aria attributes, not color alone.
- **Responsive & Accessible Design**:
  - Supports mobile viewports (360px, 390px), tablets (768px), and desktops (1280px, 1440px).
  - Semantic HTML landmarks, visible focus rings (`focus-visible:ring-2`), keyboard navigable.
  - Graceful image fallback for missing/broken assets.

---

## 2. Project Architecture & Directory Layout

```text
restaurant-menu/
├── public/
│   ├── images/
│   │   ├── menu/          # Local SVG/WebP item images
│   │   └── branding/      # Temporary logo & branding assets
│   └── favicon.ico
├── src/
│   ├── app/               # Main application routing and shell
│   ├── components/
│   │   ├── common/        # Badge, Button, ImageWithFallback
│   │   ├── layout/        # Header, Footer, AppLayout
│   │   └── menu/          # MenuCard, CategoryFilter, SearchBar, VariantSelector
│   ├── data/              # Local JSON data (categories, menu-items, site-config)
│   ├── domain/
│   │   ├── currency/      # Centralized CurrencyService
│   │   └── validation/    # Zod schemas and validation engine
│   ├── features/
│   │   ├── language/      # LanguageContext and bilingual translations
│   │   └── menu-search/   # Composable category and text search engine
│   ├── pages/             # HomePage, MenuPage, ItemDetailsPage, NotFoundPage
│   ├── services/          # DataService for category & item access
│   ├── styles/            # Tailwind CSS entry
│   ├── types/             # TypeScript interfaces
│   └── main.tsx           # React DOM root entry
├── scripts/
│   └── validate-menu-data.ts # CLI validator for local data and production gate
├── tests/                 # Unit and component tests (55 passing tests)
│   ├── accessibility.test.tsx
│   ├── currency.test.ts
│   ├── details.test.tsx
│   ├── layout.test.tsx
│   ├── localization.test.tsx
│   ├── routing.test.tsx
│   ├── schema.test.ts
│   ├── search.test.ts
│   └── smoke.test.tsx
├── .github/
│   └── workflows/
│       └── deploy.yml     # Automated CI/CD pipeline for GitHub Pages
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Development Commands

### Installation
```bash
npm install
```

### Local Development Server
```bash
npm run dev
```

### Run All Tests (Vitest)
```bash
npm run test
```

### TypeScript Type Checking
```bash
npm run typecheck
```

### Data Validation (Development)
```bash
npm run validate
```

### Data Validation (Strict Production Gate)
```bash
npm run validate:prod
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 4. Currency Production Gate & Configuration

In accordance with the specification rules:
- `exchangeRateKhrPerUsd` and `roundingRule` in `src/data/site-config.json` are preserved as `null` (TBD) pending explicit owner approval.
- Development validation (`npm run validate`) passes with warnings for missing optional English translations.
- Production validation (`npm run validate:prod`) deliberately blocks production deployment until the owner approves and inputs:
  1. A positive, finite number for `exchangeRateKhrPerUsd` (e.g. `4100`).
  2. An approved rounding policy string for `roundingRule` (e.g. `"round_to_100"`).

Once approved by the owner, update `src/data/site-config.json`:
```json
{
  "currency": {
    "baseCurrency": "USD",
    "displayCurrencies": ["USD", "KHR"],
    "exchangeRateKhrPerUsd": 4100,
    "roundingRule": "round_to_100"
  }
}
```
And `npm run validate:prod` will succeed and permit automated GitHub Pages deployment.

---

## 5. CI/CD & GitHub Pages Deployment

The automated GitHub Actions workflow (`.github/workflows/deploy.yml`) is configured for the `main` branch with least-privilege permissions:
1. `npm ci` — Installs from committed lockfile.
2. `npm run validate:prod` — Runs strict production schema and currency gate validation.
3. `npm run typecheck` — Runs TypeScript compiler checks.
4. `npm run test` — Executes all Vitest unit and component tests.
5. `npm run build` — Compiles static HTML, CSS, and JS assets into `dist/`.
6. Deploys to GitHub Pages only when all previous stages pass.
