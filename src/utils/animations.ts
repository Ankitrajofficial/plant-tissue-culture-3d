/**
 * Small animation helpers used by the 3D stage components.
 * All functions are pure and safe to call every frame.
 */

export const clamp = (v: number, min = 0, max = 1): number => Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * clamp(t)

/** Linear interpolation of 3-component vectors */
export const lerp3 = (
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]

export const smoothstep = (t: number): number => {
  const x = clamp(t)
  return x * x * (3 - 2 * x)
}

export const easeInOut = (t: number): number => {
  const x = clamp(t)
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

export const easeOut = (t: number): number => 1 - Math.pow(1 - clamp(t), 3)

export const easeIn = (t: number): number => Math.pow(clamp(t), 3)

/** Elastic "pop" used when something appears */
export const easeOutBack = (t: number): number => {
  const x = clamp(t)
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

/**
 * Maps the overall stage progress (0‒1) onto a sub-phase.
 * Example: phase(p, 0.2, 0.5) is 0 before 20 %, 1 after 50 %, and ramps between.
 */
export const phase = (progress: number, start: number, end: number): number =>
  clamp((progress - start) / Math.max(end - start, 1e-6))

/** Goes 0 → 1 → 0 across the window (useful for a dip / bounce) */
export const pulse = (progress: number, start: number, end: number): number => {
  const t = phase(progress, start, end)
  return Math.sin(t * Math.PI)
}

/** Oscillation helper for idle "breathing" animations */
export const wobble = (time: number, speed = 1, amplitude = 1): number =>
  Math.sin(time * speed) * amplitude

/** Deterministic pseudo random number in [0,1) for a seed – keeps procedural geometry stable */
export const seeded = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

/** Exponential smoothing step independent of frame-rate */
export const damp = (current: number, target: number, lambda: number, dt: number): number =>
  lerp(current, target, 1 - Math.exp(-lambda * dt))
