export const uiTranslations = {
  appName: {
    km: 'អ៊ីទុំ លៀសអប់សៀមរាប',
    en: 'E-tum LeasAob Siem Reap',
  },
  appTagline: {
    km: 'Cafe & Restaurant',
    en: 'Cafe & Restaurant',
  },
  home: {
    km: 'ទំព័រដើម',
    en: 'Home',
  },
  menu: {
    km: 'បញ្ជីមុខម្ហូប',
    en: 'Menu',
  },
  welcomeBadge: {
    km: 'សូមស្វាគមន៍',
    en: 'Welcome',
  },
  heroTitle: {
    km: 'រសជាតិពិតនៃម្ហូប និងភេសជ្ជៈខ្មែរ',
    en: 'Authentic Taste of Khmer Cuisine & Drinks',
  },
  heroSubtitle: {
    km: 'ម្ហូបខ្មែរឈ្ងុយឆ្ងាញ់ កាហ្វេស្រស់ និងភេសជ្ជៈសម្រិតសម្រាំងយ៉ាងយកចិត្តទុកដាក់នៅខេត្តសៀមរាប។',
    en: 'Delicious Khmer food, freshly brewed coffee, and craft beverages prepared with care in Siem Reap.',
  },
  viewFullMenu: {
    km: 'មើលបញ្ជីមុខម្ហូបទាំងអស់',
    en: 'View Full Menu',
  },
  featuredItems: {
    km: 'មុខម្ហូបប្រចាំហាង',
    en: 'Featured Items',
  },
  featuredSubtitle: {
    km: 'មុខម្ហូប និងភេសជ្ជៈពិសេសដែលទទួលបានការពេញនិយម',
    en: 'Special selections loved by our valued guests',
  },
  viewAll: {
    km: 'មើលទាំងអស់',
    en: 'View All',
  },
  searchPlaceholder: {
    km: 'ស្វែងរកឈ្មោះមុខម្ហូប...',
    en: 'Search menu items...',
  },
  searchLabel: {
    km: 'ស្វែងរកមុខម្ហូប',
    en: 'Search menu items',
  },
  allCategories: {
    km: 'ទាំងអស់',
    en: 'All',
  },
  noItemsFound: {
    km: 'រកមិនឃើញមុខម្ហូបទេ',
    en: 'No items found',
  },
  noItemsFoundDesc: {
    km: 'ពុំមានមុខម្ហូបដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរក ឬប្រភេទដែលបានជ្រើសរើសឡើយ។',
    en: 'No dishes or drinks match your current search terms or category filter.',
  },
  resetFilters: {
    km: 'កំណត់ការស្វែងរកឡើងវិញ',
    en: 'Reset Filters',
  },
  soldOut: {
    km: 'អស់ពីស្តុក',
    en: 'Sold Out',
  },
  unavailable: {
    km: 'អស់ពីស្តុក / Unavailable',
    en: 'Currently Unavailable',
  },
  inStock: {
    km: 'មានក្នុងស្តុកស្រាប់',
    en: 'In Stock & Available',
  },
  itemUnavailableBanner: {
    km: '⚠️ មុខម្ហូបនេះអស់ពីស្តុកបណ្តោះអាសន្ន',
    en: '⚠️ This item is temporarily out of stock',
  },
  variantUnavailableBanner: {
    km: '⚠️ មុខម្ហូបនេះអស់ពីស្តុកហើយ',
    en: '⚠️ Currently unavailable',
  },
  viewDetails: {
    km: 'មើលលម្អិត',
    en: 'View Details',
  },
  fromPrice: {
    km: 'ចាប់ពី',
    en: 'From',
  },
  hasVariants: {
    km: 'មានជម្រើសទំហំ',
    en: 'Sizes available',
  },
  selectSize: {
    km: 'ជ្រើសរើសទំហំ:',
    en: 'Select Size:',
  },
  totalPrice: {
    km: 'តម្លៃសរុប:',
    en: 'Total Price:',
  },
  sizeSoldOut: {
    km: 'ទំហំនេះអស់',
    en: 'Size Sold Out',
  },
  pageNotFoundTitle: {
    km: 'រកមិនឃើញទំព័រនេះទេ',
    en: 'Page Not Found',
  },
  pageNotFoundMessage: {
    km: 'ទំព័រ ឬមុខម្ហូបដែលលោកអ្នកកំពុងស្វែងរកមិនមានឡើយ ឬត្រូវបានផ្លាស់ប្តូរទីតាំង។',
    en: 'The page or menu item you are looking for does not exist or has been moved.',
  },
  backToMenu: {
    km: 'ត្រឡប់ទៅកាន់បញ្ជីមុខម្ហូប',
    en: 'Back to Menu',
  },
  backToHome: {
    km: 'ទំព័រដើម',
    en: 'Home',
  },
  footerDescription: {
    km: 'ម្ហូបខ្មែរឆ្ងាញ់ពិសា និងភេសជ្ជៈស្រស់ថ្លា • ក្រុងសៀមរាប',
    en: 'Authentic Khmer food & refreshing beverages • Siem Reap',
  },
  digitalMenuCopyright: {
    km: 'ម៉ឺនុយឌីជីថល',
    en: 'Digital Menu',
  },
} as const;

export type TranslationKey = keyof typeof uiTranslations;

