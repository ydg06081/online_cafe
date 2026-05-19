import type { MenuId } from './menu';
import { randomAppearance, type Appearance } from './appearance';

export type Zone = 'notebook' | 'terrace';

export interface CafeSession {
  id: string;
  nickname: string;
  currentMenu: MenuId;
  menuCount: number;
  menuHistory: MenuId[];
  purpose: string;
  durationSec: number;
  startedAt: string;
  expiresAt: string;
  currentZone: Zone;
  appearance: Appearance;
  seatSlot?: number;
}

const STORAGE_KEY = 'online-cafe-session';

export interface CreateSessionInput {
  nickname: string;
  menuId: MenuId;
  durationSec: number;
  purpose?: string;
}

export function createSession(input: CreateSessionInput): CafeSession {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    nickname: input.nickname,
    currentMenu: input.menuId,
    menuCount: 1,
    menuHistory: [input.menuId],
    purpose: input.purpose ?? '',
    durationSec: input.durationSec,
    startedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + input.durationSec * 1000).toISOString(),
    currentZone: 'notebook',
    appearance: randomAppearance(),
  };
}

export function saveSession(session: CafeSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadSession(): CafeSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as CafeSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function addMenuOrder(session: CafeSession, menuId: MenuId, durationSec: number): CafeSession {
  const now = Date.now();

  return {
    ...session,
    currentMenu: menuId,
    menuCount: session.menuCount + 1,
    menuHistory: [...session.menuHistory, menuId],
    durationSec,
    expiresAt: new Date(now + durationSec * 1000).toISOString(),
  };
}

export function resumeSession(): CafeSession | null {
  const session = loadSession();
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    clearSession();
    return null;
  }

  return session;
}
