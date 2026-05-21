'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MenuId } from '@/lib/menu';
import { createSession, saveSession, resumeSession } from '@/lib/session';
import { saveNicknameToHistory } from '@/lib/nicknameHistory';
import { DEFAULT_CHARACTER_ID } from '@/lib/appearance';
import { NicknameStep } from './steps/NicknameStep';
import { CharacterStep } from './steps/CharacterStep';
import { MenuStep } from './steps/MenuStep';
import { TimePurposeStep } from './steps/TimePurposeStep';
import { SoundOnStep } from './steps/SoundOnStep';

export interface EntryDraft {
  nickname: string;
  characterId: string;
  menuId: MenuId | null;
  durationSec: number;
  purpose: string;
}

const initial: EntryDraft = {
  nickname: '',
  characterId: DEFAULT_CHARACTER_ID,
  menuId: null,
  durationSec: 25 * 60,
  purpose: '',
};

const TOTAL_STEPS = 5;

const AUDIO_SOURCES = [
  `${process.env.NEXT_PUBLIC_R2_BASE ?? ''}/notebook-zone.mp3`,
  `${process.env.NEXT_PUBLIC_R2_BASE ?? ''}/terrace-zone.mp3`,
];

function preloadAudio() {
  AUDIO_SOURCES.forEach((src) => {
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = src;
  });
}

export function EntryFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<EntryDraft>(initial);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (resumeSession()) {
      router.replace('/cafe');
      return;
    }
    setChecking(false);
    preloadAudio();
  }, [router]);

  function patch(p: Partial<EntryDraft>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function canAdvance(): boolean {
    if (step === 1) {
      const n = draft.nickname.trim();
      return n.length >= 2 && n.length <= 12;
    }
    if (step === 2) return !!draft.characterId;
    if (step === 3) return !!draft.menuId;
    if (step === 4) return draft.durationSec >= 5 * 60;
    return true;
  }

  function advance() {
    if (!canAdvance()) return;
    if (step < TOTAL_STEPS) setStep(step + 1);
    else finish();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Enter') return;
      const target = e.target as HTMLElement | null;
      if (target instanceof HTMLTextAreaElement) return;
      // Step 1 input already handles Enter internally — let it bubble normally.
      e.preventDefault();
      advance();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, draft]);

  function finish() {
    if (!draft.menuId) return;
    const session = createSession({
      nickname: draft.nickname,
      menuId: draft.menuId,
      durationSec: draft.durationSec,
      purpose: draft.purpose,
    });
    session.appearance = { ...session.appearance, characterId: draft.characterId };
    saveSession(session);
    saveNicknameToHistory(draft.nickname);
    router.push('/cafe');
  }

  if (checking) return null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex gap-2 mb-6">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`h-1 flex-1 rounded ${n <= step ? 'bg-[var(--cafe-accent)]' : 'bg-stone-200'}`}
            />
          ))}
        </div>
        {step === 1 && (
          <NicknameStep
            value={draft.nickname}
            onChange={(v) => patch({ nickname: v })}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <CharacterStep
            value={draft.characterId}
            onChange={(v) => patch({ characterId: v })}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <MenuStep
            value={draft.menuId}
            onChange={(v) => patch({ menuId: v })}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <TimePurposeStep
            durationSec={draft.durationSec}
            purpose={draft.purpose}
            onChange={(d, p) => patch({ durationSec: d, purpose: p })}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
          />
        )}
        {step === 5 && <SoundOnStep onEnter={finish} onBack={() => setStep(4)} />}
      </div>
    </main>
  );
}
