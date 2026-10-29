import type { MenuItem, Locale } from '../../types/menu';

export function filterMenuItems(
  items: MenuItem[],
  options: {
    category?: string;
    searchTerm?: string;
    locale?: Locale;
  }
): MenuItem[] {
  const { category = 'all', searchTerm = '', locale = 'km' } = options;
  const normalizedQuery = searchTerm.trim().toLowerCase();

  return items.filter((item) => {
    // 1. Category check
    if (category !== 'all' && item.categoryId !== category) {
      return false;
    }

    // 2. Search check
    if (normalizedQuery === '') {
      return true;
    }

    // Name matching
    const primaryName = (locale === 'en' && item.name.en ? item.name.en : item.name.km).toLowerCase();
    const secondaryName = (locale === 'en' ? item.name.km : item.name.en || '').toLowerCase();

    if (primaryName.includes(normalizedQuery) || secondaryName.includes(normalizedQuery)) {
      return true;
    }

    // Description matching
    const descKm = item.description?.km?.toLowerCase() || '';
    const descEn = item.description?.en?.toLowerCase() || '';
    if (descKm.includes(normalizedQuery) || descEn.includes(normalizedQuery)) {
      return true;
    }

    return false;
  });
}
