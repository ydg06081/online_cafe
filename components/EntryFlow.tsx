'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MenuId } from '@/lib/menu';
import { createSession, saveSession } from '@/lib/session';
import { NicknameStep } from './steps/NicknameStep';
import { MenuStep } from './steps/MenuStep';
import { TimePurposeStep } from './steps/TimePurposeStep';
import { SoundOnStep } from './steps/SoundOnStep';

export interface EntryDraft {
  nickname: string;
  menuId: MenuId | null;
  durationSec: number;
  purpose: string;
}

const initial: EntryDraft = {
  nickname: '',
  menuId: null,
  durationSec: 25 * 60,
  purpose: '',
};

export function EntryFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<EntryDraft>(initial);

  function patch(p: Partial<EntryDraft>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function finish() {
    if (!draft.menuId) return;
    const session = createSession({
      nickname: draft.nickname,
      menuId: draft.menuId,
      durationSec: draft.durationSec,
      purpose: draft.purpose,
    });
    saveSession(session);
    router.push('/cafe');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((n) => (
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
          <MenuStep
            value={draft.menuId}
            onChange={(v) => patch({ menuId: v })}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <TimePurposeStep
            durationSec={draft.durationSec}
            purpose={draft.purpose}
            onChange={(d, p) => patch({ durationSec: d, purpose: p })}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && <SoundOnStep onEnter={finish} onBack={() => setStep(3)} />}
      </div>
    </main>
  );
}
