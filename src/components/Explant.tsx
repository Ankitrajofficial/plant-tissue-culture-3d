import { Leaf } from './Plant'

/**
 * A nodal explant – a short green stem segment carrying an axillary bud.
 * This is the tissue that travels from the mother plant into culture.
 */
export function Explant({
  position,
  rotation,
  scale = 1,
  bud = true,
  /** 0‒1 : bud swelling used during culture initiation */
  swell = 0,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  bud?: boolean
  swell?: number
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow>
        <cylinderGeometry args={[0.035, 0.04, 0.26, 10]} />
        <meshStandardMaterial color="#5b9a45" roughness={0.75} />
      </mesh>
      {/* node ring */}
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.04, 0.012, 6, 14]} />
        <meshStandardMaterial color="#4c7f39" />
      </mesh>
      {bud && (
        <group position={[0.04, 0.04, 0]} rotation={[0, 0, -0.9]}>
          <mesh>
            <sphereGeometry args={[0.03 + 0.03 * swell, 8, 6]} />
            <meshStandardMaterial color="#8fd16a" />
          </mesh>
          {swell > 0.4 && <Leaf size={0.12 * swell} color="#7ccc5c" position={[0, 0.02, 0]} rotation={[0.4, 0, 0]} />}
        </group>
      )}
    </group>
  )
}
