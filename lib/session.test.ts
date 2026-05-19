import { describe, it, expect, beforeEach } from 'vitest';
import { createSession, loadSession, saveSession, clearSession, addMenuOrder, resumeSession } from './session';

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

describe('session', () => {
  beforeEach(() => localStorage.clear());

  it('createSession builds a valid session object', () => {
    const s = createSession({
      nickname: 'yun',
      menuId: 'latte',
      durationSec: 1500,
      purpose: 'PRD',
    });
    expect(s.nickname).toBe('yun');
    expect(s.currentMenu).toBe('latte');
    expect(s.menuCount).toBe(1);
    expect(s.purpose).toBe('PRD');
    expect(s.currentZone).toBe('notebook');
    expect(s.menuHistory).toEqual(['latte']);
    expect(new Date(s.expiresAt).getTime()).toBeGreaterThan(new Date(s.startedAt).getTime());
  });

  it('saveSession + loadSession round-trips', () => {
    const s = createSession({ nickname: 'a', menuId: 'americano', durationSec: 60 });
    saveSession(s);
    const loaded = loadSession();
    expect(loaded).toEqual(s);
  });

  it('loadSession returns null when nothing stored', () => {
    expect(loadSession()).toBeNull();
  });

  it('clearSession removes stored session', () => {
    const s = createSession({ nickname: 'a', menuId: 'americano', durationSec: 60 });
    saveSession(s);
    clearSession();
    expect(loadSession()).toBeNull();
  });

  it('addMenuOrder increments count and extends expiry', () => {
    const s = createSession({ nickname: 'a', menuId: 'americano', durationSec: 60 });
    const before = new Date(s.expiresAt).getTime();
    const next = addMenuOrder(s, 'latte', 120);
    expect(next.menuCount).toBe(2);
    expect(next.currentMenu).toBe('latte');
    expect(next.menuHistory).toEqual(['americano', 'latte']);
    expect(new Date(next.expiresAt).getTime()).toBeGreaterThan(before);
  });

  it('resumeSession returns active session', () => {
    const s = createSession({ nickname: 'a', menuId: 'americano', durationSec: 60 });
    saveSession(s);
    expect(resumeSession()?.id).toBe(s.id);
  });

  it('resumeSession clears and returns null for expired session', () => {
    const s = createSession({ nickname: 'a', menuId: 'americano', durationSec: 0 });
    saveSession(s);
    expect(resumeSession()).toBeNull();
    expect(loadSession()).toBeNull();
  });
});
