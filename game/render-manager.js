import * as VoxelMiner from "./../lib/index.js";
import { canvas, gl } from "./game.js";
import { initShaders } from "./../lib/third-party/cuon-utils.js";

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

    this.renderer.render(this.sceneManager.scene, this.cameraManager.camera);

    if (this.sceneManager.scene.animate_light) {
      for (let i = 0; i < 4; i++) {
        const angle = this.g_seconds + this.phaseOffsets[i];

        this.sceneManager.scene.pointLights[i].pos[0] = 10 * Math.sin(angle);
        this.sceneManager.scene.pointLights[i].pos[2] = 10 * Math.cos(angle);
        this.sceneManager.scene.pointLights[i].pos[1] = 5;
      }
    }

    requestAnimationFrame(this.render.bind(this));
  }
}
