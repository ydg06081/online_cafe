'use client';

import { useEffect, useRef } from 'react';

type Zone = 'notebook' | 'terrace';

interface Props {
  zone: Zone;
  muted: boolean;
}

const SOURCES: Record<Zone, string> = {
  notebook: '/audio/notebook-zone.mp3',
  terrace: '/audio/terrace-zone.mp3',
};

const FADE_MS = 800;
const TARGET_VOLUME = 0.5;

export function AudioPlayer({ zone, muted }: Props) {
  const notebookRef = useRef<HTMLAudioElement>(null);
  const terraceRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const active = zone === 'notebook' ? notebookRef.current : terraceRef.current;
    const other = zone === 'notebook' ? terraceRef.current : notebookRef.current;
    if (!active || !other) return;

    active.play().catch(() => { /* user not yet interacted */ });
    fade(active, muted ? 0 : TARGET_VOLUME, FADE_MS);
    fade(other, 0, FADE_MS, () => other.pause());
  }, [zone, muted]);

  return (
    <>
      <audio ref={notebookRef} src={SOURCES.notebook} loop preload="auto" />
      <audio ref={terraceRef} src={SOURCES.terrace} loop preload="auto" />
    </>
  );
}

function fade(el: HTMLAudioElement, target: number, ms: number, onDone?: () => void) {
  const start = el.volume;
  const startTs = performance.now();
  function tick(now: number) {
    const t = Math.min(1, (now - startTs) / ms);
    el.volume = start + (target - start) * t;
    if (t < 1) requestAnimationFrame(tick);
    else onDone?.();
  }
  requestAnimationFrame(tick);
}