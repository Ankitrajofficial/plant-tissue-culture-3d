import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Bench, SpiritLamp } from './LabProps'

/**
 * Horizontal laminar-flow cabinet: HEPA filter at the back pushes sterile
 * air across the work surface. `active` turns on the air-flow visualisation
 * and the work light.
 */
export function LaminarFlowCabinet({
  position,
  active = false,
  flame = false,
  children,
}: {
  position: [number, number, number]
  active?: boolean
  flame?: boolean
  children?: React.ReactNode
}) {
  const flow = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!flow.current) return
    const t = clock.getElapsedTime()
    flow.current.children.forEach((c, i) => {
      const line = c as THREE.Mesh
      const life = (t * 0.45 + i * 0.13) % 1
      line.position.z = -1.0 + life * 1.9
      ;(line.material as THREE.MeshBasicMaterial).opacity = active ? 0.35 * Math.sin(life * Math.PI) : 0
    })
  })

  const w = 4
  const d = 2.4
  const h = 2.6
  const surfaceY = 1

  return (
    <group position={position}>
      <Bench position={[0, 0, 0]} width={w} depth={d} height={surfaceY} color="#e6ebf0" />
      {/* side walls */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[(s * w) / 2, surfaceY + h / 2, 0]}>
          <boxGeometry args={[0.06, h, d]} />
          <meshStandardMaterial color="#dfe6ec" roughness={0.5} />
        </mesh>
      ))}
      {/* back wall with HEPA grille */}
      <mesh position={[0, surfaceY + h / 2, -d / 2 + 0.03]}>
        <boxGeometry args={[w, h, 0.06]} />
        <meshStandardMaterial color="#d2dae2" roughness={0.5} />
      </mesh>
      <mesh position={[0, surfaceY + h * 0.6, -d / 2 + 0.07]}>
        <planeGeometry args={[w - 0.5, h * 0.55]} />
        <meshStandardMaterial color="#8d99a6" roughness={0.8} />
      </mesh>
      {Array.from({ length: 9 }, (_, i) => (
        <mesh key={i} position={[0, surfaceY + h * 0.35 + i * 0.16, -d / 2 + 0.08]}>
          <boxGeometry args={[w - 0.6, 0.02, 0.01]} />
          <meshStandardMaterial color="#2b3440" />
        </mesh>
      ))}
      {/* top with light */}
      <mesh position={[0, surfaceY + h, 0]}>
        <boxGeometry args={[w, 0.08, d]} />
        <meshStandardMaterial color="#dfe6ec" />
      </mesh>
      <mesh position={[0, surfaceY + h - 0.06, 0.2]}>
        <boxGeometry args={[w - 0.8, 0.03, 0.2]} />
        <meshStandardMaterial color="#fff" emissive={active ? '#eaf4ff' : '#111'} emissiveIntensity={active ? 2 : 0} />
      </mesh>
      {active && <pointLight position={[0, surfaceY + h - 0.3, 0.2]} intensity={2.5} distance={4} color="#eef6ff" />}
      {/* glass sash */}
      <mesh position={[0, surfaceY + h * 0.68, d / 2 - 0.15]} rotation={[0.12, 0, 0]}>
        <planeGeometry args={[w - 0.1, h * 0.62]} />
        <meshPhysicalMaterial color="#cfe9ff" transparent opacity={0.16} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* airflow streaks */}
      <group ref={flow} position={[0, surfaceY + 0.6, 0]}>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[-1.6 + i * 0.36, (i % 3) * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.03, 0.5]} />
            <meshBasicMaterial color="#9ad8ff" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      {/* permanent props */}
      <SpiritLamp position={[1.5, surfaceY, -0.2]} flame={flame} />
      <group position={[0, surfaceY, 0]}>{children}</group>
    </group>
  )
}
