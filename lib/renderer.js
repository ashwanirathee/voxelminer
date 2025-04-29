import { Cube } from "./objects/cube.js";
import { Sphere } from "./objects/sphere.js";
import { Vector3, Matrix4 } from "./third-party/cuon-matrix-cse160.js";
import { debugLog } from "./utils.js";
import { createProgram } from "./third-party/cuon-utils.js";
import { getAttrib, getUniform } from "./utils.js";
import { initTextures } from "./texture.js";
import { PhongShader } from "./shader-models/phong-shader.js";

const debugkey = "renderer";

debugLog(debugkey, "Loading renderer...");

/**
 * Represents a WebGL renderer for a graphics library.
 */
class WebGLRenderer {
  /**
   * Renderer class constructor.
   */
  constructor(gl) {
    this.g_startTime = performance.now() / 1000.0;
    this.g_seconds = performance.now() / 1000.0 - this.g_startTime;
    this.smoothedFrameRate = 0;
    this.smoothedFrameTime = 0;
    this.smoothedDrawCalls = 0;
    this.lastStatsUpdate = 0;
    this.frameRateValue = document.getElementById("frameRateValue");
    this.frameTimeValue = document.getElementById("frameTimeValue");
    this.drawCallsValue = document.getElementById("drawCallsValue");
    this.gl = gl;

    this.phong_shader = new PhongShader(gl);
    this.startStatsUpdater();
  }

  startStatsUpdater() {
    setInterval(() => {
      this.frameRateValue.innerHTML = this.smoothedFrameRate.toFixed(2);
      this.frameTimeValue.innerHTML = this.smoothedFrameTime.toFixed(3);
      this.drawCallsValue.innerHTML = this.smoothedDrawCalls.toFixed(2);
      // this.lastStatsUpdate = endTime;
    }, 500);
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

  /**
   * Clears the canvas by setting the background color and clearing the canvas.
   * Also clears the shapes list in the scene.
   */
  clearCanvas() {
    const gl = this.gl; // Use this.gl to access WebGL context
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  /**
   * Renders the scene and updates the display.
   */
  render(scene, camera) {
    const gl = this.gl; // Use this.gl to access WebGL context
    const now = performance.now();
    this.g_seconds =  now / 1000 - this.g_startTime;
    var startTime = now;

    // Clear the canvas
    this.clearCanvas(gl);

    // Pass 1: Render the skybox
    if (scene.skybox) {
      scene.skybox.render(scene, camera);
    }

    // Pass 2: Render the scene
    this.phong_shader.setUniforms(scene, camera);
    const shapesList = scene.shapesList;
    const numShapes = shapesList.length;
    for (let i = 0; i < numShapes; i++) {
      this.phong_shader.render(shapesList[i], scene.normalControllerState);
    }

    // Optionally, measure and display performance.
    let endTime = performance.now();
    var duration = endTime - startTime;

    this.updateFrameStats(duration, scene.shapesList.length);
  }
}

export { WebGLRenderer };
