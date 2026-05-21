// WarpFX — handles warp state transitions, FOV expansion, star streak morphing

export function createWarpFX() {
  let warping = false
  let transition = 0   // 0 → 1 (engage), 1 → 0 (disengage)
  const ENGAGE_DURATION = 0.6  // seconds
  const DISENGAGE_DURATION = 0.6

  function engage() {
    if (warping) return
    warping = true
  }

  function disengage() {
    if (!warping) return
    warping = false
  }

  function update(deltaTime) {
    if (warping) {
      transition = Math.min(1, transition + deltaTime / ENGAGE_DURATION)
    } else {
      transition = Math.max(0, transition - deltaTime / DISENGAGE_DURATION)
    }
  }

  /**
   * Returns FOV multiplier: 1.0 at rest → 1.2 at full warp
   * (base FOV 75 → 90 is 1.2x)
   */
  function getFovMultiplier() {
    return 1.0 + 0.2 * easeInOut(transition)
  }

  /**
   * Returns star stretch factor: 1.0 at rest → 20x at full warp
   */
  function getStarStretch() {
    return 1.0 + 19.0 * easeInOut(transition)
  }

  /**
   * Returns camera shake amplitude (0 at rest, 0.1 at full warp)
   */
  function getShakeAmplitude() {
    return 0.1 * easeInOut(transition)
  }

  function isWarping() {
    return warping && transition > 0.05
  }

  function getTransition() {
    return transition
  }

  return {
    engage,
    disengage,
    update,
    isWarping,
    getFovMultiplier,
    getStarStretch,
    getShakeAmplitude,
    getTransition,
  }
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}