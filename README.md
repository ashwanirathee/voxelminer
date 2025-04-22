# 💎 VoxelMiner
VoxelMiner is an interactive 3D graphics engine developed using WebGL, originally created as a project for CSE 160 at UCSC, and later enhanced with additional features. It enables users to explore and interact with a voxel-based 3D environment, complete with real-time lighting, textures, camera movement, and advanced rendering techniques. SceneGraph, Renderer, Camera are the main components which are modular with their responsibilities. The engine is designed to be extensible, allowing for future enhancements and features.

### 🚀 Key Features
#### 🎮 Camera & Navigation
- Movement Controls:
    - W – Move Forward
    - S – Move Backward
    - A – Move Left
    - D – Move Right
    - Q – Pan Left
    - E – Pan Right
    - R – Move Up
    - F – Move Down
    
- Customizable View:
    - Adjustable Field of View (FOV)
    - Configurable Near & Far Clipping Planes
    - Adjustable camera speed(T,G), pan speed(Y,H)
    - Currently set up to handle only information in lowercase(easy to change).

#### 💡 Lighting System
- Phong Lighting Model
    - Includes Ambient, Diffuse, and Specular components
    - Adjustable shininess factor (default: 5.0)

- Spotlight with Smooth Falloff
    - Soft edges using angular cutoff and smoothing via smoothstep()

- Dual Light Sources
- Toggle individual lights on/off
- Modify main light position (X, Y, Z) and color (RGB)

### 🌟 Rendering & Visual Effects
- Normal Mapping
    - Toggle enhanced surface detail via normal maps
- Normal Visualization
    - Debug mode to visualize surface normals directly

- Skybox Rendering
    - Immersive skybox to simulate environment background
- Crosshair
    - Centered crosshair for better navigation

### ⛏️ Interaction & World Mechanics
- Block Mechanics:
    - Add and break blocks in the world

- Collision Detection:
    - Prevents camera from passing through solid objects

### 🧱 Primitives & Texturing
- Available 3D Primitives:
    - Cube, Sphere, Cylinder, Triangle, Point, Circle

- Texture Mapping:
    - Multiple textures with mipmapping for performance and clarity

### ⚙️ Performance & Optimization
- Instanced Rendering:
    - Efficient rendering of large numbers of cubes using instancing

- Real-Time Stats:
    - Frame rate (FPS) monitor
    - Frame render time display

- Added support for fine-grained debugging
    - Toggle debug mode for detailed information in specific files
    - Debugging information is displayed in the console and some data can be global debug log

### 📚 Original Assignment
The foundation of this project was developed as part of a UCSC course assignment:
[🔗 CSE160 Assignment 4 – WebGL Engine](https://github.com/ashwanirathee/cs/tree/main/ucsc/cse160/asg4)

