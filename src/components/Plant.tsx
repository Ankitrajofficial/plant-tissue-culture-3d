import { useMemo } from 'react'
import * as THREE from 'three'
import { clamp, phase, seeded } from '../utils/animations'

/**
 * Procedural plant: a tapering stem with alternate leaves.
 * `growth` (0‒1) controls height, leaf count and leaf size so one component can
 * show everything from a 1 cm shoot to a mature plant.
 */
export interface PlantProps {
  growth?: number
  /** Full height when growth = 1 (world units) */
  height?: number
  /** Maximum number of leaves */
  leaves?: number
  /** Leaf length at full size */
  leafSize?: number
  stemColor?: string
  leafColor?: string
  /** Random seed so neighbouring plants look different */
  seed?: number
  /** Show a flower on top (used for the mature plant) */
  flower?: boolean
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/** Leaf outline built once and shared by every leaf in the scene */
let leafGeometryCache: THREE.ShapeGeometry | null = null
export function getLeafGeometry(): THREE.ShapeGeometry {
  if (leafGeometryCache) return leafGeometryCache
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.bezierCurveTo(0.42, 0.15, 0.48, 0.7, 0, 1)
  shape.bezierCurveTo(-0.48, 0.7, -0.42, 0.15, 0, 0)
  leafGeometryCache = new THREE.ShapeGeometry(shape, 12)
  return leafGeometryCache
}

export function Leaf({
  size = 0.3,
  color = '#3fa34d',
  position,
  rotation,
}: {
  size?: number
  color?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  const geometry = useMemo(() => getLeafGeometry(), [])
  return (
    <mesh geometry={geometry} position={position} rotation={rotation} scale={[size, size, size]} castShadow>
      <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.7} />
    </mesh>
  )
}

export function Plant({
  growth = 1,
  height = 1.2,
  leaves = 8,
  leafSize = 0.35,
  stemColor = '#4f8a3b',
  leafColor = '#3fa34d',
  seed = 1,
  flower = false,
  position,
  rotation,
}: PlantProps) {
  const g = clamp(growth)
  const stemHeight = Math.max(0.02, height * (0.15 + 0.85 * g))
  const stemRadius = 0.025 + 0.045 * g * (height / 1.2)

  const leafNodes = useMemo(() => {
    const nodes: { y: number; angle: number; tilt: number; size: number; threshold: number }[] = []
    for (let i = 0; i < leaves; i++) {
      const t = (i + 1) / (leaves + 1)
      nodes.push({
        y: t,
        angle: i * 2.4 + seeded(seed + i) * 0.6,
        tilt: 0.9 - t * 0.45 + seeded(seed * 3 + i) * 0.2,
        size: 0.7 + seeded(seed * 7 + i) * 0.5,
        threshold: t * 0.8,
      })
    }
    return nodes
  }, [leaves, seed])

  return (
    <group position={position} rotation={rotation}>
      {/* stem */}
      <mesh position={[0, stemHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[stemRadius * 0.7, stemRadius, stemHeight, 8]} />
        <meshStandardMaterial color={stemColor} roughness={0.8} />
      </mesh>
      {/* leaves */}
      {leafNodes.map((n, i) => {
        const appear = phase(g, n.threshold, Math.min(1, n.threshold + 0.25))
        if (appear <= 0) return null
        const size = leafSize * n.size * appear * (0.6 + 0.4 * g)
        const y = n.y * stemHeight
        return (
          <group key={i} position={[0, y, 0]} rotation={[0, n.angle, 0]}>
            <group rotation={[n.tilt, 0, 0]} position={[0, 0, stemRadius]}>
              <Leaf size={size} color={leafColor} rotation={[-Math.PI / 2, 0, 0]} />
            </group>
          </group>
        )
      })}
      {/* apical bud / flower */}
      {flower && g > 0.85 && (
        <group position={[0, stemHeight + 0.02, 0]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} rotation={[0.5, (i * Math.PI * 2) / 5, 0]} position={[0, 0.05, 0]}>
              <sphereGeometry args={[0.07 * phase(g, 0.85, 1), 8, 6]} />
              <meshStandardMaterial color="#f5a3c7" roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0.07, 0]}>
            <sphereGeometry args={[0.035 * phase(g, 0.85, 1), 8, 6]} />
            <meshStandardMaterial color="#ffd166" />
          </mesh>
        </group>
      )}
    </group>
  )
}
