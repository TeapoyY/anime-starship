import { describe, it, expect, vi } from 'vitest'

vi.mock('three', () => {
  const MockGroup = function() {
    this.children = []
    this.userData = {}
    this.position = { x: 0, y: 0, z: 0, set: vi.fn(), setScalar: vi.fn(), copy: vi.fn(), lerp: vi.fn() }
  }
  MockGroup.prototype.add = function(c) { this.children.push(c); return this }

  const MockPointsMaterial = function() {
    this.isMaterial = true
    this.size = 1
    this.color = 0xffffff
    this.transparent = true
    this.opacity = 1
  }

  const MockVector3 = function(x, y, z) {
    this.x = x ?? 0; this.y = y ?? 0; this.z = z ?? 0
    this.set = vi.fn(); this.copy = vi.fn(); this.lerp = vi.fn()
  }

  const MockColor = function(c) {
    const col = (typeof c === 'number') ? { r: ((c >> 16) & 255) / 255, g: ((c >> 8) & 255) / 255, b: (c & 255) / 255 }
                  : { r: 1, g: 1, b: 1 }
    this.r = col.r; this.g = col.g; this.b = col.b
  }

  const MockBufferAttribute = function(arr, size) {
    this.array = arr
    this.size = size
    this.setXYZ = vi.fn()
    this.needsUpdate = false
  }

  const MockBufferGeometry = function() {
    this.attributes = {}
    this.setAttribute = vi.fn((name, attr) => { this.attributes[name] = attr })
    this.getAttribute = vi.fn((name) => this.attributes[name])
  }

  const MockPoints = function(geo, mat) {
    this.geometry = geo
    this.material = mat
    this.position = { x: 0, y: 0, z: 0 }
    this.userData = {}
  }

  return {
    Group: MockGroup,
    PointsMaterial: MockPointsMaterial,
    Vector3: MockVector3,
    Color: MockColor,
    BufferGeometry: MockBufferGeometry,
    BufferAttribute: MockBufferAttribute,
    Points: MockPoints,
  }
})

const { createStarfield, STAR_COUNTS } = await import('../src/Starfield.js')

describe('Starfield.js', () => {
  let starfield

  beforeEach(() => {
    starfield = createStarfield()
  })

  it('createStarfield returns an object with stars array', () => {
    expect(starfield).toBeDefined()
    expect(Array.isArray(starfield.stars)).toBe(true)
  })

  it('returns correct default total star count', () => {
    const total = STAR_COUNTS.reduce((a, b) => a + b, 0)
    expect(total).toBe(200)
  })

  it('stars array has 200 stars by default', () => {
    expect(starfield.stars.length).toBe(200)
  })

  it('update function exists', () => {
    expect(typeof starfield.update).toBe('function')
  })

  it('each star has speed, layer, size properties', () => {
    const star = starfield.stars[0]
    expect(typeof star.speed).toBe('number')
    expect(typeof star.layer).toBe('number')
    expect(typeof star.size).toBe('number')
  })

  it('no errors on update', () => {
    expect(() => starfield.update({ x: 0, y: 0, z: 0 }, 0.016)).not.toThrow()
  })
})