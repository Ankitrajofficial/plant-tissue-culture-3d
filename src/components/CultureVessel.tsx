import type { ReactNode } from 'react'
import * as THREE from 'three'

/**
 * A glass culture jar with a layer of gelled medium and a screw cap.
 * Children are rendered on top of the medium surface, so an Explant, Callus,
 * Shoots or Roots component can simply be nested inside.
 */
export interface CultureVesselProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  /** Height of the medium layer (0 = empty jar) */
  mediumLevel?: number
  mediumColor?: string
  /** 0 = cap removed, 1 = cap on; values between lift the cap */
  cap?: number
  /** Tint used for contaminated vessels */
  cloudy?: boolean
  children?: ReactNode
}

export const VESSEL_RADIUS = 0.26
export const VESSEL_HEIGHT = 0.78

export function CultureVessel({
  position,
  rotation,
  scale = 1,
  mediumLevel = 0.18,
  mediumColor = '#f3e3a1',
  cap = 1,
  cloudy = false,
  children,
}: CultureVesselProps) {
  const r = VESSEL_RADIUS
  const h = VESSEL_HEIGHT
  const capLift = (1 - cap) * 0.5
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* glass body */}
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[r, r * 0.95, h, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#dff6ff"
          transparent
          opacity={0.22}
          roughness={0.08}
          metalness={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* bottom */}
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[r * 0.95, r * 0.95, 0.01, 24]} />
        <meshPhysicalMaterial color="#dff6ff" transparent opacity={0.35} roughness={0.1} />
      </mesh>
      {/* medium */}
      {mediumLevel > 0.005 && (
        <mesh position={[0, mediumLevel / 2 + 0.01, 0]}>
          <cylinderGeometry args={[r * 0.93, r * 0.9, mediumLevel, 24]} />
          <meshStandardMaterial
            color={cloudy ? '#c9c2a0' : mediumColor}
            transparent
            opacity={cloudy ? 0.9 : 0.75}
            roughness={0.4}
          />
        </mesh>
      )}
      {/* cap */}
      <group position={[0, h + capLift, 0]}>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[r * 1.04, r * 1.04, 0.1, 24]} />
          <meshStandardMaterial color="#3d6cb3" roughness={0.5} />
        </mesh>
      </group>
      {/* contents */}
      <group position={[0, mediumLevel + 0.01, 0]}>{children}</group>
    </group>
  )
}
