'use client';

import type { Zone } from '@/lib/session';

interface Props {
  zone: Zone;
  onChange: (z: Zone) => void;
  muted: boolean;
  onToggleMute: () => void;
}

export function ZoneToggle({ zone, onChange, muted, onToggleMute }: Props) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
      <div className="flex gap-2 bg-white/90 backdrop-blur p-1.5 rounded-full shadow">
        <button
          onClick={() => onChange('notebook')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            zone === 'notebook' ? 'bg-[var(--cafe-accent)] text-white' : 'text-stone-600'
          }`}
        >
          🏠 노트북존
        </button>
        <button
          onClick={() => onChange('terrace')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            zone === 'terrace' ? 'bg-[var(--cafe-accent)] text-white' : 'text-stone-600'
          }`}
        >
          🌿 테라스존
        </button>
      </div>
      <button
        onClick={onToggleMute}
        className="bg-white/90 backdrop-blur w-10 h-10 rounded-full shadow text-lg"
        title={muted ? '소리 켜기' : '음소거'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}