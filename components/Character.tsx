'use client';

import Image from 'next/image';
import { MUG_COLORS, type Appearance } from '@/lib/appearance';

interface Props {
  appearance: Appearance;
  size?: number;
  withMug?: boolean;
}

const ACCESSORY_EMOJI: Record<string, string | null> = {
  none: null,
  beret: '🎩',
  glasses: '👓',
  headphones: '🎧',
  headband: '🎀',
};

export function Character({ appearance, size = 140, withMug = true }: Props) {
  const mug = MUG_COLORS.find((c) => c.id === appearance.mugColor);
  const accessoryEmoji = ACCESSORY_EMOJI[appearance.accessory];

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
      data-testid="character"
    >
      <Image
        src="/images/character/clawd-working-typing.svg"
        alt="Clawd"
        width={size}
        height={size}
        unoptimized
        priority
      />
      {accessoryEmoji && (
        <span
          className="absolute"
          style={{
            top: -size * 0.15,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: size * 0.35,
          }}
        >
          {accessoryEmoji}
        </span>
      )}
      {withMug && mug && (
        <span
          className="absolute rounded-full ring-2 ring-white"
          style={{
            bottom: 4,
            right: 0,
            width: size * 0.28,
            height: size * 0.28,
            background: mug.hex,
          }}
          title={`${mug.name} 머그`}
        />
      )}
    </div>
  );
}