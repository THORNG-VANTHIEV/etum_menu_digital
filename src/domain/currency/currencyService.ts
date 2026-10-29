import type { MenuItem, SiteCurrencyConfig } from '../../types/menu';

export type RoundingPolicy = 'none' | 'round_to_100' | 'round_to_500' | 'round_to_1000';

export class CurrencyService {
  /**
   * Validates exchange rate configuration.
   * Returns isValid: false if rate is missing, <= 0, or not finite, or if rounding policy is missing.
   */
  public static validateConfig(config?: Partial<SiteCurrencyConfig> | null): {
    isValid: boolean;
    error?: string;
  } {
    if (!config) {
      return { isValid: false, error: 'Currency configuration is missing' };
    }
    const rate = config.exchangeRateKhrPerUsd;
    if (rate === null || rate === undefined) {
      return { isValid: false, error: 'Exchange rate is unconfigured (TBD)' };
    }
    if (typeof rate !== 'number' || !Number.isFinite(rate)) {
      return { isValid: false, error: 'Exchange rate must be a finite number' };
    }
    if (rate <= 0) {
      return { isValid: false, error: 'Exchange rate must be greater than zero' };
    }
    if (!config.roundingRule || config.roundingRule.trim() === '') {
      return { isValid: false, error: 'Rounding rule is unconfigured (TBD)' };
    }
    return { isValid: true };
  }

  /**
   * Formats a USD amount according to standard currency presentation ($X.XX)
   */
  public static formatUsd(amount: number): string {
    if (!Number.isFinite(amount) || amount < 0) {
      return '$0.00';
    }
    return `$${amount.toFixed(2)}`;
  }

  /**
   * Calculates KHR equivalent from USD using configured exchange rate and rounding rule.
   * Returns null if rate or rounding policy is invalid/unconfigured.
   */
  public static calculateKhr(
    priceUsd: number,
    exchangeRateKhrPerUsd?: number | null,
    roundingRule?: string | null
  ): number | null {
    if (!Number.isFinite(priceUsd) || priceUsd < 0) {
      return null;
    }
    if (
      exchangeRateKhrPerUsd === null ||
      exchangeRateKhrPerUsd === undefined ||
      !Number.isFinite(exchangeRateKhrPerUsd) ||
      exchangeRateKhrPerUsd <= 0
    ) {
      return null;
    }

    const rawKhr = priceUsd * exchangeRateKhrPerUsd;

    switch (roundingRule) {
      case 'round_to_100':
        return Math.round(rawKhr / 100) * 100;
      case 'round_to_500':
        return Math.round(rawKhr / 500) * 500;
      case 'round_to_1000':
        return Math.round(rawKhr / 1000) * 1000;
      case 'none':
        return Math.round(rawKhr);
      default:
        // When rounding policy is not approved/specified, do not guess
        return null;
    }
  }

  /**
   * Formats KHR amount with Khmer Riel symbol (៛) and comma grouping.
   * e.g. 10250 -> "៛10,300"
   */
  public static formatKhr(amountKhr: number | null): string | null {
    if (amountKhr === null || !Number.isFinite(amountKhr)) {
      return null;
    }
    return `៛${Math.round(amountKhr).toLocaleString('en-US')}`;
  }

  /**
   * Formats dual currency display: "$2.50 · ៛10,300".
   * If KHR calculation is not available or configuration is invalid, returns "$2.50"
   * without fabricating an unapproved rate or price.
   */
  public static formatDualPrice(
    priceUsd: number,
    exchangeRateKhrPerUsd?: number | null,
    roundingRule?: string | null
  ): { usd: string; khr: string | null; formatted: string } {
    const usd = this.formatUsd(priceUsd);
    const khrVal = this.calculateKhr(priceUsd, exchangeRateKhrPerUsd, roundingRule);
    const khr = this.formatKhr(khrVal);

    const formatted = khr ? `${usd} · ${khr}` : usd;
    return { usd, khr, formatted };
  }

  /**
   * Formats the price shown on an item card: the standard price, or the lowest
   * variant price flagged as a starting price ("From ...") for variant items.
   * Returns null when the item has no price to show.
   */
  public static formatItemPrice(
    item: Pick<MenuItem, 'priceUsd' | 'variants'>,
    currencyConfig?: Partial<SiteCurrencyConfig> | null
  ): { formatted: string; isStartingPrice: boolean } | null {
    const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
    const priceUsd = hasVariants
      ? Math.min(...item.variants!.map((variant) => variant.priceUsd))
      : item.priceUsd;
    if (priceUsd === undefined) {
      return null;
    }
    const { formatted } = this.formatDualPrice(
      priceUsd,
      currencyConfig?.exchangeRateKhrPerUsd,
      currencyConfig?.roundingRule
    );
    return { formatted, isStartingPrice: hasVariants };
  }
}

