export type MenuCategory = 'coffee' | 'non_coffee' | 'dessert';

export type MenuId =
  | 'americano'
  | 'latte'
  | 'mocha'
  | 'espresso'
  | 'cold_brew'
  | 'vanilla_latte'
  | 'caramel_macchiato'
  | 'einspanner'
  | 'matcha_latte'
  | 'strawberry_milk'
  | 'hot_chocolate'
  | 'milk_tea'
  | 'chamomile'
  | 'earl_grey'
  | 'grapefruit_ade'
  | 'lemonade'
  | 'croissant'
  | 'cheesecake'
  | 'cookie'
  | 'macaron'
  | 'scone'
  | 'brownie'
  | 'waffle'
  | 'tiramisu';

export interface Menu {
  id: MenuId;
  name: string;
  emoji: string;
  category: MenuCategory;
}

export const MENUS: Menu[] = [
  // ☕ Coffee
  { id: 'americano', name: '아메리카노', emoji: '☕', category: 'coffee' },
  { id: 'latte', name: '라떼', emoji: '🥛', category: 'coffee' },
  { id: 'mocha', name: '카페모카', emoji: '🤎', category: 'coffee' },
  { id: 'espresso', name: '에스프레소', emoji: '🫘', category: 'coffee' },
  { id: 'cold_brew', name: '콜드브루', emoji: '🧊', category: 'coffee' },
  { id: 'vanilla_latte', name: '바닐라라떼', emoji: '🍦', category: 'coffee' },
  { id: 'caramel_macchiato', name: '카라멜마키아토', emoji: '🍯', category: 'coffee' },
  { id: 'einspanner', name: '아인슈페너', emoji: '☁️', category: 'coffee' },

  // 🥤 Non-coffee
  { id: 'matcha_latte', name: '말차라떼', emoji: '🍵', category: 'non_coffee' },
  { id: 'strawberry_milk', name: '딸기우유', emoji: '🍓', category: 'non_coffee' },
  { id: 'hot_chocolate', name: '핫초코', emoji: '🍫', category: 'non_coffee' },
  { id: 'milk_tea', name: '밀크티', emoji: '🧋', category: 'non_coffee' },
  { id: 'chamomile', name: '캐모마일', emoji: '🌼', category: 'non_coffee' },
  { id: 'earl_grey', name: '얼그레이', emoji: '🫖', category: 'non_coffee' },
  { id: 'grapefruit_ade', name: '자몽에이드', emoji: '🍹', category: 'non_coffee' },
  { id: 'lemonade', name: '레모네이드', emoji: '🍋', category: 'non_coffee' },

  // 🍰 Dessert
  { id: 'croissant', name: '크루아상', emoji: '🥐', category: 'dessert' },
  { id: 'cheesecake', name: '치즈케이크', emoji: '🍰', category: 'dessert' },
  { id: 'cookie', name: '쿠키', emoji: '🍪', category: 'dessert' },
  { id: 'macaron', name: '마카롱', emoji: '🍬', category: 'dessert' },
  { id: 'scone', name: '스콘', emoji: '🍞', category: 'dessert' },
  { id: 'brownie', name: '브라우니', emoji: '🟫', category: 'dessert' },
  { id: 'waffle', name: '와플', emoji: '🧇', category: 'dessert' },
  { id: 'tiramisu', name: '티라미수', emoji: '🥮', category: 'dessert' },
];

export function getMenuById(id: MenuId): Menu | undefined {
  return MENUS.find((menu) => menu.id === id);
}
