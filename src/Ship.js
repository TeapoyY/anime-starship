import * as THREE from 'three'

/**
 * Creates the spaceship mesh from Three.js primitives.
 * Ship faces -Z direction (forward).
 * Origin is at ship center.
 */
export function createShip() {
  const group = new THREE.Group()
  const engineLights = []

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a1a,
    roughness: 0.7,
    metalness: 0.3
  })
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x00d4ff,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.6,
    roughness: 0.1,
    metalness: 0.9
  })
  const engineMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a1a,
    emissive: 0x00d4ff,
    emissiveIntensity: 1.5,
    roughness: 0.3
  })
  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a1a,
    emissive: 0x7c3aed,
    emissiveIntensity: 1.2,
    roughness: 0.3
  })

  // ─── Main hull ───────────────────────────────────────────────
  // Central body — elongated box
  const hullGeo = new THREE.BoxGeometry(0.8, 0.3, 3.5)
  const hull = new THREE.Mesh(hullGeo, bodyMat)
  group.add(hull)

  // Forward nose cone
  const noseGeo = new THREE.CylinderGeometry(0, 0.35, 1.0, 6)
  const nose = new THREE.Mesh(noseGeo, bodyMat)
  nose.rotation.x = Math.PI / 2
  nose.position.z = -2.25
  group.add(nose)

  // ─── Cockpit ──────────────────────────────────────────────────
  const cockpitGeo = new THREE.SphereGeometry(0.28, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5)
  const cockpit = new THREE.Mesh(cockpitGeo, glassMat)
  cockpit.position.set(0, 0.22, -0.5)
  group.add(cockpit)

  // ─── Wings ────────────────────────────────────────────────────
  const wingGeo = new THREE.BoxGeometry(2.8, 0.06, 1.2)
  const leftWing = new THREE.Mesh(wingGeo, bodyMat)
  leftWing.position.set(0, -0.02, 0.6)
  group.add(leftWing)

  // Wing tips (vertical stabilizers)
  const tipGeo = new THREE.BoxGeometry(0.08, 0.35, 0.5)
  const leftTip = new THREE.Mesh(tipGeo, bodyMat)
  leftTip.position.set(-1.4, 0.15, 0.6)
  group.add(leftTip)
  const rightTip = new THREE.Mesh(tipGeo, bodyMat)
  rightTip.position.set(1.4, 0.15, 0.6)
  group.add(rightTip)

  // ─── Engine pods ──────────────────────────────────────────────
  // Left engine
  const leftEng = createEnginePod(engineMat, accentMat)
  leftEng.position.set(-0.5, -0.05, 1.3)
  group.add(leftEng)
  engineLights.push(leftEng.userData.light)

  // Right engine
  const rightEng = createEnginePod(engineMat, accentMat)
  rightEng.position.set(0.5, -0.05, 1.3)
  group.add(rightEng)
  engineLights.push(rightEng.userData.light)

  // Center (main) engine — larger, purple glow
  const centerEng = createCenterEngine(accentMat)
  centerEng.position.set(0, 0.05, 1.5)
  group.add(centerEng)
  engineLights.push(centerEng.userData.light)

  // Store engine lights on group for external access
  group.userData.engineLights = engineLights
  group.userData.engineMeshes = [leftEng, rightEng, centerEng]

  return group
}

function createEnginePod(coreMat, accentMat) {
  const pod = new THREE.Group()

  // Outer shell
  const shellGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.8, 10)
  const shell = new THREE.Mesh(shellGeo, coreMat)
  shell.rotation.x = Math.PI / 2
  pod.add(shell)

  // Engine core glow
  const coreGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 10)
  const core = new THREE.Mesh(coreGeo, coreMat)
  core.rotation.x = Math.PI / 2
  core.position.z = 0.42
  pod.add(core)

  // Point light at engine exhaust
  const light = new THREE.PointLight(0x00d4ff, 2, 4)
  light.position.set(0, 0, 0.6)
  pod.add(light)

  pod.userData.light = light
  return pod
}

function createCenterEngine(accentMat) {
  const pod = new THREE.Group()

  const shellGeo = new THREE.CylinderGeometry(0.24, 0.28, 1.0, 10)
  const shell = new THREE.Mesh(shellGeo, accentMat)
  shell.rotation.x = Math.PI / 2
  pod.add(shell)

  const coreGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 10)
  const core = new THREE.Mesh(coreGeo, accentMat)
  core.rotation.x = Math.PI / 2
  core.position.z = 0.52
  pod.add(core)

  const light = new THREE.PointLight(0x7c3aed, 3, 5)
  light.position.set(0, 0, 0.7)
  pod.add(light)

  pod.userData.light = light
  return pod
}