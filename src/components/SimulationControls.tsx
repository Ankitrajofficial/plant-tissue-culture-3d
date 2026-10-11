import { TOTAL_STAGES } from '../data/stages'
import { useSimulation, type SimulationMode } from '../hooks/useSimulation'

const SPEEDS = [0.5, 1, 2, 4]

const MODES: { id: SimulationMode; label: string; hint: string }[] = [
  { id: 'experiment', label: 'Experiment', hint: 'Run the full 15-stage protocol with Start / Pause / Restart' },
  { id: 'explore', label: 'Explore', hint: 'Free camera – pick any stage or piece of equipment' },
  { id: 'presentation', label: 'Presentation', hint: 'Hands-free loop with slow camera orbit for demonstrations' },
]

/**
 * Transport controls (Start / Pause / Resume / Restart / Prev / Next / Speed)
 * and the Experiment / Explore / Presentation mode switch.
 */
export function SimulationControls() {
  const sim = useSimulation()
  const { mode, status, stageIndex, speed } = sim

  const statusText =
    status === 'idle' ? 'Ready' : status === 'running' ? 'Running' : status === 'paused' ? 'Paused' : 'Experiment complete'

  return (
    <div className="controls">
      <div className="mode-switch" role="tablist" aria-label="Simulation mode">
        {MODES.map((m) => (
          <button key={m.id} role="tab" aria-selected={mode === m.id} className={`mode-btn ${mode === m.id ? 'active' : ''}`} onClick={() => sim.setMode(m.id)} title={m.hint}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="transport">
        <button className="icon-btn" onClick={sim.prev} disabled={stageIndex === 0} title="Previous stage (←)" aria-label="Previous stage">
          ‹
        </button>

        {mode === 'experiment' && status === 'idle' && (
          <button className="primary-btn" onClick={sim.start}>
            ▶ Start Experiment
          </button>
        )}
        {mode === 'experiment' && status === 'completed' && (
          <button className="primary-btn" onClick={sim.restart}>
            ↺ Run Again
          </button>
        )}
        {(status === 'running' || status === 'paused') && (
          <button className="primary-btn" onClick={sim.togglePlay} title="Space">
            {status === 'running' ? '❚❚ Pause' : '▶ Resume'}
          </button>
        )}
        {mode === 'explore' && status !== 'running' && (
          <button className="ghost-btn" onClick={sim.replay} title="Replay this stage">
            ↻ Replay
          </button>
        )}
        {(status !== 'idle' || mode !== 'experiment') && (
          <button className="ghost-btn" onClick={sim.restart} title="Restart from stage 1 (R)">
            ↺ Restart
          </button>
        )}

        <button className="icon-btn" onClick={sim.next} disabled={stageIndex === TOTAL_STAGES - 1} title="Next stage (→)" aria-label="Next stage">
          ›
        </button>

        <label className="speed">
          <span>Speed</span>
          <select value={speed} onChange={(e) => sim.setSpeed(Number(e.target.value))}>
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="status-line">
        <span className={`dot ${status}`} />
        Stage {stageIndex + 1} / {TOTAL_STAGES} · {statusText}
      </div>
    </div>
  )
}
