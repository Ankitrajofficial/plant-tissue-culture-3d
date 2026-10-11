import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ENVIRONMENT_COLOR, ENVIRONMENT_LABEL, ZONES, type Hotspot, type StageData } from '../data/stages'
import { useSimulation } from '../hooks/useSimulation'

/**
 * 3D-anchored labels: the stage title floating above the active zone plus the
 * interactive hotspot markers that reveal educational notes when tapped.
 */

function HotspotMarker({ hotspot, color }: { hotspot: Hotspot; color: string }) {
  const { activeHotspot, setHotspot } = useSimulation()
  const [hover, setHover] = useState(false)
  const ring = useRef<THREE.Mesh>(null)
  const active = activeHotspot === hotspot.id

  useFrame(({ clock }) => {
    if (!ring.current) return
    const t = (clock.getElapsedTime() * 0.8 + hotspot.position[0]) % 1
    const s = 1 + t * 1.6
    ring.current.scale.set(s, s, s)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.6
  })

  return (
    <group position={hotspot.position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          setHotspot(active ? null : hotspot.id)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.09, 14, 10]} />
        <meshStandardMaterial color={active || hover ? '#ffffff' : color} emissive={color} emissiveIntensity={active ? 2.5 : 1.2} />
      </mesh>
      {/* larger invisible hit area for touch */}
      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation()
          setHotspot(active ? null : hotspot.id)
        }}
      >
        <sphereGeometry args={[0.28, 8, 6]} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.1, 0.13, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <Html position={[0, 0.22, 0]} center distanceFactor={7} zIndexRange={[60, 0]} style={{ pointerEvents: 'none' }}>
        <div className={`hotspot-label ${active ? 'active' : ''}`} style={{ borderColor: color }}>
          <strong>{hotspot.label}</strong>
          {active && <p>{hotspot.text}</p>}
        </div>
      </Html>
    </group>
  )
}

export function StageLabel({ stage, showHotspots = true }: { stage: StageData; showHotspots?: boolean }) {
  const zone = ZONES[stage.zone]
  const color = ENVIRONMENT_COLOR[stage.environment]
  const labelPos: [number, number, number] = [zone.position[0], 4.6, zone.position[2] + (stage.zone === 'greenhouse' ? 2.5 : 1.6)]

  return (
    <group>
      <Html position={labelPos} center distanceFactor={10} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
        <div className="stage-badge" style={{ borderColor: color }}>
          <span className="stage-badge-num" style={{ background: color }}>
            {stage.id}
          </span>
          <div>
            <div className="stage-badge-title">{stage.title}</div>
            <div className="stage-badge-env" style={{ color }}>
              {ENVIRONMENT_LABEL[stage.environment]}
            </div>
          </div>
        </div>
      </Html>
      {showHotspots && stage.hotspots.map((h) => <HotspotMarker key={h.id} hotspot={h} color={color} />)}
    </group>
  )
}
