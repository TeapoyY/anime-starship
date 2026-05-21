import * as THREE from 'three'

const OFFSET = { x: 0, y: 2, z: 8 }
const LERP_FACTOR = 0.05
const LOOK_AHEAD_Z = -10

export function createCameraRig() {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)

  const targetPos = new THREE.Vector3()
  const lookAtPos = new THREE.Vector3()
  const currentLookAt = new THREE.Vector3()

  function update(shipPosition, deltaTime) {
    // Camera sits behind and above ship (+Z, +Y)
    targetPos.set(
      shipPosition.x + OFFSET.x,
      shipPosition.y + OFFSET.y,
      shipPosition.z + OFFSET.z
    )

    // Lerp camera position toward target (smooth trailing)
    camera.position.lerp(targetPos, LERP_FACTOR)

    // Look at a point in front of the ship
    lookAtPos.set(
      shipPosition.x,
      shipPosition.y,
      shipPosition.z + LOOK_AHEAD_Z
    )

    // Smoothly look at target
    currentLookAt.lerp(lookAtPos, LERP_FACTOR)
    camera.lookAt(currentLookAt)
  }

  function setFov(newFov) {
    camera.fov = newFov
    camera.updateProjectionMatrix()
  }

  function getFov() {
    return camera.fov
  }

  function resize(width, height) {
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  return { camera, update, setFov, getFov, resize }
}