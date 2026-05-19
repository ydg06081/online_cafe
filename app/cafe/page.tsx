'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resumeSession, saveSession, type CafeSession, type Zone } from '@/lib/session';
import { upsertRemoteSession } from '@/lib/sessionSync';
import { ZoneCanvas, type VisibleCharacter } from '@/components/ZoneCanvas';
import { Hud } from '@/components/Hud';
import { ZoneToggle } from '@/components/ZoneToggle';
import { AudioPlayer } from '@/components/AudioPlayer';

export default function CafePage() {
  const router = useRouter();
  const [session, setSession] = useState<CafeSession | null>(null);
  const [muted, setMuted] = useState(false);
  const [expired, setExpired] = useState(false);

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

  if (!session) return null;

  function setZone(z: Zone) {
    if (!session) return;
    const next = { ...session, currentZone: z };
    saveSession(next);
    setSession(next);
    upsertRemoteSession(next);
  }

  const selfCharacter: VisibleCharacter = {
    id: session.id,
    nickname: session.nickname,
    isSelf: true,
    appearance: session.appearance,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <ZoneCanvas zone={session.currentZone} characters={[selfCharacter]} />
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