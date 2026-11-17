export type MenuCategory = 'All' | 'Crown Crust' | 'Wood-Fired' | 'Chicken & Grill';

export type PizzaSize = 'Medium 10"' | 'Large 13"' | 'Royal 16"';

export type CrustOption =
  | 'Cheese-Stuffed Crown'
  | 'Kebab-Stuffed Crown'
  | 'Classic Wood-Fired';

export interface PizzaItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'All'>;
  description: string;
  ingredients: string;
  basePrice: number; // Editable Medium 10" price in PKR
  image: string;
  featuredInSignature?: boolean;
  isHouseFavorite?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Bold';
  prepMinutes: number;
}

export interface ExtraTopping {
  id: string;
  name: string;
  price: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  eta: string;
  fee: number;
  minOrder: number;
  landmark: string;
}

export interface VerifiedReview {
  id: string;
  author: string;
  location: string;
  dishOrdered: string;
  rating: number;
  comment: string;
  dateLabel: string;
}

/**
 * CENTRAL BUSINESS CONFIGURATION
 * Update all unverified placeholder values below before production launch.
 */
export const RESTAURANT_CONFIG = {
  brandName: 'Crown Crust Pizza',
  shortBrand: 'CROWN CRUST',
  tagline: 'Crafted to Perfection',
  motto: 'Made With Passion. Served With Pride',
  cityRegion: 'Hassan Abdal, Pakistan',

  contact: {
    // Replace with verified WhatsApp number in international E.164 digits only (no "+", spaces, or dashes), e.g. "923001234567"
    whatsappNumber: '923000000000',
    isWhatsAppVerified: false,

    // Replace with verified restaurant phone number
    phoneDisplay: 'Phone number pending verification',
    phoneTel: '',
    isPhoneVerified: false,

    // Replace with verified street address
    address: 'Street address pending verification · Hassan Abdal, Pakistan',
    isAddressVerified: false,

    // Replace with verified opening hours
    openingHours: 'Opening hours pending verification',
    isHoursVerified: false,
  },

  media: {
    introVideoSrc:
      '/assets/aistudio/Crown_Crust_Pizza_commercial_34d11dbb__1__6b95f391.mp4',
    heroFlamesImage:
      '/src/assets/images/hero_woodfire_flames_1794855805731.jpg',
    signatureHeroImage:
      '/src/assets/images/signature_cheese_pull_pizza_1794855806218.jpg',
  },

  pricing: {
    currencyCode: 'PKR',
    // Editable pricing rules — verify against final printed restaurant menu
    isMenuPricingVerified: false,
    sizeMultiplier: {
      'Medium 10"': 1,
      'Large 13"': 1.38,
      'Royal 16"': 1.75,
    } as Record<PizzaSize, number>,
    crustSurcharge: {
      'Classic Wood-Fired': 0,
      'Cheese-Stuffed Crown': 320,
      'Kebab-Stuffed Crown': 450,
    } as Record<CrustOption, number>,
    extraToppings: [
      { id: 'extra-mozzarella', name: 'Buffalo Mozzarella Pull', price: 240 },
      { id: 'jalapenos-olives', name: 'Charred Jalapeños & Black Olives', price: 160 },
      { id: 'garlic-herb-dip', name: 'Roasted Garlic Herb Dip (2x)', price: 140 },
      { id: 'smoked-pepperoni', name: 'Crisp Beef Pepperoni', price: 310 },
    ] as readonly ExtraTopping[],
  },

  // Editable delivery zone placeholders — verify coverage, fees, and minimums
  isDeliveryConfigVerified: false,
  deliveryZones: [
    {
      id: 'hassan-abdal',
      name: 'Hassan Abdal City',
      eta: 'Est. 25–35 min',
      fee: 0,
      minOrder: 1200,
      landmark: 'Central Hassan Abdal coverage (confirm exact radius)',
    },
    {
      id: 'nearby-corridor',
      name: 'Surrounding Areas',
      eta: 'Est. 35–45 min',
      fee: 200,
      minOrder: 1800,
      landmark: 'Extended delivery zone (confirm availability via WhatsApp)',
    },
  ] as DeliveryZone[],

  // Supply genuine verified customer reviews only. Leave empty until verified reviews exist.
  verifiedReviews: [] as VerifiedReview[],
} as const;

export const MENU_ITEMS: PizzaItem[] = [
  {
    id: 'royal-crown-pepperoni',
    name: 'Royal Crown Pepperoni',
    category: 'Crown Crust',
    description:
      'Braided cheese-stuffed crown rim framing crispy cupped beef pepperoni, aged mozzarella, and oregano.',
    ingredients: 'Beef Pepperoni · Mozzarella Crown · San Marzano Sauce · Wild Oregano',
    basePrice: 1850,
    image: '/src/assets/images/pizza_royal_pepperoni_1794855805877.jpg',
    featuredInSignature: true,
    isHouseFavorite: true,
    spiceLevel: 'Medium',
    prepMinutes: 18,
  },
  {
    id: 'smoky-tikka-crown',
    name: 'Smoky Tikka Crown Crust',
    category: 'Chicken & Grill',
    description:
      'Sesame-brushed pocket crust bursting with cheddar-mozzarella around charcoal-grilled tikka chicken and sweet red peppers.',
    ingredients: 'Charcoal Chicken Tikka · Sesame Cheese Pockets · Red Onion · Cilantro',
    basePrice: 1950,
    image: '/src/assets/images/pizza_bbq_malai_tikka_1794855806448.jpg',
    featuredInSignature: true,
    isHouseFavorite: true,
    spiceLevel: 'Bold',
    prepMinutes: 20,
  },
  {
    id: 'neapolitan-margherita',
    name: 'Wood-Fired Margherita',
    category: 'Wood-Fired',
    description:
      'Blistered 48-hour sourdough crust baked in a brick oven with crushed plum tomatoes, fresh mozzarella, and sweet basil.',
    ingredients: 'Fresh Mozzarella · Crushed Tomatoes · Fresh Basil · Olive Oil',
    basePrice: 1550,
    image: '/src/assets/images/pizza_truffle_margherita_1794855806006.jpg',
    featuredInSignature: true,
    spiceLevel: 'Mild',
    prepMinutes: 14,
  },
  {
    id: 'quattro-formaggi-truffle',
    name: 'Quattro Formaggi & Wild Mushroom',
    category: 'Crown Crust',
    description:
      'Four-cheese melt with roasted forest mushrooms, fresh thyme, cracked black pepper, and golden stuffed crust pockets.',
    ingredients: 'Cheddar · Mozzarella · Parmesan · Wild Mushrooms · Thyme',
    basePrice: 2050,
    image: '/src/assets/images/pizza_four_cheese_crown_1794855809072.jpg',
    featuredInSignature: true,
    spiceLevel: 'Mild',
    prepMinutes: 18,
  },
  {
    id: 'obsidian-cheese-pull',
    name: 'One-Bite Heritage Cheese Pull',
    category: 'Wood-Fired',
    description:
      'Signature extra-stretch mozzarella blend over slow-simmered garlic marinara, cherry tomatoes, and fresh basil.',
    ingredients: 'Double Mozzarella · Roasted Cherry Tomatoes · Marinara Dip · Basil',
    basePrice: 1750,
    image: '/src/assets/images/signature_cheese_pull_pizza_1794855806218.jpg',
    featuredInSignature: false,
    spiceLevel: 'Mild',
    prepMinutes: 16,
  },
  {
    id: 'mughlai-malai-crown',
    name: 'Malai Boti & Herb Crown',
    category: 'Chicken & Grill',
    description:
      'Cream-marinated char-grilled chicken malai boti over white garlic sauce, green chilies, and golden cheese-stuffed crown pockets.',
    ingredients: 'Malai Chicken · White Garlic Cream · Green Chilies · Cheese Crown',
    basePrice: 2100,
    image: '/src/assets/images/pizza_malai_boti_crown_1794857744331.jpg',
    featuredInSignature: false,
    spiceLevel: 'Medium',
    prepMinutes: 20,
  },
];

export function getDefaultCrustForPizza(pizza: PizzaItem): CrustOption {
  return pizza.category === 'Crown Crust' || pizza.category === 'Chicken & Grill'
    ? 'Cheese-Stuffed Crown'
    : 'Classic Wood-Fired';
}

export function calculatePizzaUnitPrice(
  basePrice: number,
  size: PizzaSize,
  crust: CrustOption,
  extraIds: string[] = []
): number {
  const sizePrice = Math.round(basePrice * RESTAURANT_CONFIG.pricing.sizeMultiplier[size]);
  const crustPrice = RESTAURANT_CONFIG.pricing.crustSurcharge[crust];
  const extrasTotal = extraIds.reduce((sum, id) => {
    const found = RESTAURANT_CONFIG.pricing.extraToppings.find((t) => t.id === id);
    return sum + (found ? found.price : 0);
  }, 0);
  return sizePrice + crustPrice + extrasTotal;
}

export function formatCurrency(amount: number): string {
  return `${RESTAURANT_CONFIG.pricing.currencyCode} ${Math.round(amount).toLocaleString('en-PK')}`;
}
