'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { rowToSession, type SessionRow } from './sessionSync';
import type { CafeSession, Zone } from './session';

export function useZoneOccupants(zone: Zone, selfId: string): CafeSession[] {
  const [others, setOthers] = useState<CafeSession[]>([]);

  useEffect(() => {
    const sb = supabase();
    let active = true;

    sb.from('sessions')
      .select('*')
      .eq('current_zone', zone)
      .eq('status', 'active')
      .neq('id', selfId)
      .then(({ data, error }) => {
        if (error) {
          console.error('fetch occupants', error);
          return;
        }
        if (!active) return;
        setOthers((data as SessionRow[]).map(rowToSession));
      });

    const channel = sb
      .channel(`zone:${zone}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sessions' },
        (payload) => {
          const newRow = payload.new as SessionRow | null;
          const oldRow = payload.old as SessionRow | null;

          setOthers((prev) => {
            if (payload.eventType === 'INSERT' && newRow) {
              if (newRow.id === selfId) return prev;
              if (newRow.current_zone !== zone || newRow.status !== 'active') return prev;
              if (prev.some((s) => s.id === newRow.id)) return prev;
              return [...prev, rowToSession(newRow)];
            }

            if (payload.eventType === 'DELETE' && oldRow) {
              return prev.filter((s) => s.id !== oldRow.id);
            }

            if (payload.eventType === 'UPDATE' && newRow) {
              if (newRow.id === selfId) return prev;
              if (newRow.current_zone !== zone || newRow.status !== 'active') {
                return prev.filter((s) => s.id !== newRow.id);
              }

              const exists = prev.some((s) => s.id === newRow.id);
              if (exists) {
                return prev.map((s) => (s.id === newRow.id ? rowToSession(newRow) : s));
              }

              return [...prev, rowToSession(newRow)];
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      sb.removeChannel(channel);
    };
  }, [zone, selfId]);

  return others;
}
