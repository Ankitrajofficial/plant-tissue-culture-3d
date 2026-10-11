import { Caption } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { Explant } from '../Explant'
import { easeInOut, phase } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'
import { INOC_VESSEL } from './Stage06Inoculation'

export const SHELF_VESSEL: V3 = [10, 1.8, -5.6]
const CONTAM: V3 = [9.3, 1.8, -5.7]

/**
 * Stage 7 – the sealed vessel is moved to the culture room; the bud swells
 * over three weeks while a contaminated neighbour is spotted and removed.
 */
export function Stage07Initiation({ progress: p }: StageProps) {
  const move = easeInOut(phase(p, 0.02, 0.28))
  const pos = arc(INOC_VESSEL, SHELF_VESSEL, move, 1.2)
  const grow = phase(p, 0.32, 0.95)
  const day = Math.round(grow * 21)
  const contamVisible = p > 0.45 && p < 0.85
  const contamGone = easeInOut(phase(p, 0.78, 0.85))

  return (
    <group>
      <CultureVessel position={pos} mediumLevel={0.2}>
        <Explant position={[0, 0.13, 0]} swell={grow} />
      </CultureVessel>
      {contamVisible && (
        <group position={[CONTAM[0], CONTAM[1] + contamGone * 1.2, CONTAM[2] + contamGone * 1.0]} scale={1 - contamGone}>
          <CultureVessel mediumLevel={0.2} cloudy>
            <mesh position={[0.05, 0.05, 0.05]}>
              <sphereGeometry args={[0.07, 8, 6]} />
              <meshStandardMaterial color="#8a8f6a" roughness={1} />
            </mesh>
          </CultureVessel>
          <Caption position={[0, 1.05, 0]} tone="warn">
            ✗ Contaminated – discard
          </Caption>
        </group>
      )}
      {p < 0.3 && (
        <Caption position={[pos[0], pos[1] + 1.3, pos[2]]} tone="info">
          To the culture room · 25 °C · 16 h light
        </Caption>
      )}
      {p >= 0.32 && (
        <Caption position={[SHELF_VESSEL[0], SHELF_VESSEL[1] + 1.2, SHELF_VESSEL[2]]} tone={grow >= 1 ? 'ok' : 'info'}>
          {grow >= 1 ? 'Culture established · bud actively growing' : `Day ${day} – explant absorbing nutrients, bud swelling`}
        </Caption>
      )}
    </group>
  )
}
