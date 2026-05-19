'use client';

import { getMenuById } from '@/lib/menu';
import { formatRemaining, secondsLeft } from '@/lib/time';
import { useEffect, useState } from 'react';
import type { CafeSession } from '@/lib/session';

interface Props {
  session: CafeSession;
}

export function CharacterTooltip({ session }: Props) {
  const [left, setLeft] = useState(() => secondsLeft(session.expiresAt));
  useEffect(() => {
    const id = window.setInterval(() => setLeft(secondsLeft(session.expiresAt)), 1000);
    return () => window.clearInterval(id);
  }, [session.expiresAt]);

  const menu = getMenuById(session.currentMenu);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full
                    bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-2
                    text-xs whitespace-nowrap pointer-events-none z-30">
      <div className="font-bold mb-1">✦ {session.nickname}</div>
      <div className="text-stone-700">{menu?.emoji} {menu?.name}</div>
      <div className="text-stone-600">⏳ {formatRemaining(left)} 남음</div>
      <div className="text-stone-600">🍽 이번 세션 누적 {session.menuCount}개</div>
      {session.purpose && (
        <div className="text-stone-500 italic mt-1 max-w-[200px] whitespace-normal">
          &ldquo;{session.purpose}&rdquo;
        </div>
      )}
    </div>
  );
}