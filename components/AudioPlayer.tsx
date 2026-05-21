'use client';

import { useEffect, useRef } from 'react';

type Zone = 'notebook' | 'terrace';

interface Props {
  zone: Zone;
  muted: boolean;
}

const R2_BASE = process.env.NEXT_PUBLIC_R2_BASE ?? '';

const SOURCES: Record<Zone, string> = {
  notebook: `${R2_BASE}/notebook-zone.mp3`,
  terrace: `${R2_BASE}/terrace-zone.mp3`,
};

const FADE_MS = 800;
const TARGET_VOLUME = 0.5;

interface FadeHandle {
  cancel: () => void;
}

const STORAGE_KEY = (z: Zone) => `cafe:audio:${z}:t`;

function restoreTime(el: HTMLAudioElement | null, zone: Zone) {
  if (!el || typeof window === 'undefined') return;
  const raw = sessionStorage.getItem(STORAGE_KEY(zone));
  const t = raw ? parseFloat(raw) : NaN;
  if (!Number.isFinite(t) || t < 0) return;
  const apply = () => {
    const dur = el.duration;
    el.currentTime = Number.isFinite(dur) && dur > 0 ? t % dur : t;
  };
  if (el.readyState >= 1) apply();
  else el.addEventListener('loadedmetadata', apply, { once: true });
}

export function AudioPlayer({ zone, muted }: Props) {
  const notebookRef = useRef<HTMLAudioElement>(null);
  const terraceRef = useRef<HTMLAudioElement>(null);
  // Track the in-flight fade for each element so a new one can cancel it.
  const fadeMap = useRef<WeakMap<HTMLAudioElement, FadeHandle>>(new WeakMap());

  // Restore saved playback position once per element.
  useEffect(() => {
    restoreTime(notebookRef.current, 'notebook');
    restoreTime(terraceRef.current, 'terrace');
  }, []);

  // Persist currentTime periodically and on unload.
  useEffect(() => {
    const pairs: Array<[Zone, HTMLAudioElement | null]> = [
      ['notebook', notebookRef.current],
      ['terrace', terraceRef.current],
    ];
    const save = (z: Zone, el: HTMLAudioElement) => {
      sessionStorage.setItem(STORAGE_KEY(z), String(el.currentTime));
    };
    const lastSave: Record<string, number> = {};
    const handlers: Array<() => void> = [];
    for (const [z, el] of pairs) {
      if (!el) continue;
      const onTime = () => {
        const now = performance.now();
        if ((lastSave[z] ?? 0) + 1000 > now) return;
        lastSave[z] = now;
        save(z, el);
      };
      el.addEventListener('timeupdate', onTime);
      handlers.push(() => el.removeEventListener('timeupdate', onTime));
    }
    const onUnload = () => {
      for (const [z, el] of pairs) if (el) save(z, el);
    };
    window.addEventListener('pagehide', onUnload);
    handlers.push(() => window.removeEventListener('pagehide', onUnload));
    return () => handlers.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    const active = zone === 'notebook' ? notebookRef.current : terraceRef.current;
    const other = zone === 'notebook' ? terraceRef.current : notebookRef.current;
    if (!active || !other) return;

    active.play().catch(() => { /* user not yet interacted */ });
    startFade(active, muted ? 0 : TARGET_VOLUME, FADE_MS, fadeMap.current);
    startFade(other, 0, FADE_MS, fadeMap.current, () => other.pause());

    return () => {
      // Cancel any in-flight fades when zone/muted changes or component unmounts.
      fadeMap.current.get(active)?.cancel();
      fadeMap.current.get(other)?.cancel();
    };
  }, [zone, muted]);

  return (
    <>
      <audio ref={notebookRef} src={SOURCES.notebook} loop preload="metadata" />
      <audio ref={terraceRef} src={SOURCES.terrace} loop preload="metadata" />
    </>
  );
}

function startFade(
  el: HTMLAudioElement,
  target: number,
  ms: number,
  registry: WeakMap<HTMLAudioElement, FadeHandle>,
  onDone?: () => void,
) {
  registry.get(el)?.cancel();

  const start = el.volume;
  const startTs = performance.now();
  let rafId = 0;
  let cancelled = false;

  function tick(now: number) {
    if (cancelled) return;
    const t = Math.min(1, (now - startTs) / ms);
    const next = start + (target - start) * t;
    el.volume = Math.max(0, Math.min(1, next));
    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      registry.delete(el);
      onDone?.();
    }
  }

  rafId = requestAnimationFrame(tick);
  registry.set(el, {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      registry.delete(el);
    },
  });
}
