import { ENVIRONMENT_COLOR, STAGES } from '../data/stages'
import { useProgress, useSimulation } from '../hooks/useSimulation'

/**
 * 15-step navigator. Each dot is coloured by environment (ex vitro /
 * laboratory / in vitro) and fills with the live progress of the active stage.
 */
export function Timeline() {
  const { stageIndex, goTo } = useSimulation()
  const progress = useProgress()

  return (
    <div className="timeline" role="list" aria-label="Stages">
      {STAGES.map((s, i) => {
        const color = ENVIRONMENT_COLOR[s.environment]
        const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'todo'
        const fill = i < stageIndex ? 1 : i === stageIndex ? progress : 0
        return (
          <button
            key={s.id}
            role="listitem"
            className={`tl-step ${state}`}
            style={{ ['--c' as string]: color }}
            onClick={() => goTo(i)}
            title={`${s.id}. ${s.title}`}
            aria-current={state === 'current' ? 'step' : undefined}
          >
            <span className="tl-dot">
              <span className="tl-fill" style={{ transform: `scaleX(${fill})` }} />
              <span className="tl-num">{s.id}</span>
            </span>
            <span className="tl-label">{s.short}</span>
          </button>
        )
      })}
      <div className="tl-legend">
        <span>
          <i style={{ background: ENVIRONMENT_COLOR['ex-vitro'] }} /> ex vitro
        </span>
        <span>
          <i style={{ background: ENVIRONMENT_COLOR.laboratory }} /> lab prep
        </span>
        <span>
          <i style={{ background: ENVIRONMENT_COLOR['in-vitro'] }} /> in vitro
        </span>
      </div>
    </div>
  )
}
