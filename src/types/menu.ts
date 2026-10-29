export type Locale = 'km' | 'en';

export interface LocalizedText {
  km: string;
  en?: string;
}

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

export interface MenuCategory {
  id: string;
  slug: string;
  name: LocalizedText;
  sortOrder: number;
  active: boolean;
}

export interface SiteCurrencyConfig {
  baseCurrency: 'USD';
  displayCurrencies: ['USD', 'KHR'];
  exchangeRateKhrPerUsd: number | null;
  roundingRule: string | null;
}

export interface SiteBrandingConfig {
  restaurantName: string | null;
  logoPath: string | null;
  faviconPath: string | null;
}

export interface SiteConfig {
  defaultLocale: 'km';
  supportedLocales: ['km', 'en'];
  currency: SiteCurrencyConfig;
  branding: SiteBrandingConfig;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  field?: string;
  message: string;
  recordId?: string;
}

export interface ValidationReport {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}
