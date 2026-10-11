import { GREENHOUSE } from '../Greenhouse'
import { Caption, HighlightRing, Pot } from '../LabProps'
import { Plant } from '../Plant'
import { easeInOut, phase } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'

const STAND = GREENHOUSE.cloneStand
const BENCH_Y = GREENHOUSE.backBenchY
const BENCH_Z = GREENHOUSE.backBenchZ
const FROM: V3 = [GREENHOUSE.candidateX[2], BENCH_Y, BENCH_Z]
const TO: V3 = [STAND[0], STAND[1] + 0.9, STAND[2]]

/**
 * Stage 15 – one clone is moved to the display stand and grows to maturity,
 * flowering as a genetically identical copy of the mother plant.
 */
export function Stage15MaturePlant({ progress: p }: StageProps) {
  const move = easeInOut(phase(p, 0.02, 0.2))
  const pos = arc(FROM, TO, move, 0.8)
  const grow = phase(p, 0.22, 0.9)
  const done = p > 0.9

  return (
    <group>
      {/* clones that remain on the bench */}
      {GREENHOUSE.candidateX.map((x, i) =>
        i === 2 ? null : (
          <group key={i} position={[x, BENCH_Y, BENCH_Z]}>
            <Pot position={[0, 0, 0]} />
            <Plant growth={0.9} height={0.9} leaves={8} leafSize={0.3} seed={60 + i} position={[0, 0.3, 0]} />
          </group>
        ),
      )}
      {/* display stand */}
      <mesh position={[STAND[0], STAND[1] + 0.45, STAND[2]]} castShadow receiveShadow>
        <cylinderGeometry args={[0.45, 0.5, 0.9, 20]} />
        <meshStandardMaterial color="#8d99a6" roughness={0.6} />
      </mesh>
      <group position={pos}>
        <Pot position={[0, 0, 0]} scale={1 + 0.3 * grow} />
        <Plant growth={0.6 + 0.4 * grow} height={1.5} leaves={11} leafSize={0.42} seed={3} flower position={[0, 0.3 + 0.1 * grow, 0]} />
      </group>
      {done && <HighlightRing position={[STAND[0], STAND[1] + 0.92, STAND[2]]} radius={0.75} />}
      {p < 0.22 && (
        <Caption position={[pos[0], pos[1] + 1.4, pos[2]]} tone="info">
          Selecting a regenerated plant
        </Caption>
      )}
      {p >= 0.22 && !done && (
        <Caption position={[STAND[0], STAND[1] + 3.3, STAND[2]]} tone="info">
          Growing to maturity – {Math.round(grow * 12)} weeks
        </Caption>
      )}
      {done && (
        <>
          <Caption position={[STAND[0], STAND[1] + 3.5, STAND[2]]} tone="ok">
            ✓ Mature plant · genetically identical clone
          </Caption>
          <Caption position={[GREENHOUSE.motherStand[0], 3.6, GREENHOUSE.motherStand[2]]} tone="info">
            Mother plant – same genotype
          </Caption>
        </>
      )}
    </group>
  )
}
