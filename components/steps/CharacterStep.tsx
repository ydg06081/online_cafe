'use client';

import Image from 'next/image';
import { CHARACTERS } from '@/lib/appearance';

interface Props {
  value: string;
  onChange: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function CharacterStep({ value, onChange, onBack, onNext }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">캐릭터를 골라주세요</h2>
      <p className="text-sm text-stone-500 mb-6">마음에 드는 모습을 골라보세요</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {CHARACTERS.map((c) => {
          const selected = value === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition ${
                selected
                  ? 'border-[var(--cafe-accent)] bg-amber-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="relative w-16 h-16">
                <Image src={c.src} alt={c.name} fill unoptimized className="object-contain" />
              </div>
              <span className="text-xs text-stone-700">{c.name}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 text-stone-500">
          ← 이전
        </button>
        <button
          disabled={!value}
          onClick={onNext}
          className="px-6 py-2 rounded-full bg-[var(--cafe-accent)] text-white font-semibold disabled:opacity-40"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
