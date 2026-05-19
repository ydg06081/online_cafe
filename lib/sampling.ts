function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickInitial(pool: string[], max: number): string[] {
  return shuffle(pool).slice(0, max);
}

export function rotateSample(
  current: string[],
  pool: string[],
  target: number,
  rotateCount: number
): string[] {
  const poolSet = new Set(pool);
  const surviving = current.filter((id) => poolSet.has(id));
  const freshPool = pool.filter((id) => !surviving.includes(id));

  if (surviving.length < target) {
    const result = [...surviving];
    for (const id of shuffle(freshPool)) {
      if (result.length >= target) break;
      result.push(id);
    }
    return result.slice(0, target);
  }

  const replaceCount = Math.min(rotateCount, target, freshPool.length);
  const kept = shuffle(surviving).slice(0, target - replaceCount);
  const fresh = shuffle(freshPool).slice(0, replaceCount);
  return [...kept, ...fresh];
}
