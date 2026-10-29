# Data Schema — Restaurant/Cafe Menu Web App

**Version:** 1.1.0  
**Storage:** Local JSON files; no database server  
**Status:** Updated specification — pending final approval

## 1. Data Contract Principles

- JSON is the source of public menu data.
- TypeScript types describe the application contract.
- Zod validates JSON at runtime and in the validation script.
- Validation must reject malformed or contradictory records.
- No real restaurant content or production prices may be invented.
- Unresolved exchange-rate and rounding settings must remain explicit.

## 2. Localized Text

```ts
export type Locale = "km" | "en";

export interface LocalizedText {
  km: string;
  en?: string;
}
```

Rules:
- Khmer is required for essential menu and category text.
- English may be absent for individual menu records; the UI falls back to Khmer and validation emits a warning.
- UI interface strings must be translated in both languages.
- Blank Khmer text for required fields is a validation error.
- Do not use missing translations to hide invalid required data.

## 3. Menu Item Schema

```ts
export interface MenuVariant {
  id: string;
  name: LocalizedText;
  available: boolean;
  priceUsd: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: LocalizedText;
  description?: LocalizedText;
  categoryId: string;
  images: string[];
  available: boolean;
  featured?: boolean;
  priceUsd?: number;
  variants?: MenuVariant[];
}
```

### Price consistency rule

Every menu item must use exactly one pricing mode:

- **Standard price:** `priceUsd` is present and `variants` is absent or empty.
- **Variant pricing:** `variants` contains one or more valid variants, and `priceUsd` is omitted.

Reject records that define both a standard price and variant prices, or define neither. This prevents ambiguity about which price the customer should see.

For a variant-priced item, each variant has its own USD price.

## 4. Example Menu Data

Illustrative data only:

```json
[
  {
    "id": "item-001",
    "slug": "sample-item",
    "name": {
      "km": "ឈ្មោះគំរូ",
      "en": "Sample Item"
    },
    "description": {
      "km": "ការពិពណ៌នាគំរូ",
      "en": "Sample description"
    },
    "categoryId": "category-001",
    "images": [
      "/images/menu/sample-item.webp"
    ],
    "available": true,
    "priceUsd": 2.5
  },
  {
    "id": "item-002",
    "slug": "sample-size-item",
    "name": {
      "km": "មុខម្ហូបមានទំហំ",
      "en": "Item With Sizes"
    },
    "categoryId": "category-001",
    "images": [],
    "available": true,
    "variants": [
      {
        "id": "small",
        "name": {
          "km": "តូច",
          "en": "Small"
        },
        "available": true,
        "priceUsd": 2
      },
      {
        "id": "large",
        "name": {
          "km": "ធំ",
          "en": "Large"
        },
        "available": false,
        "priceUsd": 3.5
      }
    ]
  }
]
```

The names, prices, IDs, and availability in this example are not approved production content.

## 5. Category Schema

```ts
export interface MenuCategory {
  id: string;
  slug: string;
  name: LocalizedText;
  sortOrder: number;
  active: boolean;
}
```

Rules:
- IDs and slugs must be unique.
- `name.km` is required.
- Missing `name.en` falls back to Khmer with a validation warning.
- `sortOrder` must be finite.
- Inactive categories are excluded from customer filters.
- Every menu item's `categoryId` must reference a valid category.

## 6. Site Configuration

Proposed configuration fields:

```ts
export interface SiteConfig {
  defaultLocale: "km";
  supportedLocales: ["km", "en"];
  currency: {
    baseCurrency: "USD";
    displayCurrencies: ["USD", "KHR"];
    exchangeRateKhrPerUsd: number | null;
    roundingRule: string | null;
  };
  branding: {
    restaurantName: string | null;
    logoPath: string | null;
    faviconPath: string | null;
  };
}
```

Nulls may be used while requirements are being gathered. They are not valid substitutes for required production configuration.

The production validator must reject:
- Missing or non-finite exchange rate.
- Exchange rate less than or equal to zero.
- Missing rounding policy.
- Missing required brand configuration when the production UI requires it.

The actual exchange rate, rounding policy, and restaurant identity remain `TBD`.

## 7. Availability Semantics

- `item.available = false` means the item and all its variants are unavailable.
- If `item.available = true`, each variant's `available` value determines its own availability.
- Standard-price items use item-level availability.
- The UI must never present an unavailable variant as selectable for purchase.
- This website does not perform ordering or reserve stock.

## 8. Currency Contract

Input:
- USD price.
- Owner-configured KHR-per-USD rate.
- Approved rounding policy.

Output:
- USD formatted price.
- KHR calculated and formatted price.

Formula:

`KHR = USD × exchangeRateKhrPerUsd`

Implementation requirements:
- Centralize calculation in the currency domain/service.
- Use a consistent decimal and rounding approach.
- Avoid repeated intermediate rounding.
- Validate the rate before production output.
- Unit-test normal and boundary cases.
- Do not add live exchange-rate fetching.

The exact rounding rule is `TBD`; do not implement an arbitrary production policy.

## 9. Zod Validation Rules

Validate:
- JSON syntax and required fields.
- Unique item and category IDs.
- Unique item and category slugs.
- Unique variant IDs within each item.
- Required localized Khmer text.
- English fallback warnings.
- Valid category references.
- Correct standard-price versus variant-price mode.
- Finite, non-negative USD prices.
- Valid availability booleans.
- Valid local image paths and asset existence.
- Valid exchange-rate configuration.
- Approved rounding policy.
- Required production branding fields.

The validator must return actionable errors identifying the file and record where possible. Warnings must be distinguishable from blocking errors.

## 10. Validation and Test Commands

The final command names are to be established during project setup, but the project must provide equivalent commands for:

- Data validation.
- TypeScript checks.
- Unit and component tests.
- Production build.

GitHub Actions must execute all required checks and stop deployment when a blocking check fails.

## 11. Acceptance Criteria

- Standard-price items are typed and validated.
- Variant-price items are typed and validated.
- Mixed or missing price modes fail validation.
- Invalid category references fail validation.
- Parent item unavailability overrides variant availability.
- Missing English menu text follows the fallback and warning rule.
- Invalid currency configuration blocks production validation.
- Invalid local image paths are reported.
- No database server is required.