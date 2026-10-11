import { Html } from '@react-three/drei'
import { GREENHOUSE } from '../Greenhouse'
import { Caption, HighlightRing } from '../LabProps'
import { phase, easeInOut } from '../../utils/animations'
import type { StageProps, V3 } from './types'

/**
 * Stage 1 – a selector marker scans the candidate plants on the bench and
 * finally settles on the vigorous mother plant.
 */
export function Stage01MotherPlant({ progress: p }: StageProps) {
  const candidates = GREENHOUSE.candidateX
  const scan = phase(p, 0.05, 0.6) * (candidates.length - 1)
  const index = Math.min(candidates.length - 1, Math.floor(scan))
  const frac = easeInOut(scan - index)
  const nextX = candidates[Math.min(index + 1, candidates.length - 1)]
  const scanX = candidates[index] + (nextX - candidates[index]) * frac
  const toMother = easeInOut(phase(p, 0.62, 0.78))
  const selected = phase(p, 0.8, 0.9)

  const scanPos: V3 = [scanX, GREENHOUSE.backBenchY + 1.5, GREENHOUSE.backBenchZ]
  const motherPos: V3 = [GREENHOUSE.motherStand[0], 3.2, GREENHOUSE.motherStand[2]]
  const markerPos: V3 = [
    scanPos[0] + (motherPos[0] - scanPos[0]) * toMother,
    scanPos[1] + (motherPos[1] - scanPos[1]) * toMother,
    scanPos[2] + (motherPos[2] - scanPos[2]) * toMother,
  ]

  return (
    <group>
      {/* scanning marker */}
      {p > 0.05 && (
        <group position={markerPos}>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.12, 0.3, 4]} />
            <meshStandardMaterial color={selected > 0 ? '#5ad67d' : '#f4b860'} emissive={selected > 0 ? '#5ad67d' : '#f4b860'} emissiveIntensity={1.2} />
          </mesh>
          <Html position={[0, 0.4, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div className="tag">{selected > 0 ? 'Selected ✓' : toMother > 0 ? 'Comparing…' : 'Inspecting'}</div>
          </Html>
        </group>
      )}
      {/* ring on the chosen mother plant */}
      {selected > 0 && <HighlightRing position={[GREENHOUSE.motherStand[0], 0.92, GREENHOUSE.motherStand[2]]} radius={0.75} />}
      {/* verdicts above the candidates */}
      {p > 0.62 &&
        candidates.map((x, i) => (
          <Caption key={i} position={[x, GREENHOUSE.backBenchY + 1.35, GREENHOUSE.backBenchZ]} tone={i % 3 === 0 ? 'warn' : 'ok'}>
            {i % 3 === 0 ? '✗ weak / off-type' : '✓ healthy'}
          </Caption>
        ))}
      {selected >= 1 && (
        <Caption position={[GREENHOUSE.motherStand[0], 3.75, GREENHOUSE.motherStand[2]]} tone="ok">
          Mother plant: vigorous · disease-free · true-to-type
        </Caption>
      )}
    </group>
  )
}
