/** Every stage animation receives the 0‒1 progress of the current stage. */
export interface StageProps {
  progress: number
}

export type V3 = [number, number, number]

/** Lift an object along an arc while moving it from `a` to `b` */
export function arc(a: V3, b: V3, t: number, height = 0.6): V3 {
  const x = a[0] + (b[0] - a[0]) * t
  const y = a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * height
  const z = a[2] + (b[2] - a[2]) * t
  return [x, y, z]
}
