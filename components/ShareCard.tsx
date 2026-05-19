'use client';

import { forwardRef } from 'react';
import { getMenuById } from '@/lib/menu';
import { formatRemaining } from '@/lib/time';
import type { CafeSession } from '@/lib/session';

interface Props {
  session: CafeSession;
  stayedSec: number;
}

export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { session, stayedSec },
  ref
) {
  const emojis = session.menuHistory.map((id) => getMenuById(id)?.emoji ?? '').join(' ');
  return (
    <div
      ref={ref}
      className="w-[480px] p-8 rounded-3xl text-center"
      style={{ background: 'linear-gradient(135deg, #fdf6e3 0%, #f5d49a 100%)' }}
    >
      <div className="text-5xl mb-2">☕</div>
      <p className="text-sm text-stone-600">Online Cafe</p>
      <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#6b4423' }}>
        {session.nickname}님의 카페 기록
      </h2>
      <div className="bg-white/80 rounded-2xl p-5 space-y-2 text-left">
        <p className="text-sm">📍 머문 시간 <strong className="float-right">{formatRemaining(stayedSec)}</strong></p>
        <p className="text-sm">🍽 주문 <strong className="float-right">{session.menuCount}잔</strong></p>
        <div className="text-2xl text-center pt-2">{emojis}</div>
        {session.purpose && (
          <p className="text-sm italic text-stone-600 text-center pt-2">"{session.purpose}"</p>
        )}
      </div>
      <p className="text-xs text-stone-500 mt-4">cafe.example.com</p>
    </div>
  );
});