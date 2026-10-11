import { Bottle, Caption } from '../LabProps'
import { CultureVessel } from '../CultureVessel'
import { Plant } from '../Plant'
import { lerp, phase } from '../../utils/animations'
import type { StageProps } from './types'
import { SHELF_VESSEL } from './Stage07Initiation'
import { HORMONE_BOTTLE } from './Stage08Callus'

/**
 * Stage 11 – on low-cytokinin medium (± GA₃) the shoots stretch and unfold
 * their leaves until they are 2 – 4 cm long.
 */
export function Stage11Elongation({ progress: p }: StageProps) {
  const grow = phase(p, 0.08, 0.92)
  const height = lerp(0.28, 0.5, grow)
  return (
    <group>
      <CultureVessel position={SHELF_VESSEL} mediumLevel={0.2} mediumColor="#e9eec4">
        {[0, 1, 2].map((i) => (
          <Plant
            key={i}
            growth={0.7 + 0.3 * grow}
            height={height * (0.85 + i * 0.1)}
            leaves={6}
            leafSize={0.16 + 0.1 * grow}
            seed={30 + i}
            position={[i === 0 ? 0 : i === 1 ? 0.1 : -0.09, 0, i === 2 ? 0.08 : -0.04]}
            rotation={[(i - 1) * 0.15, i * 2, 0]}
          />
        ))}
      </CultureVessel>
      <Bottle position={HORMONE_BOTTLE} color="#ffd166" label="GA₃ · low BAP" />
      <Caption position={[SHELF_VESSEL[0], SHELF_VESSEL[1] + 1.25, SHELF_VESSEL[2]]} tone={grow >= 1 ? 'ok' : 'info'}>
        {grow >= 1 ? 'Shoots 2 – 4 cm with 3 – 4 leaves · ready to root' : `Internodes elongating · shoot ${(1 + grow * 2.5).toFixed(1)} cm`}
      </Caption>
    </group>
  )
}
