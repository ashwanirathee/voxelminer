# CODEX

Repository operating guide for contributors and coding agents.

## 1) Project Intent

VoxelMiner is a modular 3D rendering engine centered on WebGL2 and reusable scene abstractions.
The repository also includes focused examples (JavaScript/WebGL demos and a C++ Magnum procedural generation sample) that demonstrate engine capabilities and experimentation.

## 2) Repository Map

- `lib/` — engine core (renderer, camera, scene graph, utilities, shaders, objects, assets)
- `example/basic/` — baseline engine integration demo with camera + lighting GUI
- `example/scan/` — high-polygon statue scan rendering demo
- `example/car/` — vehicle-focused example scene
- `example/cloth-sim/` — cloth simulation flavored prototype/example
- `example/cpp-gen/` — C++ procedural house generation using Magnum/Corrade
- `assets/` — project-level static assets
- `README.md` — public-facing feature overview
- `bib.md` — attribution and source references

## 3) Architecture Snapshot (JavaScript Engine)

- Public entrypoint: `lib/index.js`
- Scene state: `lib/scene.js` (`SceneGraph` holds shapes, lights, lighting factors, overlays)
- Camera controls: `lib/camera.js` (FPS + arcball modes, movement/panning, projection/view updates)
- Rendering: `lib/renderer.js` (`WebGLRenderer` performs multi-pass render: skybox, scene geometry, crosshair)
- Shading model: `lib/shader-models/phong-shader.js` (Phong lighting, 4-point-light cap, texture routing, debug visual modes)
- Geometry primitives: `lib/objects/*`

## 4) Development Conventions

- Keep modules single-purpose; follow the existing `manager` split in examples (`scene-manager`, `camera-manager`, `render-manager`, `input-manager`).
- Prefer extending `lib/` in reusable form before adding one-off logic in `example/*`.
- Keep public exports wired through `lib/index.js` when introducing reusable engine APIs.
- Preserve shader uniform naming patterns and the existing point-light array contract.
- Avoid hard-coded per-example hacks inside core renderer/camera unless the change is globally useful.

## 5) Typical Workflows

### JavaScript/WebGL examples

1. Start from `example/basic/` when validating engine-level behavior.
2. Wire new scene behavior in the example's managers first.
3. Promote stable logic into `lib/` only after it proves reusable.

### C++ procedural generation example

Build from `example/cpp-gen/`:

```bash
./build.sh
./build/src/MyApplication
```

Requires Magnum/Corrade and an appropriate `CMAKE_PREFIX_PATH` (defaults to `/opt/homebrew` in `build.sh`).

## 6) Quality Checklist for Changes

- Engine compiles/runs without breaking existing examples.
- `example/basic` camera controls and pointer lock behavior still work.
- Lighting uniforms remain consistent with scene configuration fields.
- No regressions in skybox/crosshair render ordering.
- New documentation is aligned with both `README.md` and `bib.md` attributions.

## 7) Known Constraints

- Collision detection hooks exist but are currently stubbed in camera logic.
- Some README-listed features are aspirational/partial in current implementation.
- Point lights are capped by shader design (`MAX_POINT_LIGHTS = 4`).

## 8) Suggested Next Improvements

- Add lightweight docs for each example's objective and controls.
- Add regression checks for camera movement + shader uniforms.
- Normalize naming around camera sensitivity variables in inputs/examples.
