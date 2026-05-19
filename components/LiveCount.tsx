'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function LiveCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const sb = supabase();
    let active = true;

    async function refresh() {
      const { count: c, error } = await sb
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      if (error) { console.error('count', error); return; }
      if (active) setCount(c ?? 0);
    }

    refresh();
    const channel = sb
      .channel('sessions-count')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'sessions' },
        () => refresh())
      .subscribe();

    return () => {
      active = false;
      sb.removeChannel(channel);
    };
  }, []);

  return (
    <p className="text-sm text-stone-500 mb-10">
      지금 카페에 <span className="font-semibold">{count ?? '—'}명</span>이 있어요
    </p>
  );
}