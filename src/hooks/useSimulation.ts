import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { STAGES, TOTAL_STAGES, type StageData } from '../data/stages'

/**
 * Central simulation state machine.
 *
 *  - EXPERIMENT mode: the user presses Start; stages play one after another and
 *    the camera follows the action. Pause / Resume / Restart are available.
 *  - EXPLORE mode:    free camera. Clicking a stage in the timeline plays that
 *    stage once and then holds, so the student can inspect the result.
 *  - PRESENTATION mode: hands-free loop with slow camera orbit and large
 *    captions – designed for demonstrating to a class or professor.
 *
 * Slow-changing state (mode, status, stage) lives in a reducer and is exposed
 * through `useSimulation()`. The per-frame stage progress (0‒1) is exposed
 * separately through `useProgress()` so that only the components that animate
 * re-render 60 times per second.
 */

export type SimulationMode = 'experiment' | 'explore' | 'presentation'
export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed'

export interface SimulationState {
  mode: SimulationMode
  status: SimulationStatus
  /** 0-based index into STAGES */
  stageIndex: number
  speed: number
  /** Id of the hotspot the user selected (for the InfoPanel) */
  activeHotspot: string | null
  /** Incremented whenever the camera should fly to the current stage */
  cameraToken: number
  /** Number of full runs completed (used for the completion banner) */
  completedRuns: number
  /** 'overview' = wide shot of the whole laboratory, 'stage' = follow the current stage */
  view: 'overview' | 'stage'
  /** Id of the equipment item the camera is focused on (see data/equipment.ts) */
  equipmentId: string | null
}

type Action =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESTART' }
  | { type: 'STAGE_END' }
  | { type: 'GO_TO'; index: number; play?: boolean }
  | { type: 'SET_MODE'; mode: SimulationMode }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'SET_HOTSPOT'; id: string | null }
  | { type: 'REFOCUS' }
  | { type: 'SHOW_OVERVIEW' }
  | { type: 'FOCUS_EQUIPMENT'; id: string | null }

const initialState: SimulationState = {
  mode: 'experiment',
  status: 'idle',
  stageIndex: 0,
  speed: 1,
  activeHotspot: null,
  cameraToken: 0,
  completedRuns: 0,
  view: 'overview',
  equipmentId: null,
}

function reducer(state: SimulationState, action: Action): SimulationState {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'running', stageIndex: 0, activeHotspot: null, cameraToken: state.cameraToken + 1, view: 'stage', equipmentId: null }
    case 'PAUSE':
      return state.status === 'running' ? { ...state, status: 'paused' } : state
    case 'RESUME':
      if (state.status === 'paused') return { ...state, status: 'running' }
      return reducer(state, { type: 'START' })
    case 'RESTART':
      return {
        ...state,
        status: 'running',
        stageIndex: 0,
        activeHotspot: null,
        cameraToken: state.cameraToken + 1, view: 'stage', equipmentId: null,
      }
    case 'STAGE_END': {
      if (state.mode === 'explore') return { ...state, status: 'paused' }
      if (state.stageIndex >= TOTAL_STAGES - 1) {
        if (state.mode === 'presentation') {
          return { ...state, stageIndex: 0, cameraToken: state.cameraToken + 1, view: 'stage', equipmentId: null, completedRuns: state.completedRuns + 1 }
        }
        return { ...state, status: 'completed', completedRuns: state.completedRuns + 1 }
      }
      return { ...state, stageIndex: state.stageIndex + 1, activeHotspot: null, cameraToken: state.cameraToken + 1, view: 'stage', equipmentId: null }
    }
    case 'GO_TO': {
      const index = Math.min(Math.max(action.index, 0), TOTAL_STAGES - 1)
      const play = action.play ?? (state.status === 'running' || state.mode !== 'experiment')
      return {
        ...state,
        stageIndex: index,
        status: play ? 'running' : 'paused',
        activeHotspot: null,
        cameraToken: state.cameraToken + 1, view: 'stage', equipmentId: null,
      }
    }
    case 'SET_MODE': {
      if (action.mode === state.mode) return state
      if (action.mode === 'experiment') {
        return { ...state, mode: 'experiment', status: 'idle', stageIndex: 0, activeHotspot: null, cameraToken: state.cameraToken + 1, view: 'stage', equipmentId: null }
      }
      return { ...state, mode: action.mode, status: 'running', activeHotspot: null, cameraToken: state.cameraToken + 1, view: 'stage', equipmentId: null }
    }
    case 'SHOW_OVERVIEW':
      return { ...state, view: 'overview', equipmentId: null, activeHotspot: null }
    case 'FOCUS_EQUIPMENT':
      return { ...state, view: 'stage', equipmentId: action.id, activeHotspot: null }
    case 'SET_SPEED':
      return { ...state, speed: action.speed }
    case 'SET_HOTSPOT':
      return { ...state, activeHotspot: action.id }
    case 'REFOCUS':
      return { ...state, cameraToken: state.cameraToken + 1, view: 'stage', equipmentId: null }
    default:
      return state
  }
}

export interface SimulationApi extends SimulationState {
  stage: StageData
  isRunning: boolean
  start: () => void
  pause: () => void
  resume: () => void
  togglePlay: () => void
  restart: () => void
  next: () => void
  prev: () => void
  goTo: (index: number, play?: boolean) => void
  replay: () => void
  setMode: (mode: SimulationMode) => void
  setSpeed: (speed: number) => void
  setHotspot: (id: string | null) => void
  refocus: () => void
  showOverview: () => void
  focusEquipment: (id: string | null) => void
}

const SimulationContext = createContext<SimulationApi | null>(null)
const ProgressContext = createContext<number>(0)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const stateRef = useRef(state)
  stateRef.current = state

  const resetProgress = useCallback((value = 0) => {
    progressRef.current = value
    setProgress(value)
  }, [])

  // requestAnimationFrame loop drives progress only while running
  useEffect(() => {
    if (state.status !== 'running') return
    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1) // clamp so a tab switch doesn't jump
      last = now
      const s = stateRef.current
      const stage = STAGES[s.stageIndex]
      const next = progressRef.current + (dt * s.speed) / stage.duration
      if (next >= 1) {
        const isLastStage = s.stageIndex >= TOTAL_STAGES - 1
        const holds = s.mode === 'explore' || (s.mode === 'experiment' && isLastStage)
        progressRef.current = holds ? 1 : 0
        setProgress(progressRef.current)
        dispatch({ type: 'STAGE_END' })
      } else {
        progressRef.current = next
        setProgress(next)
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [state.status, state.stageIndex])

  const start = useCallback(() => {
    resetProgress()
    dispatch({ type: 'START' })
  }, [resetProgress])
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), [])
  const resume = useCallback(() => {
    const s = stateRef.current
    if (s.status !== 'paused') resetProgress()
    dispatch({ type: 'RESUME' })
  }, [resetProgress])
  const restart = useCallback(() => {
    resetProgress()
    dispatch({ type: 'RESTART' })
  }, [resetProgress])
  const goTo = useCallback(
    (index: number, play?: boolean) => {
      resetProgress()
      dispatch({ type: 'GO_TO', index, play })
    },
    [resetProgress],
  )
  const replay = useCallback(() => {
    resetProgress()
    dispatch({ type: 'GO_TO', index: stateRef.current.stageIndex, play: true })
  }, [resetProgress])
  const next = useCallback(() => {
    const s = stateRef.current
    if (s.stageIndex < TOTAL_STAGES - 1) goTo(s.stageIndex + 1)
  }, [goTo])
  const prev = useCallback(() => {
    const s = stateRef.current
    goTo(Math.max(0, s.stageIndex - 1))
  }, [goTo])
  const togglePlay = useCallback(() => {
    const s = stateRef.current
    if (s.status === 'running') pause()
    else resume()
  }, [pause, resume])
  const setMode = useCallback(
    (mode: SimulationMode) => {
      resetProgress()
      dispatch({ type: 'SET_MODE', mode })
    },
    [resetProgress],
  )
  const setSpeed = useCallback((speed: number) => dispatch({ type: 'SET_SPEED', speed }), [])
  const setHotspot = useCallback((id: string | null) => dispatch({ type: 'SET_HOTSPOT', id }), [])
  const refocus = useCallback(() => dispatch({ type: 'REFOCUS' }), [])
  const showOverview = useCallback(() => dispatch({ type: 'SHOW_OVERVIEW' }), [])
  const focusEquipment = useCallback((id: string | null) => dispatch({ type: 'FOCUS_EQUIPMENT', id }), [])

  // Keyboard shortcuts: Space = play/pause, ← → = previous/next, R = restart
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (e.code === 'Space') {
        e.preventDefault()
        togglePlay()
      } else if (e.code === 'ArrowRight') next()
      else if (e.code === 'ArrowLeft') prev()
      else if (e.key === 'r' || e.key === 'R') restart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, next, prev, restart])

  const api = useMemo<SimulationApi>(
    () => ({
      ...state,
      stage: STAGES[state.stageIndex],
      isRunning: state.status === 'running',
      start,
      pause,
      resume,
      togglePlay,
      restart,
      next,
      prev,
      goTo,
      replay,
      setMode,
      setSpeed,
      setHotspot,
      refocus,
      showOverview,
      focusEquipment,
    }),
    [state, start, pause, resume, togglePlay, restart, next, prev, goTo, replay, setMode, setSpeed, setHotspot, refocus, showOverview, focusEquipment],
  )

  return createElement(
    SimulationContext.Provider,
    { value: api },
    createElement(ProgressContext.Provider, { value: progress }, children),
  )
}

/** Slow-changing simulation state and actions */
export function useSimulation(): SimulationApi {
  const ctx = useContext(SimulationContext)
  if (!ctx) throw new Error('useSimulation must be used inside <SimulationProvider>')
  return ctx
}

/** Current stage progress 0‒1, updated every animation frame */
export function useProgress(): number {
  return useContext(ProgressContext)
}
