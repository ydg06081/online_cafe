'use client';

import Image from 'next/image';
import { getCharacterSrc, type Appearance } from '@/lib/appearance';

interface Props {
  appearance: Appearance;
  size?: number;
  className?: string;
}

export function Character({ appearance, size = 140, className }: Props) {
  if (className) {
    return (
      <div className={`relative inline-block ${className}`} data-testid="character">
        <Image
          src={getCharacterSrc(appearance.characterId)}
          alt="Clawd"
          fill
          unoptimized
          priority
        />
      </div>
    );
  }

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