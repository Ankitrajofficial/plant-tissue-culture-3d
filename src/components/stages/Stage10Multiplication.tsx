import { Caption, Scalpel } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { Shoots } from '../Shoots'
import { easeOutBack, phase } from '../../utils/animations'
import type { StageProps, V3 } from './types'
import { SHELF_VESSEL } from './Stage07Initiation'

const CLONES: V3[] = [
  [SHELF_VESSEL[0] - 1.4, SHELF_VESSEL[1], SHELF_VESSEL[2]],
  [SHELF_VESSEL[0] - 0.7, SHELF_VESSEL[1], SHELF_VESSEL[2]],
  [SHELF_VESSEL[0] + 0.7, SHELF_VESSEL[1], SHELF_VESSEL[2]],
  [SHELF_VESSEL[0] + 1.4, SHELF_VESSEL[1], SHELF_VESSEL[2]],
]

/**
 * Stage 10 – the shoot cluster is divided and re-plated; new vessels appear
 * and the number of clones multiplies.
 */
export function Stage10Multiplication({ progress: p }: StageProps) {
  const cutting = phase(p, 0.06, 0.3)
  const cutOffset = Math.sin(cutting * Math.PI * 5) * 0.05
  const cap = p < 0.04 ? 1 : p < 0.34 ? 0 : 1
  const mainGrow = p < 0.3 ? 1 : 0.55 + 0.45 * phase(p, 0.3, 0.9)
  const totalShoots = Math.round(1 + 4 * phase(p, 0.34, 0.7)) * 5

  return (
    <group>
      <CultureVessel position={SHELF_VESSEL} mediumLevel={0.2} mediumColor="#dfe9b3" cap={cap}>
        <Shoots growth={mainGrow} count={5} height={0.28} spread={0.12} position={[0, 0.05, 0]} />
      </CultureVessel>
      {cutting > 0 && cutting < 1 && (
        <Scalpel position={[SHELF_VESSEL[0] - 0.3, SHELF_VESSEL[1] + 0.5 + cutOffset, SHELF_VESSEL[2] + 0.1]} rotation={[0, 0, -0.9]} />
      )}
      {CLONES.map((c, i) => {
        const s = easeOutBack(phase(p, 0.34 + i * 0.09, 0.44 + i * 0.09))
        if (s <= 0) return null
        return (
          <group key={i} position={c} scale={s}>
            <CultureVessel mediumLevel={0.2} mediumColor="#dfe9b3">
              <Shoots growth={0.5 + 0.5 * phase(p, 0.5, 0.95)} count={4} height={0.24} spread={0.1} position={[0, 0.05, 0]} />
            </CultureVessel>
          </group>
        )
      })}
      <Caption position={[SHELF_VESSEL[0], SHELF_VESSEL[1] + 1.2, SHELF_VESSEL[2]]} tone={p > 0.9 ? 'ok' : 'info'}>
        {p < 0.34 ? 'Dividing the shoot cluster (aseptically)' : p < 0.9 ? `Re-plating on fresh medium · ${totalShoots} shoots` : '1 explant → 5 vessels → ×5 every 4 weeks'}
      </Caption>
    </group>
  )
}
