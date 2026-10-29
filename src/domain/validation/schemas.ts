import { z } from 'zod';

export const LocalizedTextSchema = z.object({
  km: z.string().trim().min(1, 'Khmer text is required and cannot be empty'),
  en: z.string().optional(),
});

export const MenuVariantSchema = z.object({
  id: z.string().trim().min(1, 'Variant ID cannot be empty'),
  name: LocalizedTextSchema,
  available: z.boolean(),
  priceUsd: z.number().finite('Price must be a finite number').nonnegative('Price cannot be negative'),
});

export const MenuItemRawSchema = z.object({
  id: z.string().trim().min(1, 'Item ID cannot be empty'),
  slug: z.string().trim().min(1, 'Slug cannot be empty').regex(/^[a-z0-9-]+$/, 'Slug must be lower-case alphanumeric and dashes only'),
  name: LocalizedTextSchema,
  description: LocalizedTextSchema.optional(),
  categoryId: z.string().trim().min(1, 'Category ID cannot be empty'),
  images: z.array(z.string()),
  available: z.boolean(),
  featured: z.boolean().optional(),
  priceUsd: z.number().finite('Standard price must be finite').nonnegative('Standard price cannot be negative').optional(),
  variants: z.array(MenuVariantSchema).optional(),
});

export const MenuItemSchema = MenuItemRawSchema.superRefine((item, ctx) => {
  const hasStandardPrice = item.priceUsd !== undefined;
  const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;

  if (hasStandardPrice && hasVariants) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Item "${item.id}" defines both standard price and variants. Exactly one pricing mode is required.`,
      path: ['priceUsd'],
    });
  }

  if (!hasStandardPrice && !hasVariants) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Item "${item.id}" must define either a standard price (priceUsd) or a non-empty variants array.`,
      path: ['priceUsd'],
    });
  }

  if (hasVariants && item.variants) {
    const variantIds = new Set<string>();
    item.variants.forEach((v, index) => {
      if (variantIds.has(v.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate variant id "${v.id}" in item "${item.id}".`,
          path: ['variants', index, 'id'],
        });
      }
      variantIds.add(v.id);
    });
  }
});

export const MenuCategorySchema = z.object({
  id: z.string().trim().min(1, 'Category ID cannot be empty'),
  slug: z.string().trim().min(1, 'Category slug cannot be empty').regex(/^[a-z0-9-]+$/, 'Category slug must be lower-case alphanumeric and dashes only'),
  name: LocalizedTextSchema,
  sortOrder: z.number().finite('sortOrder must be finite'),
  active: z.boolean(),
});

export const SiteCurrencyConfigSchema = z.object({
  baseCurrency: z.literal('USD'),
  displayCurrencies: z.tuple([z.literal('USD'), z.literal('KHR')]),
  exchangeRateKhrPerUsd: z.number().finite().nullable(),
  roundingRule: z.string().nullable(),
});

export const SiteBrandingConfigSchema = z.object({
  restaurantName: z.string().nullable(),
  logoPath: z.string().nullable(),
  faviconPath: z.string().nullable(),
});

export const SiteConfigSchema = z.object({
  defaultLocale: z.literal('km'),
  supportedLocales: z.tuple([z.literal('km'), z.literal('en')]),
  currency: SiteCurrencyConfigSchema,
  branding: SiteBrandingConfigSchema,
});

export const ProductionSiteConfigSchema = SiteConfigSchema.superRefine((config, ctx) => {
  const rate = config.currency.exchangeRateKhrPerUsd;
  if (rate === null || typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Production configuration requires a finite, positive exchangeRateKhrPerUsd.',
      path: ['currency', 'exchangeRateKhrPerUsd'],
    });
  }

  const rounding = config.currency.roundingRule;
  if (!rounding || rounding.trim().length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Production configuration requires an approved roundingRule.',
      path: ['currency', 'roundingRule'],
    });
  }
});

