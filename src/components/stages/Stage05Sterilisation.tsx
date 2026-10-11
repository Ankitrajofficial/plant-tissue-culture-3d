import { LaminarFlowCabinet } from '../LaminarFlowCabinet'
import { Beaker, Caption, Forceps, PetriDish } from '../LabProps'
import { Explant } from '../Explant'
import { ZONES } from '../../data/stages'
import { easeInOut, phase } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'

const LAM = ZONES.laminar.position
const Y = LAM[1] + 1
export const STERIL_BEAKERS: { pos: V3; label: string; color: string }[] = [
  { pos: [LAM[0] - 1.4, Y, LAM[2] + 0.4], label: '70 % Ethanol · 30 s', color: '#cfe9ff' },
  { pos: [LAM[0] - 0.4, Y, LAM[2] + 0.4], label: '1 % NaOCl · 10 min', color: '#e8fbd0' },
  { pos: [LAM[0] + 0.8, Y, LAM[2] + 0.4], label: 'Sterile water · ×3', color: '#d8f1ff' },
]
const DISH_IN: V3 = [LAM[0] - 1.6, Y, LAM[2] - 0.4]
const DISH_OUT: V3 = [LAM[0] + 1.2, Y, LAM[2] - 0.4]

/**
 * Stage 5 – forceps carry the explant through ethanol, sodium hypochlorite
 * and three rinses of sterile water.
 */
export function Stage05Sterilisation({ progress: p }: StageProps) {
  const dipDepth = 0.26
  // sequence of waypoints (position above beaker, then dip)
  const steps: { from: number; to: number; target: V3; dips: number }[] = [
    { from: 0.05, to: 0.16, target: STERIL_BEAKERS[0].pos, dips: 1 },
    { from: 0.2, to: 0.52, target: STERIL_BEAKERS[1].pos, dips: 1 },
    { from: 0.56, to: 0.86, target: STERIL_BEAKERS[2].pos, dips: 3 },
    { from: 0.88, to: 0.97, target: DISH_OUT, dips: 0 },
  ]

  let pos: V3 = [DISH_IN[0], DISH_IN[1] + 0.05, DISH_IN[2]]
  let prev: V3 = pos
  let dipping = 0
  let stepIndex = -1
  for (let i = 0; i < steps.length; i++) {
    const s = steps[i]
    const travelEnd = s.from + (s.to - s.from) * 0.3
    if (p < s.from) break
    stepIndex = i
    const above: V3 = [s.target[0], s.target[1] + 0.55, s.target[2]]
    if (p < travelEnd) {
      const t = easeInOut(phase(p, s.from, travelEnd))
      pos = arc(prev, above, t, 0.25)
      prev = above
      break
    }
    const t = phase(p, travelEnd, s.to)
    if (s.dips > 0) {
      dipping = Math.sin(Math.min(1, t) * Math.PI * s.dips) ** 2
      // hold under the liquid in the middle of the step for single dips
      if (s.dips === 1) dipping = Math.min(1, Math.sin(t * Math.PI) * 1.6)
      pos = [above[0], above[1] - dipping * dipDepth, above[2]]
    } else {
      pos = [above[0], above[1] - t * 0.5, above[2]]
    }
    prev = above
  }

  const explantPos: V3 = [pos[0], pos[1] - 0.12, pos[2]]
  const current = steps[stepIndex]
  const stepLabel = stepIndex === 0 ? 'Ethanol wets the surface' : stepIndex === 1 ? 'Hypochlorite kills bacteria & fungi' : stepIndex === 2 ? 'Rinsing away the sterilant' : stepIndex === 3 ? 'Surface-sterile explant' : 'Explant from the field'

  return (
    <group>
      <LaminarFlowCabinet position={LAM} active flame={false}>
        {STERIL_BEAKERS.map((b, i) => (
          <Beaker key={i} position={[b.pos[0] - LAM[0], 0, b.pos[2] - LAM[2]]} level={0.65} liquidColor={b.color} label={b.label} />
        ))}
        <PetriDish position={[DISH_IN[0] - LAM[0], 0, DISH_IN[2] - LAM[2]]} lid={p < 0.05 ? 1 : 0} />
        <PetriDish position={[DISH_OUT[0] - LAM[0], 0, DISH_OUT[2] - LAM[2]]} lid={p > 0.97 ? 1 : 0} />
      </LaminarFlowCabinet>
      <Forceps position={[pos[0] - 0.2, pos[1] + 0.05, pos[2]]} rotation={[0, 0, -1.1]} open={dipping > 0 ? 0.1 : 0.3} />
      <Explant position={explantPos} rotation={[0, 0, 0.1]} />
      <Caption position={[pos[0], pos[1] + 0.55, pos[2]]} tone={stepIndex === 3 ? 'ok' : 'info'}>
        {stepLabel}
      </Caption>
      {current && current.dips > 0 && dipping > 0.05 && (
        <Caption position={[current.target[0], current.target[1] + 0.95, current.target[2]]} tone="warn">
          {stepIndex === 0 ? '30 s' : stepIndex === 1 ? `${Math.round(phase(p, current.from, current.to) * 10)} min` : `rinse ${Math.min(3, Math.ceil(phase(p, current.from, current.to) * 3))} / 3`}
        </Caption>
      )}
    </group>
  )
}
