/**
 * The 15 biological / laboratory stages of plant tissue culture (micropropagation).
 *
 * Each stage describes:
 *  - where in the virtual laboratory it happens (zone + camera framing)
 *  - whether the plant material is IN VITRO (inside sterile culture vessels)
 *    or EX VITRO (outside, in soil / greenhouse)
 *  - the educational content shown in the InfoPanel
 *  - interactive hotspots rendered as clickable 3D markers
 *
 * Edit this file to change text, durations or hotspot positions.
 */

export type Environment = 'ex-vitro' | 'laboratory' | 'in-vitro'

export type ZoneId =
  | 'greenhouse'
  | 'mediaBench'
  | 'autoclave'
  | 'laminar'
  | 'cultureRoom'
  | 'hardening'

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface Hotspot {
  id: string
  label: string
  text: string
  /** World-space position of the 3D marker */
  position: [number, number, number]
}

export interface StageData {
  id: number
  /** Short name shown in the timeline */
  short: string
  /** Full stage title */
  title: string
  /** Classical micropropagation stage grouping (Stage 0 – IV) */
  group: string
  environment: Environment
  zone: ZoneId
  /** Simulation duration in seconds at 1x speed */
  duration: number
  /** Real-world duration of this step */
  realTime: string
  description: string
  keyPoints: string[]
  conditions: { label: string; value: string }[]
  hotspots: Hotspot[]
  camera: { position: [number, number, number]; target: [number, number, number] }
}

/** World-space anchor positions of each laboratory zone */
export const ZONES: Record<ZoneId, { position: [number, number, number]; name: string }> = {
  greenhouse: { position: [-16, 0, 0], name: 'Greenhouse' },
  mediaBench: { position: [-7, 0, -6], name: 'Media Preparation Bench' },
  autoclave: { position: [-2, 0, -6.5], name: 'Autoclave' },
  laminar: { position: [3.5, 0, -6], name: 'Laminar Flow Cabinet' },
  cultureRoom: { position: [10, 0, -6], name: 'Culture Room' },
  hardening: { position: [16, 0, -3], name: 'Hardening Chamber' },
}

export const ENVIRONMENT_LABEL: Record<Environment, string> = {
  'ex-vitro': 'EX VITRO · outside the vessel',
  laboratory: 'LABORATORY · preparation',
  'in-vitro': 'IN VITRO · inside sterile culture',
}

export const ENVIRONMENT_COLOR: Record<Environment, string> = {
  'ex-vitro': '#f4b860',
  laboratory: '#8ab4ff',
  'in-vitro': '#5ad67d',
}

export const STAGES: StageData[] = [
  {
    id: 1,
    short: 'Mother plant',
    title: 'Mother Plant Selection',
    group: 'Stage 0 · Preparation of the donor plant',
    environment: 'ex-vitro',
    zone: 'greenhouse',
    duration: 9,
    realTime: '2 – 4 weeks of pre-conditioning',
    description:
      'A healthy, vigorous and disease-free donor plant with the desired genetic traits is chosen as the mother plant. It is kept in a clean greenhouse, often treated with fungicides and watered carefully to reduce the microbial load on its surface before any tissue is removed.',
    keyPoints: [
      'Select an elite genotype that is true-to-type and free from visible disease.',
      'Pre-conditioning (clean water, low humidity, systemic fungicide) lowers contamination later.',
      'Young, actively growing tissue responds best in culture.',
    ],
    conditions: [
      { label: 'Location', value: 'Greenhouse / growth chamber' },
      { label: 'Material', value: 'Elite, disease-free plant' },
      { label: 'Goal', value: 'Source of explants' },
    ],
    hotspots: [
      {
        id: 'mother',
        label: 'Mother plant',
        text: 'The donor plant. Every plantlet produced later is a genetic clone of this individual.',
        position: [-16.2, 2.9, 0.6],
      },
      {
        id: 'pots',
        label: 'Candidate plants',
        text: 'Only the healthiest plant is selected. Weak, infected or off-type plants are rejected.',
        position: [-14.5, 1.9, -2.2],
      },
    ],
    camera: { position: [-15, 3.6, 7.2], target: [-16.2, 1.4, -0.2] },
  },
  {
    id: 2,
    short: 'Explant',
    title: 'Explant Excision',
    group: 'Stage 0 · Preparation of the donor plant',
    environment: 'ex-vitro',
    zone: 'greenhouse',
    duration: 9,
    realTime: 'Minutes',
    description:
      'A small piece of tissue called the explant is cut from the mother plant with a sterile scalpel. Nodal segments, shoot tips or axillary buds are preferred because they contain meristematic cells that readily regenerate whole plants.',
    keyPoints: [
      'Explant = any plant part placed in culture (node, shoot tip, leaf disc, embryo).',
      'Meristem-rich tissue gives genetically stable plants and can be virus-free.',
      'Explants are kept in a clean container and taken to the lab immediately.',
    ],
    conditions: [
      { label: 'Tool', value: 'Sterile scalpel / blade' },
      { label: 'Explant size', value: '0.5 – 2 cm nodal segment' },
      { label: 'Tissue', value: 'Shoot tip or axillary node' },
    ],
    hotspots: [
      {
        id: 'node',
        label: 'Nodal segment',
        text: 'The node carries an axillary bud – a tiny dormant shoot that will grow once the apical dominance is removed.',
        position: [-15.7, 2.55, 0.9],
      },
      {
        id: 'dish',
        label: 'Collection dish',
        text: 'Excised explants are collected in a covered dish to keep them moist and clean.',
        position: [-13.7, 1.45, 1.75],
      },
    ],
    camera: { position: [-13.2, 3.0, 4.8], target: [-15.2, 1.7, 0.9] },
  },
  {
    id: 3,
    short: 'Medium',
    title: 'Culture Medium Preparation',
    group: 'Laboratory preparation',
    environment: 'laboratory',
    zone: 'mediaBench',
    duration: 11,
    realTime: '1 – 2 hours',
    description:
      'The nutrient medium is prepared on the media bench. Murashige & Skoog (MS) salts, vitamins, sucrose as an energy source and plant growth regulators are dissolved in distilled water. The pH is adjusted to about 5.8 and agar is added so the medium sets as a gel inside each vessel.',
    keyPoints: [
      'MS medium supplies macro- and micro-nutrients that the plant cannot photosynthesise in a closed jar.',
      'Sucrose (20 – 30 g/L) provides carbon; agar (6 – 8 g/L) makes it solid.',
      'Hormone balance (auxin : cytokinin) decides whether callus, shoots or roots will form.',
    ],
    conditions: [
      { label: 'Basal medium', value: 'MS salts + vitamins' },
      { label: 'Sugar', value: 'Sucrose 30 g/L' },
      { label: 'pH', value: '5.6 – 5.8' },
      { label: 'Gelling agent', value: 'Agar 7 g/L' },
    ],
    hotspots: [
      {
        id: 'beaker',
        label: 'Mixing beaker',
        text: 'Salts, sucrose and hormones are dissolved while a magnetic stirrer keeps the solution moving.',
        position: [-7.4, 2.3, -5.6],
      },
      {
        id: 'ph',
        label: 'pH meter',
        text: 'The pH is set to 5.8 with dilute NaOH or HCl. Wrong pH stops nutrient uptake and prevents the agar from gelling.',
        position: [-5.3, 1.75, -6.1],
      },
      {
        id: 'vessels',
        label: 'Culture vessels',
        text: 'The hot medium is poured into jars or test tubes and loosely capped before sterilisation.',
        position: [-9.0, 2.1, -6.0],
      },
    ],
    camera: { position: [-7, 3.6, -1.4], target: [-7, 1.5, -6] },
  },
  {
    id: 4,
    short: 'Autoclave',
    title: 'Sterilisation of the Medium (Autoclaving)',
    group: 'Laboratory preparation',
    environment: 'laboratory',
    zone: 'autoclave',
    duration: 11,
    realTime: '15 – 20 min at 121 °C (+ heating / cooling)',
    description:
      'The filled vessels are placed in the autoclave, where pressurised steam at 121 °C and 15 psi kills all bacteria, fungi and spores. Heat-sensitive compounds such as some vitamins or gibberellins are instead filter-sterilised and added after cooling.',
    keyPoints: [
      'Steam under pressure reaches temperatures far above boiling water – lethal to spores.',
      'Standard cycle: 121 °C, 15 psi (103 kPa), 15 – 20 minutes.',
      'Once sterile, the medium is only opened again inside the laminar flow cabinet.',
    ],
    conditions: [
      { label: 'Temperature', value: '121 °C' },
      { label: 'Pressure', value: '15 psi (103 kPa)' },
      { label: 'Time', value: '15 – 20 minutes' },
    ],
    hotspots: [
      {
        id: 'chamber',
        label: 'Pressure chamber',
        text: 'Thick steel walls hold the steam under pressure. The door locks until pressure returns to normal.',
        position: [-2, 2.7, -5.5],
      },
      {
        id: 'gauge',
        label: 'Gauge & timer',
        text: 'Temperature and pressure are monitored. Sterilisation time is counted only after 121 °C is reached.',
        position: [-0.9, 2.3, -5.6],
      },
    ],
    camera: { position: [-2.4, 3.2, -1.4], target: [-2.2, 1.6, -6.4] },
  },
  {
    id: 5,
    short: 'Surface steril.',
    title: 'Surface Sterilisation of the Explant',
    group: 'Stage I · Establishment',
    environment: 'laboratory',
    zone: 'laminar',
    duration: 12,
    realTime: '10 – 20 minutes',
    description:
      'Inside the laminar flow cabinet the explant is washed to remove microbes living on its surface without killing the plant cells. A typical sequence is 70 % ethanol for 30 – 60 s, then 0.1 % mercuric chloride or 1 – 2 % sodium hypochlorite with a drop of detergent for 5 – 10 min, followed by 3 – 5 rinses in sterile distilled water.',
    keyPoints: [
      'Contamination is the main cause of failure in tissue culture.',
      'Ethanol breaks surface tension; hypochlorite / HgCl₂ kills microbes.',
      'Sterile water rinses remove the toxic sterilant so it does not harm the tissue.',
    ],
    conditions: [
      { label: 'Step 1', value: '70 % ethanol · 30 – 60 s' },
      { label: 'Step 2', value: '1 % NaOCl or 0.1 % HgCl₂ · 5 – 10 min' },
      { label: 'Step 3', value: 'Sterile water · 3 – 5 rinses' },
    ],
    hotspots: [
      {
        id: 'ethanol',
        label: '70 % Ethanol',
        text: 'A short dip wets the surface and kills many bacteria instantly. Too long and the tissue dies.',
        position: [2.1, 2.0, -5.6],
      },
      {
        id: 'naocl',
        label: 'Sodium hypochlorite',
        text: 'Diluted bleach is the standard disinfectant. A drop of Tween-20 helps it reach every crevice.',
        position: [3.1, 2.0, -5.6],
      },
      {
        id: 'rinse',
        label: 'Sterile water',
        text: 'Repeated rinses remove every trace of sterilant.',
        position: [4.3, 2.0, -5.6],
      },
    ],
    camera: { position: [3.5, 3.1, -2.2], target: [3.3, 1.6, -6.0] },
  },
  {
    id: 6,
    short: 'Inoculation',
    title: 'Inoculation – Aseptic Transfer to Medium',
    group: 'Stage I · Establishment',
    environment: 'in-vitro',
    zone: 'laminar',
    duration: 12,
    realTime: 'Minutes per explant',
    description:
      'The sterilised explant is trimmed to remove dead edges and placed on the solid medium with flamed forceps. The vessel is opened only inside the sterile air stream of the laminar flow cabinet, closed quickly, and sealed. From this moment the tissue is IN VITRO.',
    keyPoints: [
      'HEPA-filtered air flows horizontally across the work surface, pushing microbes away.',
      'Instruments are dipped in ethanol and flamed between every explant.',
      'The explant is oriented with its basal end in the medium so nutrients can be absorbed.',
    ],
    conditions: [
      { label: 'Environment', value: 'Laminar flow (HEPA, class II)' },
      { label: 'Instruments', value: 'Flamed forceps & scalpel' },
      { label: 'Seal', value: 'Cap + Parafilm' },
    ],
    hotspots: [
      {
        id: 'hepa',
        label: 'HEPA filter',
        text: 'Removes 99.97 % of particles ≥ 0.3 µm. The constant airflow keeps the work zone sterile.',
        position: [3.5, 3.1, -6.9],
      },
      {
        id: 'lamp',
        label: 'Spirit lamp',
        text: 'Forceps and scalpel are flamed to burn off any organism. The vessel mouth is also passed through the flame.',
        position: [5.0, 1.9, -6.2],
      },
      {
        id: 'vessel',
        label: 'Culture vessel',
        text: 'The explant now sits on sterile MS medium – the start of in-vitro growth.',
        position: [3.5, 2.3, -6.0],
      },
    ],
    camera: { position: [3.6, 3.0, -2.4], target: [3.5, 1.7, -6.0] },
  },
  {
    id: 7,
    short: 'Initiation',
    title: 'Culture Initiation in the Growth Room',
    group: 'Stage I · Establishment',
    environment: 'in-vitro',
    zone: 'cultureRoom',
    duration: 10,
    realTime: '2 – 4 weeks',
    description:
      'Vessels are moved to the culture room with controlled temperature, light and photoperiod. During the first weeks the explant absorbs nutrients, swells and the axillary bud starts to grow. Any contaminated vessel shows cloudy medium or fuzzy colonies and is discarded.',
    keyPoints: [
      'Typical conditions: 25 ± 2 °C, 16 h light / 8 h dark, 2 000 – 3 000 lux.',
      'Cool-white fluorescent or LED tubes provide light without excess heat.',
      'Contamination is visible within 3 – 7 days and must be removed immediately.',
    ],
    conditions: [
      { label: 'Temperature', value: '25 ± 2 °C' },
      { label: 'Photoperiod', value: '16 h light / 8 h dark' },
      { label: 'Light', value: '2 000 – 3 000 lux' },
      { label: 'Humidity', value: '50 – 60 % RH' },
    ],
    hotspots: [
      {
        id: 'lights',
        label: 'Light tubes',
        text: 'Cool-white tubes on a timer give the 16 h photoperiod that drives growth.',
        position: [10, 2.75, -5.3],
      },
      {
        id: 'explant',
        label: 'Establishing explant',
        text: 'The axillary bud swells as the tissue takes up water, sugar and nutrients from the agar.',
        position: [10, 2.35, -5.3],
      },
    ],
    camera: { position: [9.6, 3.4, -1.6], target: [10, 2.0, -6.0] },
  },
  {
    id: 8,
    short: 'Callus',
    title: 'Callus Induction',
    group: 'Stage I · Establishment (indirect route)',
    environment: 'in-vitro',
    zone: 'cultureRoom',
    duration: 12,
    realTime: '3 – 6 weeks',
    description:
      'With a high auxin level (e.g. 2,4-D or NAA) cells at the cut surface de-differentiate and divide to form callus – an unorganised, pale mass of parenchyma cells. Callus is the raw material for indirect organogenesis and somatic embryogenesis and allows rapid bulk production.',
    keyPoints: [
      'Callus shows totipotency: differentiated cells returning to a dividing, embryonic state.',
      'Auxin-rich medium (2,4-D 1 – 2 mg/L) favours callus formation.',
      'Friable callus can be sub-cultured or used for cell suspension cultures.',
    ],
    conditions: [
      { label: 'Hormone', value: '2,4-D 1 – 2 mg/L (auxin)' },
      { label: 'Light', value: 'Dark or dim light' },
      { label: 'Appearance', value: 'Pale, friable mass' },
    ],
    hotspots: [
      {
        id: 'callus',
        label: 'Callus mass',
        text: 'A cluster of undifferentiated cells. Its colour and texture tell the technician whether it is healthy.',
        position: [10, 2.35, -5.3],
      },
      {
        id: 'auxin',
        label: 'Auxin (2,4-D)',
        text: 'Synthetic auxin triggers cell division without organisation – the chemical signal for callus.',
        position: [11.6, 2.85, -5.6],
      },
    ],
    camera: { position: [10.3, 3.0, -2.8], target: [10, 2.2, -5.8] },
  },
  {
    id: 9,
    short: 'Shoot induction',
    title: 'Shoot Induction (Organogenesis)',
    group: 'Stage II · Multiplication',
    environment: 'in-vitro',
    zone: 'cultureRoom',
    duration: 12,
    realTime: '3 – 5 weeks',
    description:
      'The culture is transferred to a medium rich in cytokinin (BAP or kinetin) and low in auxin. The hormone balance now pushes the cells to organise into shoot meristems, and green shoot buds emerge from the callus or directly from the axillary bud.',
    keyPoints: [
      'High cytokinin : auxin ratio → shoots; low ratio → roots (Skoog & Miller, 1957).',
      'BAP 1 – 3 mg/L is the most common shoot-inducing cytokinin.',
      'Green colour appears as chloroplasts develop under light.',
    ],
    conditions: [
      { label: 'Hormone', value: 'BAP 1 – 3 mg/L (cytokinin)' },
      { label: 'Ratio', value: 'Cytokinin ≫ Auxin' },
      { label: 'Light', value: '16 h photoperiod' },
    ],
    hotspots: [
      {
        id: 'buds',
        label: 'Shoot buds',
        text: 'Tiny green primordia organise from the callus – the first sign of successful organogenesis.',
        position: [10, 2.45, -5.3],
      },
      {
        id: 'cytokinin',
        label: 'Cytokinin (BAP)',
        text: '6-Benzylaminopurine releases axillary buds from dormancy and promotes shoot formation.',
        position: [11.6, 2.85, -5.6],
      },
    ],
    camera: { position: [10.2, 3.0, -2.4], target: [10, 2.2, -5.8] },
  },
  {
    id: 10,
    short: 'Multiplication',
    title: 'Shoot Multiplication & Sub-culturing',
    group: 'Stage II · Multiplication',
    environment: 'in-vitro',
    zone: 'cultureRoom',
    duration: 12,
    realTime: 'Every 3 – 4 weeks, repeated',
    description:
      'Clusters of shoots are divided and transferred to fresh medium every 3 – 4 weeks. Each cycle multiplies the number of shoots several-fold, so a single explant can yield thousands of identical plantlets within a year. This exponential multiplication is the commercial heart of micropropagation.',
    keyPoints: [
      'Sub-culture replenishes nutrients and removes toxic metabolites.',
      'Multiplication rate of 3 – 10× per cycle is typical.',
      'Too many cycles can cause somaclonal variation – limit to 8 – 10 passages.',
    ],
    conditions: [
      { label: 'Cycle', value: '3 – 4 weeks' },
      { label: 'Rate', value: '3 – 10× per cycle' },
      { label: 'Medium', value: 'MS + BAP (fresh)' },
    ],
    hotspots: [
      {
        id: 'clones',
        label: 'Clonal vessels',
        text: 'Every new jar holds shoots that are genetically identical to the mother plant.',
        position: [8.6, 2.5, -5.3],
      },
      {
        id: 'subculture',
        label: 'Sub-culture',
        text: 'Shoot clusters are divided with a sterile scalpel inside the laminar cabinet and re-plated.',
        position: [11.4, 2.5, -5.3],
      },
    ],
    camera: { position: [10, 3.3, -1.6], target: [10, 2.1, -6.0] },
  },
  {
    id: 11,
    short: 'Elongation',
    title: 'Shoot Elongation',
    group: 'Stage II · Multiplication',
    environment: 'in-vitro',
    zone: 'cultureRoom',
    duration: 10,
    realTime: '2 – 3 weeks',
    description:
      'Shoots are moved to a medium with reduced cytokinin, sometimes with a little gibberellic acid (GA₃). Internodes stretch, leaves expand and each shoot reaches a size (2 – 4 cm) suitable for rooting.',
    keyPoints: [
      'Lowering cytokinin stops branching and lets individual shoots grow longer.',
      'GA₃ 0.1 – 0.5 mg/L stimulates internode elongation.',
      'Only well-formed shoots with 3 – 4 leaves proceed to rooting.',
    ],
    conditions: [
      { label: 'Hormone', value: 'Low BAP ± GA₃' },
      { label: 'Target size', value: '2 – 4 cm shoots' },
      { label: 'Light', value: '16 h photoperiod' },
    ],
    hotspots: [
      {
        id: 'shoots',
        label: 'Elongating shoots',
        text: 'Internode length increases and leaves unfold as cytokinin pressure is reduced.',
        position: [10, 2.6, -5.3],
      },
    ],
    camera: { position: [10.3, 3.0, -2.8], target: [10, 2.3, -5.8] },
  },
  {
    id: 12,
    short: 'Rooting',
    title: 'Root Induction (Rooting)',
    group: 'Stage III · Rooting',
    environment: 'in-vitro',
    zone: 'cultureRoom',
    duration: 12,
    realTime: '2 – 4 weeks',
    description:
      'Individual shoots are transferred to a rooting medium – usually half-strength MS with an auxin such as IBA or NAA and no cytokinin. Adventitious roots emerge from the base of the shoot, producing a complete plantlet.',
    keyPoints: [
      'High auxin : cytokinin ratio now favours roots.',
      'Half-strength salts and lower sucrose mimic natural soil conditions.',
      'Some species root better ex vitro by dipping shoots in auxin powder before potting.',
    ],
    conditions: [
      { label: 'Medium', value: '½ MS' },
      { label: 'Hormone', value: 'IBA 0.5 – 2 mg/L (auxin)' },
      { label: 'Result', value: 'Complete plantlet' },
    ],
    hotspots: [
      {
        id: 'roots',
        label: 'Adventitious roots',
        text: 'Roots forming from the stem base – not from a seed radicle – are called adventitious.',
        position: [10, 2.1, -5.3],
      },
      {
        id: 'iba',
        label: 'Auxin (IBA)',
        text: 'Indole-3-butyric acid is the most reliable rooting hormone for most species.',
        position: [11.6, 2.85, -5.6],
      },
    ],
    camera: { position: [10.3, 2.9, -2.8], target: [10, 2.1, -5.8] },
  },
  {
    id: 13,
    short: 'Acclimatization',
    title: 'Acclimatization (Hardening)',
    group: 'Stage IV · Transfer to ex vitro',
    environment: 'ex-vitro',
    zone: 'hardening',
    duration: 12,
    realTime: '2 – 4 weeks',
    description:
      'Plantlets grown in a jar have thin cuticles, poorly functioning stomata and weak roots. They are gently removed, the agar is washed off, and they are potted in a sterile mix under a humidity dome. Humidity is reduced step by step so the plant learns to control its own water loss.',
    keyPoints: [
      'This is the most critical ex-vitro step – losses can be high without care.',
      'Start at ~90 % RH, reduce gradually over 2 – 3 weeks.',
      'Washing off agar prevents fungal growth on the sugar-rich gel.',
    ],
    conditions: [
      { label: 'Humidity', value: '90 % → 60 % RH' },
      { label: 'Substrate', value: 'Sterile peat : perlite (1:1)' },
      { label: 'Light', value: 'Low → moderate' },
    ],
    hotspots: [
      {
        id: 'dome',
        label: 'Humidity dome',
        text: 'A transparent cover keeps humidity high. It is opened a little more each day.',
        position: [16, 2.5, -3.0],
      },
      {
        id: 'wash',
        label: 'Washing agar',
        text: 'Roots are rinsed in lukewarm water to remove all nutrient gel.',
        position: [14.6, 1.9, -2.6],
      },
    ],
    camera: { position: [15.6, 3.2, 1.6], target: [16, 1.5, -3.0] },
  },
  {
    id: 14,
    short: 'Greenhouse',
    title: 'Greenhouse Transfer',
    group: 'Stage IV · Transfer to ex vitro',
    environment: 'ex-vitro',
    zone: 'greenhouse',
    duration: 10,
    realTime: '4 – 8 weeks',
    description:
      'Hardened plantlets are transferred to larger pots in the greenhouse. They now photosynthesise fully, develop a thick cuticle and functional stomata, and grow under natural light with regular feeding. Survival rates above 90 % are expected at this point.',
    keyPoints: [
      'Plantlets become autotrophic – they no longer rely on sucrose in the medium.',
      'Shading in the first week prevents sun-scorch of the soft leaves.',
      'Regular inspection removes any plant showing disease or variation.',
    ],
    conditions: [
      { label: 'Light', value: 'Natural, 30 – 50 % shade' },
      { label: 'Temperature', value: '20 – 28 °C' },
      { label: 'Feeding', value: 'Dilute liquid fertiliser' },
    ],
    hotspots: [
      {
        id: 'bench',
        label: 'Greenhouse bench',
        text: 'Rows of identical clones growing side by side – the uniformity is the main advantage of micropropagation.',
        position: [-14.5, 2.2, -2.2],
      },
    ],
    camera: { position: [-15.5, 3.8, 5.6], target: [-16, 1.4, -1.6] },
  },
  {
    id: 15,
    short: 'Mature plant',
    title: 'Mature Plant Regeneration',
    group: 'Stage IV · Transfer to ex vitro',
    environment: 'ex-vitro',
    zone: 'greenhouse',
    duration: 10,
    realTime: 'Months, depending on species',
    description:
      'The regenerated plant is now fully grown, genetically identical to the mother plant and ready for the field or for sale. Micropropagation has produced, from a few millimetres of tissue, a complete plant – and in parallel, thousands of identical siblings.',
    keyPoints: [
      'Clonal propagation preserves the exact genotype of the elite mother plant.',
      'Used commercially for orchids, banana, potato, sugarcane, ornamentals and forest trees.',
      'The cycle can start again: this plant can itself become a new mother plant.',
    ],
    conditions: [
      { label: 'Result', value: 'True-to-type clone' },
      { label: 'Scale', value: '1 explant → 1 000s of plants / year' },
      { label: 'Next', value: 'Field planting or new mother plant' },
    ],
    hotspots: [
      {
        id: 'clone',
        label: 'Regenerated clone',
        text: 'A complete plant produced entirely from cultured tissue. It is the final product of the 15-stage process.',
        position: [-18.6, 3.1, 1.4],
      },
      {
        id: 'cycle',
        label: 'Closing the loop',
        text: 'The best regenerated plants can be selected as new mother plants, restarting the cycle at Stage 1.',
        position: [-16.2, 3.2, 0.6],
      },
    ],
    camera: { position: [-15.2, 3.3, 6.6], target: [-17.4, 1.5, 0.9] },
  },
]

export const TOTAL_STAGES = STAGES.length

export function getStage(index: number): StageData {
  return STAGES[Math.min(Math.max(index, 0), STAGES.length - 1)]
}
