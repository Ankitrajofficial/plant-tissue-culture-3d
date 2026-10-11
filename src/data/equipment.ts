/**
 * Catalogue of every piece of laboratory equipment in the virtual lab.
 * Each entry has a 3D anchor for its label, a camera shot used when the
 * student clicks it, and a short educational description.
 *
 * Positions must match where the object is rendered in LaboratoryScene.tsx.
 */
export interface EquipmentItem {
  id: string
  name: string
  area: string
  /** World position of the floating label */
  label: [number, number, number]
  camera: { position: [number, number, number]; target: [number, number, number] }
  description: string
  usedIn: string
  /** Small bench-top items: their label is hidden when the camera is far away */
  small?: boolean
}

/** Wide shot of the whole laboratory */
export const OVERVIEW_CAMERA = {
  position: [4, 19, 30] as [number, number, number],
  target: [3, 0.5, -2.5] as [number, number, number],
}

/** Labels of small items are hidden beyond this camera distance (world units) */
export const SMALL_LABEL_DISTANCE = 16

export const EQUIPMENT: EquipmentItem[] = [
  // ---------------- greenhouse ----------------
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    area: 'Greenhouse',
    label: [-16, 5.2, 0],
    camera: { position: [-12, 6, 10], target: [-16, 1.2, 0] },
    description: 'Glass house where the elite mother plants are kept and where hardened plantlets finish growing. Natural light, shading nets and controlled watering keep plants healthy and clean.',
    usedIn: 'Stages 1, 2, 14, 15',
  },
  {
    id: 'mother-stand',
    small: true,
    name: 'Mother plant stand',
    area: 'Greenhouse',
    label: [-16.2, 3.3, 0.6],
    camera: { position: [-14.6, 3.2, 4.6], target: [-16.2, 1.6, 0.6] },
    description: 'The selected donor plant is isolated on its own stand so it can be inspected, pre-treated with fungicide and sampled without touching other plants.',
    usedIn: 'Stages 1, 2',
  },
  // ---------------- media preparation ----------------
  {
    id: 'stirrer',
    small: true,
    name: 'Magnetic stirrer / hot plate',
    area: 'Media preparation bench',
    label: [-7.4, 2.0, -5.6],
    camera: { position: [-7.4, 2.6, -3.0], target: [-7.4, 1.3, -5.6] },
    description: 'A spinning magnet inside the beaker mixes salts, sucrose and agar while the plate heats the solution so the agar dissolves completely.',
    usedIn: 'Stage 3',
  },
  {
    id: 'ph-meter',
    small: true,
    name: 'pH meter',
    area: 'Media preparation bench',
    label: [-5.3, 1.8, -6.1],
    camera: { position: [-5.3, 2.4, -3.6], target: [-5.3, 1.2, -6.1] },
    description: 'Measures the acidity of the medium. Plant media are adjusted to pH 5.6 – 5.8 before autoclaving; outside this range nutrients precipitate and agar will not gel.',
    usedIn: 'Stage 3',
  },
  {
    id: 'balance',
    small: true,
    name: 'Analytical balance',
    area: 'Media preparation bench',
    label: [-4.6, 1.7, -6.6],
    camera: { position: [-4.6, 2.4, -4.0], target: [-4.6, 1.2, -6.6] },
    description: 'Weighs MS salts, sucrose, agar and hormone powders to the milligram. Accurate weighing is the first step of reproducible media.',
    usedIn: 'Stage 3',
  },
  {
    id: 'reagents',
    small: true,
    name: 'Reagent & hormone stocks',
    area: 'Media preparation bench',
    label: [-8.4, 1.9, -6.6],
    camera: { position: [-8.4, 2.4, -4.2], target: [-8.4, 1.2, -6.6] },
    description: 'MS basal salts, sucrose, agar and plant growth regulators (auxins such as 2,4-D / IBA, cytokinins such as BAP). Hormone stocks are kept in the refrigerator between uses.',
    usedIn: 'Stages 3, 8, 9, 11, 12',
  },
  {
    id: 'vessel-rack',
    small: true,
    name: 'Culture vessel rack',
    area: 'Media preparation bench',
    label: [-9.0, 1.7, -6.0],
    camera: { position: [-9.0, 2.4, -3.8], target: [-9.0, 1.3, -6.0] },
    description: 'Holds the glass jars or test tubes while medium is dispensed. Vessels are capped loosely for autoclaving and tightened once sterile.',
    usedIn: 'Stages 3, 4',
  },
  // ---------------- sterilisation ----------------
  {
    id: 'autoclave',
    name: 'Autoclave',
    area: 'Sterilisation',
    label: [-2, 3.1, -6.0],
    camera: { position: [-2.4, 3.2, -1.4], target: [-2.2, 1.6, -6.4] },
    description: 'Pressure steriliser. Saturated steam at 121 °C and 15 psi for 15 – 20 min destroys bacteria, fungi and their spores in media, water and instruments.',
    usedIn: 'Stage 4',
  },
  {
    id: 'biohazard-bin',
    small: true,
    name: 'Biohazard waste bin',
    area: 'Sterilisation',
    label: [0.2, 1.5, -7.2],
    camera: { position: [0.4, 2.2, -4.6], target: [0.2, 0.6, -7.2] },
    description: 'Contaminated cultures and used plant material are collected here and autoclaved before disposal so that no micro-organisms spread through the lab.',
    usedIn: 'Stage 7',
  },
  // ---------------- aseptic area ----------------
  {
    id: 'laminar',
    name: 'Laminar flow cabinet',
    area: 'Aseptic transfer area',
    label: [3.5, 4.1, -6.0],
    camera: { position: [3.6, 3.0, -2.4], target: [3.5, 1.7, -6.0] },
    description: 'HEPA-filtered air flows horizontally over the work surface, keeping it free of airborne microbes. All opening of sterile vessels happens inside this cabinet.',
    usedIn: 'Stages 5, 6, 10',
  },
  {
    id: 'spirit-lamp',
    small: true,
    name: 'Spirit lamp',
    area: 'Aseptic transfer area',
    label: [5.0, 1.75, -6.2],
    camera: { position: [5.0, 2.3, -4.2], target: [5.0, 1.3, -6.2] },
    description: 'Forceps and scalpels are dipped in ethanol and flamed between every explant. The mouth of each vessel is also passed through the flame.',
    usedIn: 'Stage 6',
  },
  // ---------------- culture room ----------------
  {
    id: 'culture-shelf',
    name: 'Culture room shelving',
    area: 'Culture room',
    label: [10, 4.3, -6.0],
    camera: { position: [9.6, 3.4, -1.6], target: [10, 2.0, -6.0] },
    description: 'Lit shelves hold hundreds of vessels at 25 ± 2 °C under a 16 h photoperiod from cool-white tubes. Timers and air-conditioning keep conditions constant.',
    usedIn: 'Stages 7 – 12',
  },
  // ---------------- hardening ----------------
  {
    id: 'hardening',
    name: 'Hardening chamber',
    area: 'Acclimatization',
    label: [16, 2.9, -3.0],
    camera: { position: [15.6, 3.2, 1.6], target: [16, 1.5, -3.0] },
    description: 'Trays of potted plantlets under a transparent humidity dome with misting. Humidity is lowered day by day so the plants develop a cuticle and working stomata.',
    usedIn: 'Stage 13',
  },
  // ---------------- right wall ----------------
  {
    id: 'fridge',
    name: 'Refrigerator / freezer',
    area: 'Storage',
    label: [19.6, 2.5, -7.0],
    camera: { position: [16.8, 2.6, -5.4], target: [19.6, 1.1, -7.0] },
    description: 'Stores hormone stock solutions, vitamins and poured media at 4 °C, and long-term stocks at −20 °C. Light- and heat-sensitive growth regulators degrade at room temperature.',
    usedIn: 'Stages 3, 8, 9, 12',
  },
  {
    id: 'growth-chamber',
    name: 'Plant growth chamber',
    area: 'Culture room',
    label: [19.6, 2.5, -5.2],
    camera: { position: [16.8, 2.6, -3.8], target: [19.6, 1.1, -5.2] },
    description: 'Programmable cabinet with its own lights, temperature and humidity control. Used for small experiments that need conditions different from the main culture room.',
    usedIn: 'Stages 7 – 12',
  },
  {
    id: 'incubator-shaker',
    name: 'Orbital incubator shaker',
    area: 'Culture room',
    label: [19.4, 2.1, -0.6],
    camera: { position: [16.6, 2.4, 0.6], target: [19.4, 1.1, -0.6] },
    description: 'Shakes flasks of liquid medium at a set temperature. Cell suspension cultures started from friable callus are grown here with constant aeration.',
    usedIn: 'Stage 8 (cell suspensions)',
  },
  {
    id: 'distiller',
    name: 'Water distiller / deioniser',
    area: 'Storage',
    label: [19.6, 2.4, 1.6],
    camera: { position: [16.8, 2.5, 2.6], target: [19.6, 1.1, 1.6] },
    description: 'Produces pure water for media and rinses. Tap water contains ions and microbes that alter medium chemistry and cause contamination.',
    usedIn: 'Stages 3, 5',
  },
  {
    id: 'cabinet',
    name: 'Glassware cabinet',
    area: 'Storage',
    label: [19.6, 2.9, 3.6],
    camera: { position: [16.8, 2.8, 4.4], target: [19.6, 1.4, 3.6] },
    description: 'Clean, dry beakers, flasks, petri dishes and culture jars ready for use. Glassware is washed, rinsed with distilled water and dried before storage.',
    usedIn: 'All stages',
  },
  // ---------------- island bench ----------------
  {
    id: 'stereo-microscope',
    small: true,
    name: 'Stereo (dissecting) microscope',
    area: 'Island bench',
    label: [-4, 2.1, 2.2],
    camera: { position: [-4, 2.5, 4.8], target: [-4, 1.4, 2.2] },
    description: 'Low-power microscope with a wide working distance. Used to excise tiny shoot-tip meristems (0.2 – 0.5 mm) for virus-free plants and to inspect explants.',
    usedIn: 'Stages 2, 10',
  },
  {
    id: 'compound-microscope',
    small: true,
    name: 'Compound microscope',
    area: 'Island bench',
    label: [-2.3, 2.1, 2.2],
    camera: { position: [-2.3, 2.5, 4.8], target: [-2.3, 1.4, 2.2] },
    description: 'High-power microscope for looking at cells: checking callus for dividing cells, counting cells in suspension cultures and identifying contaminants.',
    usedIn: 'Stages 7, 8',
  },
  {
    id: 'bead-steriliser',
    small: true,
    name: 'Glass-bead steriliser & instruments',
    area: 'Island bench',
    label: [-0.8, 1.9, 2.2],
    camera: { position: [-0.8, 2.4, 4.6], target: [-0.8, 1.3, 2.2] },
    description: 'Hot glass beads (250 °C) sterilise forceps and scalpels in seconds – a flame-free alternative to the spirit lamp. The tray holds the dissecting instrument kit.',
    usedIn: 'Stages 2, 6, 10',
  },
  {
    id: 'vortex',
    small: true,
    name: 'Vortex mixer',
    area: 'Island bench',
    label: [0.5, 1.8, 2.2],
    camera: { position: [0.5, 2.4, 4.6], target: [0.5, 1.3, 2.2] },
    description: 'Rapidly mixes small tubes – dissolving hormone powders in a few drops of solvent before they are added to the medium.',
    usedIn: 'Stage 3',
  },
  {
    id: 'centrifuge',
    small: true,
    name: 'Centrifuge',
    area: 'Island bench',
    label: [2.0, 1.9, 2.2],
    camera: { position: [2.0, 2.4, 4.6], target: [2.0, 1.3, 2.2] },
    description: 'Spins tubes at high speed to separate cells from liquid – used to collect cells from suspension cultures and to clarify solutions.',
    usedIn: 'Stage 8 (cell suspensions)',
  },
  {
    id: 'pipettes',
    small: true,
    name: 'Micropipettes',
    area: 'Island bench',
    label: [3.6, 1.95, 2.2],
    camera: { position: [3.6, 2.4, 4.6], target: [3.6, 1.3, 2.2] },
    description: 'Adjustable pipettes measure microlitre volumes of hormone stock solutions. A typical medium needs 1 mg/L BAP, which is only a few microlitres of stock.',
    usedIn: 'Stage 3',
  },
  {
    id: 'water-bath',
    small: true,
    name: 'Water bath',
    area: 'Island bench',
    label: [5.4, 1.85, 2.2],
    camera: { position: [5.4, 2.4, 4.6], target: [5.4, 1.3, 2.2] },
    description: 'Keeps autoclaved medium at about 50 °C so it stays liquid while heat-sensitive, filter-sterilised additives are mixed in before pouring.',
    usedIn: 'Stages 3, 4',
  },
  {
    id: 'sink',
    name: 'Washing station',
    area: 'Washing area',
    label: [-10.4, 2.1, -1.8],
    camera: { position: [-8.4, 2.8, 0.8], target: [-10.4, 1.1, -1.8] },
    description: 'Sink with drying rack. Glassware is washed with detergent, rinsed with distilled water and dried; the agar of harvested plantlets is also rinsed off here.',
    usedIn: 'Stages 3, 13',
  },
]

export function getEquipment(id: string | null): EquipmentItem | undefined {
  return EQUIPMENT.find((e) => e.id === id)
}
