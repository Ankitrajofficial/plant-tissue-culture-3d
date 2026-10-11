import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { EQUIPMENT, SMALL_LABEL_DISTANCE } from '../data/equipment'
import { useSimulation } from '../hooks/useSimulation'
import { Bench, Beaker, Flask } from './LabProps'

/**
 * Additional biotechnology laboratory equipment. All of it is decorative
 * context for the protocol, but every item is labelled and can be clicked
 * to read what it is used for.
 */

type V3 = [number, number, number]

const steel = <meshStandardMaterial color="#c9d1d9" metalness={0.6} roughness={0.35} />
const white = <meshStandardMaterial color="#e9edf1" roughness={0.5} />
const dark = <meshStandardMaterial color="#2b3440" roughness={0.6} />

export function Refrigerator({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 2.0, 0.9]} />
        {white}
      </mesh>
      {/* door split and handles (facing -x into the room) */}
      <mesh position={[-0.46, 1.28, 0]}>
        <boxGeometry args={[0.02, 0.01, 0.86]} />
        {dark}
      </mesh>
      <mesh position={[-0.48, 1.6, 0.3]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        {steel}
      </mesh>
      <mesh position={[-0.48, 0.8, 0.3]}>
        <boxGeometry args={[0.04, 0.5, 0.04]} />
        {steel}
      </mesh>
      <mesh position={[-0.46, 1.85, -0.2]}>
        <planeGeometry args={[0.18, 0.08]} />
        <meshStandardMaterial color="#163f2c" emissive="#1f6d3d" emissiveIntensity={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function GrowthChamber({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 2.0, 1.1]} />
        {white}
      </mesh>
      {/* glass door */}
      <mesh position={[-0.46, 1.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 1.5]} />
        <meshPhysicalMaterial color="#cfe9ff" transparent opacity={0.3} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {/* lit shelves inside */}
      {[0.6, 1.1, 1.6].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 0]}>
            <boxGeometry args={[0.8, 0.03, 1.0]} />
            {steel}
          </mesh>
          <mesh position={[0, y + 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
            <meshStandardMaterial color="#fff" emissive="#ffd6f2" emissiveIntensity={1.6} />
          </mesh>
          <mesh position={[0, y + 0.02, 0]}>
            <sphereGeometry args={[0.1, 8, 6]} />
            <meshStandardMaterial color="#58c25f" />
          </mesh>
        </group>
      ))}
      <pointLight position={[-0.2, 1.3, 0]} intensity={0.8} distance={1.6} color="#ffd6f2" />
      <mesh position={[-0.46, 1.9, 0]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshStandardMaterial color="#1b2229" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function IncubatorShaker({ position }: { position: V3 }) {
  const tray = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!tray.current) return
    const t = clock.getElapsedTime() * 6
    tray.current.position.set(Math.cos(t) * 0.03, 0, Math.sin(t) * 0.03)
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.5, 0.9]} />
        {white}
      </mesh>
      <mesh position={[-0.5, 0.35, 0.3]}>
        <boxGeometry args={[0.12, 0.14, 0.2]} />
        {dark}
      </mesh>
      <group ref={tray} position={[0, 0.5, 0]}>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.7]} />
          {steel}
        </mesh>
        {[-0.25, 0.25].map((x) =>
          [-0.18, 0.18].map((z) => <Flask key={`${x}${z}`} position={[x, 0.04, z]} level={0.3} liquidColor="#f3e3a1" />),
        )}
      </group>
      {/* transparent lid */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.0, 0.66, 0.8]} />
        <meshPhysicalMaterial color="#cfe9ff" transparent opacity={0.18} roughness={0.1} depthWrite={false} />
      </mesh>
    </group>
  )
}

export function Distiller({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 1.5, 0.6]} />
        {white}
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.3, 16]} />
        <meshPhysicalMaterial color="#cfe9ff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      <mesh position={[-0.37, 0.5, 0]}>
        <boxGeometry args={[0.04, 0.03, 0.08]} />
        {steel}
      </mesh>
      {/* collection bottle */}
      <mesh position={[-0.6, 0.3, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.6, 14]} />
        <meshPhysicalMaterial color="#d8f1ff" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export function GlasswareCabinet({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 2.4, 1.6]} />
        {white}
      </mesh>
      <mesh position={[-0.31, 1.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 2.2]} />
        <meshPhysicalMaterial color="#cfe9ff" transparent opacity={0.25} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>
      {[0.3, 0.9, 1.5, 2.1].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[0.5, 0.03, 1.5]} />
          {steel}
        </mesh>
      ))}
      {[0.3, 0.9, 1.5].map((y, row) =>
        [-0.5, -0.1, 0.3].map((z, i) => (
          <group key={`${row}${i}`} position={[-0.05, y + 0.02, z]}>
            {(row + i) % 2 === 0 ? <Beaker position={[0, 0, 0]} radius={0.09} height={0.22} level={0} /> : <Flask position={[0, 0, 0]} level={0} />}
          </group>
        )),
      )}
    </group>
  )
}

export function StereoMicroscope({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.36, 0.06, 0.3]} />
        {white}
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 20]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[0, 0.35, -0.1]}>
        <boxGeometry args={[0.08, 0.64, 0.08]} />
        {white}
      </mesh>
      <mesh position={[0, 0.5, 0.02]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.16, 0.22, 0.14]} />
        {white}
      </mesh>
      {[-0.04, 0.04].map((x) => (
        <mesh key={x} position={[x, 0.66, 0.08]} rotation={[0.9, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.028, 0.16, 10]} />
          {dark}
        </mesh>
      ))}
      <mesh position={[0, 0.33, 0.02]}>
        <cylinderGeometry args={[0.03, 0.04, 0.12, 10]} />
        {dark}
      </mesh>
    </group>
  )
}

export function CompoundMicroscope({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.3, 0.06, 0.26]} />
        {dark}
      </mesh>
      <mesh position={[0, 0.3, -0.08]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.07, 0.55, 0.07]} />
        {dark}
      </mesh>
      <mesh position={[0, 0.3, 0.03]}>
        <boxGeometry args={[0.2, 0.02, 0.18]} />
        {steel}
      </mesh>
      <mesh position={[0, 0.44, 0.03]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.06, 12]} />
        {steel}
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI * 2) / 3) * 0.035, 0.37, 0.03 + Math.sin((i * Math.PI * 2) / 3) * 0.035]}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
          {steel}
        </mesh>
      ))}
      <mesh position={[0, 0.62, 0.1]} rotation={[1.0, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.2, 10]} />
        {dark}
      </mesh>
    </group>
  )
}

export function BeadSteriliser({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.24, 16]} />
        {steel}
      </mesh>
      <mesh position={[0, 0.245, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.01, 16]} />
        <meshStandardMaterial color="#ffb347" emissive="#ff7b1a" emissiveIntensity={0.6} />
      </mesh>
      {/* instrument tray */}
      <mesh position={[0.35, 0.015, 0]}>
        <boxGeometry args={[0.36, 0.03, 0.24]} />
        {steel}
      </mesh>
      {[-0.07, 0, 0.07].map((z, i) => (
        <mesh key={i} position={[0.35, 0.04, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.008, 0.008, 0.26, 6]} />
          <meshStandardMaterial color="#d9dee6" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
    </group>
  )
}

export function VortexMixer({ position }: { position: V3 }) {
  const head = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (head.current) head.current.position.x = Math.sin(clock.getElapsedTime() * 40) * 0.006
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[0.2, 0.12, 0.22]} />
        {white}
      </mesh>
      <mesh ref={head} position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.04, 14]} />
        <meshStandardMaterial color="#3a4652" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.2, 8]} />
        <meshPhysicalMaterial color="#d8f1ff" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export function Centrifuge({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.46]} />
        {white}
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.06, 20]} />
        {steel}
      </mesh>
      <mesh position={[0.18, 0.31, 0.2]}>
        <boxGeometry args={[0.1, 0.03, 0.04]} />
        <meshStandardMaterial color="#163f2c" emissive="#1f6d3d" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

export function PipetteStand({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.04, 16]} />
        {white}
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.56, 8]} />
        {steel}
      </mesh>
      <mesh position={[0, 0.56, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
        {white}
      </mesh>
      {['#2f8ad6', '#f4b860', '#5ad67d', '#c9a3ff'].map((c, i) => {
        const a = (i / 4) * Math.PI * 2
        return (
          <group key={c} position={[Math.cos(a) * 0.1, 0.33, Math.sin(a) * 0.1]}>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.018, 0.012, 0.22, 8]} />
              <meshStandardMaterial color={c} />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <cylinderGeometry args={[0.008, 0.004, 0.16, 6]} />
              <meshStandardMaterial color="#f5f5f5" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export function WaterBath({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.14, 0]} castShadow>
        <boxGeometry args={[0.7, 0.28, 0.5]} />
        {white}
      </mesh>
      <mesh position={[0, 0.285, 0.02]}>
        <boxGeometry args={[0.5, 0.01, 0.34]} />
        <meshStandardMaterial color="#8fd0ff" transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.2, 0.3, 0.02]}>
        <cylinderGeometry args={[0.07, 0.07, 0.2, 12]} />
        <meshPhysicalMaterial color="#d8f1ff" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.26, 0.2, 0.26]}>
        <planeGeometry args={[0.14, 0.06]} />
        <meshStandardMaterial color="#163f2c" emissive="#1f6d3d" emissiveIntensity={0.8} />
      </mesh>
    </group>
  )
}

export function Sink({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <Bench position={[0, 0, 0]} width={1.8} depth={1.2} height={1} color="#d2d9de" />
      <mesh position={[-0.2, 0.9, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.6]} />
        <meshStandardMaterial color="#8d99a6" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.2, 0.92, 0]}>
        <boxGeometry args={[0.7, 0.18, 0.5]} />
        {dark}
      </mesh>
      {/* tap */}
      <mesh position={[-0.2, 1.2, -0.35]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        {steel}
      </mesh>
      <mesh position={[-0.2, 1.4, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
        {steel}
      </mesh>
      {/* drying rack with glassware */}
      <mesh position={[0.55, 1.1, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.6]} />
        {steel}
      </mesh>
      {[-0.15, 0.15].map((z) => (
        <Beaker key={z} position={[0.55, 1.11, z]} radius={0.09} height={0.22} level={0} />
      ))}
    </group>
  )
}

export function BiohazardBin({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.25, 0.8, 18]} />
        <meshStandardMaterial color="#f4b860" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.83, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 18]} />
        {dark}
      </mesh>
      <mesh position={[0, 0.45, 0.26]}>
        <circleGeometry args={[0.1, 16]} />
        <meshStandardMaterial color="#1b1b1b" />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Clickable labels                                                    */
/* ------------------------------------------------------------------ */

export function EquipmentLabels({ visible }: { visible: boolean }) {
  const { equipmentId, focusEquipment } = useSimulation()
  const [nearIds, setNearIds] = useState<string>('')
  const frame = useRef(0)
  const tmp = useRef(new THREE.Vector3())

  // every few frames, work out which small items are close enough to label
  useFrame(({ camera }) => {
    frame.current++
    if (frame.current % 10 !== 0) return
    const ids = EQUIPMENT.filter((e) => !e.small || camera.position.distanceTo(tmp.current.set(...e.label)) < SMALL_LABEL_DISTANCE)
      .map((e) => e.id)
      .join(',')
    if (ids !== nearIds) setNearIds(ids)
  })

  if (!visible) return null
  const near = new Set(nearIds.split(','))
  return (
    <group>
      {EQUIPMENT.filter((e) => near.has(e.id) || e.id === equipmentId).map((e) => (
        <Html key={e.id} position={e.label} center zIndexRange={[35, 0]}>
          <button
            className={`equip-label ${equipmentId === e.id ? 'active' : ''}`}
            onClick={(ev) => {
              ev.stopPropagation()
              focusEquipment(equipmentId === e.id ? null : e.id)
            }}
            title={e.description}
          >
            {e.name}
          </button>
        </Html>
      ))}
    </group>
  )
}
