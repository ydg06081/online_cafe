export type MenuCategory = 'coffee' | 'non_coffee' | 'dessert';

export type MenuId =
  | 'americano'
  | 'latte'
  | 'mocha'
  | 'matcha_latte'
  | 'strawberry_milk'
  | 'croissant'
  | 'cheesecake'
  | 'cookie';

export interface Menu {
  id: MenuId;
  name: string;
  emoji: string;
  category: MenuCategory;
}

export const MENUS: Menu[] = [
  { id: 'americano', name: '아메리카노', emoji: '☕', category: 'coffee' },
  { id: 'latte', name: '라떼', emoji: '🥛', category: 'coffee' },
  { id: 'mocha', name: '카페모카', emoji: '🤎', category: 'coffee' },
  { id: 'matcha_latte', name: '말차라떼', emoji: '🍵', category: 'non_coffee' },
  { id: 'strawberry_milk', name: '딸기우유', emoji: '🍓', category: 'non_coffee' },
  { id: 'croissant', name: '크루아상', emoji: '🥐', category: 'dessert' },
  { id: 'cheesecake', name: '치즈케이크', emoji: '🍰', category: 'dessert' },
  { id: 'cookie', name: '쿠키', emoji: '🍪', category: 'dessert' },
];

export function getMenuById(id: MenuId): Menu | undefined {
  return MENUS.find((menu) => menu.id === id);
}
