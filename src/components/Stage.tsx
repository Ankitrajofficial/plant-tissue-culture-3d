import { useProgress, useSimulation } from '../hooks/useSimulation'
import { Stage01MotherPlant } from './stages/Stage01MotherPlant'
import { Stage02Explant } from './stages/Stage02Explant'
import { Stage03Medium } from './stages/Stage03Medium'
import { Stage04Autoclave } from './stages/Stage04Autoclave'
import { Stage05Sterilisation } from './stages/Stage05Sterilisation'
import { Stage06Inoculation } from './stages/Stage06Inoculation'
import { Stage07Initiation } from './stages/Stage07Initiation'
import { Stage08Callus } from './stages/Stage08Callus'
import { Stage09ShootInduction } from './stages/Stage09ShootInduction'
import { Stage10Multiplication } from './stages/Stage10Multiplication'
import { Stage11Elongation } from './stages/Stage11Elongation'
import { Stage12Rooting } from './stages/Stage12Rooting'
import { Stage13Acclimatization } from './stages/Stage13Acclimatization'
import { Stage14Greenhouse } from './stages/Stage14Greenhouse'
import { Stage15MaturePlant } from './stages/Stage15MaturePlant'

/**
 * Renders the animated laboratory action for the current stage. This is the
 * only part of the 3D scene that re-renders every frame.
 */
export function Stage() {
  const { stage } = useSimulation()
  const progress = useProgress()

  switch (stage.id) {
    case 1:
      return <Stage01MotherPlant progress={progress} />
    case 2:
      return <Stage02Explant progress={progress} />
    case 3:
      return <Stage03Medium progress={progress} />
    case 4:
      return <Stage04Autoclave progress={progress} />
    case 5:
      return <Stage05Sterilisation progress={progress} />
    case 6:
      return <Stage06Inoculation progress={progress} />
    case 7:
      return <Stage07Initiation progress={progress} />
    case 8:
      return <Stage08Callus progress={progress} />
    case 9:
      return <Stage09ShootInduction progress={progress} />
    case 10:
      return <Stage10Multiplication progress={progress} />
    case 11:
      return <Stage11Elongation progress={progress} />
    case 12:
      return <Stage12Rooting progress={progress} />
    case 13:
      return <Stage13Acclimatization progress={progress} />
    case 14:
      return <Stage14Greenhouse progress={progress} />
    case 15:
      return <Stage15MaturePlant progress={progress} />
    default:
      return null
  }
}
