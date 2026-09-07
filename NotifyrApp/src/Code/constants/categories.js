// src/constants/categories.js
//
// Single source of truth for item categories. Add/remove/rename a category
// here and every screen (CategorySelection, Dashboard, ItemDetail) picks it up.
//
// NOTE: 'id' values MUST exactly match the backend's CATEGORIES enum in
// Notifyr_Backend/src/validators/itemValidators.js, or saving an item will
// fail validation.

export const CATEGORIES = [
  {
    id: 'laptop',
    name: 'Laptop',
    icon: 'laptop-outline',
  },
  {
    id: 'bag',
    name: 'Bag',
    icon: 'briefcase-outline',
  },
  {
    id: 'mobile',
    name: 'Mobile',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'keys',
    name: 'Keys',
    icon: 'key-outline',
  },
  {
    id: 'wallet',
    name: 'Wallet',
    icon: 'wallet-outline',
  },
  {
    id: 'bottle',
    name: 'Bottle',
    icon: 'water-outline',
  },
];

const FALLBACK_ICON = 'cube-outline';

export function getCategoryIcon(categoryId) {
  const match = CATEGORIES.find((c) => c.id === categoryId);
  return match ? match.icon : FALLBACK_ICON;
}

export function getCategoryName(categoryId) {
  const match = CATEGORIES.find((c) => c.id === categoryId);
  return match ? match.name : categoryId;
}