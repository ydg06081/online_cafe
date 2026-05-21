'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Character } from './Character';
import { CharacterTooltip } from './CharacterTooltip';
import type { CafeSession, Zone } from '@/lib/session';
import type { Appearance } from '@/lib/appearance';

// Horseshoe/arc layout — self sits at index 0 (center), others fan out left/right.
// Order: center, then alternating right/left outward.
function buildArcSlots(count: number): { x: number; y: number; scale: number }[] {
  const slots: { x: number; y: number; scale: number }[] = [];
  const centerX = 50;
  const centerY = 72;
  const stepX = 11; // horizontal spacing
  const liftY = 4;  // each ring further from center sits a bit higher (perspective)
  slots.push({ x: centerX, y: centerY + 4, scale: 1.15 });
  const pairs = Math.ceil((count - 1) / 2);
  for (let i = 1; i <= pairs; i++) {
    const y = centerY - i * liftY;
    const scale = Math.max(0.65, 1.05 - i * 0.08);
    slots.push({ x: centerX + i * stepX, y, scale });
    slots.push({ x: centerX - i * stepX, y, scale });
  }
  return slots.slice(0, count);
}

const SEAT_SLOTS: Record<Zone, { x: number; y: number; scale: number }[]> = {
  notebook: buildArcSlots(10),
  terrace: buildArcSlots(10),
};

export interface VisibleCharacter {
  id: string;
  appearance: Appearance;
  nickname: string;
  isSelf: boolean;
  session?: CafeSession;
}

interface Props {
  zone: Zone;
  characters: VisibleCharacter[];
  onSelfPositionChange?: (pos: { x: number; y: number }) => void;
}

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

const BACKGROUND_SRC: Record<Zone, string> = {
  notebook: `${R2_BASE}/images/terminal-cafe.png`,
  terrace:  `${R2_BASE}/images/terminal-teras.png`,
};

export function ZoneCanvas({ zone, characters, onSelfPositionChange }: Props) {
  const arranged = arrangeForArc(characters, SEAT_SLOTS[zone].length);

  return (
    <div
      className="relative w-full h-full overflow-hidden touch-none"
      data-testid={`zone-${zone}`}
    >
      <Image
        src={BACKGROUND_SRC[zone]}
        alt={zone}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-semibold opacity-80 drop-shadow text-sm sm:text-base">
        {zone === 'notebook' ? '🏠 노트북 존' : '🌿 테라스 존'}
      </div>
      {arranged.map((c, i) => {
        if (!c) return null;
        const slot = c.session?.position
          ? { x: c.session.position.x, y: c.session.position.y, scale: c.isSelf ? 1.15 : 1.0 }
          : SEAT_SLOTS[zone][i];
        return (
          <SlotCharacter
            key={c.id}
            slot={slot}
            character={c}
            onPositionChange={c.isSelf ? onSelfPositionChange : undefined}
          />
        );
      })}
    </div>
  );
}

// Place self at center (index 0); fill remaining slots alternating outward with others.
function arrangeForArc(characters: VisibleCharacter[], maxSlots: number): (VisibleCharacter | null)[] {
  const self = characters.find((c) => c.isSelf) ?? null;
  const others = characters.filter((c) => !c.isSelf);
  const out: (VisibleCharacter | null)[] = new Array(maxSlots).fill(null);
  out[0] = self;
  for (let i = 0; i < others.length && i + 1 < maxSlots; i++) {
    out[i + 1] = others[i];
  }
  return out;
}

function SlotCharacter({
  slot,
  character,
  onPositionChange,
}: {
  slot: { x: number; y: number; scale: number };
  character: VisibleCharacter;
  onPositionChange?: (pos: { x: number; y: number }) => void;
}) {
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);

  const sizeClasses = character.isSelf
    ? 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-44 lg:h-44'
    : 'w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40';

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!onPositionChange) return;
    e.preventDefault();
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !onPositionChange) return;
    const parent = e.currentTarget.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onPositionChange({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  return (
    <div
      className={`absolute ${character.isSelf && onPositionChange ? 'cursor-grab active:cursor-grabbing z-10' : ''}`}
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: 'translate(-50%, -100%)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        className={`relative ${sizeClasses} select-none`}
        style={{ touchAction: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
      >
        <Character appearance={character.appearance} className="w-full h-full pointer-events-none" />
        {character.isSelf && (
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold text-white drop-shadow whitespace-nowrap">
            {character.nickname}
          </div>
        )}
        {hover && !character.isSelf && character.session && (
          <CharacterTooltip session={character.session} />
        )}
      </div>
    </div>
  );
}
