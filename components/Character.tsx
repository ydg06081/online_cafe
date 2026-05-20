'use client';

import Image from 'next/image';
import { getCharacterSrc, type Appearance } from '@/lib/appearance';

interface Props {
  appearance: Appearance;
  size?: number;
}

export function Character({ appearance, size = 140 }: Props) {
  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      data-testid="character"
    >
      <Image
        src={getCharacterSrc(appearance.characterId)}
        alt="Clawd"
        width={size}
        height={size}
        unoptimized
        priority
      />
    </div>
  );
}