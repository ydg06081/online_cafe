export interface MugColor {
  id: string;
  name: string;
  hex: string;
}

export interface Accessory {
  id: string;
  name: string;
}

export const MUG_COLORS: MugColor[] = [
  { id: 'red', name: '빨강', hex: '#e57373' },
  { id: 'orange', name: '주황', hex: '#ffb74d' },
  { id: 'yellow', name: '노랑', hex: '#fff176' },
  { id: 'green', name: '초록', hex: '#81c784' },
  { id: 'blue', name: '파랑', hex: '#64b5f6' },
  { id: 'purple', name: '보라', hex: '#ba68c8' },
  { id: 'pink', name: '분홍', hex: '#f48fb1' },
  { id: 'brown', name: '갈색', hex: '#a1887f' },
];

export const ACCESSORIES: Accessory[] = [
  { id: 'none', name: '없음' },
  { id: 'beret', name: '베레모' },
  { id: 'glasses', name: '안경' },
  { id: 'headphones', name: '이어폰' },
  { id: 'headband', name: '머리띠' },
];

export interface Appearance {
  mugColor: string;
  accessory: string;
}

export function randomAppearance(): Appearance {
  return {
    mugColor: MUG_COLORS[Math.floor(Math.random() * MUG_COLORS.length)].id,
    accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id,
  };
}
