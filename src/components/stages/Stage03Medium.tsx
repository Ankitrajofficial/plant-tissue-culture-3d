import { useMemo } from 'react'
import { Beaker, Bottle, Caption, PHMeter } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { easeInOut, lerp, phase, pulse, seeded } from '../../utils/animations'
import { arc, type StageProps, type V3 } from './types'

export const MEDIA_BENCH: V3 = [-7, 1, -6]
export const BEAKER_HOME: V3 = [-7.4, 1.13, -5.6]
export const RACK: V3 = [-9.0, 1.06, -6.0]
export const RACK_SLOTS: V3[] = [0, 1, 2, 3].map((i) => [RACK[0] - 0.45 + i * 0.3, RACK[1], RACK[2]])

const INGREDIENTS = [
  { label: 'MS salts', color: '#9ad8ff', home: [-8.6, 1, -6.55] as V3, from: 0.04, to: 0.14 },
  { label: 'Sucrose', color: '#ffffff', home: [-8.2, 1, -6.55] as V3, from: 0.14, to: 0.24 },
  { label: 'Hormones', color: '#c9a3ff', home: [-6.4, 1, -6.55] as V3, from: 0.24, to: 0.34 },
  { label: 'Agar', color: '#f4d9a0', home: [-6.0, 1, -6.55] as V3, from: 0.62, to: 0.72 },
]

/**
 * Stage 3 – ingredients are added to the beaker, the solution is stirred,
 * the pH is corrected to 5.8 and the medium is poured into culture vessels.
 */
export function Stage03Medium({ progress: p }: StageProps) {
  const fill = lerp(0.35, 0.8, phase(p, 0.04, 0.34))
  const colorMix = phase(p, 0.04, 0.34)
  const liquidColor = colorMix < 0.3 ? '#cfe9ff' : colorMix < 0.6 ? '#e7ecd2' : '#f3e3a1'
  const phDip = pulse(p, 0.4, 0.58)
  const phValue = (4.9 + 0.9 * easeInOut(phase(p, 0.44, 0.56))).toFixed(1)
  const pour = easeInOut(phase(p, 0.76, 0.86))
  const vesselFill = phase(p, 0.84, 0.98)

  const beakerPos = arc(BEAKER_HOME, [RACK[0] + 0.2, RACK[1] + 0.75, RACK[2] + 0.1], pour, 0.5)
  const beakerTilt = pour * 1.1 * (p < 0.98 ? 1 : 1 - phase(p, 0.98, 1))
  const beakerLevel = fill * (1 - vesselFill * 0.9)

  const particles = useMemo(() => Array.from({ length: 10 }, (_, i) => ({ x: (seeded(i * 3) - 0.5) * 0.14, z: (seeded(i * 5) - 0.5) * 0.14, d: seeded(i * 7) })), [])

  return (
    <group>
      {/* ingredient bottles: each lifts over the beaker in turn */}
      {INGREDIENTS.map((ing) => {
        const t = phase(p, ing.from, ing.to)
        const up = Math.sin(t * Math.PI)
        const pos = arc(ing.home, [BEAKER_HOME[0] + 0.1, BEAKER_HOME[1] + 0.55, BEAKER_HOME[2]], up, 0.2)
        return (
          <group key={ing.label}>
            <group position={pos} rotation={[0, 0, -up * 1.4]}>
              <Bottle position={[0, 0, 0]} color={ing.color} label={ing.label} scale={0.9} />
            </group>
            {up > 0.6 &&
              particles.map((pt, i) => {
                const fall = ((t * 4 + pt.d) % 1)
                return (
                  <mesh key={i} position={[BEAKER_HOME[0] + pt.x, BEAKER_HOME[1] + 0.5 - fall * 0.35, BEAKER_HOME[2] + pt.z]}>
                    <sphereGeometry args={[0.012, 5, 4]} />
                    <meshStandardMaterial color={ing.color} />
                  </mesh>
                )
              })}
          </group>
        )
      })}

      {/* beaker (moves to the rack when pouring) */}
      <group position={beakerPos} rotation={[0, 0, beakerTilt]}>
        <Beaker position={[0, 0, 0]} radius={0.2} height={0.5} level={beakerLevel} liquidColor={liquidColor} />
      </group>
      {pour > 0.8 && vesselFill < 1 && (
        <mesh position={[RACK[0] + 0.05, RACK[1] + 0.45, RACK[2] + 0.1]}>
          <cylinderGeometry args={[0.02, 0.03, 0.5, 6]} />
          <meshStandardMaterial color="#f3e3a1" transparent opacity={0.8} />
        </mesh>
      )}

      {/* pH meter with live reading; the electrode dips into the beaker */}
      <PHMeter position={[-5.3, 1, -6.1]} reading={p > 0.4 && p < 0.62 ? phValue : undefined} />
      {phDip > 0 && (
        <mesh position={[BEAKER_HOME[0] + 0.12, BEAKER_HOME[1] + 0.55 - phDip * 0.2, BEAKER_HOME[2]]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
          <meshStandardMaterial color="#9fb6c8" />
        </mesh>
      )}

      {/* vessels being filled */}
      {RACK_SLOTS.map((slot, i) => (
        <CultureVessel key={i} position={slot} mediumLevel={0.18 * phase(vesselFill, i * 0.22, i * 0.22 + 0.3)} cap={p > 0.98 ? 1 : 0.75} />
      ))}

      {/* captions describing each sub-step */}
      {p > 0.04 && p < 0.34 && (
        <Caption position={[BEAKER_HOME[0], BEAKER_HOME[1] + 1.5, BEAKER_HOME[2]]} tone="info">
          Dissolving MS salts · sucrose 30 g/L · growth regulators
        </Caption>
      )}
      {p >= 0.34 && p < 0.4 && (
        <Caption position={[BEAKER_HOME[0], BEAKER_HOME[1] + 1.5, BEAKER_HOME[2]]} tone="info">
          Magnetic stirring until clear
        </Caption>
      )}
      {p >= 0.4 && p < 0.62 && (
        <Caption position={[-5.3, 2.35, -6.1]} tone={Number(phValue) >= 5.7 ? 'ok' : 'warn'}>
          Adjusting pH → 5.8 (NaOH / HCl)
        </Caption>
      )}
      {p >= 0.62 && p < 0.76 && (
        <Caption position={[BEAKER_HOME[0], BEAKER_HOME[1] + 1.5, BEAKER_HOME[2]]} tone="info">
          Adding agar 7 g/L and heating to dissolve
        </Caption>
      )}
      {p >= 0.76 && (
        <Caption position={[RACK[0], RACK[1] + 1.25, RACK[2]]} tone={p > 0.98 ? 'ok' : 'info'}>
          {p > 0.98 ? 'Vessels filled · ready for autoclave' : 'Dispensing ~25 mL per vessel'}
        </Caption>
      )}
    </group>
  )
}
