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
    const coffeeItems = filterMenuItems(items, { category: 'cat-coffee', searchTerm: '' });
    expect(coffeeItems.length).toBeGreaterThan(0);
    expect(coffeeItems.every((item) => item.categoryId === 'cat-coffee')).toBe(true);
  });

  it('searches items in Khmer', () => {
    // Search "កាហ្វេ" (Coffee)
    const results = filterMenuItems(items, { category: 'all', searchTerm: 'កាហ្វេ', locale: 'km' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((i) => i.id === 'item-espresso')).toBe(true);
  });

  it('searches items in English', () => {
    // Search "Espresso" matches item-espresso (name) and item-iced-latte (description)
    const results = filterMenuItems(items, { category: 'all', searchTerm: 'espresso', locale: 'en' });
    expect(results.length).toBe(2);
    expect(results.some((i) => i.id === 'item-espresso')).toBe(true);
  });

  it('composes category filter and search term correctly', () => {
    // Category cat-food with search "Croissant"
    const res = filterMenuItems(items, { category: 'cat-food', searchTerm: 'croissant' });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('item-croissant');

    // Searching "espresso" in cat-food should return 0 items
    const emptyRes = filterMenuItems(items, { category: 'cat-food', searchTerm: 'espresso' });
    expect(emptyRes.length).toBe(0);
  });

  it('returns empty array when search query matches nothing', () => {
    const res = filterMenuItems(items, { category: 'all', searchTerm: 'xyz-no-such-food-123' });
    expect(res.length).toBe(0);
  });
});
