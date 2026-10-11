import { LaminarFlowCabinet } from '../LaminarFlowCabinet'
import { Caption, Forceps, PetriDish } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { Explant } from '../Explant'
import { ZONES } from '../../data/stages'
import { easeInOut, phase, pulse } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'

const LAM = ZONES.laminar.position
const Y = LAM[1] + 1
export const INOC_VESSEL: V3 = [LAM[0], Y, LAM[2]]
const DISH: V3 = [LAM[0] - 1.2, Y, LAM[2] + 0.5]
const FLAME: V3 = [LAM[0] + 1.5, Y + 0.45, LAM[2] - 0.2]
const HOME: V3 = [LAM[0] + 0.9, Y + 0.3, LAM[2] + 0.6]

/**
 * Stage 6 – forceps are flamed, the explant is lifted from the dish and
 * placed on the medium; the vessel is capped and sealed.
 */
export function Stage06Inoculation({ progress: p }: StageProps) {
  const toFlame = easeInOut(phase(p, 0.02, 0.12))
  const flaming = p > 0.12 && p < 0.2
  const toDish = easeInOut(phase(p, 0.2, 0.3))
  const capOff = 1 - easeInOut(phase(p, 0.3, 0.42))
  const capOn = easeInOut(phase(p, 0.72, 0.84))
  const cap = p < 0.6 ? capOff : capOn
  const toVessel = easeInOut(phase(p, 0.44, 0.6))
  const lower = easeInOut(phase(p, 0.6, 0.7))
  const retreat = easeInOut(phase(p, 0.7, 0.8))
  const seal = phase(p, 0.86, 0.96)

  const above: V3 = [INOC_VESSEL[0], INOC_VESSEL[1] + 1.05, INOC_VESSEL[2]]
  const onMedium: V3 = [INOC_VESSEL[0], INOC_VESSEL[1] + 0.2 + 0.13, INOC_VESSEL[2]]
  const dishPick: V3 = [DISH[0], DISH[1] + 0.12, DISH[2]]

  let hand: V3 = HOME
  if (p < 0.12) hand = arc(HOME, FLAME, toFlame, 0.2)
  else if (p < 0.2) hand = [FLAME[0] + Math.sin(p * 60) * 0.06, FLAME[1] + 0.1, FLAME[2]]
  else if (p < 0.3) hand = arc([FLAME[0], FLAME[1] + 0.1, FLAME[2]], dishPick, toDish, 0.3)
  else if (p < 0.44) hand = dishPick
  else if (p < 0.6) hand = arc(dishPick, above, toVessel, 0.3)
  else if (p < 0.7) hand = [above[0], above[1] - (above[1] - onMedium[1]) * lower, above[2]]
  else if (p < 0.8) hand = arc(onMedium, HOME, retreat, 0.6)
  else hand = HOME

  const explantWithHand = p >= 0.3 && p < 0.7
  const explantPos: V3 = p < 0.3 ? dishPick : explantWithHand ? hand : onMedium

  return (
    <group>
      <LaminarFlowCabinet position={LAM} active flame>
        <PetriDish position={[DISH[0] - LAM[0], 0, DISH[2] - LAM[2]]} lid={p > 0.22 && p < 0.9 ? 0 : 1} />
      </LaminarFlowCabinet>
      <CultureVessel position={INOC_VESSEL} mediumLevel={0.2} cap={cap}>
        {p >= 0.7 && <Explant position={[0, 0.13, 0]} />}
      </CultureVessel>
      {/* Parafilm seal */}
      {seal > 0 && (
        <mesh position={[INOC_VESSEL[0], INOC_VESSEL[1] + 0.76, INOC_VESSEL[2]]} scale={[1, seal, 1]}>
          <cylinderGeometry args={[0.285, 0.285, 0.12, 24, 1, true]} />
          <meshStandardMaterial color="#f7f3e3" transparent opacity={0.8} />
        </mesh>
      )}
      <Forceps position={[hand[0] - 0.18, hand[1] + 0.06, hand[2]]} rotation={[0, 0, -1.15]} open={explantWithHand ? 0.1 : 0.4} />
      {p < 0.7 && <Explant position={[explantPos[0], explantPos[1] - (explantWithHand ? 0.1 : 0), explantPos[2]]} rotation={[0, 0, 0.1]} />}
      {flaming && (
        <Caption position={[FLAME[0], FLAME[1] + 0.6, FLAME[2]]} tone="warn">
          Flaming forceps
        </Caption>
      )}
      {p >= 0.3 && p < 0.44 && (
        <Caption position={[DISH[0], DISH[1] + 0.6, DISH[2]]} tone="info">
          Trimming dead edges, picking up explant
        </Caption>
      )}
      {p >= 0.44 && p < 0.72 && (
        <Caption position={[INOC_VESSEL[0], INOC_VESSEL[1] + 1.35, INOC_VESSEL[2]]} tone="info">
          Basal end into the medium · vessel open only in the air stream
        </Caption>
      )}
      {p >= 0.72 && p < 0.86 && (
        <Caption position={[INOC_VESSEL[0], INOC_VESSEL[1] + 1.35, INOC_VESSEL[2]]} tone="info">
          Capping quickly
        </Caption>
      )}
      {p >= 0.86 && (
        <Caption position={[INOC_VESSEL[0], INOC_VESSEL[1] + 1.35, INOC_VESSEL[2]]} tone="ok">
          {seal < 1 ? 'Sealing with Parafilm' : 'Sealed · the explant is now IN VITRO'}
        </Caption>
      )}
      {pulse(p, 0.12, 0.2) > 0 && <pointLight position={FLAME} intensity={3} distance={2} color="#ffb347" />}
    </group>
  )
}
