import { useEffect, useState } from 'react'
import { ENVIRONMENT_COLOR, ENVIRONMENT_LABEL } from '../data/stages'
import { EQUIPMENT, getEquipment } from '../data/equipment'
import { useSimulation } from '../hooks/useSimulation'

type Tab = 'stage' | 'equipment'

/**
 * Educational side panel with two tabs:
 *  - Stage:     what is happening, why, under which conditions, hotspots
 *  - Equipment: every instrument in the laboratory; click to fly to it
 */
export function InfoPanel() {
  const { stage, activeHotspot, setHotspot, refocus, equipmentId, focusEquipment, showOverview, view } = useSimulation()
  // start collapsed on small screens so the 3D view stays visible
  const [open, setOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth > 900))
  const [tab, setTab] = useState<Tab>('stage')
  const color = ENVIRONMENT_COLOR[stage.environment]
  const focused = getEquipment(equipmentId)

  // selecting equipment in 3D switches to the equipment tab; a stage change switches back
  useEffect(() => {
    if (equipmentId) {
      setTab('equipment')
      setOpen(true)
    }
  }, [equipmentId])
  useEffect(() => {
    if (view === 'stage' && !equipmentId) setTab('stage')
  }, [stage.id, view, equipmentId])

  const areas = Array.from(new Set(EQUIPMENT.map((e) => e.area)))

  return (
    <aside className={`info-panel ${open ? 'open' : 'closed'}`}>
      <div className="info-top">
        <button className="info-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? 'Hide ▾' : 'Show info ▴'}
        </button>
        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'stage'} className={tab === 'stage' ? 'active' : ''} onClick={() => { setTab('stage'); setOpen(true) }}>
            Stage
          </button>
          <button role="tab" aria-selected={tab === 'equipment'} className={tab === 'equipment' ? 'active' : ''} onClick={() => { setTab('equipment'); setOpen(true) }}>
            Equipment
          </button>
        </div>
      </div>

      <div className="info-body">
        {tab === 'stage' && (
          <>
            <div className="info-head">
              <span className="info-num" style={{ background: color }}>
                {stage.id}
              </span>
              <div>
                <h2>{stage.title}</h2>
                <div className="info-group">{stage.group}</div>
              </div>
            </div>
            <div className="env-badge" style={{ borderColor: color, color }}>
              {ENVIRONMENT_LABEL[stage.environment]}
            </div>
            <div className="info-meta">
              <span>⏱ Real duration: {stage.realTime}</span>
              <button className="link-btn" onClick={refocus} title="Move the camera back to this stage">
                ⌖ Re-centre camera
              </button>
            </div>
            <p className="info-desc">{stage.description}</p>

            <h3>Key points</h3>
            <ul className="info-points">
              {stage.keyPoints.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>

            <h3>Conditions</h3>
            <table className="info-table">
              <tbody>
                {stage.conditions.map((c) => (
                  <tr key={c.label}>
                    <th>{c.label}</th>
                    <td>{c.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Hotspots – tap a marker in 3D or here</h3>
            <ul className="hotspot-list">
              {stage.hotspots.map((h) => (
                <li key={h.id}>
                  <button className={`hotspot-btn ${activeHotspot === h.id ? 'active' : ''}`} style={{ ['--c' as string]: color }} onClick={() => setHotspot(activeHotspot === h.id ? null : h.id)}>
                    <span className="hs-dot" />
                    {h.label}
                  </button>
                  {activeHotspot === h.id && <p className="hotspot-text">{h.text}</p>}
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'equipment' && (
          <>
            {focused ? (
              <div className="equip-card">
                <div className="equip-card-area">{focused.area}</div>
                <h2>{focused.name}</h2>
                <p className="info-desc">{focused.description}</p>
                <div className="equip-used">Used in: {focused.usedIn}</div>
                <div className="equip-card-actions">
                  <button className="ghost-btn" onClick={showOverview}>
                    ⌂ Full lab view
                  </button>
                  <button className="ghost-btn" onClick={() => focusEquipment(null)}>
                    ✕ Close
                  </button>
                </div>
              </div>
            ) : (
              <p className="info-desc">
                The virtual laboratory contains {EQUIPMENT.length} pieces of equipment. Click an item here or its label in 3D to fly to it and learn what it is used for.
                <button className="link-btn" style={{ marginLeft: 6 }} onClick={showOverview}>
                  ⌂ Full lab view
                </button>
              </p>
            )}
            {areas.map((area) => (
              <div key={area}>
                <h3>{area}</h3>
                <ul className="equip-list">
                  {EQUIPMENT.filter((e) => e.area === area).map((e) => (
                    <li key={e.id}>
                      <button className={`hotspot-btn ${equipmentId === e.id ? 'active' : ''}`} style={{ ['--c' as string]: '#8ab4ff' }} onClick={() => focusEquipment(equipmentId === e.id ? null : e.id)}>
                        <span className="hs-dot" />
                        {e.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  )
}
