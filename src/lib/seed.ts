export type Rng = () => number;

export function hashText(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createRng(key: string): Rng {
  let state = hashText(key) || 1;
  return () => {
    state += 0x6d2b79f5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: Rng, values: readonly T[]): T {
  return values[Math.floor(rng() * values.length)];
}

export function shuffle<T>(rng: Rng, values: readonly T[]): T[] {
  return values
    .map((value) => ({ value, sort: rng() }))
    .sort((left, right) => left.sort - right.sort)
    .map(({ value }) => value);
}

export function intBetween(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}
