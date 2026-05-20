'use client';

import { useEffect, useState } from 'react';
import { loadNicknameHistory, SUGGESTED_NICKNAMES } from '@/lib/nicknameHistory';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}

export function NicknameStep({ value, onChange, onNext }: Props) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(loadNicknameHistory());
  }, []);

  const valid = value.trim().length >= 2 && value.trim().length <= 12;
  const isSelected = (chip: string) => value.trim() === chip;

  function handleChipClick(chip: string) {
    if (isSelected(chip)) {
      onChange('');
    } else {
      onChange(chip);
    }
  }

  function Chip({ label }: { label: string }) {
    const selected = isSelected(label);
    return (
      <button
        type="button"
        onClick={() => handleChipClick(label)}
        className={`px-3 py-1.5 text-sm rounded-full border transition ${
          selected
            ? 'border-[var(--cafe-accent)] bg-amber-50 text-[var(--cafe-accent)]'
            : 'border-stone-200 text-stone-700 hover:border-stone-300'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">어떻게 불러드릴까요?</h2>
      <p className="text-sm text-stone-500 mb-6">닉네임 2~12자</p>
      <input
        autoFocus
        value={value}
        maxLength={12}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && valid && onNext()}
        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:outline-none focus:border-[var(--cafe-accent)]"
        placeholder="예: 따뜻한라떼"
      />

      {history.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-stone-500 mb-2">최근 사용</p>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <Chip key={h} label={h} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-stone-500 mb-2">추천</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_NICKNAMES.map((s) => (
            <Chip key={s} label={s} />
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          disabled={!valid}
          onClick={onNext}
          className="px-6 py-2 rounded-full bg-[var(--cafe-accent)] text-white font-semibold disabled:opacity-40"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
