import { describe, it, expect } from 'vitest';
import { validateMenuData } from '../src/domain/validation/validate';
import { MenuItemSchema, ProductionSiteConfigSchema } from '../src/domain/validation/schemas';
import categoriesData from '../src/data/categories.json';
import menuItemsData from '../src/data/menu-items.json';
import siteConfigData from '../src/data/site-config.json';

describe('T02 — Data Schema and Validation', () => {
  const validCategories = categoriesData;
  const validSiteConfig = siteConfigData;

  it('passes validation for valid standard-price items', () => {
    const item = {
      id: 'test-std',
      slug: 'test-std',
      name: { km: 'តែបៃតង', en: 'Green Tea' },
      categoryId: 'cat-tea',
      images: [],
      available: true,
      priceUsd: 2.5,
    };
    const res = MenuItemSchema.safeParse(item);
    expect(res.success).toBe(true);
  });

  it('passes validation for valid variant-price items', () => {
    const item = {
      id: 'test-var',
      slug: 'test-var',
      name: { km: 'តែបៃតង', en: 'Green Tea' },
      categoryId: 'cat-tea',
      images: [],
      available: true,
      variants: [
        { id: 'sm', name: { km: 'តូច', en: 'Small' }, available: true, priceUsd: 2.0 },
        { id: 'lg', name: { km: 'ធំ', en: 'Large' }, available: false, priceUsd: 3.0 },
      ],
    };
    const res = MenuItemSchema.safeParse(item);
    expect(res.success).toBe(true);
  });

  it('rejects items that define both standard price and variants', () => {
    const item = {
      id: 'test-mixed',
      slug: 'test-mixed',
      name: { km: 'តែបៃតង' },
      categoryId: 'cat-tea',
      images: [],
      available: true,
      priceUsd: 2.5,
      variants: [
        { id: 'sm', name: { km: 'តូច' }, available: true, priceUsd: 2.0 },
      ],
    };
    const res = MenuItemSchema.safeParse(item);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain('defines both standard price and variants');
    }
  });

  it('rejects items that define neither standard price nor variants', () => {
    const item = {
      id: 'test-none',
      slug: 'test-none',
      name: { km: 'តែបៃតង' },
      categoryId: 'cat-tea',
      images: [],
      available: true,
    };
    const res = MenuItemSchema.safeParse(item);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain('must define either a standard price');
    }
  });

  it('rejects duplicate variant IDs within the same item', () => {
    const item = {
      id: 'test-dup-variant',
      slug: 'test-dup-variant',
      name: { km: 'កាហ្វេ' },
      categoryId: 'cat-coffee',
      images: [],
      available: true,
      variants: [
        { id: 'sm', name: { km: 'តូច' }, available: true, priceUsd: 2.0 },
        { id: 'sm', name: { km: 'តូច' }, available: true, priceUsd: 3.0 },
      ],
    };
    const res = MenuItemSchema.safeParse(item);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain('Duplicate variant id');
    }
  });

  it('rejects duplicate category IDs or duplicate category slugs', () => {
    const duplicateCategories = [
      { id: 'cat-1', slug: 'cat-one', name: { km: 'ប្រភេទ ១' }, sortOrder: 1, active: true },
      { id: 'cat-1', slug: 'cat-two', name: { km: 'ប្រភេទ ២' }, sortOrder: 2, active: true },
    ];
    const report = validateMenuData(duplicateCategories, [], validSiteConfig);
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.message.includes('Duplicate category ID'))).toBe(true);
  });

  it('rejects duplicate item IDs or duplicate item slugs', () => {
    const duplicateItems = [
      { id: 'item-1', slug: 'item-slug', name: { km: 'មួយ' }, categoryId: 'cat-coffee', images: [], available: true, priceUsd: 2 },
      { id: 'item-1', slug: 'other-slug', name: { km: 'ពីរ' }, categoryId: 'cat-coffee', images: [], available: true, priceUsd: 3 },
    ];
    const report = validateMenuData(validCategories, duplicateItems, validSiteConfig);
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.message.includes('Duplicate item ID'))).toBe(true);
  });

  it('rejects items referencing non-existent categoryId', () => {
    const invalidCategoryItem = [
      { id: 'item-1', slug: 'item-1', name: { km: 'មួយ' }, categoryId: 'cat-nonexistent', images: [], available: true, priceUsd: 2 },
    ];
    const report = validateMenuData(validCategories, invalidCategoryItem, validSiteConfig);
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.message.includes('references non-existent categoryId'))).toBe(true);
  });

  it('warns when English translation is missing and falls back to Khmer', () => {
    const itemWithoutEnglish = [
      { id: 'item-no-en', slug: 'no-en', name: { km: 'ឈ្មោះខ្មែរ' }, categoryId: 'cat-coffee', images: [], available: true, priceUsd: 2.0 },
    ];
    const report = validateMenuData(validCategories, itemWithoutEnglish, validSiteConfig);
    expect(report.isValid).toBe(true);
    expect(report.warnings.some((w) => w.message.includes('missing English name'))).toBe(true);
  });

  it('blocks production validation if exchange rate is missing, non-positive, or non-finite', () => {
    const configWithNullRate = {
      ...siteConfigData,
      currency: {
        baseCurrency: 'USD' as const,
        displayCurrencies: ['USD' as const, 'KHR' as const],
        exchangeRateKhrPerUsd: null,
        roundingRule: null,
      },
    };
    const prodRes = ProductionSiteConfigSchema.safeParse(configWithNullRate);
    expect(prodRes.success).toBe(false);

    const report = validateMenuData(validCategories, menuItemsData, configWithNullRate, { isProduction: true });
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.message.includes('exchangeRateKhrPerUsd'))).toBe(true);
  });

  it('reports missing or invalid local asset paths when asset checker is supplied', () => {
    const itemWithMissingAsset = [
      {
        id: 'item-bad-asset',
        slug: 'bad-asset',
        name: { km: 'តេស្ត' },
        categoryId: 'cat-coffee',
        images: ['/images/menu/non-existent-image.png'],
        available: true,
        priceUsd: 2.0,
      },
    ];
    const report = validateMenuData(validCategories, itemWithMissingAsset, validSiteConfig, {
      assetExistenceChecker: () => false,
    });
    expect(report.isValid).toBe(false);
    expect(report.errors.some((e) => e.message.includes('does not exist on disk'))).toBe(true);
  });

  it('passes development validation for current project data files', () => {
    const report = validateMenuData(categoriesData, menuItemsData, siteConfigData);
    expect(report.isValid).toBe(true);
    // Warnings are expected for items without English translations
    expect(report.warnings.length).toBeGreaterThan(0);
  });
});
