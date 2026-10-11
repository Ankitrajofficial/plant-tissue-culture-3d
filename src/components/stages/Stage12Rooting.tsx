import { Bottle, Caption } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { Plant } from '../Plant'
import { Roots } from '../Roots'
import { easeInOut, phase } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'
import { SHELF_VESSEL } from './Stage07Initiation'
import { HORMONE_BOTTLE } from './Stage08Callus'

const OFFSTAGE: V3 = [SHELF_VESSEL[0], SHELF_VESSEL[1] - 0.2, SHELF_VESSEL[2] + 2.2]

/**
 * Stage 12 – a single shoot is moved to half-strength MS with IBA; adventitious
 * roots emerge from its base, completing the plantlet.
 */
export function Stage12Rooting({ progress: p }: StageProps) {
  const swapIn = easeInOut(phase(p, 0.02, 0.16))
  const pos = arc(OFFSTAGE, SHELF_VESSEL, swapIn, 0.4)
  const grow = phase(p, 0.22, 0.94)
  return (
    <group>
      <CultureVessel position={pos} mediumLevel={0.2} mediumColor="#f4f0d6">
        <Plant growth={1} height={0.5} leaves={6} leafSize={0.24} seed={41} />
        <Roots growth={grow} count={7} length={0.17} position={[0, 0.005, 0]} />
      </CultureVessel>
      <Bottle position={HORMONE_BOTTLE} color="#ffb6a3" label="IBA (auxin) · ½ MS" />
      <Caption position={[SHELF_VESSEL[0], SHELF_VESSEL[1] + 1.25, SHELF_VESSEL[2]]} tone={grow >= 1 ? 'ok' : 'info'}>
        {p < 0.16 ? 'Single shoot → rooting medium (½ MS + IBA)' : grow >= 1 ? 'Complete plantlet: shoot + adventitious roots' : `Week ${1 + Math.round(grow * 3)} – roots emerging from the stem base`}
      </Caption>
    </group>
  )
}
