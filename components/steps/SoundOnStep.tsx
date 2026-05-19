'use client';

interface Props {
  onEnter: () => void;
  onBack: () => void;
}

export function SoundOnStep({ onEnter, onBack }: Props) {
  return (
    <div className="text-center">
      <div className="text-6xl mb-4">🔊</div>
      <h2 className="text-xl font-bold mb-2">소리를 켜고 입장할까요?</h2>
      <p className="text-sm text-stone-500 mb-6">
        브라우저 정책상 한 번 클릭이 필요해요.<br />
        조용히 작업하고 싶으면 입장 후 음소거 버튼을 누르세요.
      </p>
      <button
        onClick={onEnter}
        className="w-full px-6 py-4 rounded-xl bg-[var(--cafe-accent)] text-white text-lg font-semibold"
      >
        🔊 소리 켜고 입장
      </button>
      <button onClick={onBack} className="mt-3 px-6 py-2 rounded-full text-stone-500">← 뒤로</button>
    </div>
  );
}
