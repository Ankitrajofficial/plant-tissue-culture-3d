import { Html } from '@react-three/drei'
import { Beaker, Caption, HumidityDome, Pot, Steam, Tray } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { Plant } from '../Plant'
import { Roots } from '../Roots'
import { ZONES } from '../../data/stages'
import { easeInOut, lerp, phase, pulse } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'

const H = ZONES.hardening.position
const Y = H[1] + 1
export const BASIN: V3 = [H[0] - 1.4, Y, H[2] + 0.4]
export const TRAY: V3 = [H[0], Y, H[2]]
const POTS: V3[] = [
  [TRAY[0] - 0.45, Y + 0.06, TRAY[2]],
  [TRAY[0], Y + 0.06, TRAY[2]],
  [TRAY[0] + 0.45, Y + 0.06, TRAY[2]],
]
const VESSEL_START: V3 = [H[0] - 2.6, Y + 0.4, H[2] + 1.4]
const VESSEL_SPOT: V3 = [H[0] - 1.4, Y, H[2] - 0.5]

/**
 * Stage 13 – the plantlet is taken out of the jar, its agar is washed off,
 * it is potted and placed under a humidity dome that is opened gradually.
 */
export function Stage13Acclimatization({ progress: p }: StageProps) {
  const arrive = easeInOut(phase(p, 0.02, 0.16))
  const vesselPos = arc(VESSEL_START, VESSEL_SPOT, arrive, 0.4)
  const cap = 1 - easeInOut(phase(p, 0.18, 0.24))
  const liftOut = easeInOut(phase(p, 0.24, 0.34))
  const toBasin = easeInOut(phase(p, 0.34, 0.44))
  const wash = pulse(p, 0.44, 0.54)
  const toPot = easeInOut(phase(p, 0.54, 0.66))
  const plantDown = easeInOut(phase(p, 0.66, 0.72))
  const domeDown = 1 - easeInOut(phase(p, 0.74, 0.8))
  const hardening = phase(p, 0.82, 1)
  const humidity = Math.round(lerp(90, 60, hardening))
  const domeLift = p < 0.74 ? 1.1 : 0.9 * domeDown + hardening * 0.3

  const inVessel: V3 = [vesselPos[0], vesselPos[1] + 0.21, vesselPos[2]]
  const aboveVessel: V3 = [VESSEL_SPOT[0], VESSEL_SPOT[1] + 1.1, VESSEL_SPOT[2]]
  const aboveBasin: V3 = [BASIN[0], BASIN[1] + 0.75, BASIN[2]]
  const inBasin: V3 = [BASIN[0], BASIN[1] + 0.75 - wash * 0.3, BASIN[2]]
  const abovePot: V3 = [POTS[1][0], POTS[1][1] + 0.9, POTS[1][2]]
  const inPot: V3 = [POTS[1][0], POTS[1][1] + 0.3, POTS[1][2]]

  let plantPos: V3 = inVessel
  if (p >= 0.24 && p < 0.34) plantPos = [inVessel[0], inVessel[1] + (aboveVessel[1] - inVessel[1]) * liftOut, inVessel[2]]
  else if (p >= 0.34 && p < 0.44) plantPos = arc(aboveVessel, aboveBasin, toBasin, 0.2)
  else if (p >= 0.44 && p < 0.54) plantPos = inBasin
  else if (p >= 0.54 && p < 0.66) plantPos = arc(aboveBasin, abovePot, toPot, 0.3)
  else if (p >= 0.66 && p < 0.72) plantPos = [abovePot[0], abovePot[1] + (inPot[1] - abovePot[1]) * plantDown, abovePot[2]]
  else if (p >= 0.72) plantPos = inPot

  const agar = p < 0.44 ? 1 : 1 - wash
  const growth = 0.75 + 0.25 * hardening

  return (
    <group>
      <Beaker position={BASIN} radius={0.3} height={0.4} level={0.6} liquidColor="#d8f1ff" label="Lukewarm water" />
      <Tray position={TRAY} />
      {POTS.map((pt, i) => (
        <Pot key={i} position={pt} scale={0.8} />
      ))}
      {/* sibling plantlets already potted */}
      <Plant growth={0.7 + 0.2 * hardening} height={0.45} leaves={6} leafSize={0.2} seed={51} position={[POTS[0][0], POTS[0][1] + 0.3, POTS[0][2]]} />
      <Plant growth={0.7 + 0.2 * hardening} height={0.45} leaves={6} leafSize={0.2} seed={52} position={[POTS[2][0], POTS[2][1] + 0.3, POTS[2][2]]} />

      {p < 0.72 && (
        <CultureVessel position={vesselPos} mediumLevel={0.2} mediumColor="#f4f0d6" cap={cap} />
      )}
      <group position={plantPos}>
        <Plant growth={growth} height={0.5} leaves={6} leafSize={0.24} seed={41} />
        <Roots growth={1} count={7} length={0.17} position={[0, 0.005, 0]} />
        {agar > 0.02 && (
          <mesh position={[0, -0.06, 0]} scale={agar}>
            <sphereGeometry args={[0.14, 10, 8]} />
            <meshStandardMaterial color="#f4f0d6" transparent opacity={0.6} />
          </mesh>
        )}
      </group>

      <HumidityDome position={[TRAY[0], TRAY[1] + 0.06, TRAY[2]]} radius={1.0} lift={domeLift} />
      <Steam position={[TRAY[0], TRAY[1] + 0.2, TRAY[2]]} active={p > 0.8} count={10} spread={0.5} rise={0.6} size={0.06} color="#eaf6ff" />
      {p > 0.8 && (
        <Html position={[TRAY[0] + 1.1, TRAY[1] + 1.1, TRAY[2]]} center distanceFactor={7} style={{ pointerEvents: 'none' }}>
          <div className="readout">
            <span>RH {humidity} %</span>
            <span>Day {Math.round(hardening * 21)}</span>
          </div>
        </Html>
      )}

      {p < 0.24 && (
        <Caption position={[vesselPos[0], vesselPos[1] + 1.25, vesselPos[2]]} tone="info">
          Rooted plantlet arrives from the culture room
        </Caption>
      )}
      {p >= 0.24 && p < 0.44 && (
        <Caption position={[plantPos[0], plantPos[1] + 0.7, plantPos[2]]} tone="info">
          Gently removing the plantlet
        </Caption>
      )}
      {p >= 0.44 && p < 0.54 && (
        <Caption position={[BASIN[0], BASIN[1] + 1.3, BASIN[2]]} tone="info">
          Washing off agar – sugar gel would feed fungi
        </Caption>
      )}
      {p >= 0.54 && p < 0.74 && (
        <Caption position={[POTS[1][0], POTS[1][1] + 1.3, POTS[1][2]]} tone="info">
          Potting in sterile peat : perlite
        </Caption>
      )}
      {p >= 0.74 && (
        <Caption position={[TRAY[0], TRAY[1] + 1.55, TRAY[2]]} tone={hardening >= 1 ? 'ok' : 'info'}>
          {hardening >= 1 ? 'Hardened – stomata and cuticle now functional' : 'Humidity dome · reduce RH a little every day'}
        </Caption>
      )}
    </group>
  )
}
