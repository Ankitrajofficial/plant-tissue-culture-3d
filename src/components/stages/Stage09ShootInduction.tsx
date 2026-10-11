import { Bottle, Caption } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { Callus } from '../Callus'
import { Shoots } from '../Shoots'
import { easeInOut, phase } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'
import { SHELF_VESSEL } from './Stage07Initiation'
import { HORMONE_BOTTLE } from './Stage08Callus'

const OFFSTAGE: V3 = [SHELF_VESSEL[0], SHELF_VESSEL[1] - 0.2, SHELF_VESSEL[2] + 2.2]

/**
 * Stage 9 – the callus is transferred to a cytokinin-rich medium and green
 * shoot buds organise from it.
 */
export function Stage09ShootInduction({ progress: p }: StageProps) {
  const swapOut = easeInOut(phase(p, 0.02, 0.12))
  const swapIn = easeInOut(phase(p, 0.12, 0.24))
  const grow = phase(p, 0.28, 0.95)
  const oldPos = arc(SHELF_VESSEL, OFFSTAGE, swapOut, 0.4)
  const newPos = arc(OFFSTAGE, SHELF_VESSEL, swapIn, 0.4)

  return (
    <group>
      {p < 0.12 && (
        <CultureVessel position={oldPos} mediumLevel={0.2} mediumColor="#efe2a9">
          <Callus growth={1} position={[0, -0.02, 0]} radius={0.17} />
        </CultureVessel>
      )}
      {p >= 0.12 && (
        <CultureVessel position={newPos} mediumLevel={0.2} mediumColor="#dfe9b3">
          <Callus growth={1} position={[0, -0.02, 0]} radius={0.15} color="#dcd59a" />
          <Shoots growth={grow} count={4} height={0.26} spread={0.1} position={[0, 0.1, 0]} />
        </CultureVessel>
      )}
      <Bottle position={HORMONE_BOTTLE} color="#8fd16a" label="BAP (cytokinin)" />
      <Caption position={[SHELF_VESSEL[0], SHELF_VESSEL[1] + 1.2, SHELF_VESSEL[2]]} tone={grow >= 1 ? 'ok' : 'info'}>
        {p < 0.24 ? 'Sub-culture onto BAP medium (cytokinin ≫ auxin)' : grow >= 1 ? 'Shoot buds organised – organogenesis' : `Week ${1 + Math.round(grow * 4)} – meristems forming, turning green`}
      </Caption>
    </group>
  )
}
