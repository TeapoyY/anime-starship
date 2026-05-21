import { describe, it, expect, vi, beforeEach } from 'vitest'
import { State, createState } from '../src/state.js'

describe('state.js', () => {
  let state

  beforeEach(() => {
    state = createState()
  })

  it('starts in IDLE state', () => {
    expect(state.getState()).toBe(State.IDLE)
  })

  it('update returns speed between 0.5 and 1.5', () => {
    const speed1 = state.update(0)
    const speed2 = state.update(5000)
    expect(speed1).toBeGreaterThanOrEqual(0.5)
    expect(speed1).toBeLessThanOrEqual(1.5)
    expect(speed2).toBeGreaterThanOrEqual(0.5)
    expect(speed2).toBeLessThanOrEqual(1.5)
  })

  it('triggerBurst changes state to WARP', () => {
    state.triggerBurst()
    expect(state.getState()).toBe(State.WARP)
  })

  it('triggerBurst returns to prior state after 2s', () => {
    vi.useFakeTimers()
    state.update(0)  // set initial speed
    state.triggerBurst()
    expect(state.getState()).toBe(State.WARP)
    vi.advanceTimersByTime(2001)
    expect(state.getState()).toBe(State.IDLE)
    vi.useRealTimers()
  })

  it('onStateChange fires callback on state change', () => {
    const cb = vi.fn()
    state.onStateChange(cb)
    state.triggerBurst()
    expect(cb).toHaveBeenCalledWith(State.WARP)
  })

  it('getSpeed returns current speed value', () => {
    state.update(0)
    const speed = state.getSpeed()
    expect(typeof speed).toBe('number')
    expect(speed).toBeGreaterThanOrEqual(0.5)
    expect(speed).toBeLessThanOrEqual(1.5)
  })
})