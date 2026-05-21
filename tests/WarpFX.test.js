import { describe, it, expect, vi } from 'vitest'

// Mock three - minimal for WarpFX
vi.mock('three', () => {
  return {
    Color: class MockColor {
      constructor(c) { this.val = c }
    }
  }
})

const { createWarpFX } = await import('../src/WarpFX.js')

describe('WarpFX.js', () => {
  let warp

  beforeEach(() => {
    warp = createWarpFX()
  })

  it('createWarpFX returns engage/disengage functions', () => {
    expect(typeof warp.engage).toBe('function')
    expect(typeof warp.disengage).toBe('function')
  })

  it('isWarping starts false', () => {
    expect(warp.isWarping()).toBe(false)
  })

  it('engage() then update transitions toward warping', () => {
    warp.engage()
    // transition += delta/duration. Need >0.05 threshold.
    // With duration=0.6, one update: 0.016/0.6 = 0.027 < 0.05, so still false
    warp.update(0.016)
    expect(warp.isWarping()).toBe(false) // transition not yet > 0.05
    // After enough frames, it becomes true
    warp.update(0.016)
    warp.update(0.016)
    expect(warp.isWarping()).toBe(true)
  })

  it('disengage() sets isWarping to false', () => {
    warp.engage()
    warp.disengage()
    expect(warp.isWarping()).toBe(false)
  })

  it('engage/disengage are idempotent', () => {
    warp.engage()
    warp.engage()
    warp.disengage()
    warp.disengage()
    expect(warp.isWarping()).toBe(false)
  })

  it('update() is callable without errors', () => {
    warp.engage()
    expect(() => warp.update(0.016)).not.toThrow()
  })

  it('getFovMultiplier returns >1 when warping', () => {
    warp.engage()
    // Simulate some time passing
    for (let i = 0; i < 10; i++) warp.update(0.016)
    const fovMult = warp.getFovMultiplier()
    expect(fovMult).toBeGreaterThan(1)
  })
})