import * as THREE from 'three'

export const STAR_COUNTS = [80, 70, 50]  // near, mid, far
const STAR_SPEEDS = [0.3, 0.8, 1.5]       // per layer
const STAR_SIZES  = [2.5, 1.8, 1.0]       // per layer
const SPAWN_Z_NEAR = -10
const SPAWN_Z_FAR  = -600
const RESET_Z_PAST  = 15  // past camera

const COLORS = [0xa5c8ff, 0x6688aa, 0xffffff]

/**
 * Creates a layered starfield with 3 depth layers.
 * Returns { stars, update, group }
 */
export function createStarfield(counts = STAR_COUNTS) {
  const group = new THREE.Group()
  const stars = []

  counts.forEach((count, layer) => {
    const positions = new Float32Array(count * 3)
    const colors    = new Float32Array(count * 3)
    const sizes     = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 200
      const y = (Math.random() - 0.5) * 200
      const z = SPAWN_Z_FAR + Math.random() * (SPAWN_Z_NEAR - SPAWN_Z_FAR)

      positions[i * 3]     = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const c = new THREE.Color(COLORS[layer])
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      sizes[i] = STAR_SIZES[layer] * (0.5 + Math.random() * 0.5)

      stars.push({
        x, y, z,
        speed: STAR_SPEEDS[layer],
        size:  sizes[i],
        layer,
        color: COLORS[layer],
      })
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size',    new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      size:        STAR_SIZES[layer],
      vertexColors: true,
      transparent: true,
      opacity:    0.9,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geo, mat)
    group.add(points)
  })

  function update(shipPos, deltaTime, speed = 1) {
    const posAttr = group.children.map(p => p.geometry.attributes.position)
    let si = 0

    for (let layer = 0; layer < counts.length; layer++) {
      const count = counts[layer]
      const positions = posAttr[layer]
      const speedFactor = STAR_SPEEDS[layer] * speed

      for (let i = 0; i < count; i++) {
        const star = stars[si++]
        // Stars move toward camera (+Z) relative to ship motion
        star.z += speedFactor * deltaTime * 60

        // If past camera, reset to far ahead
        if (star.z > RESET_Z_PAST) {
          star.z = SPAWN_Z_FAR + Math.random() * (SPAWN_Z_NEAR - SPAWN_Z_FAR)
          star.x = (Math.random() - 0.5) * 200
          star.y = (Math.random() - 0.5) * 200
        }

        positions.setXYZ(i, star.x, star.y, star.z)
      }
      positions.needsUpdate = true
    }
  }

  function setWarpMode(warp, speed) {
    // During warp, stretch star points by scaling size
    group.children.forEach((points, layer) => {
      points.material.size = warp
        ? STAR_SIZES[layer] * 3
        : STAR_SIZES[layer]
    })
  }

  return { stars, update, setWarpMode, group }
}