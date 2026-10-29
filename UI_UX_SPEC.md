# UI/UX Specification — Restaurant/Cafe Menu Web App

**Version:** 1.1.0  
**Status:** Updated specification — pending final approval  
**Branding:** Existing brand assets supplied by owner

## 1. Design Goals

- Make the menu attractive, clear, and easy to browse.
- Prioritize mobile usability.
- Support Khmer and English, with Khmer as the default.
- Display USD and KHR together.
- Keep layout, spacing, typography, and interactions consistent.
- Use the approved restaurant branding when available.
- Provide accessible controls and understandable error states.

## 2. Global Layout

### Header

- Restaurant logo and name, once supplied.
- Main navigation.
- Language switcher.
- Optional contact link if approved.

Mobile navigation must be touch-friendly and keyboard accessible.

### Footer

Potential content:
- Restaurant name.
- Address and contact information.
- Business hours.
- Social links.

These details remain `TBD`. Do not display empty placeholder rows in production.

## 3. Page A — Home

Purpose: Present the brand and help customers start browsing.

Potential components:
- Header.
- Optional brand introduction.
- Featured menu items if approved and configured.
- Menu navigation entry point.
- Footer.

Acceptance criteria:
- Branding uses supplied assets.
- Primary menu navigation is easy to find.
- Missing optional content does not leave broken gaps.
- Layout works at all required viewports.

## 4. Page B — Menu Listing

Components:
- Page heading.
- Search input.
- Category filters, including All.
- Responsive item grid.
- Empty search/filter state.

Each menu card may show:
- Item image or approved fallback.
- Localized item name.
- USD price.
- Calculated KHR price.
- Availability indicator.
- Link to the item's details page.

Behavior:
- Search and category filters work together.
- Selecting a card opens its dedicated details route.
- Unavailable items remain clearly marked.
- Search and filter changes do not require a full-page reload.
- Currency-dependent production output is not enabled until required currency configuration passes validation.

## 5. Page C — Item Details

Components:
- Back-to-menu navigation or breadcrumb.
- Main image or gallery when assets are available.
- Localized item name and description.
- Category.
- Variant selector when variants exist.
- USD and KHR price display.
- Availability state.

Behavior:
- Selecting a variant updates its price display.
- If the item itself is unavailable, all variants are treated as unavailable.
- If the item is available, each variant follows its own availability.
- Standard-price items display their single price.
- Invalid slugs display Not Found.
- Direct route loading and refresh work on the deployed host.

## 6. Page D — Not Found

Components:
- Clear localized message.
- Link or button back to the menu.

Acceptance criteria:
- No blank screen or unhandled exception.
- Keyboard users can reach the navigation action.
- The page uses the shared layout and branding.

## 7. Localization UX

- Khmer is the default locale.
- English is the alternate locale.
- The language switcher is visible and accessible.
- Menu names, descriptions, categories, variants, and UI labels use the active locale.
- UI interface strings must be translated in both languages.
- For menu content, use the active locale first and fall back to Khmer.
- Required Khmer content cannot be empty.
- Missing optional English translations may fall back to Khmer and should be reported by validation.

## 8. Currency UX

Always display both currencies together.

Illustrative format only:

`$2.50 · ៛10,000`

The sample does not establish a production exchange rate or rounding policy.

Requirements:
- USD is the source price.
- KHR is calculated using the configured owner-defined rate.
- Use consistent formatting on cards, details pages, and variants.
- Do not imply the rate is live.
- Apply the approved rounding rule consistently.
- Do not show fabricated prices if configuration is invalid.

The initial exchange rate and rounding policy remain `TBD`.

## 9. Variant UX

- Use clear buttons, radio options, or another suitable accessible selection control.
- Identify the selected variant visually and programmatically.
- Update displayed prices when the selected variant changes.
- Show unavailable variants clearly and prevent selecting them as available.
- If the parent item is unavailable, disable all variants.
- Do not add Hot/Iced, sugar, toppings, or other variant types without approval.

## 10. Responsive Requirements

Test representative viewport widths:

| Viewport | Required checks |
|---|---|
| 360 × 800 | Small mobile layout; no horizontal page overflow |
| 390 × 844 | Mobile navigation, search, filters, item cards |
| 768 × 1024 | Tablet layout and category filter behavior |
| 1280 × 800 | Desktop grid, spacing, and readable content |
| 1440 × 900 | Wide-screen alignment and maximum content width |

These are baseline test viewports, not exclusive supported sizes.

At all viewports:
- No clipped primary content.
- No unintended horizontal page scrolling.
- Controls remain usable.
- Dual-currency prices remain readable.
- Long Khmer and English text wraps without breaking the layout.

## 11. Accessibility Verification

The implementation must verify:

- Semantic headings, landmarks, and links.
- Keyboard navigation through all primary actions.
- Visible focus indicators.
- Meaningful alternative text for informative images.
- Appropriate accessible labels for search and variant controls.
- Sufficient text/background contrast.
- Availability is not conveyed by color alone.
- Selected and disabled states are programmatically identifiable.
- Language and price changes are understandable to assistive technology.

Use automated accessibility checks where available, plus manual keyboard testing. Automated tools alone do not prove accessibility compliance.

## 12. Empty and Error States

Provide:
- No search results.
- Empty category results.
- Broken or missing image fallback.
- Unavailable item and variant states.
- Invalid item route.
- Clear data-validation errors during development and CI.

Avoid artificial loading screens when data is already bundled locally.

## 13. UI Acceptance Checklist

- [ ] Branding uses owner-approved assets.
- [ ] Khmer is the default language.
- [ ] English switching works across routes.
- [ ] Missing menu translations fall back to Khmer.
- [ ] Cards and details show both currencies when valid configuration exists.
- [ ] Search and category filters work together.
- [ ] Each item has a dedicated details page.
- [ ] Variant selection updates price and availability.
- [ ] Parent item unavailability disables all variants.
- [ ] All specified viewport checks pass.
- [ ] Primary interactions work with a keyboard.
- [ ] Focus and disabled states are visible.
- [ ] Empty, error, and Not Found states are complete.
- [ ] No unapproved ordering, payment, account, or QR features are shown.