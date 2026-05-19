import { describe, it, expect } from 'vitest';
import { MENUS, getMenuById, MenuId } from './menu';

describe('menu', () => {
  it('exposes exactly 8 menus', () => {
    expect(MENUS).toHaveLength(8);
  });

  it('each menu has id, name, emoji, category', () => {
    for (const m of MENUS) {
      expect(m.id).toMatch(/^[a-z_]+$/);
      expect(m.name).toBeTruthy();
      expect(m.emoji).toBeTruthy();
      expect(['coffee', 'non_coffee', 'dessert']).toContain(m.category);
    }
  });

  it('getMenuById returns the correct menu', () => {
    expect(getMenuById('americano' as MenuId)?.name).toBe('아메리카노');
  });

  it('getMenuById returns undefined for unknown', () => {
    expect(getMenuById('unknown' as MenuId)).toBeUndefined();
  });
});
