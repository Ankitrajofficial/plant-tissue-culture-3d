import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { seeded } from '../utils/animations'

/**
 * Small reusable laboratory props shared by several stages:
 * benches, glassware, tools, pots, steam and flames.
 */

type V3 = [number, number, number]

/* ------------------------------------------------------------------ */
/* Furniture                                                           */
/* ------------------------------------------------------------------ */

export function Bench({
  position,
  width = 4,
  depth = 2,
  height = 1,
  color = '#cfd6dc',
}: {
  position: V3
  width?: number
  depth?: number
  height?: number
  color?: string
}) {
  const legOffsetX = width / 2 - 0.15
  const legOffsetZ = depth / 2 - 0.15
  return (
    <group position={position}>
      <mesh position={[0, height - 0.04, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.08, depth]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {[
        [-legOffsetX, -legOffsetZ],
        [legOffsetX, -legOffsetZ],
        [-legOffsetX, legOffsetZ],
        [legOffsetX, legOffsetZ],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, (height - 0.08) / 2, z]} castShadow>
          <boxGeometry args={[0.08, height - 0.08, 0.08]} />
          <meshStandardMaterial color="#6f7b86" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

export function Shelf({
  position,
  width = 4,
  depth = 1.2,
  levels = [0.6, 1.8, 3.0],
  lightsOn = true,
}: {
  position: V3
  width?: number
  depth?: number
  levels?: number[]
  lightsOn?: boolean
}) {
  const top = levels[levels.length - 1] + 0.9
  return (
    <group position={position}>
      {/* uprights */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh key={`${sx}${sz}`} position={[(sx * width) / 2, top / 2, (sz * depth) / 2]}>
            <boxGeometry args={[0.06, top, 0.06]} />
            <meshStandardMaterial color="#8d99a6" metalness={0.6} roughness={0.4} />
          </mesh>
        )),
      )}
      {levels.map((y, i) => (
        <group key={i}>
          <mesh position={[0, y - 0.03, 0]} receiveShadow>
            <boxGeometry args={[width, 0.06, depth]} />
            <meshStandardMaterial color="#e3e8ee" roughness={0.6} />
          </mesh>
          {/* light tube under the shelf above (or under the top frame) */}
          <mesh position={[0, y + 0.85, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, width - 0.4, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={lightsOn ? '#e8f3ff' : '#222'}
              emissiveIntensity={lightsOn ? 2.2 : 0}
            />
          </mesh>
          {lightsOn && <pointLight position={[0, y + 0.75, 0]} intensity={1.2} distance={2.6} color="#eaf4ff" />}
        </group>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Glassware                                                           */
/* ------------------------------------------------------------------ */

export function Beaker({
  position,
  radius = 0.18,
  height = 0.42,
  level = 0.5,
  liquidColor = '#bfe3ff',
  label,
}: {
  position: V3
  radius?: number
  height?: number
  /** 0‒1 fill */
  level?: number
  liquidColor?: string
  label?: string
}) {
  const liquidH = Math.max(0.001, height * 0.9 * level)
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius * 0.94, height, 20, 1, true]} />
        <meshPhysicalMaterial color="#e5f6ff" transparent opacity={0.22} roughness={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[radius * 0.94, radius * 0.94, 0.008, 20]} />
        <meshPhysicalMaterial color="#e5f6ff" transparent opacity={0.35} />
      </mesh>
      {level > 0.01 && (
        <mesh position={[0, liquidH / 2 + 0.006, 0]}>
          <cylinderGeometry args={[radius * 0.92, radius * 0.9, liquidH, 20]} />
          <meshStandardMaterial color={liquidColor} transparent opacity={0.7} roughness={0.2} />
        </mesh>
      )}
      {label && (
        <Html position={[0, height + 0.12, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div className="tag">{label}</div>
        </Html>
      )}
    </group>
  )
}

export function Bottle({
  position,
  color = '#8ab4ff',
  label,
  scale = 1,
}: {
  position: V3
  color?: string
  label?: string
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.11, 0.34, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 0.08, 12]} />
        <meshStandardMaterial color={color} transparent opacity={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.06, 12]} />
        <meshStandardMaterial color="#222a33" />
      </mesh>
      {/* label strip */}
      <mesh position={[0, 0.17, 0.105]}>
        <planeGeometry args={[0.13, 0.12]} />
        <meshStandardMaterial color="#f8f8f0" />
      </mesh>
      {label && (
        <Html position={[0, 0.58, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div className="tag">{label}</div>
        </Html>
      )}
    </group>
  )
}

export function Flask({ position, level = 0.4, liquidColor = '#f3e3a1' }: { position: V3; level?: number; liquidColor?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.22, 0.34, 20, 1, true]} />
        <meshPhysicalMaterial color="#e5f6ff" transparent opacity={0.22} roughness={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.16, 12, 1, true]} />
        <meshPhysicalMaterial color="#e5f6ff" transparent opacity={0.22} roughness={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {level > 0.01 && (
        <mesh position={[0, 0.16 - (0.34 * (1 - level)) / 2, 0]} scale={[1, level, 1]}>
          <coneGeometry args={[0.2, 0.33, 20]} />
          <meshStandardMaterial color={liquidColor} transparent opacity={0.75} />
        </mesh>
      )}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </group>
  )
}

export function PetriDish({ position, lid = 1 }: { position: V3; lid?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24, 1, true]} />
        <meshPhysicalMaterial color="#e5f6ff" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.004, 24]} />
        <meshPhysicalMaterial color="#e5f6ff" transparent opacity={0.45} />
      </mesh>
      {/* lid, slides sideways when opened */}
      <group position={[(1 - lid) * 0.3, 0.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.23, 0.23, 0.006, 24]} />
          <meshPhysicalMaterial color="#e5f6ff" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Tools                                                               */
/* ------------------------------------------------------------------ */

export function Scalpel({ position, rotation }: { position?: V3; rotation?: V3 }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.32, 0.03, 0.05]} />
        <meshStandardMaterial color="#2b3440" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.24, 0, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.18, 0.006, 0.045]} />
        <meshStandardMaterial color="#d9dee6" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  )
}

export function Forceps({ position, rotation, open = 0.5 }: { position?: V3; rotation?: V3; open?: number }) {
  return (
    <group position={position} rotation={rotation}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.2, 0, s * (0.012 + open * 0.03)]} rotation={[0, s * open * 0.12, 0]}>
          <boxGeometry args={[0.4, 0.018, 0.018]} />
          <meshStandardMaterial color="#d9dee6" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}
    </group>
  )
}

export function SpiritLamp({ position, flame = true }: { position: V3; flame?: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const light = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ref.current) {
      const f = 1 + Math.sin(t * 18) * 0.08 + Math.sin(t * 7.3) * 0.06
      ref.current.scale.set(1 + Math.sin(t * 11) * 0.08, f, 1)
    }
    if (light.current) light.current.intensity = flame ? 1.6 + Math.sin(t * 15) * 0.4 : 0
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.11, 14, 10]} />
        <meshPhysicalMaterial color="#cfe8ff" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.08, 10]} />
        <meshStandardMaterial color="#8d99a6" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.05, 6]} />
        <meshStandardMaterial color="#f5f0d8" />
      </mesh>
      {flame && (
        <group position={[0, 0.3, 0]}>
          <mesh ref={ref} position={[0, 0.06, 0]}>
            <coneGeometry args={[0.035, 0.14, 10]} />
            <meshBasicMaterial color="#ffb347" transparent opacity={0.9} />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <coneGeometry args={[0.02, 0.07, 8]} />
            <meshBasicMaterial color="#5fa8ff" transparent opacity={0.8} />
          </mesh>
          <pointLight ref={light} position={[0, 0.1, 0]} color="#ffb347" distance={1.8} intensity={1.6} />
        </group>
      )}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Equipment                                                           */
/* ------------------------------------------------------------------ */

export function Stirrer({ position, running = true }: { position: V3; running?: boolean }) {
  const bar = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (bar.current && running) bar.current.rotation.y += dt * 14
  })
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[0.5, 0.12, 0.42]} />
        <meshStandardMaterial color="#e9edf1" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.125, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.01, 20]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.16, 0.08, 0.16]}>
        <cylinderGeometry args={[0.03, 0.03, 0.03, 10]} />
        <meshStandardMaterial color="#2f8ad6" />
      </mesh>
      {/* magnetic bar inside the beaker above the plate */}
      <mesh ref={bar} position={[0, 0.15, 0]}>
        <capsuleGeometry args={[0.012, 0.12, 4, 8]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </group>
  )
}

export function PHMeter({ position, reading }: { position: V3; reading?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.22]} />
        <meshStandardMaterial color="#dfe6ec" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.14, 0.111]}>
        <planeGeometry args={[0.2, 0.08]} />
        <meshStandardMaterial color="#163f2c" emissive="#1f6d3d" emissiveIntensity={0.8} />
      </mesh>
      {/* electrode */}
      <mesh position={[0.25, 0.25, 0]} rotation={[0, 0, 0.25]}>
        <cylinderGeometry args={[0.012, 0.012, 0.45, 8]} />
        <meshStandardMaterial color="#9fb6c8" />
      </mesh>
      {reading && (
        <Html position={[0, 0.34, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div className="tag tag-mono">pH {reading}</div>
        </Html>
      )}
    </group>
  )
}

export function Balance({ position }: { position: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <boxGeometry args={[0.4, 0.12, 0.34]} />
        <meshStandardMaterial color="#dfe6ec" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.01, 20]} />
        <meshStandardMaterial color="#9aa7b4" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function VesselRack({ position, count = 4 }: { position: V3; count?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.3 * count + 0.3, 0.06, 0.6]} />
        <meshStandardMaterial color="#b4bfca" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Horticulture                                                        */
/* ------------------------------------------------------------------ */

export function Pot({ position, scale = 1, color = '#b4573c', soil = true }: { position: V3; scale?: number; color?: string; soil?: boolean }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.19, 0.34, 18, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.01, 18]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {soil && (
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.245, 0.245, 0.02, 18]} />
          <meshStandardMaterial color="#3f2a1c" roughness={1} />
        </mesh>
      )}
    </group>
  )
}

export function Tray({ position, width = 1.6, depth = 1.0 }: { position: V3; width?: number; depth?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <boxGeometry args={[width, 0.06, depth]} />
        <meshStandardMaterial color="#2d3a46" roughness={0.6} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`x${s}`} position={[(s * width) / 2, 0.08, 0]}>
          <boxGeometry args={[0.04, 0.1, depth]} />
          <meshStandardMaterial color="#2d3a46" />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={`z${s}`} position={[0, 0.08, (s * depth) / 2]}>
          <boxGeometry args={[width, 0.1, 0.04]} />
          <meshStandardMaterial color="#2d3a46" />
        </mesh>
      ))}
    </group>
  )
}

export function HumidityDome({ position, radius = 0.9, lift = 0, opacity = 0.25 }: { position: V3; radius?: number; lift?: number; opacity?: number }) {
  return (
    <group position={[position[0], position[1] + lift, position[2]]}>
      <mesh scale={[1, 0.75, 0.7]}>
        <sphereGeometry args={[radius, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#d6f1ff" transparent opacity={opacity} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Effects                                                             */
/* ------------------------------------------------------------------ */

/** Rising, fading particles – used for autoclave steam and the mist in the hardening chamber */
export function Steam({
  position,
  count = 14,
  active = true,
  color = '#ffffff',
  spread = 0.3,
  rise = 1.2,
  size = 0.08,
}: {
  position: V3
  count?: number
  active?: boolean
  color?: string
  spread?: number
  rise?: number
  size?: number
}) {
  const group = useRef<THREE.Group>(null)
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => ({ x: (seeded(i * 3) - 0.5) * spread * 2, z: (seeded(i * 5) - 0.5) * spread * 2, phase: seeded(i * 7), speed: 0.6 + seeded(i * 11) * 0.5 })), [count, spread])
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.children.forEach((child, i) => {
      const o = offsets[i]
      const life = ((t * o.speed * 0.5 + o.phase) % 1)
      const m = child as THREE.Mesh
      m.position.set(o.x + Math.sin(t + i) * 0.05, life * rise, o.z)
      const s = active ? size * (0.5 + life) : 0
      m.scale.setScalar(s)
      const mat = m.material as THREE.MeshBasicMaterial
      mat.opacity = active ? 0.45 * (1 - life) : 0
    })
  })
  return (
    <group ref={group} position={position}>
      {offsets.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

/** Pulsing ring used to highlight the selected object */
export function HighlightRing({ position, radius = 0.5, color = '#5ad67d' }: { position: V3; radius?: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const s = 1 + Math.sin(t * 3) * 0.08
    ref.current.scale.set(s, s, s)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = 0.55 + Math.sin(t * 3) * 0.25
  })
  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 0.85, radius, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
    </mesh>
  )
}

/** Floating caption attached to a point in the 3D scene */
export function Caption({ position, children, tone }: { position: V3; children: React.ReactNode; tone?: 'info' | 'warn' | 'ok' }) {
  return (
    <Html position={position} center distanceFactor={7} style={{ pointerEvents: 'none' }} zIndexRange={[50, 0]}>
      <div className={`caption ${tone ?? ''}`}>{children}</div>
    </Html>
  )
}
