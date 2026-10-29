import categoriesData from '../data/categories.json';
import menuItemsData from '../data/menu-items.json';
import siteConfigData from '../data/site-config.json';
import { MenuCategorySchema, MenuItemSchema, SiteConfigSchema } from '../domain/validation/schemas';
import type { MenuCategory, MenuItem, SiteConfig } from '../types/menu';

export class DataService {
  private static cachedCategories: MenuCategory[] | null = null;
  private static cachedMenuItems: MenuItem[] | null = null;
  private static cachedSiteConfig: SiteConfig | null = null;

  public static getCategories(includeInactive = false): MenuCategory[] {
    if (!this.cachedCategories) {
      const parsed = categoriesData.map((cat) => MenuCategorySchema.parse(cat));
      this.cachedCategories = parsed;
    }
    const list = includeInactive
      ? this.cachedCategories
      : this.cachedCategories.filter((c) => c.active);

    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  public static getCategoryById(id: string): MenuCategory | undefined {
    return this.getCategories(true).find((c) => c.id === id);
  }

  public static getCategoryBySlug(slug: string): MenuCategory | undefined {
    return this.getCategories(true).find((c) => c.slug === slug);
  }

  public static getMenuItems(): MenuItem[] {
    if (!this.cachedMenuItems) {
      const parsed = menuItemsData.map((item) => MenuItemSchema.parse(item));
      this.cachedMenuItems = parsed;
    }
    return this.cachedMenuItems;
  }

  public static getMenuItemBySlug(slug: string): MenuItem | undefined {
    return this.getMenuItems().find((item) => item.slug === slug);
  }

  public static getFeaturedMenuItems(): MenuItem[] {
    return this.getMenuItems().filter((item) => item.featured);
  }

  public static getMenuItemsByCategory(categoryId: string): MenuItem[] {
    if (categoryId === 'all' || !categoryId) {
      return this.getMenuItems();
    }
    return this.getMenuItems().filter((item) => item.categoryId === categoryId);
  }

  public static getSiteConfig(): SiteConfig {
    if (!this.cachedSiteConfig) {
      this.cachedSiteConfig = SiteConfigSchema.parse(siteConfigData) as SiteConfig;
    }
    return this.cachedSiteConfig;
  }
}
