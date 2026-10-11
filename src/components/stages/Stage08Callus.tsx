import { Bottle, Caption } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { Explant } from '../Explant'
import { Callus } from '../Callus'
import { phase } from '../../utils/animations'
import type { StageProps, V3 } from './types'
import { SHELF_VESSEL } from './Stage07Initiation'

export const HORMONE_BOTTLE: V3 = [11.6, 1.8, -5.7]

/**
 * Stage 8 – on an auxin-rich medium the cut surface de-differentiates into a
 * pale callus mass.
 */
export function Stage08Callus({ progress: p }: StageProps) {
  const grow = phase(p, 0.12, 0.92)
  const week = 3 + Math.round(grow * 3)
  return (
    <group>
      <CultureVessel position={SHELF_VESSEL} mediumLevel={0.2} mediumColor="#efe2a9">
        <Explant position={[0, 0.13, 0]} swell={1} />
        <Callus growth={grow} position={[0, -0.02, 0]} radius={0.17} />
      </CultureVessel>
      <Bottle position={HORMONE_BOTTLE} color="#c9a3ff" label="2,4-D (auxin)" />
      <Caption position={[SHELF_VESSEL[0], SHELF_VESSEL[1] + 1.2, SHELF_VESSEL[2]]} tone={grow >= 1 ? 'ok' : 'info'}>
        {p < 0.12 ? 'Transfer to callus-induction medium (2,4-D)' : grow >= 1 ? 'Friable callus formed – totipotent cells' : `Week ${week} – cells de-differentiating`}
      </Caption>
    </group>
  )
}
