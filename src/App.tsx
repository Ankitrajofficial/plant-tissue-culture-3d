import { useState } from 'react'
import { LaboratoryScene } from './components/LaboratoryScene'
import { SimulationControls } from './components/SimulationControls'
import { Timeline } from './components/Timeline'
import { InfoPanel } from './components/InfoPanel'
import { SimulationProvider, useSimulation } from './hooks/useSimulation'
import { ENVIRONMENT_COLOR, ENVIRONMENT_LABEL, TOTAL_STAGES } from './data/stages'

function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="help-backdrop" onClick={onClose}>
      <div className="help-card" onClick={(e) => e.stopPropagation()}>
        <h2>How to use the virtual lab</h2>
        <ul>
          <li>
            <b>Rotate</b> – drag with the mouse / one finger
          </li>
          <li>
            <b>Zoom</b> – scroll wheel / pinch with two fingers
          </li>
          <li>
            <b>Pan</b> – right-drag or Ctrl-drag / two-finger drag
          </li>
          <li>
            <b>Experiment mode</b> – press <i>Start Experiment</i>; the camera follows all 15 stages. Pause, Resume or Restart at any time.
          </li>
          <li>
            <b>Explore mode</b> – click any stage in the timeline or any zone sign in the lab; the stage plays once and then holds.
          </li>
          <li>
            <b>Presentation mode</b> – hands-free loop with a slowly orbiting camera and large captions.
          </li>
          <li>
            <b>Hotspots</b> – tap the glowing markers in 3D (or the list in the info panel) for explanations.
          </li>
          <li>
            <b>Full lab view / Equipment</b> – the ⌂ button shows the whole laboratory; equipment labels and the Equipment tab explain every instrument.
          </li>
          <li>
            <b>Keyboard</b> – Space = play/pause · ← → = previous/next stage · R = restart
          </li>
        </ul>
        <button className="primary-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  )
}

function PresentationOverlay() {
  const { stage, stageIndex, setMode, togglePlay, status } = useSimulation()
  const color = ENVIRONMENT_COLOR[stage.environment]
  return (
    <div className="presentation-overlay">
      <div className="presentation-top">
        <span className="brand">Plant Tissue Culture · Micropropagation</span>
        <div>
          <button className="ghost-btn" onClick={togglePlay}>
            {status === 'running' ? '❚❚ Pause' : '▶ Resume'}
          </button>
          <button className="ghost-btn" onClick={() => setMode('experiment')}>
            ✕ Exit presentation
          </button>
        </div>
      </div>
      <div className="presentation-caption">
        <div className="pc-head">
          <span className="info-num" style={{ background: color }}>
            {stage.id}
          </span>
          <div>
            <h2>{stage.title}</h2>
            <span style={{ color }}>{ENVIRONMENT_LABEL[stage.environment]}</span> · <span>{stage.group}</span>
          </div>
        </div>
        <p>{stage.description}</p>
        <div className="pc-progress">
          {Array.from({ length: TOTAL_STAGES }, (_, i) => (
            <i key={i} className={i <= stageIndex ? 'on' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Layout() {
  const { mode, status, view, showOverview } = useSimulation()
  const [help, setHelp] = useState(false)
  const presentation = mode === 'presentation'

  return (
    <div className={`app ${presentation ? 'presentation' : ''}`}>
      <div className="scene">
        <LaboratoryScene />
      </div>

      {!presentation && (
        <>
          <header className="topbar">
            <div className="brand">
              <span className="brand-icon">🌱</span>
              <div>
                <strong>Plant Tissue Culture</strong>
                <small>Micropropagation 3D Lab</small>
              </div>
            </div>
            <div className="topbar-actions">
              <button className={`ghost-btn ${view === 'overview' ? 'active' : ''}`} onClick={showOverview} title="Wide view of the whole laboratory">
                ⌂ Full lab view
              </button>
              <button className="ghost-btn" onClick={() => setHelp(true)} aria-label="Help">
                ? Help
              </button>
            </div>
          </header>

          {view === 'overview' && (
            <div className="overview-hint">
              Laboratory overview – drag to rotate, scroll to zoom. Click any equipment label, zone sign or timeline stage to go there.
            </div>
          )}

          <InfoPanel />

          <div className="bottom-dock">
            {status === 'completed' && (
              <div className="banner">
                ✓ Experiment complete – a mature plant was regenerated from a single explant through all 15 stages.
              </div>
            )}
            <Timeline />
            <SimulationControls />
          </div>
        </>
      )}

      {presentation && <PresentationOverlay />}
      {help && <HelpOverlay onClose={() => setHelp(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <SimulationProvider>
      <Layout />
    </SimulationProvider>
  )
}
