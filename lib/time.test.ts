import { describe, it, expect } from 'vitest';
import { formatRemaining, secondsLeft } from './time';

describe('time', () => {
  it('formatRemaining shows mm:ss under an hour', () => {
    expect(formatRemaining(0)).toBe('0:00');
    expect(formatRemaining(5)).toBe('0:05');
    expect(formatRemaining(65)).toBe('1:05');
    expect(formatRemaining(60 * 25)).toBe('25:00');
  });

  it('formatRemaining shows h:mm:ss over an hour', () => {
    expect(formatRemaining(60 * 60)).toBe('1:00:00');
    expect(formatRemaining(60 * 90 + 5)).toBe('1:30:05');
  });

  it('formatRemaining clamps negatives to 0', () => {
    expect(formatRemaining(-10)).toBe('0:00');
  });

  it('secondsLeft computes seconds between now and expiry', () => {
    const expiresAt = new Date(Date.now() + 30_000).toISOString();
    const left = secondsLeft(expiresAt);
    expect(left).toBeGreaterThanOrEqual(29);
    expect(left).toBeLessThanOrEqual(30);
  });

  it('secondsLeft is 0 when past expiry', () => {
    const past = new Date(Date.now() - 1000).toISOString();
    expect(secondsLeft(past)).toBe(0);
  });
});
