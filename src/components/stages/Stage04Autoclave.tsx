import { Autoclave } from '../Autoclave'
import { Caption } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { ZONES } from '../../data/stages'
import { easeInOut, lerp, phase } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'
import { RACK_SLOTS } from './Stage03Medium'

const AUTO = ZONES.autoclave.position
export const COOLING_SPOT: V3[] = [0, 1, 2, 3].map((i) => [-4.9 + i * 0.3, 1.0, -5.35])
const CHAMBER: V3[] = [0, 1, 2, 3].map((i) => [AUTO[0] - 0.33 + (i % 2) * 0.33, AUTO[1] + 0.85 + Math.floor(i / 2) * 0.0, AUTO[2] + 0.05 - Math.floor(i / 2) * 0.35])

/**
 * Stage 4 – vessels are loaded, the door locks, steam sterilises the medium
 * at 121 °C / 15 psi for 15 minutes, then the vessels come out to cool.
 */
export function Stage04Autoclave({ progress: p }: StageProps) {
  const load = easeInOut(phase(p, 0.02, 0.22))
  const doorClose = 1 - easeInOut(phase(p, 0.24, 0.32))
  const doorOpen = easeInOut(phase(p, 0.82, 0.9))
  const door = p < 0.6 ? doorClose : doorOpen
  const heating = phase(p, 0.34, 0.5)
  const cooling = phase(p, 0.74, 0.82)
  const temperature = p < 0.74 ? lerp(25, 121, easeInOut(heating)) : lerp(121, 60, cooling)
  const active = p > 0.33 && p < 0.8
  const holdT = phase(p, 0.5, 0.74)
  const minutes = Math.max(0, 15 - Math.floor(holdT * 15))
  const seconds = Math.floor((1 - ((holdT * 15) % 1)) * 60) % 60
  const timer = p >= 0.5 && p < 0.74 ? `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : p >= 0.74 && p < 0.9 ? 'DONE' : undefined
  const unload = easeInOut(phase(p, 0.9, 1))

  return (
    <group>
      <Autoclave position={AUTO} door={door} active={active} temperature={p > 0.3 && p < 0.9 ? temperature : undefined} timer={timer} />
      {RACK_SLOTS.map((slot, i) => {
        let pos: V3
        if (p < 0.9) pos = arc(slot, CHAMBER[i], load, 0.8)
        else pos = arc(CHAMBER[i], COOLING_SPOT[i], unload, 0.6)
        const insideClosed = p >= 0.3 && p < 0.86
        return (
          <group key={i} visible={!insideClosed}>
            <CultureVessel position={pos} mediumLevel={0.18} cap={1} />
          </group>
        )
      })}
      {p > 0.02 && p < 0.24 && (
        <Caption position={[AUTO[0], AUTO[1] + 3.1, AUTO[2] + 0.8]} tone="info">
          Loading vessels (caps loosened)
        </Caption>
      )}
      {p >= 0.24 && p < 0.34 && (
        <Caption position={[AUTO[0], AUTO[1] + 3.1, AUTO[2] + 0.8]} tone="info">
          Door locked – pressure building
        </Caption>
      )}
      {p >= 0.34 && p < 0.5 && (
        <Caption position={[AUTO[0], AUTO[1] + 3.1, AUTO[2] + 0.8]} tone="warn">
          Heating to 121 °C · 15 psi
        </Caption>
      )}
      {p >= 0.5 && p < 0.74 && (
        <Caption position={[AUTO[0], AUTO[1] + 3.1, AUTO[2] + 0.8]} tone="warn">
          Sterilising – 15 min at 121 °C kills all spores
        </Caption>
      )}
      {p >= 0.74 && p < 0.9 && (
        <Caption position={[AUTO[0], AUTO[1] + 3.1, AUTO[2] + 0.8]} tone="info">
          Cooling – door opens only when pressure is normal
        </Caption>
      )}
      {p >= 0.9 && (
        <Caption position={[COOLING_SPOT[1][0] + 0.15, 2.0, COOLING_SPOT[1][2]]} tone="ok">
          Sterile medium · cooling to set
        </Caption>
      )}
    </group>
  )
}
