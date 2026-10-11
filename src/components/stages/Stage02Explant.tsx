import { GREENHOUSE } from '../Greenhouse'
import { Caption, PetriDish, Scalpel } from '../LabProps'
import { Explant } from '../Explant'
import { easeInOut, phase, pulse } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'

/** Position of the node on the mother plant that will be excised */
export const NODE_POS: V3 = [GREENHOUSE.motherStand[0] + 0.25, 2.25, GREENHOUSE.motherStand[2] + 0.3]
const TABLE: V3 = [GREENHOUSE.sideTable[0], 1.0, GREENHOUSE.sideTable[2]]
const SCALPEL_HOME: V3 = [TABLE[0] + 0.1, TABLE[1] + 0.03, TABLE[2] - 0.3]
const DISH: V3 = [TABLE[0] - 0.1, TABLE[1], TABLE[2] + 0.15]

/**
 * Stage 2 – the scalpel travels to the node, cuts, and the explant is carried
 * to a covered petri dish.
 */
export function Stage02Explant({ progress: p }: StageProps) {
  const approach = easeInOut(phase(p, 0.05, 0.3))
  const cutting = phase(p, 0.3, 0.5)
  const carry = easeInOut(phase(p, 0.55, 0.78))
  const back = easeInOut(phase(p, 0.8, 0.95))
  const lid = 1 - pulse(p, 0.5, 0.95)

  const cutOffset = Math.sin(cutting * Math.PI * 6) * 0.04
  const scalpelAtNode: V3 = [NODE_POS[0] - 0.28, NODE_POS[1] + 0.02 + cutOffset, NODE_POS[2] + 0.05]
  let scalpelPos = arc(SCALPEL_HOME, scalpelAtNode, approach, 0.5)
  if (p > 0.55) scalpelPos = arc(scalpelAtNode, SCALPEL_HOME, back, 0.5)

  const detached = p > 0.5
  const explantPos: V3 = detached ? arc(NODE_POS, [DISH[0], DISH[1] + 0.05, DISH[2]], carry, 0.7) : NODE_POS

  return (
    <group>
      <PetriDish position={DISH} lid={lid} />
      <Scalpel position={scalpelPos} rotation={[0, 0.3, approach * -0.5]} />
      <Explant position={explantPos} rotation={detached ? [0, 0, (1 - carry) * 0.4] : [0, 0, 0.25]} />
      {cutting > 0 && cutting < 1 && (
        <Caption position={[NODE_POS[0], NODE_POS[1] + 0.5, NODE_POS[2]]} tone="info">
          Cutting nodal segment (1 – 2 cm)
        </Caption>
      )}
      {carry > 0 && carry < 1 && (
        <Caption position={[explantPos[0], explantPos[1] + 0.35, explantPos[2]]} tone="info">
          Explant → collection dish
        </Caption>
      )}
      {p > 0.95 && (
        <Caption position={[DISH[0], DISH[1] + 0.6, DISH[2]]} tone="ok">
          Explant collected · to the laboratory
        </Caption>
      )}
    </group>
  )
}
