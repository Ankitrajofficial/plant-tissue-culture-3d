import { GREENHOUSE } from '../Greenhouse'
import { Caption, Pot } from '../LabProps'
import { Plant } from '../Plant'
import { easeInOut, easeOutBack, phase } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'

const BENCH_Y = GREENHOUSE.backBenchY
const BENCH_Z = GREENHOUSE.backBenchZ
const ENTRY: V3 = [GREENHOUSE.center[0] + GREENHOUSE.width / 2 + 1.5, BENCH_Y + 0.4, BENCH_Z + 1.5]
const CENTER_X = GREENHOUSE.candidateX[2]

/**
 * Stage 14 – the hardened plantlet and its siblings are transferred to the
 * greenhouse bench and grow under natural light.
 */
export function Stage14Greenhouse({ progress: p }: StageProps) {
  const arrive = easeInOut(phase(p, 0.02, 0.22))
  const mainPos = arc(ENTRY, [CENTER_X, BENCH_Y, BENCH_Z], arrive, 0.5)
  const grow = phase(p, 0.4, 0.96)
  const week = Math.round(grow * 6)

  return (
    <group>
      {GREENHOUSE.candidateX.map((x, i) => {
        const isMain = x === CENTER_X
        const order = Math.abs(i - 2)
        const pop = isMain ? 1 : easeOutBack(phase(p, 0.2 + order * 0.08, 0.3 + order * 0.08))
        if (pop <= 0) return null
        const pos: V3 = isMain ? mainPos : [x, BENCH_Y, BENCH_Z]
        return (
          <group key={i} position={pos} scale={pop}>
            <Pot position={[0, 0, 0]} />
            <Plant growth={0.45 + 0.45 * grow} height={0.9} leaves={8} leafSize={0.3} seed={60 + i} position={[0, 0.3, 0]} />
          </group>
        )
      })}
      {p < 0.24 && (
        <Caption position={[mainPos[0], mainPos[1] + 1.1, mainPos[2]]} tone="info">
          Transfer to greenhouse · 30 – 50 % shade at first
        </Caption>
      )}
      {p >= 0.24 && p < 0.4 && (
        <Caption position={[CENTER_X, BENCH_Y + 1.5, BENCH_Z]} tone="info">
          Batch of identical clones on the bench
        </Caption>
      )}
      {p >= 0.4 && (
        <Caption position={[CENTER_X, BENCH_Y + 1.6, BENCH_Z]} tone={grow >= 1 ? 'ok' : 'info'}>
          {grow >= 1 ? 'Autotrophic plants · survival > 90 %' : `Week ${week} – photosynthesising, thick cuticle forming`}
        </Caption>
      )}
    </group>
  )
}
