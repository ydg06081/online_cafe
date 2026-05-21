'use client';

import { useState } from 'react';

const PRESETS = [
  { label: '25분 (뽀모도로)', sec: 25 * 60 },
  { label: '50분 (2세트)',    sec: 50 * 60 },
  { label: '90분 (딥워크)',   sec: 90 * 60 },
];

interface Props {
  durationSec: number;
  purpose: string;
  onChange: (durationSec: number, purpose: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function TimePurposeStep({ durationSec, purpose, onChange, onBack, onNext }: Props) {
  const isPreset = PRESETS.some((p) => p.sec === durationSec);
  const [customInput, setCustomInput] = useState(
    isPreset ? '' : String(Math.round(durationSec / 60))
  );
  const [mode, setMode] = useState<'preset' | 'custom'>(isPreset ? 'preset' : 'custom');

  const customMin = parseInt(customInput, 10);
  const customValid = Number.isFinite(customMin) && customMin >= 1 && customMin <= 180;
  const canProceed = mode === 'preset' ? durationSec > 0 : customValid;

  function applyPreset(sec: number) {
    setMode('preset');
    onChange(sec, purpose);
  }

  function handleCustomChange(value: string) {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 3);
    setCustomInput(digits);
    setMode('custom');
    const n = parseInt(digits, 10);
    if (Number.isFinite(n) && n >= 1 && n <= 180) {
      onChange(n * 60, purpose);
    } else {
      onChange(0, purpose);
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">얼마나 머무실까요?</h2>
      <p className="text-sm text-stone-500 mb-4">시간을 정하면 카운트다운이 시작돼요</p>
      <div className="grid gap-2 mb-3">
        {PRESETS.map((p) => (
          <button
            key={p.sec}
            onClick={() => applyPreset(p.sec)}
            className={`px-4 py-3 rounded-lg border-2 text-left transition ${
              mode === 'preset' && durationSec === p.sec
                ? 'border-[var(--cafe-accent)] bg-amber-50'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 mb-6 ${
          mode === 'custom' ? 'border-[var(--cafe-accent)] bg-amber-50' : 'border-stone-200'
        }`}
      >
        <span className="text-sm">직접 입력:</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={customInput}
          onFocus={() => setMode('custom')}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="분"
          className="w-20 px-2 py-1 border border-stone-300 rounded"
        />
        <span className="text-sm text-stone-500">분 (1~180)</span>
      </div>
      <h3 className="text-sm font-semibold mb-2">작업 목적 <span className="text-stone-400 font-normal">(선택)</span></h3>
      <input
        value={purpose}
        maxLength={50}
        onChange={(e) => onChange(durationSec, e.target.value)}
        placeholder="예: PRD 마무리하기"
        className="w-full px-4 py-2 rounded-lg border border-stone-300"
      />
      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="px-6 py-2 rounded-full text-stone-500">← 뒤로</button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-2 rounded-full bg-[var(--cafe-accent)] text-white font-semibold disabled:opacity-40"
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
