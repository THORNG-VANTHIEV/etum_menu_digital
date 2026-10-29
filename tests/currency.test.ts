import { describe, it, expect } from 'vitest';
import { CurrencyService } from '../src/domain/currency/currencyService';

describe('T07 — Currency Service', () => {
  describe('validateConfig', () => {
    it('fails when config is missing or rate is null', () => {
      expect(CurrencyService.validateConfig(null).isValid).toBe(false);
      expect(CurrencyService.validateConfig({ exchangeRateKhrPerUsd: null }).isValid).toBe(false);
    });

    it('fails when rate is zero or negative', () => {
      expect(CurrencyService.validateConfig({ exchangeRateKhrPerUsd: 0, roundingRule: 'none' }).isValid).toBe(false);
      expect(CurrencyService.validateConfig({ exchangeRateKhrPerUsd: -4100, roundingRule: 'none' }).isValid).toBe(false);
    });

    it('fails when rate is not finite', () => {
      expect(CurrencyService.validateConfig({ exchangeRateKhrPerUsd: Infinity, roundingRule: 'none' }).isValid).toBe(false);
      expect(CurrencyService.validateConfig({ exchangeRateKhrPerUsd: NaN, roundingRule: 'none' }).isValid).toBe(false);
    });

    it('fails when rounding rule is missing or empty', () => {
      expect(CurrencyService.validateConfig({ exchangeRateKhrPerUsd: 4100, roundingRule: null }).isValid).toBe(false);
      expect(CurrencyService.validateConfig({ exchangeRateKhrPerUsd: 4100, roundingRule: '   ' }).isValid).toBe(false);
    });

    it('passes when valid rate and approved rounding rule exist', () => {
      const res = CurrencyService.validateConfig({
        exchangeRateKhrPerUsd: 4100,
        roundingRule: 'round_to_100',
      });
      expect(res.isValid).toBe(true);
    });
  });

  describe('calculateKhr & rounding', () => {
    it('calculates exact conversion with round_to_100', () => {
      // $2.50 * 4100 = 10250 -> rounded to 100 = 10300
      const khr = CurrencyService.calculateKhr(2.5, 4100, 'round_to_100');
      expect(khr).toBe(10300);
    });

    it('calculates conversion with round_to_500', () => {
      // $2.50 * 4100 = 10250 -> rounded to 500 = 10500
      const khr = CurrencyService.calculateKhr(2.5, 4100, 'round_to_500');
      expect(khr).toBe(10500);
    });

    it('returns null if rate is null or unapproved rounding rule', () => {
      expect(CurrencyService.calculateKhr(2.5, null, 'round_to_100')).toBeNull();
      expect(CurrencyService.calculateKhr(2.5, 4100, null)).toBeNull();
      expect(CurrencyService.calculateKhr(2.5, 4100, 'unknown_policy')).toBeNull();
    });

    it('handles zero USD properly', () => {
      expect(CurrencyService.calculateKhr(0, 4100, 'round_to_100')).toBe(0);
      expect(CurrencyService.formatUsd(0)).toBe('$0.00');
    });
  });

  describe('formatDualPrice', () => {
    it('returns dual formatted string when rate and rounding are valid', () => {
      const result = CurrencyService.formatDualPrice(2.5, 4100, 'round_to_100');
      expect(result.usd).toBe('$2.50');
      expect(result.khr).toBe('៛10,300');
      expect(result.formatted).toBe('$2.50 · ៛10,300');
    });

    it('does NOT fabricate KHR price when rate is null or invalid', () => {
      const result = CurrencyService.formatDualPrice(2.5, null, null);
      expect(result.usd).toBe('$2.50');
      expect(result.khr).toBeNull();
      expect(result.formatted).toBe('$2.50');
    });
  });
});

