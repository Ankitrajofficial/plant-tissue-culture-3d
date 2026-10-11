import { Html } from '@react-three/drei'
import { Steam } from './LabProps'

/**
 * Vertical autoclave: pressure chamber with a round door, gauge and timer.
 * `door` 0 = closed, 1 = fully open. `active` shows steam and the heating lamp.
 */
export function Autoclave({
  position,
  door = 0,
  active = false,
  temperature,
  timer,
}: {
  position: [number, number, number]
  door?: number
  active?: boolean
  temperature?: number
  timer?: string
}) {
  return (
    <group position={position}>
      {/* body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 2.2, 1.5]} />
        <meshStandardMaterial color="#d9dfe5" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* chamber ring */}
      <mesh position={[0, 1.3, 0.76]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.56, 0.06, 10, 32]} />
        <meshStandardMaterial color="#8d99a6" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* dark chamber interior */}
      <mesh position={[0, 1.3, 0.74]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.04, 28]} />
        <meshStandardMaterial color="#1b2229" />
      </mesh>
      {/* door, hinged on the right */}
      <group position={[0.6, 1.3, 0.8]} rotation={[0, -door * 1.9, 0]}>
        <mesh position={[-0.6, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.58, 0.58, 0.08, 32]} />
          <meshStandardMaterial color="#c9d1d9" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.6, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 28]} />
          <meshPhysicalMaterial color="#9ad8ff" transparent opacity={0.35} roughness={0.1} />
        </mesh>
        <mesh position={[-0.6, -0.1, 0.1]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 10]} />
          <meshStandardMaterial color="#2b3440" />
        </mesh>
      </group>
      {/* control panel */}
      <mesh position={[0, 2.0, 0.76]}>
        <boxGeometry args={[1.2, 0.3, 0.02]} />
        <meshStandardMaterial color="#1f2730" />
      </mesh>
      <mesh position={[0.4, 2.0, 0.78]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshStandardMaterial color={active ? '#ff5a4f' : '#3a4a3a'} emissive={active ? '#ff2a1a' : '#000'} emissiveIntensity={active ? 2 : 0} />
      </mesh>
      {/* gauge */}
      <mesh position={[-0.4, 2.0, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 20]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      {(temperature !== undefined || timer) && (
        <Html position={[0, 2.45, 0.8]} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
          <div className="readout">
            {temperature !== undefined && <span>{Math.round(temperature)} °C</span>}
            {temperature !== undefined && <span>{Math.max(0, Math.round(((temperature - 100) / 21) * 15))} psi</span>}
            {timer && <span>{timer}</span>}
          </div>
        </Html>
      )}
      <Steam position={[0, 2.25, 0.3]} active={active} count={16} spread={0.4} rise={1.4} />
    </group>
  )
}
