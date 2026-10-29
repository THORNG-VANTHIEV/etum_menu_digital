# AGENTS.md — AI Agent Development Rules

**Version:** 1.1.0  
**Project:** Restaurant/Cafe Menu Web App  
**Status:** Updated rules — pending final approval  
**Implementation:** Not started

## 1. Source of Truth

Read these documents before performing implementation work:

1. `docs/PRD.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DATA_SCHEMA.md`
4. `docs/UI_UX_SPEC.md`
5. `docs/TASK_PACK.md`

The PRD defines approved product scope. The architecture and schema define technical behavior. The UI/UX specification defines user experience and accessibility. The task pack defines implementation order and verification.

If documents conflict, stop and ask the owner. Do not silently override requirements.

## 2. Approved Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router with HashRouter
- Local JSON data
- Zod for runtime validation
- Vitest for unit tests
- React Testing Library for component tests
- Git and GitHub
- GitHub Actions
- GitHub Pages

Playwright remains optional unless approved. Use compatible, supported dependency versions and commit the lockfile.

## 3. Architecture Rules

- Separate presentation, domain logic, data access, and configuration.
- Use reusable components when responsibilities are genuinely shared.
- Centralize currency calculation and formatting.
- Centralize localization fallback rules.
- Validate JSON with Zod.
- Avoid duplicated business logic and unnecessary abstractions.
- Follow official documentation for the selected framework and libraries.
- Do not introduce a backend or database server.

## 4. Data and Pricing Rules

- Local JSON is the source of public menu content.
- Use stable IDs and slugs.
- Validate category references, variants, prices, and asset paths.
- Every item must use exactly one pricing mode:
  - Standard `priceUsd`, or
  - A non-empty `variants` list with `priceUsd` for each variant.
- Reject items that define both pricing modes or neither.
- Prices must be finite and non-negative.
- Do not invent actual menu content or production prices.
- Treat all shipped data and assets as public.

## 5. Currency Rules

- USD is the source currency.
- Display USD and KHR together.
- Calculate KHR using an owner-configured KHR-per-USD rate.
- Do not fetch live exchange rates.
- Do not hardcode an assumed production rate.
- Do not select an unapproved rounding policy.
- Use one centralized currency service.
- Invalid, missing, zero, negative, or non-finite exchange rates must fail validation.

**Production gate:** The exchange rate and rounding policy remain `TBD` until the owner approves them. Production currency validation and deployment must be blocked until required settings are valid.

## 6. Availability Rules

- If the parent item is unavailable, all its variants are unavailable.
- If the parent item is available, each variant follows its own availability value.
- Standard-price items use item-level availability.
- Do not implement ordering or stock reservation.
- Clearly communicate unavailable states without relying on color alone.

## 7. Localization Rules

- Default locale is Khmer (`km`).
- English is `en`.
- UI interface strings must be translated into both languages.
- For menu content, prefer the active locale, then fall back to Khmer.
- Required Khmer text must not be empty.
- Missing optional English menu translations may generate a warning and fall back to Khmer.
- Keep localization behavior consistent across cards, details pages, filters, and variants.

## 8. UI and Accessibility Rules

- Follow `UI_UX_SPEC.md`.
- Use owner-supplied branding assets.
- Do not invent an official restaurant identity.
- Keep the UI responsive and visually consistent.
- Use semantic elements, accessible labels, keyboard navigation, visible focus, and meaningful alt text.
- Verify the specified mobile, tablet, and desktop viewport sizes.
- Provide clear empty, unavailable, broken-image, and Not Found states.
- Do not add unapproved ordering, payment, account, or QR features.

## 9. Coding Rules

- Prefer explicit TypeScript types over unnecessary `any`.
- Use descriptive names and focused functions.
- Keep components small enough to understand and test.
- Avoid unnecessary dependencies.
- Do not suppress compiler or test errors merely to pass checks.
- Do not modify unrelated files.
- Do not make architectural changes without approval.

## 10. Testing Rules

Before reporting a task as complete:

1. Run applicable data validation.
2. Run TypeScript checks.
3. Run relevant unit and component tests.
4. Run the production build.
5. Verify the changed behavior.
6. Report actual command output or summarized results.
7. Mark unexecuted checks as `Not Verified`.

Automated accessibility checks supplement, but do not replace, manual keyboard and visual verification.

## 11. GitHub and Deployment Rules

- Use `main` as the production deployment branch.
- Use the committed dependency lockfile.
- Run validation, TypeScript checks, tests, and build before deployment.
- Configure least-privilege GitHub Actions permissions.
- Failed required checks must prevent deployment.
- Verify the GitHub Pages base path and deployed routes.
- Never commit secrets or private credentials.
- Do not force-push or rewrite shared Git history without explicit authorization.
- Do not claim deployment succeeded without verification.

## 12. Stop and Ask the Owner

Stop when:
- Requirements conflict.
- An unresolved decision changes architecture or production behavior.
- The exchange rate or rounding policy is needed but unapproved.
- Required branding or business information is missing.
- A new dependency changes the approved stack materially.
- A proposed feature expands MVP scope.
- A destructive operation is proposed.
- An acceptance criterion cannot be met within the approved architecture.

## 13. Required Task Report

Every task report must include:
- Task ID and summary.
- Files created or modified.
- Decisions made.
- Commands executed and actual results.
- Acceptance criteria marked Pass, Fail, or Not Verified.
- Remaining issues.
- Owner decisions required.

## 14. Current Authorization State

The PRD has been approved. Review corrections R-01 through R-07 have also been approved for incorporation into the specification.

This file does not itself authorize implementation. Begin coding only after the owner explicitly approves the final System Specification and requests the implementation phase.