import { useMemo } from 'react'
import * as THREE from 'three'
import { clamp, phase, seeded } from '../utils/animations'

/**
 * Adventitious roots growing downward from the base of a shoot. Each root is a
 * tube along a curved path; `growth` reveals the tubes progressively.
 */
export function Roots({
  growth = 1,
  count = 6,
  length = 0.3,
  position,
  color = '#f1e6c8',
}: {
  growth?: number
  count?: number
  length?: number
  position?: [number, number, number]
  color?: string
}) {
  const g = clamp(growth)
  const roots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + seeded(i * 9.1) * 0.9
        const reach = length * (0.6 + seeded(i * 4.4) * 0.6)
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.cos(a) * reach * 0.3, -reach * 0.35, Math.sin(a) * reach * 0.3),
          new THREE.Vector3(Math.cos(a + 0.5) * reach * 0.6, -reach * 0.7, Math.sin(a + 0.5) * reach * 0.6),
          new THREE.Vector3(Math.cos(a + 0.2) * reach * 0.7, -reach, Math.sin(a + 0.2) * reach * 0.7),
        ])
        const geometry = new THREE.TubeGeometry(curve, 14, 0.012, 5, false)
        return { geometry, order: i / count }
      }),
    [count, length],
  )

  if (g <= 0) return null
  return (
    <group position={position}>
      {roots.map((r, i) => {
        const local = phase(g, r.order * 0.5, r.order * 0.5 + 0.5)
        if (local <= 0) return null
        // reveal the tube by limiting the drawn index range
        const index = r.geometry.index
        const total = index ? index.count : r.geometry.attributes.position.count
        r.geometry.setDrawRange(0, Math.floor(total * local))
        return (
          <mesh key={i} geometry={r.geometry}>
            <meshStandardMaterial color={color} roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}
