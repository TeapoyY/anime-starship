# anime-starship v2 — 3D Third-Person Ship Viewer

## Concept & Vision

A fully immersive 3D space flight experience from a **third-person over-the-shoulder perspective**. The camera sits just behind and above the spaceship, looking forward — like looking over a pilot's shoulder out the cockpit window. Stars rush toward the viewer creating a visceral sense of speed. The ship feels weighty and alive: engines pulse, exhaust trails linger, and entering warp tears reality apart with stretched light streaks.

This is not a game — it's a **living wallpaper**, a meditative flight simulator you set and watch.

---

## Design Language

### Aesthetic
Dark anime space opera — deep blacks, electric cyan engine glow, purple nebula haze. Reference: Ghost in the Shell cockpit views, Evangelion entry plug sequences.

### Color Palette
| Role        | Hex       | Usage                          |
|-------------|-----------|--------------------------------|
| Background  | `#030014` | Deep space void                |
| Primary     | `#00d4ff` | Engine glow, UI accents        |
| Secondary   | `#7c3aed` | Nebula, exhaust trail          |
| Accent      | `#f59e0b` | Warp state, heat               |
| Ship body   | `#0a0a1a` | Hull base                      |

### Motion Philosophy
- **Engine idle**: Subtle pulse on engine cores, 2-3s loop
- **Speed buildup**: Stars accelerate gradually, engine glow intensifies
- **Warp transition**: Stars stretch into radial streaks from screen center outward, engine exhaust elongates
- **Burst**: Screen flash + ship scale pop (camera shake feel)

---

## 3D Architecture

### Scene Setup
- **Camera**: PerspectiveCamera (FOV 75), positioned at (0, 2, 8) relative to ship — behind and above, looking forward. Soft follow (lerp factor 0.05).
- **Lighting**: Dim ambient (0x111122) + point light at engine positions (cyan, intensity 2) + subtle directional light from front
- **Background**: Black (#030014) via scene.background
- **Fog**: Exponential fog matching background color

### Coordinate System
- Ship moves along **-Z axis** (forward)
- Camera sits at ship.position + (0, 2, 8)
- Stars spawn ahead (z: -500 to -1000), move toward camera (+Z)

### 3D Assets (Primitives Only)

**Spaceship**:
- Hull: BoxGeometry composed
- Wings: BoxGeometry angled back
- Engine pods: CylinderGeometry × 3
- Cockpit: SphereGeometry half, transparent
- Engine glow: PointLight

**Starfield**: 3 layers, ~200 stars, PointsMaterial

**Warp Streaks**: Stars morph to elongated scaleZ when warp active

---

## States

- `IDLE`: speed ≤ 1.0, stars normal
- `CRUISING`: speed 1.0–1.5, stars slightly elongated
- `WARP`: speed > 1.5 or burst, stars stretched, FOV expands 75→90

---

## Controls

- **Click anywhere** → burst (2s warp)
- **Automatic speed**: 0.5 → 1.5 → 0.5, 20s cycle
- **Auto warp**: every 15s for 5s (demo mode)

---

## Technical Stack

- Vite + Vanilla JS + Three.js (npm)
- No framework, no external 3D models
- GitHub Pages deployment (static)