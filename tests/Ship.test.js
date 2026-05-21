import { describe, it, expect, vi } from 'vitest'

// Mock Three.js before importing Ship
vi.mock('three', () => {
  // Must use function to support `new`
  const MockGroup = function() {
    this.children = []
    this.userData = {}
    this.position = { x: 0, y: 0, z: 0, set: vi.fn(), setScalar: vi.fn(), copy: vi.fn(), lerp: vi.fn() }
    this.rotation = { x: 0, y: 0, z: 0, set: vi.fn(), setFromVector3: vi.fn() }
    this.scale = { x: 1, y: 1, z: 1, set: vi.fn(), setScalar: vi.fn() }
  }
  MockGroup.prototype.add = function(child) { this.children.push(child); return this }
  MockGroup.prototype.traverse = function(fn) { this.children.forEach(fn) }

  const MockMaterial = function(opts = {}) {
    this.isMaterial = true
    this.color = opts.color ?? 0x0a0a1a
    this.emissive = opts.emissive ?? 0x000000
    this.emissiveIntensity = opts.emissiveIntensity ?? 0
    this.transparent = opts.transparent ?? false
    this.opacity = opts.opacity ?? 1
    this.roughness = opts.roughness ?? 0.5
    this.metalness = opts.metalness ?? 0.5
  }

  const MockMesh = function(geo, mat) {
    this.geometry = geo
    this.material = mat
    this.position = { x: 0, y: 0, z: 0, set: vi.fn(), setScalar: vi.fn(), copy: vi.fn() }
    this.rotation = { x: 0, y: 0, z: 0, set: vi.fn() }
    this.scale = { x: 1, y: 1, z: 1, set: vi.fn(), setScalar: vi.fn() }
    this.visible = true
    this.userData = {}
    this.traverse = function(fn) { fn(this) }
  }

  const MockPointLight = function(color, intensity, distance) {
    this.color = color ?? 0xffffff
    this.intensity = intensity ?? 1
    this.distance = distance ?? 0
    this.position = { x: 0, y: 0, z: 0, set: vi.fn() }
  }

  return {
    Group: MockGroup,
    BoxGeometry: class BoxGeometry { isBufferGeometry = true },
    CylinderGeometry: class CylinderGeometry { isBufferGeometry = true },
    SphereGeometry: class SphereGeometry { isBufferGeometry = true },
    MeshStandardMaterial: MockMaterial,
    Mesh: MockMesh,
    MeshBasicMaterial: MockMaterial,
    Color: vi.fn((c) => c),
    Vector3: vi.fn(function(x, y, z) {
      this.x = x ?? 0; this.y = y ?? 0; this.z = z ?? 0
      this.set = vi.fn(); this.copy = vi.fn(); this.lerp = vi.fn()
    }),
    PointLight: MockPointLight,
  }
})

const { createShip } = await import('../src/Ship.js')

describe('Ship.js', () => {
  it('createShip returns an object with children array', () => {
    const ship = createShip()
    expect(ship).toBeDefined()
    expect(Array.isArray(ship.children)).toBe(true)
  })

  it('ship has children (hull + engines)', () => {
    const ship = createShip()
    expect(ship.children.length).toBeGreaterThan(0)
  })

  it('ship has 3 engine lights in userData', () => {
    const ship = createShip()
    expect(ship.userData.engineLights).toBeDefined()
    expect(ship.userData.engineLights.length).toBe(3)
  })

  it('no errors thrown on creation', () => {
    expect(() => createShip()).not.toThrow()
  })
})