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
    <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/85 backdrop-blur px-5 py-2 rounded-full shadow flex items-center gap-4 text-sm">
      <span className="font-bold">✦ {nickname}</span>
      <span>{menu?.emoji} {menu?.name}</span>
      <span className="text-stone-600">⏳ {formatRemaining(left)}</span>
      <span className="text-stone-600">🍽 {menuCount}개</span>
      {purpose && <span className="text-stone-500 italic truncate max-w-[200px]">"{purpose}"</span>}
    </div>
  );
}