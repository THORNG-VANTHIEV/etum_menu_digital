import { describe, it, expect } from 'vitest';
import { filterMenuItems } from '../src/features/menu-search/searchUtils';
import menuItemsData from '../src/data/menu-items.json';
import type { MenuItem } from '../src/types/menu';

describe('T05 & T06 — Menu Category Filtering & Search', () => {
  const items = menuItemsData as MenuItem[];

  it('returns all items when category is "all" and search is empty', () => {
    const res = filterMenuItems(items, { category: 'all', searchTerm: '' });
    expect(res.length).toBe(items.length);
  });

  it('filters items by specific category', () => {
    const steamedItems = filterMenuItems(items, { category: 'cat-steamed-spices', searchTerm: '' });
    expect(steamedItems.length).toBeGreaterThan(0);
    expect(steamedItems.every((item) => item.categoryId === 'cat-steamed-spices')).toBe(true);
  });

  it('searches items in Khmer', () => {
    // Search "លៀស" (Clams)
    const results = filterMenuItems(items, { category: 'all', searchTerm: 'លៀស', locale: 'km' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((i) => i.id === 'item-leas-aob')).toBe(true);
  });

  it('searches items in English', () => {
    // Search "Clams" matches Steamed Clams with Spices and Steamed White Clams
    const results = filterMenuItems(items, { category: 'all', searchTerm: 'clams', locale: 'en' });
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.some((i) => i.id === 'item-leas-aob')).toBe(true);
  });

  it('composes category filter and search term correctly', () => {
    // Category cat-steamed-spices with search "លៀសស"
    const res = filterMenuItems(items, { category: 'cat-steamed-spices', searchTerm: 'លៀសស' });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('item-leas-sor-aob');

    // Searching "បង្កង" (river prawns) in cat-steamed-spices should return 0 items
    const emptyRes = filterMenuItems(items, { category: 'cat-steamed-spices', searchTerm: 'បង្កង' });
    expect(emptyRes.length).toBe(0);
  });

  it('returns empty array when search query matches nothing', () => {
    const res = filterMenuItems(items, { category: 'all', searchTerm: 'xyz-no-such-food-123' });
    expect(res.length).toBe(0);
  });
});
