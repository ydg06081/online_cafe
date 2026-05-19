'use client';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}

export function NicknameStep({ value, onChange, onNext }: Props) {
  const valid = value.trim().length >= 2 && value.trim().length <= 12;
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
