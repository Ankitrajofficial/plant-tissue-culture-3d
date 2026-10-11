import * as THREE from 'three'
import { Bench, Pot } from './LabProps'
import { Plant } from './Plant'
import { MotherPlant } from './MotherPlant'

/**
 * Glass-house annex with benches of candidate plants and the mother plant
 * on its stand. Positions here are also referenced by stage hotspots.
 */
export const GREENHOUSE = {
  center: [-16, 0, 0] as [number, number, number],
  width: 9,
  depth: 8,
  wallHeight: 3,
  ridge: 4.6,
  motherStand: [-16.2, 0, 0.6] as [number, number, number],
  cloneStand: [-18.6, 0, 1.4] as [number, number, number],
  sideTable: [-13.6, 0, 1.6] as [number, number, number],
  backBenchZ: -2.2,
  backBenchY: 1,
  candidateX: [-19, -17.5, -16, -14.5, -13],
}

export function Greenhouse({
  highlightMother = false,
  showCandidates = true,
  children,
}: {
  highlightMother?: boolean
  showCandidates?: boolean
  children?: React.ReactNode
}) {
  const [cx, , cz] = GREENHOUSE.center
  const { width: w, depth: d, wallHeight: h, ridge } = GREENHOUSE
  const glass = (
    <meshPhysicalMaterial color="#d8f4ff" transparent opacity={0.13} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
  )
  const frame = <meshStandardMaterial color="#e9eef2" roughness={0.4} metalness={0.4} />

  return (
    <group>
      {/* floor slab */}
      <mesh position={[cx, 0.01, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#a8b3a5" roughness={0.95} />
      </mesh>
      {/* walls */}
      <mesh position={[cx, h / 2, cz - d / 2]}>
        <planeGeometry args={[w, h]} />
        {glass}
      </mesh>
      <mesh position={[cx, h / 2, cz + d / 2]}>
        <planeGeometry args={[w, h]} />
        {glass}
      </mesh>
      <mesh position={[cx - w / 2, h / 2, cz]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d, h]} />
        {glass}
      </mesh>
      <mesh position={[cx + w / 2, h / 2, cz]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[d, h]} />
        {glass}
      </mesh>
      {/* gable roof */}
      {[-1, 1].map((s) => {
        const slope = Math.atan2(ridge - h, w / 2)
        const len = Math.hypot(ridge - h, w / 2)
        return (
          <mesh key={s} position={[cx + (s * w) / 4, h + (ridge - h) / 2, cz]} rotation={[0, 0, -s * (Math.PI / 2 - slope)]}>
            <planeGeometry args={[len, d]} />
            {glass}
          </mesh>
        )
      })}
      {/* frame columns */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[cx + (sx * w) / 2, h / 2, cz + (sz * d) / 2]} castShadow>
            <boxGeometry args={[0.1, h, 0.1]} />
            {frame}
          </mesh>
        )),
      )}
      {[-1, 1].map((sz) => (
        <mesh key={sz} position={[cx, h, cz + (sz * d) / 2]}>
          <boxGeometry args={[w, 0.1, 0.1]} />
          {frame}
        </mesh>
      ))}
      <mesh position={[cx, ridge, cz]}>
        <boxGeometry args={[w + 0.2, 0.1, 0.12]} />
        {frame}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[cx, (h + ridge) / 2, cz + (s * d) / 2]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.08, ridge - h, 0.08]} />
          {frame}
        </mesh>
      ))}

      {/* back bench with candidate plants */}
      <Bench position={[cx, 0, GREENHOUSE.backBenchZ]} width={7.4} depth={1.2} height={GREENHOUSE.backBenchY} color="#b9c6a8" />
      {showCandidates &&
        GREENHOUSE.candidateX.map((x, i) => (
          <group key={i} position={[x, GREENHOUSE.backBenchY, GREENHOUSE.backBenchZ]}>
            <Pot position={[0, 0, 0]} />
            <Plant growth={0.75 + (i % 3) * 0.08} height={0.9} leaves={7} leafSize={0.3} seed={20 + i} position={[0, 0.3, 0]} />
          </group>
        ))}

      {/* side table for tools */}
      <Bench position={GREENHOUSE.sideTable} width={1.2} depth={0.9} height={1} color="#cfd6dc" />

      <MotherPlant position={GREENHOUSE.motherStand} highlight={highlightMother} />
      {children}
    </group>
  )
}
