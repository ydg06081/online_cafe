import { describe, it, expect, beforeEach } from 'vitest';
import { saveNicknameToHistory, loadNicknameHistory, SUGGESTED_NICKNAMES } from './nicknameHistory';

const store = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  },
});

describe('nicknameHistory', () => {
  beforeEach(() => localStorage.clear());

  it('loads empty array when nothing saved', () => {
    expect(loadNicknameHistory()).toEqual([]);
  });

  it('saves and loads a nickname', () => {
    saveNicknameToHistory('따뜻한라떼');
    expect(loadNicknameHistory()).toEqual(['따뜻한라떼']);
  });

  it('moves existing nickname to front instead of duplicating', () => {
    saveNicknameToHistory('라떼');
    saveNicknameToHistory('아메리칸');
    saveNicknameToHistory('라떼');
    expect(loadNicknameHistory()).toEqual(['라떼', '아메리칸']);
  });

  it('keeps at most 5 nicknames', () => {
    saveNicknameToHistory('1');
    saveNicknameToHistory('2');
    saveNicknameToHistory('3');
    saveNicknameToHistory('4');
    saveNicknameToHistory('5');
    saveNicknameToHistory('6');
    expect(loadNicknameHistory()).toEqual(['6', '5', '4', '3', '2']);
  });

  it('ignores empty nickname', () => {
    saveNicknameToHistory('  ');
    expect(loadNicknameHistory()).toEqual([]);
  });

  it('trims nickname before saving', () => {
    saveNicknameToHistory('  라떼  ');
    expect(loadNicknameHistory()).toEqual(['라떼']);
  });

  it('returns empty array on invalid JSON', () => {
    localStorage.setItem('online-cafe-nickname-history', 'not-json');
    expect(loadNicknameHistory()).toEqual([]);
  });

  it('returns empty array on non-array JSON', () => {
    localStorage.setItem('online-cafe-nickname-history', '{"foo": "bar"}');
    expect(loadNicknameHistory()).toEqual([]);
  });

  it('exports suggested nicknames', () => {
    expect(SUGGESTED_NICKNAMES.length).toBe(8);
    expect(SUGGESTED_NICKNAMES).toContain('따뜻한라떼');
  });
});
