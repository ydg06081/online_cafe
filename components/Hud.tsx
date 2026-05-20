'use client';

import { useEffect, useState } from 'react';
import { getMenuById, type MenuId } from '@/lib/menu';
import { formatRemaining, secondsLeft } from '@/lib/time';

interface Props {
  nickname: string;
  menuId: MenuId;
  menuCount: number;
  expiresAt: string;
  purpose: string;
  onExpire: () => void;
}

export function Hud({ nickname, menuId, menuCount, expiresAt, purpose, onExpire }: Props) {
  const [left, setLeft] = useState(() => secondsLeft(expiresAt));

  useEffect(() => {
    const tick = () => {
      const l = secondsLeft(expiresAt);
      setLeft(l);
      if (l === 0) onExpire();
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt, onExpire]);

  const menu = getMenuById(menuId);

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/85 backdrop-blur px-3 py-2 sm:px-6 sm:py-3 rounded-2xl shadow flex items-center gap-2 sm:gap-6 max-w-[95vw]">
      <div className="flex flex-col gap-1 text-xs sm:text-sm min-w-0">
        <span className="font-bold text-sm sm:text-base">✦ {nickname}</span>
        <span className="text-stone-700">
          {menu?.emoji} {menu?.name}
          <span className="text-stone-500 ml-2">🍽 {menuCount}개</span>
        </span>
        {purpose && (
          <span className="text-stone-500 italic truncate max-w-[160px] sm:max-w-[260px]">"{purpose}"</span>
        )}
      </div>
      <div className="border-l border-stone-300 h-8 sm:h-12" />
      <div className="flex flex-col items-center leading-none">
        <span className="text-[10px] text-stone-500 mb-1">남은 시간</span>
        <span className="text-xl sm:text-3xl font-bold text-[var(--cafe-accent)] tabular-nums">
          {formatRemaining(left)}
        </span>
      </div>
    </div>
  );
}