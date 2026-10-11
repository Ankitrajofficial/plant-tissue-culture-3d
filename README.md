# Plant Tissue Culture — Micropropagation 3D Lab

An interactive 3D educational virtual laboratory that demonstrates **plant tissue culture / micropropagation** from mother-plant selection all the way to a regenerated mature plant.

It is built for biotechnology students: you can walk around a virtual lab, start the experiment, watch every laboratory action happen in real time, pause to inspect glassware, tap on hotspots for explanations, and present the whole protocol to a class.

## About

Micropropagation produces thousands of genetically identical plants from a few millimetres of tissue. This application turns the textbook protocol into a living laboratory:

- a **greenhouse** with the mother plant,
- a **media preparation bench** with stirrer, pH meter and culture vessels,
- an **autoclave** that steams at 121 °C,
- a **laminar flow cabinet** with HEPA air flow and spirit lamp,
- a **culture room** with lit shelves,
- a **hardening chamber** with humidity dome.

The plant material travels through these zones in **15 stages**, and the application clearly distinguishes **in vitro** (inside sterile culture) from **ex vitro** (outside the vessel) steps.

## Features

- Fully interactive 3D laboratory (procedural geometry, no downloads required)
- 360° rotation, zoom and pan with mouse or touch
- Touch controls: one finger rotate, two fingers pinch-zoom / pan
- 15 biological stages with real laboratory conditions (hormones, pH, temperature, timing)
- Real-time laboratory simulation with animated actions (cutting, pouring, autoclaving, flaming forceps, inoculation, growth…)
- **Experiment mode** – Start, Pause, Resume, Restart, speed 0.5× – 4×
- **Explore mode** – free camera, click any stage or any zone sign in the lab
- **Presentation mode** – hands-free loop, slow camera orbit, large captions
- Interactive educational hotspots (glowing markers in 3D + list in the info panel)
- In-vitro / ex-vitro / laboratory colour coding on the timeline and labels
- Stage navigation (timeline, previous / next, keyboard arrows)
- Animated plant development: explant → callus → shoots → roots → plantlet → mature flowering plant
- Completion banner when the full protocol has run
- **Full lab view** – wide shot of the entire biotechnology laboratory (the ⌂ button)
- **Equipment tab** – 26 labelled instruments; click any label in 3D or in the list to fly to it and read what it is for

## Laboratory equipment

Besides the six working zones, the lab contains a central island bench and storage wall with the instruments a real plant-biotechnology lab uses. Every item is clickable:

| Area | Equipment |
|------|-----------|
| Greenhouse | Greenhouse, mother plant stand |
| Media preparation bench | Magnetic stirrer / hot plate, pH meter, analytical balance, reagent & hormone stocks, culture vessel rack |
| Sterilisation | Autoclave, biohazard waste bin |
| Aseptic transfer area | Laminar flow cabinet (HEPA), spirit lamp |
| Culture room | Lit culture shelving, plant growth chamber, orbital incubator shaker |
| Acclimatization | Hardening chamber with humidity dome and misting |
| Island bench | Stereo (dissecting) microscope, compound microscope, glass-bead steriliser & instrument kit, vortex mixer, centrifuge, micropipettes, water bath |
| Storage / washing | Refrigerator / freezer, water distiller / deioniser, glassware cabinet, washing station |

The catalogue (names, descriptions, label positions, camera shots) lives in `src/data/equipment.ts`; the 3D models are in `src/components/LabEquipment.tsx`.

## The 15 stages

| # | Stage | Environment | Zone |
|---|-------|-------------|------|
| 1 | Mother Plant Selection | ex vitro | Greenhouse |
| 2 | Explant Excision | ex vitro | Greenhouse |
| 3 | Culture Medium Preparation | laboratory | Media bench |
| 4 | Sterilisation of the Medium (Autoclaving) | laboratory | Autoclave |
| 5 | Surface Sterilisation of the Explant | laboratory | Laminar flow cabinet |
| 6 | Inoculation – Aseptic Transfer to Medium | in vitro | Laminar flow cabinet |
| 7 | Culture Initiation in the Growth Room | in vitro | Culture room |
| 8 | Callus Induction | in vitro | Culture room |
| 9 | Shoot Induction (Organogenesis) | in vitro | Culture room |
| 10 | Shoot Multiplication & Sub-culturing | in vitro | Culture room |
| 11 | Shoot Elongation | in vitro | Culture room |
| 12 | Root Induction (Rooting) | in vitro | Culture room |
| 13 | Acclimatization (Hardening) | ex vitro | Hardening chamber |
| 14 | Greenhouse Transfer | ex vitro | Greenhouse |
| 15 | Mature Plant Regeneration | ex vitro | Greenhouse |

## Technology

- React 19
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei

No backend, no database, no API keys. Everything runs in the browser.

## Installation

```bash
git clone YOUR_REPOSITORY_URL
cd plant-tissue-culture-3d
npm install
npm run dev
```

Then open the address printed in the terminal (normally `http://localhost:5173`).

## Build

```bash
npm run build
```

This creates a `dist/` folder containing a static website (HTML, CSS, JS). Nothing else is needed to host it.

Optional type check (the same one the editor runs):

```bash
npm run typecheck
```

## Preview Production Build

```bash
npm run preview
```

Serves the `dist/` folder locally so you can test the production build before uploading it.

## Controls

| Action | Mouse / keyboard | Touch |
|--------|------------------|-------|
| Rotate | left-drag | one finger drag |
| Zoom | scroll wheel | pinch |
| Pan | right-drag or Ctrl + drag | two finger drag |
| Play / pause | Space | ▶ / ❚❚ button |
| Previous / next stage | ← / → | ‹ / › buttons |
| Restart | R | ↺ Restart button |

## Project structure

```
plant-tissue-culture-3d/
├── public/
│   ├── icons/          favicon
│   ├── models/         (optional) .glb / .gltf models – none required
│   └── textures/       (optional) textures – none required
├── src/
│   ├── components/
│   │   ├── LaboratoryScene.tsx   Canvas, lights, camera rig, static lab
│   │   ├── Stage.tsx             picks the animation for the current stage
│   │   ├── stages/               one file per stage (Stage01…Stage15)
│   │   ├── StageLabel.tsx        floating stage title + hotspot markers
│   │   ├── CultureVessel.tsx     glass jar with medium
│   │   ├── MotherPlant.tsx       donor plant on its stand
│   │   ├── Autoclave.tsx         pressure steriliser with steam
│   │   ├── LaminarFlowCabinet.tsx
│   │   ├── Greenhouse.tsx
│   │   ├── Plant.tsx             procedural plant (stem + leaves + flower)
│   │   ├── Explant.tsx / Callus.tsx / Shoots.tsx / Roots.tsx
│   │   ├── LabProps.tsx          benches, beakers, bottles, tools, steam…
│   │   ├── LabEquipment.tsx      microscopes, centrifuge, fridge, growth chamber, sink…
│   │   ├── SimulationControls.tsx
│   │   ├── Timeline.tsx
│   │   └── InfoPanel.tsx
│   ├── data/stages.ts            ALL educational content, timings, hotspots, camera framing
│   ├── data/equipment.ts         equipment catalogue + overview camera
│   ├── hooks/useSimulation.ts    state machine (modes, play/pause, progress)
│   ├── utils/animations.ts       easing / interpolation helpers
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .github/workflows/deploy.yml  optional GitHub Pages deployment
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Important files to edit

| Want to change… | Edit |
|-----------------|------|
| Stage text, key points, conditions, durations, hotspots, camera framing | `src/data/stages.ts` |
| What happens on screen during a stage | `src/components/stages/StageXX….tsx` |
| Lab layout, lighting, equipment positions | `src/components/LaboratoryScene.tsx` and `ZONES` in `src/data/stages.ts` |
| Equipment names, descriptions, label positions, overview camera | `src/data/equipment.ts` |
| Colours, panel layout, mobile breakpoints | `src/index.css` |
| Play / pause / mode logic, keyboard shortcuts | `src/hooks/useSimulation.ts` |
| Deployment base path (GitHub Pages) | `vite.config.ts` |

## GitHub

### Pushing the project for the first time

Create an empty repository on GitHub (do **not** add a README there), then run these commands inside the project folder:

```bash
git init
git add .
git commit -m "Initial 3D plant tissue culture lab"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

What each command does:

- `git init` – turns the folder into a Git project (creates a hidden `.git` folder that stores history).
- `git add .` – adds the project files to Git's tracking area (the "staging area"). Files listed in `.gitignore`, such as `node_modules/`, are skipped automatically.
- `git commit -m "…"` – creates a saved version (a snapshot) of the project with a short message.
- `git branch -M main` – names the main line of history `main`.
- `git remote add origin URL` – tells Git where your GitHub repository lives. Replace `YOUR_GITHUB_REPOSITORY_URL` with the URL GitHub shows you, e.g. `https://github.com/USERNAME/plant-tissue-culture-3d.git`.
- `git push -u origin main` – uploads that version to GitHub. `-u` remembers the connection so later you can simply type `git push`.

### Day-to-day development workflow

```
Make changes
     ↓
Test locally        npm run dev
     ↓
git status          see which files changed
     ↓
git add .           stage the changes
     ↓
git commit -m "Describe change"
     ↓
git push            upload to GitHub
     ↓
GitHub updated
```

Example session:

```bash
git status
git add .
git commit -m "Add callus formation animation"
git push
```

Useful extras:

- `git log --oneline` – list previous versions.
- `git diff` – show exactly what you changed since the last commit.
- `git checkout -- path/to/file` – throw away your changes to one file.

## Deployment

The production build is a plain static website. No Node.js server, database or API key is needed at run time.

### Hostinger (or any shared / static hosting)

1. Run `npm run build`.
2. Open the generated `dist/` folder.
3. Upload **the contents** of `dist/` (the `index.html` file, the `assets/` folder and the `icons/` folder) into your public web directory, usually `public_html/`.
4. Visit your domain. Done.

If you host the site in a sub-folder (for example `https://example.com/lab/`), build with that base path:

```bash
VITE_BASE_PATH=/lab/ npm run build
```

### Vercel / Netlify

Connect the GitHub repository and use these settings:

- Build command: `npm run build`
- Output / publish directory: `dist`

Both platforms detect Vite automatically.

### GitHub Pages

A ready-made workflow is included in `.github/workflows/deploy.yml`.

1. Push the project to GitHub.
2. In the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` builds and deploys the site to  
   `https://USERNAME.github.io/REPOSITORY_NAME/`.

**Base path:** on GitHub Pages the site lives in a sub-folder named after the repository, so assets must be loaded from `/REPOSITORY_NAME/`. The workflow sets this automatically from the repository name through the `VITE_BASE_PATH` environment variable. If you build for GitHub Pages manually, either run

```bash
VITE_BASE_PATH=/REPOSITORY_NAME/ npm run build
```

or change `DEFAULT_BASE` at the top of `vite.config.ts` to `'/REPOSITORY_NAME/'`. Do not hard-code a username anywhere else.

## Environment variables

None are required. The only optional variable is `VITE_BASE_PATH` (see Deployment). There is no `.env` file and no secrets.

## Limitations

- All 3D objects are procedural (built from simple shapes) rather than photoreal models. You can drop `.glb` models into `public/models/` and load them with drei's `useGLTF` if you want higher fidelity.
- Timings are compressed for teaching: a stage that takes weeks in reality plays in about 10 seconds. The real durations are shown in the info panel.
- The protocol shown is a generic MS-medium micropropagation route (nodal explant → callus → shoots → roots). Species-specific hormone concentrations vary; edit `src/data/stages.ts` to match your course.
- WebGL is required. Very old devices or browsers with hardware acceleration disabled will run slowly.
- Shadows and real-time lighting are tuned for laptops and modern phones; on low-end phones the frame rate may drop. Reducing the `dpr` prop in `LaboratoryScene.tsx` (for example `dpr={[1, 1.25]}`) helps.

## License

Free to use for educational purposes.
