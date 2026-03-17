# SKILL

Skill matrix inferred from this repository's implementation.

## Core Graphics Engineering

### WebGL2 Pipeline
- Configuring WebGL context and render lifecycle
- Multi-pass rendering (skybox -> lit geometry -> overlays)
- Buffer/attribute/uniform orchestration across reusable objects

### Real-Time Shading
- Phong shading with ambient, diffuse, and specular terms
- Multiple point lights (bounded array-based uniform upload)
- Texture routing with debug/diagnostic texture modes
- Normal-space visualization and shape-specific shader branching

### Camera Systems
- 6DoF/FPS navigation controls
- Arcball camera mode with orbit radius management
- Runtime projection updates (FOV, near/far, aspect)
- Mouse + pointer-lock interaction handling

## Engine and Code Architecture

### Modular Design
- Separation of concerns across renderer, scene graph, camera, input
- Public engine API aggregation through `lib/index.js`
- Extensible object model for primitives, scan meshes, skybox, and lights

### Scene Management
- Managed shape lists and point-light collections
- Runtime parameter controls for lighting and rendering behavior
- Structured integration pattern in `example/*` with manager classes

### Debugging and Instrumentation
- Feature-scoped debug logging hooks
- GUI-based runtime tuning for camera/light parameters
- Frame stats surface in examples

## Procedural and Native Graphics Skills (C++)

### Procedural Mesh Generation
- Programmatic assembly of triangles/quads/boxes/roof geometry
- Randomized parameterized house generation
- Vertex-normal-color pipeline construction for indexed draw flow

### Magnum/Corrade Usage
- `Platform::Sdl2Application` lifecycle management
- `Shaders::PhongGL` setup with light-space transforms
- CMake-based native build integration

## Product/Project Skills Demonstrated

- Building reusable graphics abstractions suitable for coursework and experimentation
- Combining educational demos with incremental engine hardening
- Maintaining attribution discipline for third-party assets and references
- Balancing visual features with maintainable code organization

## Growth Areas Visible in Current Codebase

- Formal collision system implementation
- Automated rendering regression tests
- Expanded lighting/shader model variants
- Performance scaling (instancing, broader profiling, asset streaming)
