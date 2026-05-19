import { describe, it, expect } from 'vitest';
import { pickInitial, rotateSample } from './sampling';

const ids = (n: number) => Array.from({ length: n }, (_, i) => `id-${i}`);

describe('sampling', () => {
  it('pickInitial returns at most N when pool is smaller', () => {
    expect(pickInitial(ids(3), 9)).toHaveLength(3);
  });

  it('pickInitial returns exactly N when pool is larger', () => {
    expect(pickInitial(ids(20), 9)).toHaveLength(9);
  });

  it('pickInitial returns unique ids', () => {
    const out = pickInitial(ids(20), 9);
    expect(new Set(out).size).toBe(out.length);
  });

  it('rotateSample keeps the same size when pool allows', () => {
    const current = ids(9);
    const pool = ids(20);
    const next = rotateSample(current, pool, 9, 2);
    expect(next).toHaveLength(9);
    expect(new Set(next).size).toBe(9);
  });

  it('rotateSample drops missing ids (someone left)', () => {
    const current = ['id-0', 'id-1', 'id-2'];
    const pool = ['id-0', 'id-1'];
    const next = rotateSample(current, pool, 9, 2);
    expect(next).not.toContain('id-2');
    expect(next.length).toBeLessThanOrEqual(2);
  });

  it('rotateSample adds new ids from pool when below target', () => {
    const current = ['id-0'];
    const pool = ids(10);
    const next = rotateSample(current, pool, 5, 2);
    expect(next.length).toBe(5);
    expect(next).toContain('id-0');
  });
});
