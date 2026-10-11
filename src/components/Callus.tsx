import { useMemo } from 'react'
import { clamp, phase, seeded } from '../utils/animations'

/**
 * Callus: an unorganised mass of pale, dividing cells rendered as a cluster
 * of small spheres that appear one after another as `growth` increases.
 */
export function Callus({
  growth = 1,
  position,
  cells = 26,
  radius = 0.16,
  color = '#e6dfa8',
}: {
  growth?: number
  position?: [number, number, number]
  cells?: number
  radius?: number
  color?: string
}) {
  const g = clamp(growth)
  const blobs = useMemo(() => {
    const list: { pos: [number, number, number]; r: number; order: number }[] = []
    for (let i = 0; i < cells; i++) {
      const a = seeded(i * 1.7) * Math.PI * 2
      const d = Math.sqrt(seeded(i * 2.3)) * radius
      const y = seeded(i * 3.1) * radius * 0.9
      list.push({
        pos: [Math.cos(a) * d, y, Math.sin(a) * d],
        r: radius * (0.35 + seeded(i * 4.9) * 0.4),
        order: i / cells,
      })
    }
    return list
  }, [cells, radius])

  if (g <= 0) return null
  return (
    <group position={position}>
      {blobs.map((b, i) => {
        const s = phase(g, b.order * 0.85, b.order * 0.85 + 0.2)
        if (s <= 0) return null
        return (
          <mesh key={i} position={b.pos} scale={s} castShadow>
            <sphereGeometry args={[b.r, 8, 6]} />
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}
