'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Character } from './Character';
import { CharacterTooltip } from './CharacterTooltip';
import type { CafeSession, Zone } from '@/lib/session';
import type { Appearance } from '@/lib/appearance';

const SEAT_SLOTS = [
  { x: 12, y: 55 }, { x: 28, y: 62 }, { x: 44, y: 58 }, { x: 60, y: 64 }, { x: 76, y: 56 },
  { x: 18, y: 78 }, { x: 36, y: 82 }, { x: 54, y: 80 }, { x: 72, y: 84 }, { x: 88, y: 76 },
];

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
      <AnimatePresence>
        {characters.slice(0, SEAT_SLOTS.length).map((c, i) => {
          const slot = SEAT_SLOTS[i];
          return <SlotCharacter key={c.id} slot={slot} character={c} />;
        })}
      </AnimatePresence>
    </div>
  );
}

function SlotCharacter({ slot, character }: { slot: { x: number; y: number }; character: VisibleCharacter }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      className="absolute"
      style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative">
        <Character appearance={character.appearance} size={character.isSelf ? 64 : 52} />
        {character.isSelf && (
          <div className="text-center text-xs mt-1 font-semibold text-white drop-shadow">
            {character.nickname}
          </div>
        )}
        {hover && !character.isSelf && character.session && (
          <CharacterTooltip session={character.session} />
        )}
      </div>
    </motion.div>
  );
}