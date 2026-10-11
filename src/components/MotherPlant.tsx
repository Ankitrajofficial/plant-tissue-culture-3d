import { Plant } from './Plant'
import { Pot, HighlightRing } from './LabProps'

/**
 * The donor (mother) plant on its stand in the greenhouse.
 */
export function MotherPlant({
  position,
  highlight = false,
  growth = 1,
  seed = 3,
}: {
  position: [number, number, number]
  highlight?: boolean
  growth?: number
  seed?: number
}) {
  return (
    <group position={position}>
      {/* stand */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.9, 20]} />
        <meshStandardMaterial color="#8d99a6" roughness={0.6} />
      </mesh>
      <Pot position={[0, 0.9, 0]} scale={1.3} />
      <Plant growth={growth} height={1.5} leaves={11} leafSize={0.42} seed={seed} position={[0, 1.3, 0]} />
      {highlight && <HighlightRing position={[0, 0.92, 0]} radius={0.75} />}
    </group>
  )
}
