'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resumeSession, saveSession, type CafeSession, type Zone } from '@/lib/session';
import { upsertRemoteSession } from '@/lib/sessionSync';
import { pickInitial, rotateSample } from '@/lib/sampling';
import { useZoneOccupants } from '@/lib/presence';
import { ZoneCanvas, type VisibleCharacter } from '@/components/ZoneCanvas';
import { Hud } from '@/components/Hud';
import { ZoneToggle } from '@/components/ZoneToggle';
import { AudioPlayer } from '@/components/AudioPlayer';

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
      finalSession = { ...s, seatSlot: Math.floor(Math.random() * 10) };
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

  if (!session) return null;

  const selfCharacter: VisibleCharacter = {
    id: session.id,
    nickname: session.nickname,
    isSelf: true,
    appearance: session.appearance,
  };

  const otherCharacters: VisibleCharacter[] = visibleOthers.map((o) => ({
    id: o.id,
    nickname: o.nickname,
    isSelf: false,
    appearance: o.appearance,
  }));

  const allCharacters = [selfCharacter, ...otherCharacters];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ZoneCanvas zone={session.currentZone} characters={allCharacters} />
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
      {expired && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <p className="text-xl font-bold mb-2">⏰ 시간이 다 됐어요!</p>
            <p className="text-stone-600">(다음 task에서 종료 모달 구현)</p>
          </div>
        </div>
      )}
    </div>
  );
}
