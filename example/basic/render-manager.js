import * as VoxelMiner from "../../lib/index.js";
import { gl, obj } from "./game.js";

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

    this.g_seconds = performance.now() / 1000.0 - this.g_startTime;
    this.smoothedFrameRate = 0;
    this.smoothedFrameTime = 0;
    this.smoothedDrawCalls = 0;
    this.lastStatsUpdate = 0;
    this.startStatsUpdater();
  }

  startStatsUpdater() {
    setInterval(() => {
      const endTime = performance.now();
      obj.frame_rate = this.smoothedFrameRate.toFixed(2);
      obj.frame_time = this.smoothedFrameTime.toFixed(3);
      obj.draw_calls = this.smoothedDrawCalls.toFixed(2);
      this.lastStatsUpdate = endTime;
    }, 1000);
  }
  
  updateFrameStats(duration, drawCalls) {
    // Use a smoothing factor (between 0 and 1). Lower = slower updates.
    const alpha = 0.1;

    // Safety fallback
    const safeDuration = isFinite(duration) && duration > 0 ? duration : 16.67;
    const currentFrameRate = 1000 / safeDuration;
    const currentFrameTime = safeDuration;

    // Exponential Moving Average
    this.smoothedFrameRate = (1 - alpha) * this.smoothedFrameRate + alpha * currentFrameRate;
    this.smoothedFrameTime = (1 - alpha) * this.smoothedFrameTime + alpha * currentFrameTime;
    this.smoothedDrawCalls = (1 - alpha) * this.smoothedDrawCalls + alpha * drawCalls;
  }

  updateFrameStatsSimple(duration, drawCalls) {
    const MIN_DURATION = 1; // ms, prevent 0 or unrealistic values
    const safeDuration = isFinite(duration) && duration >= MIN_DURATION ? duration : 16.67;
    const frameRate = 1000.0 / safeDuration;
  
    obj.frame_rate = frameRate.toFixed(2);
    obj.frame_time = safeDuration.toFixed(3);
    obj.draw_calls = drawCalls.toFixed(2);
  }
  
  /**
   * Renders the scene and updates the point lights.
   */
  render() {
    const now = performance.now();
    this.g_seconds = now / 1000 - this.g_startTime;
  
    const scene = this.sceneManager.scene;
    const pointLights = scene.pointLights;
  
    const radius = 10;
    const height = 5;
    const phaseOffsets = this.phaseOffsets;
  
    if (scene.animate_light) {
      for (let i = 0; i < 4; i++) {
        const angle = this.g_seconds + phaseOffsets[i];
        pointLights[i].pos[0] = radius * Math.sin(angle);
        pointLights[i].pos[2] = radius * Math.cos(angle);
        pointLights[i].pos[1] = height;
      }
    }
  
    const startTime = performance.now(); // more accurate timing
    this.renderer.render(scene, this.cameraManager.camera);
    const endTime = performance.now();
  
    const duration = endTime - startTime;
    this.updateFrameStats(duration, scene.shapesList.length);
  
    requestAnimationFrame(() => this.render());
  }
  
}
