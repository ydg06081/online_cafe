'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { resumeSession, saveSession, addMenuOrder, clearSession, type CafeSession, type Zone } from '@/lib/session';
import { upsertRemoteSession, endRemoteSession } from '@/lib/sessionSync';
import type { MenuId } from '@/lib/menu';
import { pickInitial, rotateSample } from '@/lib/sampling';
import { useZoneOccupants } from '@/lib/presence';
import { ZoneCanvas, type VisibleCharacter } from '@/components/ZoneCanvas';
import { Hud } from '@/components/Hud';
import { ZoneToggle } from '@/components/ZoneToggle';
import { AudioPlayer } from '@/components/AudioPlayer';
import { EndSessionModal } from '@/components/EndSessionModal';

export default function CafePage() {
  const router = useRouter();
  const [session, setSession] = useState<CafeSession | null>(null);
  const [muted, setMuted] = useState(false);
  const [expired, setExpired] = useState(false);

  const others = useZoneOccupants(session?.currentZone ?? 'notebook', session?.id ?? '');

  const VISIBLE_OTHERS = 9;
  const ROTATE_INTERVAL_MS = 30_000;
  const ROTATE_COUNT = 2;

  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  // 존 변경 시 새로 샘플링
  useEffect(() => {
    setVisibleIds(pickInitial(others.map((o) => o.id), VISIBLE_OTHERS));
  }, [session?.currentZone]);

  // 30초마다 일부 교체
  useEffect(() => {
    const id = window.setInterval(() => {
      setVisibleIds((cur) =>
        rotateSample(cur, others.map((o) => o.id), VISIBLE_OTHERS, ROTATE_COUNT)
      );
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [others]);

  // 누가 떠나거나 들어오면 빈 자리 즉시 채움
  useEffect(() => {
    setVisibleIds((cur) => rotateSample(cur, others.map((o) => o.id), VISIBLE_OTHERS, 0));
  }, [others.length]);

  const visibleOthers = useMemo(() => {
    const byId = new Map(others.map((o) => [o.id, o]));
    return visibleIds.map((id) => byId.get(id)).filter(Boolean) as typeof others;
  }, [visibleIds, others]);

  useEffect(() => {
    const s = resumeSession();
    if (!s) {
      router.replace('/');
      return;
    }

    // Assign random seat on first load if not set
    let finalSession = s;
    if (s.seatSlot == null) {
      const maxSlots = s.currentZone === 'terrace' ? 10 : 12;
      finalSession = { ...s, seatSlot: Math.floor(Math.random() * maxSlots) };
      saveSession(finalSession);
      upsertRemoteSession(finalSession);
    }

    setSession(finalSession);
    upsertRemoteSession(finalSession);
  }, [router]);

  function setZone(z: Zone) {
    if (!session) return;
    const next = { ...session, currentZone: z };
    saveSession(next);
    setSession(next);
    upsertRemoteSession(next);
  }

  const lastSyncRef = useRef(0);

  const handleSelfPositionChange = useCallback((pos: { x: number; y: number }) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, position: pos };
      saveSession(next);

      const now = Date.now();
      if (now - lastSyncRef.current > 500) {
        lastSyncRef.current = now;
        upsertRemoteSession(next);
      }

      return next;
    });
  }, []);

  if (!session) return null;

  const selfCharacter: VisibleCharacter = {
    id: session.id,
    nickname: session.nickname,
    isSelf: true,
    appearance: session.appearance,
    session: session,
  };

  const otherCharacters: VisibleCharacter[] = visibleOthers.map((o) => ({
    id: o.id,
    nickname: o.nickname,
    isSelf: false,
    appearance: o.appearance,
    session: o,
  }));

  const allCharacters = [selfCharacter, ...otherCharacters];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ZoneCanvas
        zone={session.currentZone}
        characters={allCharacters}
        onSelfPositionChange={handleSelfPositionChange}
      />
      <Hud
        nickname={session.nickname}
        menuId={session.currentMenu}
        menuCount={session.menuCount}
        expiresAt={session.expiresAt}
        purpose={session.purpose}
        onExpire={() => setExpired(true)}
      />
      <ZoneToggle
        zone={session.currentZone}
        onChange={setZone}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
      />
      <AudioPlayer zone={session.currentZone} muted={muted} />
      <button
        onClick={() => {
          if (confirm('카페에서 나가시겠어요?')) {
            endRemoteSession(session.id);
            clearSession();
            router.replace('/');
          }
        }}
        className="absolute top-14 right-2 sm:top-4 sm:right-4 bg-white/90 backdrop-blur px-2 py-1 sm:px-4 sm:py-2 rounded-full shadow text-xs sm:text-sm font-semibold text-stone-700 hover:bg-white z-20"
      >
        🚪 나가기
      </button>
      {expired && (
        <EndSessionModal
          session={session}
          onExtend={(menuId: MenuId, durationSec: number) => {
            const next = addMenuOrder(session, menuId, durationSec);
            saveSession(next);
            setSession(next);
            upsertRemoteSession(next);
            setExpired(false);
          }}
          onExit={() => {
            endRemoteSession(session.id);
            clearSession();
            router.replace('/');
          }}
        />
      )}
    </div>
  );
}
