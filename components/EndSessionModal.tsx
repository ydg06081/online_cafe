'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { MENUS, getMenuById, type MenuId } from '@/lib/menu';
import type { CafeSession } from '@/lib/session';
import { formatRemaining } from '@/lib/time';
import { ShareCard } from './ShareCard';

interface Props {
  session: CafeSession;
  onExtend: (menuId: MenuId, durationSec: number) => void;
  onExit: () => void;
}

const EXTEND_PRESETS = [
  { label: '25분', sec: 25 * 60 },
  { label: '50분', sec: 50 * 60 },
];

export function EndSessionModal({ session, onExtend, onExit }: Props) {
  const [pickingMenu, setPickingMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuId | null>(null);
  const [selectedDur, setSelectedDur] = useState(25 * 60);
  const [customInput, setCustomInput] = useState('');

  const customMin = parseInt(customInput, 10);
  const customValid = Number.isFinite(customMin) && customMin >= 1 && customMin <= 180;
  const isCustomMode = customInput.length > 0;
  const canOrder = !!selectedMenu && (isCustomMode ? customValid : selectedDur > 0);
  const finalDur = isCustomMode && customValid ? customMin * 60 : selectedDur;

  function handleCustomChange(value: string) {
    const digits = value.replace(/[^0-9]/g, '').slice(0, 3);
    setCustomInput(digits);
  }
  const cardRef = useRef<HTMLDivElement>(null);

  const stayedSec = Math.floor(
    (Date.now() - new Date(session.startedAt).getTime()) / 1000
  );
  const menuChain = session.menuHistory.map((id) => getMenuById(id)?.emoji ?? '').join(' → ');

  async function handleShare() {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `cafe-${session.nickname}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }

  if (pickingMenu) {
    return (
      <Backdrop>
        <div className="bg-white rounded-2xl shadow-xl p-6 w-[420px]">
          <h2 className="text-lg font-bold mb-3">한 잔 더 주문하시겠어요?</h2>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {MENUS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMenu(m.id)}
                className={`flex flex-col items-center py-2 rounded-lg border-2 ${
                  selectedMenu === m.id ? 'border-[var(--cafe-accent)]' : 'border-stone-200'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-xs">{m.name}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2 mb-4">
            {EXTEND_PRESETS.map((p) => (
              <button
                key={p.sec}
                onClick={() => {
                  setSelectedDur(p.sec);
                  setCustomInput('');
                }}
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm ${
                  !isCustomMode && selectedDur === p.sec
                    ? 'border-[var(--cafe-accent)]'
                    : 'border-stone-200'
                }`}
              >
                {p.label}
              </button>
            ))}
            <div
              className={`flex-1 flex items-center gap-1 px-2 py-2 rounded-lg border-2 text-sm ${
                isCustomMode ? 'border-[var(--cafe-accent)]' : 'border-stone-200'
              }`}
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={customInput}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder="직접"
                className="w-full min-w-0 px-1 py-0.5 text-center bg-transparent outline-none"
              />
              <span className="text-stone-500">분</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPickingMenu(false)}
              className="px-4 py-2 text-stone-500"
            >
              뒤로
            </button>
            <button
              disabled={!canOrder}
              onClick={() => selectedMenu && onExtend(selectedMenu, finalDur)}
              className="flex-1 py-2 bg-[var(--cafe-accent)] text-white rounded-full font-semibold disabled:opacity-40"
            >
              주문하기
            </button>
          </div>
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[420px] text-center">
        <div className="text-5xl mb-2">☕</div>
        <h2 className="text-2xl font-bold mb-4">오늘도 수고했어요!</h2>
        <div className="text-left space-y-1 text-sm bg-amber-50 rounded-xl p-4 mb-6">
          <p>📍 머문 시간: <strong>{formatRemaining(stayedSec)}</strong></p>
          <p>🍽 주문한 메뉴: {menuChain} ({session.menuCount}개)</p>
          {session.purpose && <p>✏️ &quot;{session.purpose}&quot;</p>}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setPickingMenu(true)}
            className="w-full py-3 rounded-full bg-[var(--cafe-accent)] text-white font-semibold"
          >
            한 잔 더 주문하기
          </button>
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-full border-2 border-stone-200 font-medium"
          >
            📸 공유 카드 저장
          </button>
          <button
            onClick={onExit}
            className="w-full py-2 text-stone-500 font-medium"
          >
            카페 나가기
          </button>
        </div>
      </div>
      {/* off-screen render target for html-to-image PNG capture */}
      <div style={{ position: 'fixed', left: -9999, top: 0 }}>
        <ShareCard ref={cardRef} session={session} stayedSec={stayedSec} />
      </div>
    </Backdrop>
  );
}

function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
      {children}
    </div>
  );
}
