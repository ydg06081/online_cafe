'use client';

import { MENUS, type MenuId } from '@/lib/menu';

interface Props {
  value: MenuId | null;
  onChange: (v: MenuId) => void;
  onBack: () => void;
  onNext: () => void;
}

export function MenuStep({ value, onChange, onBack, onNext }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">무엇을 주문하시겠어요?</h2>
      <p className="text-sm text-stone-500 mb-6">한 잔 골라주세요</p>
      <div className="grid grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-1">
        {MENUS.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition ${
              value === m.id
                ? 'border-[var(--cafe-accent)] bg-amber-50'
                : 'border-stone-200 hover:border-stone-300'
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-xs font-medium text-center leading-tight">{m.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="px-6 py-2 rounded-full text-stone-500">
          ← 뒤로
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
