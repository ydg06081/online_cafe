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

export interface CharacterOption {
  id: string;
  name: string;
  src: string;
}

export const CHARACTERS: CharacterOption[] = [
  { id: 'working-typing', name: '타이핑', src: '/images/character/clawd-working-typing.svg' },
  { id: 'headphones-groove', name: '리듬타기', src: '/images/character/clawd-headphones-groove.svg' },
  { id: 'idle-look', name: '두리번', src: '/images/character/clawd-idle-look.svg' },
  { id: 'idle-reading', name: '독서', src: '/images/character/clawd-idle-reading.svg' },
  { id: 'idle-living', name: '느긋', src: '/images/character/clawd-idle-living.svg' },
  { id: 'mini-typing', name: '미니타이핑', src: '/images/character/clawd-mini-typing.svg' },
  { id: 'mini-happy', name: '미니방긋', src: '/images/character/clawd-mini-happy.svg' },
  { id: 'happy', name: '방긋', src: '/images/character/clawd-happy.svg' },
  { id: 'react-double', name: '깜짝', src: '/images/character/clawd-react-double.svg' },
  { id: 'static-base', name: '기본', src: '/images/character/clawd-static-base.svg' },
];

export const DEFAULT_CHARACTER_ID = 'working-typing';

export function getCharacterSrc(id: string | undefined): string {
  const found = CHARACTERS.find((c) => c.id === id);
  return found?.src ?? CHARACTERS[0].src;
}

export interface Appearance {
  mugColor: string;
  accessory: string;
  characterId?: string;
}

export function randomAppearance(): Appearance {
  return {
    mugColor: MUG_COLORS[Math.floor(Math.random() * MUG_COLORS.length)].id,
    accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)].id,
    characterId: DEFAULT_CHARACTER_ID,
  };
}
