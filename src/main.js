import * as THREE from 'three'
import { createShip } from './Ship.js'
import { createCameraRig } from './CameraRig.js'
import { createStarfield } from './Starfield.js'
import { createState } from './state.js'
import { createWarpFX } from './WarpFX.js'

let renderer, scene, camera, ship, starfield, state, warpFX, cameraRig
let lastTime = 0
let clickDebounce = false

export function init() {
  // ─── Renderer ───────────────────────────────────────────────────
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x030014)
  document.body.appendChild(renderer.domElement)

  // ─── Scene ─────────────────────────────────────────────────────
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x030014)
  scene.fog = new THREE.FogExp2(0x030014, 0.003)

  // ─── Lighting ───────────────────────────────────────────────────
  const ambient = new THREE.AmbientLight(0x111122, 0.8)
  scene.add(ambient)

  const dirLight = new THREE.DirectionalLight(0xaaccee, 0.5)
  dirLight.position.set(0, 5, -20)
  scene.add(dirLight)

  // ─── Camera ────────────────────────────────────────────────────
  const rig = createCameraRig()
  camera = rig.camera
  cameraRig = rig

  // ─── Ship ─────────────────────────────────────────────────────
  ship = createShip()
  scene.add(ship)

  // ─── Starfield ─────────────────────────────────────────────────
  const sf = createStarfield()
  starfield = sf
  scene.add(sf.group)

  // ─── State machine ─────────────────────────────────────────────
  state = createState()

  // ─── Warp FX ───────────────────────────────────────────────────
  warpFX = createWarpFX()

  // ─── Engine glow animation ──────────────────────────────────────
  let engineTime = 0

  // ─── Resize ────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h)
    cameraRig.resize(w, h)
  })

  // ─── Click to burst ─────────────────────────────────────────────
  document.getElementById('click-layer').addEventListener('click', () => {
    if (clickDebounce) return
    clickDebounce = true
    state.triggerBurst()
    warpFX.engage()
    setTimeout(() => {
      warpFX.disengage()
      clickDebounce = false
    }, 2000)
  })

  // ─── Auto warp demo ─────────────────────────────────────────────
  state.startAutoWarp(15000, 5000)

  // ─── Start loop ────────────────────────────────────────────────
  lastTime = performance.now()
  requestAnimationFrame(loop)

  return { renderer, scene, camera }
}

function loop(now) {
  requestAnimationFrame(loop)

  const deltaTime = Math.min((now - lastTime) / 1000, 0.05) // cap at 50ms
  lastTime = now
  const time = now / 1000  // seconds

  // ─── Update state machine ───────────────────────────────────────
  const speed = state.update(time)
  const isWarping = state.isState(State.WARP)

  // ─── Update warp FX ─────────────────────────────────────────────
  warpFX.update(deltaTime)

  // ─── Update camera FOV ─────────────────────────────────────────
  const fovMult = warpFX.getFovMultiplier()
  cameraRig.setFov(75 * fovMult)

  // ─── Camera shake during warp ───────────────────────────────────
  const shakeAmp = warpFX.getShakeAmplitude()
  if (shakeAmp > 0) {
    camera.position.x += (Math.random() - 0.5) * shakeAmp
    camera.position.y += (Math.random() - 0.5) * shakeAmp
  }

  // ─── Update starfield ───────────────────────────────────────────
  starfield.update(ship.position, deltaTime, speed)

  // ─── Update star streak stretch ────────────────────────────────
  const stretch = warpFX.getStarStretch()
  starfield.setWarpMode(warpFX.isWarping(), stretch)

  // ─── Engine glow pulse ──────────────────────────────────────────
  engineTime += deltaTime
  const enginePulse = 1.5 + 0.5 * Math.sin(engineTime * Math.PI) // 1.5→2.0
  const warpIntensity = warpFX.getTransition()
  const lights = ship.userData.engineLights
  if (lights) {
    lights.forEach((light, i) => {
      const base = i < 2 ? 2 : 3  // side engines vs center
      const intensity = base * enginePulse * (1 + warpIntensity * 2)
      light.intensity = intensity
    })
  }

  // ─── Render ────────────────────────────────────────────────────
  renderer.render(scene, camera)
}