import {
  MenuItemSchema,
  MenuCategorySchema,
  SiteConfigSchema,
  ProductionSiteConfigSchema,
} from './schemas';
import type {
  MenuItem,
  MenuCategory,
  ValidationReport,
  ValidationIssue,
} from '../../types/menu';

export interface ValidateMenuDataOptions {
  isProduction?: boolean;
  assetExistenceChecker?: (path: string) => boolean;
}

export function validateMenuData(
  categories: unknown,
  items: unknown,
  siteConfig: unknown,
  options: ValidateMenuDataOptions = {}
): ValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // 1. Validate Site Config
  const configSchema = options.isProduction ? ProductionSiteConfigSchema : SiteConfigSchema;
  const configResult = configSchema.safeParse(siteConfig);
  if (!configResult.success) {
    configResult.error.issues.forEach((issue) => {
      errors.push({
        type: 'error',
        field: issue.path.join('.'),
        message: issue.message,
      });
    });
  }

  // 2. Validate Categories Array
  if (!Array.isArray(categories)) {
    errors.push({
      type: 'error',
      message: 'Categories data must be a JSON array',
    });
    return { isValid: false, errors, warnings };
  }

  const categoryIds = new Set<string>();
  const categorySlugs = new Set<string>();
  const validCategoryList: MenuCategory[] = [];

  categories.forEach((catRaw, index) => {
    const res = MenuCategorySchema.safeParse(catRaw);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        errors.push({
          type: 'error',
          recordId: (catRaw as Record<string, unknown>)?.id as string | undefined ?? `index-${index}`,
          field: `categories[${index}].${issue.path.join('.')}`,
          message: issue.message,
        });
      });
    } else {
      const cat = res.data;
      if (categoryIds.has(cat.id)) {
        errors.push({
          type: 'error',
          recordId: cat.id,
          field: `categories[${index}].id`,
          message: `Duplicate category ID: "${cat.id}"`,
        });
      }
      categoryIds.add(cat.id);

      if (categorySlugs.has(cat.slug)) {
        errors.push({
          type: 'error',
          recordId: cat.id,
          field: `categories[${index}].slug`,
          message: `Duplicate category slug: "${cat.slug}"`,
        });
      }
      categorySlugs.add(cat.slug);

      if (!cat.name.en || cat.name.en.trim() === '') {
        warnings.push({
          type: 'warning',
          recordId: cat.id,
          field: `categories[${index}].name.en`,
          message: `Category "${cat.id}" (${cat.name.km}) is missing English translation. Will fall back to Khmer.`,
        });
      }

      validCategoryList.push(cat);
    }
  });

  // 3. Validate Menu Items Array
  if (!Array.isArray(items)) {
    errors.push({
      type: 'error',
      message: 'Menu items data must be a JSON array',
    });
    return { isValid: false, errors, warnings };
  }

  const itemIds = new Set<string>();
  const itemSlugs = new Set<string>();

  items.forEach((itemRaw, index) => {
    const res = MenuItemSchema.safeParse(itemRaw);
    if (!res.success) {
      res.error.issues.forEach((issue) => {
        errors.push({
          type: 'error',
          recordId: (itemRaw as Record<string, unknown>)?.id as string | undefined ?? `index-${index}`,
          field: `items[${index}].${issue.path.join('.')}`,
          message: issue.message,
        });
      });
    } else {
      const item = res.data as MenuItem;

      if (itemIds.has(item.id)) {
        errors.push({
          type: 'error',
          recordId: item.id,
          field: `items[${index}].id`,
          message: `Duplicate item ID: "${item.id}"`,
        });
      }
      itemIds.add(item.id);

      if (itemSlugs.has(item.slug)) {
        errors.push({
          type: 'error',
          recordId: item.id,
          field: `items[${index}].slug`,
          message: `Duplicate item slug: "${item.slug}"`,
        });
      }
      itemSlugs.add(item.slug);

      // Verify category reference
      if (!categoryIds.has(item.categoryId)) {
        errors.push({
          type: 'error',
          recordId: item.id,
          field: `items[${index}].categoryId`,
          message: `Item "${item.id}" references non-existent categoryId "${item.categoryId}"`,
        });
      }

      // Check for missing optional English translations
      if (!item.name.en || item.name.en.trim() === '') {
        warnings.push({
          type: 'warning',
          recordId: item.id,
          field: `items[${index}].name.en`,
          message: `Item "${item.id}" (${item.name.km}) is missing English name. Will fall back to Khmer.`,
        });
      }

      if (item.description && (!item.description.en || item.description.en.trim() === '')) {
        warnings.push({
          type: 'warning',
          recordId: item.id,
          field: `items[${index}].description.en`,
          message: `Item "${item.id}" (${item.name.km}) is missing English description. Will fall back to Khmer.`,
        });
      }

      // Check variant English translations
      if (item.variants) {
        item.variants.forEach((v, vIndex) => {
          if (!v.name.en || v.name.en.trim() === '') {
            warnings.push({
              type: 'warning',
              recordId: item.id,
              field: `items[${index}].variants[${vIndex}].name.en`,
              message: `Variant "${v.id}" of item "${item.id}" is missing English name. Will fall back to Khmer.`,
            });
          }
        });
      }

      // Check local image asset existence if checker provided
      if (options.assetExistenceChecker && item.images && item.images.length > 0) {
        item.images.forEach((imgPath, imgIndex) => {
          if (!options.assetExistenceChecker!(imgPath)) {
            errors.push({
              type: 'error',
              recordId: item.id,
              field: `items[${index}].images[${imgIndex}]`,
              message: `Image asset path "${imgPath}" for item "${item.id}" does not exist on disk.`,
            });
          }
        });
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
