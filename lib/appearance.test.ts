import { describe, it, expect } from 'vitest';
import { MUG_COLORS, ACCESSORIES, randomAppearance, type Appearance } from './appearance';

describe('appearance', () => {
  it('has 8 mug colors and 5 accessories', () => {
    expect(MUG_COLORS).toHaveLength(8);
    expect(ACCESSORIES).toHaveLength(5);
  });

  it('randomAppearance returns a valid combo', () => {
    const a: Appearance = randomAppearance();
    expect(MUG_COLORS.map((c) => c.id)).toContain(a.mugColor);
    expect(ACCESSORIES.map((c) => c.id)).toContain(a.accessory);
  });

  it('randomAppearance is varied across many calls (probabilistic)', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const a = randomAppearance();
      seen.add(`${a.mugColor}|${a.accessory}`);
    }
    expect(seen.size).toBeGreaterThanOrEqual(15);
  });
});
