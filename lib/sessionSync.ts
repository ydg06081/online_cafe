import { supabase } from './supabase';
import type { CafeSession } from './session';

interface SessionRow {
  id: string;
  nickname: string;
  current_menu: string;
  menu_count: number;
  menu_history: string[];
  purpose: string;
  duration_sec: number;
  started_at: string;
  expires_at: string;
  current_zone: 'notebook' | 'terrace';
  appearance: { mugColor: string; accessory: string };
  seat_slot: number | null;
  status: 'active' | 'ended';
}

function toRow(s: CafeSession): SessionRow {
  return {
    id: s.id,
    nickname: s.nickname,
    current_menu: s.currentMenu,
    menu_count: s.menuCount,
    menu_history: s.menuHistory,
    purpose: s.purpose,
    duration_sec: s.durationSec,
    started_at: s.startedAt,
    expires_at: s.expiresAt,
    current_zone: s.currentZone,
    appearance: s.appearance,
    seat_slot: s.seatSlot ?? null,
    status: 'active',
  };
}

export async function upsertRemoteSession(s: CafeSession): Promise<void> {
  const { error } = await supabase().from('sessions').upsert(toRow(s), { onConflict: 'id' });
  if (error) console.error('upsertRemoteSession', error);
}

export async function endRemoteSession(id: string): Promise<void> {
  const { error } = await supabase().from('sessions').update({ status: 'ended' }).eq('id', id);
  if (error) console.error('endRemoteSession', error);
}

export function rowToSession(r: SessionRow): CafeSession {
  return {
    id: r.id,
    nickname: r.nickname,
    currentMenu: r.current_menu as CafeSession['currentMenu'],
    menuCount: r.menu_count,
    menuHistory: r.menu_history as CafeSession['menuHistory'],
    purpose: r.purpose,
    durationSec: r.duration_sec,
    startedAt: r.started_at,
    expiresAt: r.expires_at,
    currentZone: r.current_zone,
    appearance: r.appearance,
    seatSlot: r.seat_slot ?? undefined,
  };
}

export type { SessionRow };
