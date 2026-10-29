# Vibe Coding Task Pack — Restaurant/Cafe Menu Web App

**Version:** 1.1.0  
**Status:** Updated task specification — no tasks executed  
**Source:** Approved PRD v0.3.0 and System Specification Review corrections R-01 through R-07

## 1. Execution Policy

- One task at a time.
- Read `AGENTS.md` and the relevant specification before starting.
- State planned files before making changes.
- Do not modify unrelated files.
- Run relevant checks before reporting completion.
- Never claim a test passed unless it was executed.
- Stop if a decision changes scope or architecture.
- Keep unresolved business details as `TBD`.
- Production currency behavior must remain blocked until the exchange rate and rounding policy are approved.

## 2. Task Order

```text
T01 Project Setup
  -> T02 Schema and Validation
  -> T03 App Shell and Routing
  -> T04 Branding and Layout
  -> T05 Menu and Categories
  -> T06 Search
  -> T07 Currency Service
  -> T08 Details and Variants
  -> T09 Localization
  -> T10 Accessibility and Responsive Checks
  -> T11 Automated Tests
  -> T12 GitHub Actions and Deployment
  -> T13 Final Verification
```

## 3. Shared Definition of Done

A task is complete only when:
- Its acceptance criteria are checked.
- Relevant TypeScript checks, tests, and builds pass.
- The changed files match the task scope.
- No unapproved dependencies or features were added.
- Results and any unresolved issues are reported.

## T01 — Project Setup

**Goal:** Create the approved React + TypeScript + Vite project.

**Files:** package configuration, TypeScript/Vite configuration, entry point, basic app shell, lockfile.

**Prompt:**

> Set up the React + TypeScript + Vite project according to the approved architecture. Configure Tailwind CSS using the compatible official setup for the selected version. Add only approved dependencies. Do not implement menu features or invent brand assets.

**Acceptance criteria:**
- Clean dependency installation succeeds.
- Development server starts.
- TypeScript checks pass.
- Production build succeeds.
- Lockfile is committed.

**Gate:** Verify setup before T02.

## T02 — Data Schema and Validation

**Goal:** Implement TypeScript models and Zod validation.

**Files:** `src/types/`, `src/data/`, data service, validation script, schema tests.

**Prompt:**

> Implement the exact data contracts in `DATA_SCHEMA.md`. Validate JSON syntax, unique identifiers and slugs, category references, local images, prices, variants, locale requirements, and currency configuration. Enforce exactly one pricing mode per item: a standard price or a non-empty variants list, never both. Report actionable errors and warnings.

**Acceptance criteria:**
- Standard-price items pass.
- Variant-price items pass.
- Mixed or missing pricing modes fail.
- Duplicate IDs/slugs fail.
- Invalid category references fail.
- Missing English menu text produces the specified warning/fallback behavior.
- Invalid exchange-rate configuration blocks production validation.
- Invalid local asset paths are reported.

**Gate:** Review schema and validation output before T03.

## T03 — App Shell and Routing

**Goal:** Establish pages and GitHub Pages-compatible routing.

**Files:** `src/app/`, `src/pages/`, shared layout.

**Prompt:**

> Implement Home, Menu, Item Details, and Not Found route shells using React Router with HashRouter. Verify that the Vite base path can be configured for the actual repository URL. Do not add unapproved features.

**Acceptance criteria:**
- Defined routes render.
- Unknown routes show Not Found.
- Back/forward navigation works.
- Nested item links work with the deployment path.
- No runtime errors.

**Gate:** Verify routes locally.

## T04 — Branding and Responsive Layout

**Goal:** Build reusable design components.

**Files:** Layout, common components, styles, supplied branding assets.

**Prompt:**

> Implement header, navigation, footer, typography, spacing, and reusable components according to `UI_UX_SPEC.md`. Use supplied branding. If assets are not available, keep the configuration ready and use only an explicitly temporary development preview. Do not invent the official restaurant identity.

**Acceptance criteria:**
- Components are reusable.
- Layout passes baseline mobile and desktop viewport checks.
- No horizontal overflow.
- Focus states are visible.
- Missing optional brand content does not break layout.

**Gate:** Review preview before feature implementation.

## T05 — Menu Listing and Categories

**Goal:** Render menu data and category filters.

**Files:** Menu page, menu cards, category filter components.

**Prompt:**

> Render menu cards from validated JSON. Display localized names, images or fallback, USD and calculated KHR where currency configuration is valid, and availability. Add the All category filter. Link cards to details pages.

**Acceptance criteria:**
- Data is rendered from JSON, not duplicated in UI markup.
- Category filtering works.
- Empty category state works.
- Unavailable items are identifiable.
- Invalid currency configuration does not produce fabricated prices.

**Gate:** Verify filtering and card rendering.

## T06 — Search

**Goal:** Implement localized item-name search.

**Files:** Search component and menu-search feature.

**Prompt:**

> Implement accessible search using the active locale. Search and category filtering must compose correctly. Use Khmer fallback for menu text where the selected translation is absent. Add a no-results state.

**Acceptance criteria:**
- Search works in Khmer and English.
- Search and filters work together.
- Clearing search restores the applicable items.
- Empty results are clear.
- Keyboard use works.

**Gate:** Run interaction tests.

## T07 — Currency Service

**Goal:** Centralize USD-to-KHR calculation.

**Files:** Currency domain/service, configuration validation, unit tests.

**Prompt:**

> Implement currency calculation and formatting in one service. Use USD as the source currency and an owner-configured KHR-per-USD rate. Do not fetch live rates or invent an exchange rate. Do not select an unapproved rounding rule. Keep production currency validation blocked until both the rate and rounding policy are explicitly approved.

**Acceptance criteria:**
- Currency calculation is not duplicated in components.
- Invalid, zero, negative, or non-finite exchange rates fail validation.
- Rounding behavior is explicitly configured and tested once approved.
- Standard and variant prices use the same service.
- Tests cover normal, boundary, and invalid values.

**Gate:** Production currency output remains blocked until the owner resolves rate and rounding.

## T08 — Details Pages and Variants

**Goal:** Display dedicated item pages and size variants.

**Files:** Details page, variant selector, associated tests.

**Prompt:**

> Implement item details by slug. Support standard-price items and items with size variants. Variant selection updates price and availability. If the parent item is unavailable, all variants must be unavailable. If the parent is available, each variant follows its own availability.

**Acceptance criteria:**
- Correct item appears for each valid slug.
- Invalid slug shows Not Found.
- Standard-price item works.
- Variant prices update correctly.
- Unavailable parent disables every variant.
- Unavailable variant cannot be selected as available.

**Gate:** Test all pricing and availability modes.

## T09 — Bilingual UX

**Goal:** Complete Khmer/English switching.

**Files:** Language feature, translations, language switcher, tests.

**Prompt:**

> Implement Khmer as the default locale and English as the alternate. Translate all UI strings into both languages. Use active-locale content first and Khmer fallback for menu content. Required Khmer text must be validated; do not hide missing required content.

**Acceptance criteria:**
- Khmer is the default.
- Language switch works across routes.
- Menu, category, and variant labels update.
- Missing optional English content falls back consistently.
- Required translation failures are reported.

**Gate:** Review real Khmer text rendering when supplied.

## T10 — Accessibility and Responsive Verification

**Goal:** Verify usability and error states.

**Files:** Affected components, accessibility tests, responsive test notes.

**Prompt:**

> Check the viewport sizes listed in `UI_UX_SPEC.md`: 360×800, 390×844, 768×1024, 1280×800, and 1440×900. Verify keyboard navigation, focus visibility, labels, image alt text, contrast, empty states, unavailable states, and Not Found. Fix in-scope failures.

**Acceptance criteria:**
- No unintended horizontal page overflow at target viewports.
- Primary actions are keyboard accessible.
- Focus is visible.
- Availability is not communicated by color alone.
- Empty and error states work.
- Automated accessibility results and manual checks are reported separately.

**Gate:** Review evidence before T11.

## T11 — Automated Tests

**Goal:** Cover core behavior.

**Files:** Unit and component tests; Playwright tests only if approved.

**Prompt:**

> Test schema validation, price-mode consistency, currency calculation, availability inheritance, search, filtering, localization fallback, routing, variant selection, and error states. Do not skip or weaken failing tests just to get a passing result.

**Acceptance criteria:**
- Core domain rules have unit tests.
- Main UI interactions have component tests.
- Required test command succeeds.
- Failures and untested behavior are reported honestly.

**Gate:** Review test output.

## T12 — GitHub Actions and Deployment

**Goal:** Automate checks and deploy to GitHub Pages.

**Files:** `.github/workflows/deploy.yml`, Vite config, README deployment instructions.

**Prompt:**

> Configure the production deployment workflow for `main`. Use the committed lockfile. Run data validation, TypeScript checks, tests, and build before deployment. Use least-privilege permissions and deploy only after all required checks pass. Configure the correct Pages base path. Never expose secrets or bypass failed checks.

**Acceptance criteria:**
- Production deploy branch is `main`.
- Failed validation, tests, or build block deployment.
- Successful workflow builds static assets.
- Pages deployment and asset paths work.
- Workflow permissions are minimal.
- Deployment instructions are documented.

**Gate:** Verify a successful deployment and that a deliberately failed check blocks deployment.

## T13 — Final Verification

**Goal:** Audit the completed MVP against approved requirements.

**Prompt:**

> Audit the application against PRD, architecture, data schema, UI/UX specification, and this task pack. Run available checks. Report every acceptance criterion as Pass, Fail, or Not Verified. Fix in-scope issues and request approval before any scope change. Do not claim complete verification without evidence.

**Acceptance criteria:**
- Core MVP requirements pass.
- Production currency configuration is valid and approved.
- Language and availability rules are consistent.
- Routes work on the deployed site.
- Required checks pass.
- README and deployment instructions are complete.

## 4. Do Not Touch Rules

Unless explicitly approved:
- Do not add a backend or database server.
- Do not add ordering, payments, accounts, or QR code functionality.
- Do not fetch live exchange rates.
- Do not invent production menu prices or brand identity.
- Do not change the approved stack.
- Do not silently alter schema or availability semantics.
- Do not deploy after failed checks.
- Do not commit secrets.
- Do not perform unrelated refactoring.

## 5. Task Report Format

Report:
- Task ID and summary.
- Files created or modified.
- Commands executed and actual results.
- Acceptance criteria: Pass / Fail / Not Verified.
- Remaining issues.
- Decisions requiring owner approval.

**Current status:** All tasks are planned only. No implementation task has been executed.