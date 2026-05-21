// State machine for the flight experience
// States: IDLE (≤1.0), CRUISING (1.0–1.5), WARP (>1.5)

export const State = { IDLE: 'IDLE', CRUISING: 'CRUISING', WARP: 'WARP' }

const listeners = []

export function createState() {
  let current = State.IDLE
  let speed = 0.5
  let warpActive = false
  let autoWarpTimer = null
  let burstTimeout = null

  function setState(newState) {
    if (current !== newState) {
      current = newState
      listeners.forEach(fn => fn(current))
    }
  }

  function update(time) {
    // Auto speed oscillation: 0.5 → 1.5 → 0.5 over 20s period
    speed = 1.0 + 0.5 * Math.sin(time * 0.1 * Math.PI)

    if (!warpActive) {
      if (speed <= 1.0) setState(State.IDLE)
      else if (speed <= 1.5) setState(State.CRUISING)
      else setState(State.WARP)
    }

    return speed
  }

  function engageWarp() {
    warpActive = true
    setState(State.WARP)
  }

  function disengageWarp() {
    warpActive = false
    // Re-evaluate based on current speed
    if (speed <= 1.0) setState(State.IDLE)
    else if (speed <= 1.5) setState(State.CRUISING)
    else setState(State.WARP)
  }

  function triggerBurst() {
    if (burstTimeout) clearTimeout(burstTimeout)
    engageWarp()
    burstTimeout = setTimeout(disengageWarp, 2000)
  }

  function onStateChange(fn) {
    listeners.push(fn)
    return () => { listeners.splice(listeners.indexOf(fn), 1) }
  }

  function getState() { return current }
  function getSpeed() { return speed }
  function isState(s) { return current === s }

  function startAutoWarp(intervalMs = 15000, durationMs = 5000) {
    autoWarpTimer = setInterval(() => {
      engageWarp()
      setTimeout(disengageWarp, durationMs)
    }, intervalMs)
  }

  function stopAutoWarp() {
    if (autoWarpTimer) clearInterval(autoWarpTimer)
    autoWarpTimer = null
  }

  return {
    update,
    engageWarp,
    disengageWarp,
    triggerBurst,
    onStateChange,
    getState,
    getSpeed,
    isState,
    startAutoWarp,
    stopAutoWarp,
  }
}