import { useMemo } from 'react'
import { Plant } from './Plant'
import { clamp, phase, seeded } from '../utils/animations'

/**
 * A cluster of adventitious / axillary shoots. Each shoot is a small Plant
 * that appears in sequence and grows with `growth`.
 */
export function Shoots({
  growth = 1,
  count = 5,
  height = 0.35,
  spread = 0.12,
  position,
  leafColor = '#58c25f',
}: {
  growth?: number
  count?: number
  height?: number
  spread?: number
  position?: [number, number, number]
  leafColor?: string
}) {
  const g = clamp(growth)
  const shoots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + seeded(i * 5.3) * 0.8
        const d = i === 0 ? 0 : spread * (0.5 + seeded(i * 7.1) * 0.5)
        return {
          pos: [Math.cos(a) * d, 0, Math.sin(a) * d] as [number, number, number],
          rot: [(seeded(i * 2.2) - 0.5) * 0.5, a, (seeded(i * 3.3) - 0.5) * 0.5] as [number, number, number],
          order: i / count,
          seed: i + 11,
        }
      }),
    [count, spread],
  )

  if (g <= 0) return null
  return (
    <group position={position}>
      {shoots.map((s, i) => {
        const local = phase(g, s.order * 0.6, s.order * 0.6 + 0.4)
        if (local <= 0) return null
        return (
          <Plant
            key={i}
            growth={local}
            height={height * (0.8 + 0.2 * seeded(s.seed))}
            leaves={5}
            leafSize={height * 0.5}
            leafColor={leafColor}
            stemColor="#6bb55a"
            seed={s.seed}
            position={s.pos}
            rotation={s.rot}
          />
        )
      })}
    </group>
  )
}
