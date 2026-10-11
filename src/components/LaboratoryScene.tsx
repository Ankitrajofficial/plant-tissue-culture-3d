import { memo, useEffect, useRef, type ComponentRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { STAGES, ZONES, type ZoneId } from '../data/stages'
import { getEquipment, OVERVIEW_CAMERA } from '../data/equipment'
import {
  BeadSteriliser,
  BiohazardBin,
  Centrifuge,
  CompoundMicroscope,
  Distiller,
  EquipmentLabels,
  GlasswareCabinet,
  GrowthChamber,
  IncubatorShaker,
  PipetteStand,
  Refrigerator,
  Sink,
  StereoMicroscope,
  VortexMixer,
  WaterBath,
} from './LabEquipment'
import { useSimulation } from '../hooks/useSimulation'
import { Greenhouse } from './Greenhouse'
import { Autoclave } from './Autoclave'
import { LaminarFlowCabinet } from './LaminarFlowCabinet'
import { CultureVessel } from './CultureVessel'
import { Shoots } from './Shoots'
import { Plant } from './Plant'
import { Balance, Beaker, Bench, Bottle, Flask, HumidityDome, PHMeter, Pot, Shelf, Stirrer, Tray, VesselRack } from './LabProps'
import { Stage } from './Stage'
import { StageLabel } from './StageLabel'
import { RACK_SLOTS } from './stages/Stage03Medium'
import { COOLING_SPOT } from './stages/Stage04Autoclave'
import { BASIN, TRAY } from './stages/Stage13Acclimatization'

/* ------------------------------------------------------------------ */
/* Camera: flies to each stage, hands over to the user on touch/drag   */
/* ------------------------------------------------------------------ */

function CameraRig() {
  const { stage, cameraToken, mode, view, equipmentId } = useSimulation()
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null)
  const { camera } = useThree()
  const flying = useRef(false)
  const goalPos = useRef(new THREE.Vector3())
  const goalTarget = useRef(new THREE.Vector3())

  useEffect(() => {
    const equipment = getEquipment(equipmentId)
    const shot = view === 'overview' ? OVERVIEW_CAMERA : equipment ? equipment.camera : stage.camera
    goalPos.current.set(...shot.position)
    goalTarget.current.set(...shot.target)
    flying.current = true
    if (import.meta.env.DEV) {
      ;(window as unknown as { __lab?: unknown }).__lab = { camera, controls, goalPos, goalTarget, flying }
    }
  }, [cameraToken, stage, camera, view, equipmentId])

  useFrame((_, dt) => {
    if (!flying.current || !controls.current) return
    const k = 1 - Math.exp(-2.6 * Math.min(dt, 0.1))
    camera.position.lerp(goalPos.current, k)
    controls.current.target.lerp(goalTarget.current, k)
    controls.current.update()
    if (camera.position.distanceTo(goalPos.current) < 0.03 && controls.current.target.distanceTo(goalTarget.current) < 0.03) {
      flying.current = false
    }
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={1}
      maxDistance={45}
      maxPolarAngle={Math.PI / 2 - 0.03}
      autoRotate={mode === 'presentation'}
      autoRotateSpeed={0.45}
      onStart={() => {
        flying.current = false
      }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Static laboratory – memoised so it only re-renders on stage change  */
/* ------------------------------------------------------------------ */

function ZoneSign({ zone, visible }: { zone: ZoneId; visible: boolean }) {
  const { goTo, stage } = useSimulation()
  const z = ZONES[zone]
  const firstStage = STAGES.findIndex((s) => s.zone === zone)
  const active = stage.zone === zone
  if (!visible) return null
  return (
    <Html position={[z.position[0], 4.2, z.position[2] + (zone === 'greenhouse' ? 2.5 : 1.6)]} center distanceFactor={12} zIndexRange={[30, 0]}>
      <button className={`zone-sign ${active ? 'active' : ''}`} onClick={() => goTo(firstStage)} title={`Go to ${z.name}`}>
        {z.name}
      </button>
    </Html>
  )
}

const LabEnvironment = memo(function LabEnvironment({ stageId, presentation }: { stageId: number; presentation: boolean }) {
  const mb = ZONES.mediaBench.position
  const sh = ZONES.cultureRoom.position
  const hd = ZONES.hardening.position
  const zones = Object.keys(ZONES) as ZoneId[]

  return (
    <group>
      {/* floor and walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 32]} />
        <meshStandardMaterial color="#b9c3c9" roughness={0.9} />
      </mesh>
      <gridHelper args={[60, 60, '#9aa7b0', '#a9b4bb']} position={[0, 0.005, 0]} />
      <mesh position={[4.5, 2.75, -8.25]} receiveShadow>
        <boxGeometry args={[32, 5.5, 0.2]} />
        <meshStandardMaterial color="#e4ebef" roughness={0.9} />
      </mesh>
      <mesh position={[20.5, 2.75, -1]} receiveShadow>
        <boxGeometry args={[0.2, 5.5, 14.5]} />
        <meshStandardMaterial color="#dfe6ea" roughness={0.9} />
      </mesh>
      <mesh position={[-11.5, 2.75, -6.1]}>
        <boxGeometry args={[0.2, 5.5, 4.2]} />
        <meshStandardMaterial color="#dfe6ea" roughness={0.9} />
      </mesh>
      {/* wall stripe */}
      <mesh position={[4.5, 1.2, -8.14]}>
        <planeGeometry args={[32, 0.25]} />
        <meshStandardMaterial color="#5ad67d" />
      </mesh>
      {/* ceiling light panels */}
      {[-6, 2, 10, 17].map((x) => (
        <group key={x}>
          <mesh position={[x, 5.4, -3]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.4, 0.9]} />
            <meshStandardMaterial color="#fff" emissive="#f4f9ff" emissiveIntensity={1.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* greenhouse */}
      <Greenhouse showCandidates={stageId < 14} />

      {/* media preparation bench */}
      <Bench position={[mb[0], 0, mb[2]]} width={6} depth={2} height={1} />
      <Stirrer position={[-7.4, 1, -5.6]} running={stageId === 3} />
      {stageId !== 3 && (
        <>
          <Beaker position={[-7.4, 1.13, -5.6]} radius={0.2} height={0.5} level={0.3} liquidColor="#cfe9ff" />
          <Bottle position={[-8.6, 1, -6.55]} color="#9ad8ff" scale={0.9} />
          <Bottle position={[-8.2, 1, -6.55]} color="#ffffff" scale={0.9} />
          <Bottle position={[-6.4, 1, -6.55]} color="#c9a3ff" scale={0.9} />
          <Bottle position={[-6.0, 1, -6.55]} color="#f4d9a0" scale={0.9} />
          <PHMeter position={[-5.3, 1, -6.1]} />
        </>
      )}
      <Balance position={[-4.6, 1, -6.6]} />
      <Flask position={[-5.6, 1, -5.35]} level={0.35} />
      <VesselRack position={[-9, 1, -6]} />
      {stageId < 3 && RACK_SLOTS.map((s, i) => <CultureVessel key={i} position={s} mediumLevel={0} cap={0.75} />)}
      {stageId > 4 && COOLING_SPOT.slice(1).map((s, i) => <CultureVessel key={i} position={s} mediumLevel={0.18} />)}

      {/* autoclave */}
      {stageId !== 4 && <Autoclave position={ZONES.autoclave.position} door={0} active={false} />}

      {/* laminar flow cabinet */}
      {stageId !== 5 && stageId !== 6 && <LaminarFlowCabinet position={ZONES.laminar.position} active={false} flame={false} />}

      {/* culture room */}
      <Shelf position={[sh[0], 0, sh[2]]} width={4} depth={1.2} levels={[0.6, 1.8, 3.0]} lightsOn />
      {[-1.4, -0.7, 0.7, 1.4].map((dx, i) => (
        <CultureVessel key={`b${i}`} position={[sh[0] + dx, 0.6, sh[2] + 0.1]} mediumLevel={0.2} mediumColor="#dfe9b3">
          <Shoots growth={1} count={3 + (i % 2)} height={0.22} spread={0.08} position={[0, 0.03, 0]} />
        </CultureVessel>
      ))}
      {[-1.4, -0.7, 0, 0.7, 1.4].map((dx, i) => (
        <CultureVessel key={`t${i}`} position={[sh[0] + dx, 3.0, sh[2] + 0.1]} mediumLevel={0.2} mediumColor={i % 2 ? '#efe2a9' : '#dfe9b3'}>
          <Shoots growth={0.6 + (i % 3) * 0.15} count={3} height={0.2} spread={0.08} position={[0, 0.03, 0]} />
        </CultureVessel>
      ))}
      {stageId !== 10 &&
        [-1.4, 1.4].map((dx, i) => (
          <CultureVessel key={`m${i}`} position={[sh[0] + dx, 1.8, sh[2] + 0.1]} mediumLevel={0.2} mediumColor="#dfe9b3">
            <Shoots growth={0.9} count={3} height={0.22} spread={0.08} position={[0, 0.03, 0]} />
          </CultureVessel>
        ))}
      <Html position={[sh[0], 4.0, sh[2] - 0.5]} center distanceFactor={9} style={{ pointerEvents: 'none' }}>
        <div className="readout">
          <span>25 ± 2 °C</span>
          <span>16 h / 8 h</span>
          <span>2 500 lux</span>
        </div>
      </Html>

      {/* hardening chamber */}
      <Bench position={[hd[0], 0, hd[2]]} width={4.4} depth={2.2} height={1} color="#d9e3dc" />
      {stageId !== 13 && (
        <>
          <Beaker position={BASIN} radius={0.3} height={0.4} level={0.6} liquidColor="#d8f1ff" />
          <Tray position={TRAY} />
          {[-0.45, 0, 0.45].map((dx, i) => (
            <group key={i} position={[TRAY[0] + dx, TRAY[1] + 0.06, TRAY[2]]}>
              <Pot position={[0, 0, 0]} scale={0.8} />
              <Plant growth={0.7} height={0.45} leaves={6} leafSize={0.2} seed={50 + i} position={[0, 0.3, 0]} />
            </group>
          ))}
          <HumidityDome position={[TRAY[0], TRAY[1] + 0.06, TRAY[2]]} radius={1.0} />
        </>
      )}

      {/* central island bench with analytical equipment */}
      <Bench position={[0.7, 0, 2.2]} width={12} depth={1.6} height={1} />
      <StereoMicroscope position={[-4, 1, 2.2]} />
      <CompoundMicroscope position={[-2.3, 1, 2.2]} />
      <BeadSteriliser position={[-0.95, 1, 2.2]} />
      <VortexMixer position={[0.5, 1, 2.2]} />
      <Centrifuge position={[2.0, 1, 2.2]} />
      <PipetteStand position={[3.6, 1, 2.2]} />
      <WaterBath position={[5.4, 1, 2.2]} />

      {/* washing station and waste */}
      <Sink position={[-10.4, 0, -1.8]} />
      <BiohazardBin position={[0.2, 0, -7.2]} />

      {/* equipment along the right wall */}
      <Refrigerator position={[19.6, 0, -7.0]} />
      <GrowthChamber position={[19.6, 0, -5.2]} />
      <Bench position={[19.4, 0, -0.6]} width={1.3} depth={1.2} height={0.6} />
      <IncubatorShaker position={[19.4, 0.6, -0.6]} />
      <Distiller position={[19.6, 0, 1.6]} />
      <GlasswareCabinet position={[19.6, 0, 3.6]} />

      {zones.map((z) => (
        <ZoneSign key={z} zone={z} visible={!presentation} />
      ))}
    </group>
  )
})

/* ------------------------------------------------------------------ */
/* Scene root                                                          */
/* ------------------------------------------------------------------ */

function SceneContent() {
  const { stage, mode, setHotspot, view, equipmentId } = useSimulation()
  const showEquipmentLabels = view === 'overview' || mode === 'explore' || equipmentId !== null
  return (
    <>
      <color attach="background" args={['#0f1c22']} />
      <fog attach="fog" args={['#0f1c22', 60, 110]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={['#dfefff', '#3b4a3a', 0.7]} />
      <directionalLight
        position={[8, 14, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-14, 10, -6]} intensity={0.5} />

      {/* click on empty space clears the hotspot selection */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={() => setHotspot(null)}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <LabEnvironment stageId={stage.id} presentation={mode === 'presentation'} />
      <Stage />
      <StageLabel stage={stage} />
      <EquipmentLabels visible={showEquipmentLabels && mode !== 'presentation'} />
      <CameraRig />
    </>
  )
}

export function LaboratoryScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [-2, 9, 20], fov: 48, near: 0.1, far: 150 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'none' }}
    >
      <SceneContent />
    </Canvas>
  )
}
