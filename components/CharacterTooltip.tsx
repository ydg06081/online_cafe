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
    <div className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full pointer-events-none z-30">
      <div className="relative bg-white/95 backdrop-blur rounded-xl shadow-lg px-3 py-2 text-xs min-w-[140px]">
        <div className="font-bold text-sm mb-1 text-stone-800">{session.nickname}</div>
        <div className="border-b border-stone-200 mb-1.5" />
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-stone-700">
            <span>{menu?.emoji}</span>
            <span>{menu?.name}</span>
          </div>
          {session.purpose && (
            <div className="flex items-center gap-1.5 text-stone-600">
              <span>📋</span>
              <span className="truncate max-w-[180px]">{session.purpose}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-stone-600">
            <span>⏳</span>
            <span>{formatRemaining(left)}</span>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-full">
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white/95" />
        </div>
      </div>
    </div>
  );
}
