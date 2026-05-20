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
}

const BACKGROUND_SRC: Record<Zone, string> = {
  notebook: '/images/terminal cafe.png',
  terrace:  '/images/terminal teras.png',
};

export function ZoneCanvas({ zone, characters }: Props) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      data-testid={`zone-${zone}`}
    >
      <Image
        src={BACKGROUND_SRC[zone]}
        alt={zone}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-semibold opacity-80 drop-shadow">
        {zone === 'notebook' ? '🏠 노트북 존' : '🌿 테라스 존'}
      </div>
      {arrangeForArc(characters, SEAT_SLOTS[zone].length).map((c, i) => {
        if (!c) return null;
        const slot = SEAT_SLOTS[zone][i];
        return <SlotCharacter key={c.id} slot={slot} character={c} />;
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

function SlotCharacter({ slot, character }: { slot: { x: number; y: number; scale: number }; character: VisibleCharacter }) {
  const [hover, setHover] = useState(false);
  const baseSize = character.isSelf ? 170 : 140;
  const size = Math.round(baseSize * slot.scale);

  return (
    <div
      className="absolute"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: 'translate(-50%, -100%)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <Character appearance={character.appearance} size={size} />
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