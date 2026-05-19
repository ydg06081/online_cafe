export function formatRemaining(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  if (h > 0) return `${h}:${pad(m)}:${pad(sec)}`;
  return `${m}:${pad(sec)}`;
}

export function secondsLeft(expiresAtIso: string): number {
  const diff = new Date(expiresAtIso).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / 1000));
}
