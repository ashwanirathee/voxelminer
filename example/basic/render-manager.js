import * as VoxelMiner from "../../lib/index.js";
import { gl } from "./game.js";

const debugkey = "render_manager";

VoxelMiner.debugLog(debugkey, "Loading render_manager...");

/**
 * Class representing a Render Manager.
 */
export class RenderManager {
  constructor(sceneManager, cameraManager) {
    this.renderer = new VoxelMiner.WebGLRenderer(gl);
    this.sceneManager = sceneManager;
    this.cameraManager = cameraManager;
    this.g_startTime = performance.now() / 1000.0;
    this.g_seconds = performance.now() / 1000.0 - this.g_startTime;
    this.phaseOffsets = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
  }

  /**
   * Renders the scene and updates the point lights.
   */
  render() {
    this.g_seconds = performance.now() / 1000 - this.g_startTime;

    const scene = this.sceneManager.scene;
    const pointLights = scene.pointLights;
  
    const radius = 10;
    const height = 5;
    const phaseOffsets = this.phaseOffsets;
    const sin = Math.sin(this.g_seconds);
    const cos = Math.cos(this.g_seconds);
  
    this.renderer.render(scene, this.cameraManager.camera);
  
    if (scene.animate_light) {
      for (let i = 0; i < 4; i++) {
        const angle = this.g_seconds + phaseOffsets[i];
        
        pointLights[i].pos[0] = radius * Math.sin(angle);
        pointLights[i].pos[2] = radius * Math.cos(angle);
        pointLights[i].pos[1] = height;
      }
    }
  
    requestAnimationFrame(() => this.render());
  }
}
