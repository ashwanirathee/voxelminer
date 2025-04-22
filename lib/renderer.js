import { Cube } from "./objects/cube.js";
import { Sphere } from "./objects/sphere.js";
import { gl, shaderVars, scene, camera, canvas } from "./global.js";
import { Vector3, Matrix4 } from "./third-party/cuon-matrix-cse160.js";
import { debugLog } from "./utils.js";

const debugkey = "renderer";

debugLog(debugkey, "Loading renderer.js");

/**
 * Represents a WebGL renderer for a graphics library.
 */
class WebGLRenderer {
  /**
   * Renderer class constructor.
   */
  constructor() {
    this.g_startTime = performance.now() / 1000.0;
    this.g_seconds = performance.now() / 1000.0 - this.g_startTime;
    
  }

  /**
   * Renders the scene and updates the display.
   */
  render() {
    this.g_seconds = performance.now() / 1000 - this.g_startTime;
    var startTime = performance.now();

    gl.uniform3fv(shaderVars.attribs.u_LightColor, new Float32Array([scene.lightR, scene.lightG, scene.lightB]));
    
    gl.uniform1i(shaderVars.attribs.u_lightStatus, scene.lightStatus);
    gl.uniform3fv(shaderVars.attribs.u_lightPos, scene.g_lightpos);
    scene.light.matrix.setTranslate(scene.g_lightpos[0], scene.g_lightpos[1], scene.g_lightpos[2]);
    
    gl.uniform1i(shaderVars.attribs.u_light2Status, scene.light2Status);
    gl.uniform3fv(shaderVars.attribs.u_light2Pos, scene.g_light2pos);
    scene.light2.matrix.setTranslate(scene.g_light2pos[0], scene.g_light2pos[1], scene.g_light2pos[2]);

    gl.uniform3f(shaderVars.attribs.a_CameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let t = Math.sin(0.1 * this.g_seconds * Math.PI);
    let currentColor = lerpColor(scene.dayColor, scene.nightColor, (t + 1) / 2);
    gl.clearColor(...currentColor, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < scene.shapesList.length; i++) {
      scene.shapesList[i].render();
    }

    // Now simply render each pre-created cube:
    for (let i = 0; i < scene.cubeInstances.length; i++) {
      scene.cubeInstances[i].render();
    }

    // Optionally, measure and display performance.
    var duration = performance.now() - startTime;
    document.getElementById("perf").innerHTML = "Time Taken in rendering: " + duration.toFixed(3) + " ms, fps: " + (1000 / duration).toFixed(2);
    

    if (scene.animate_light) {
      scene.g_lightpos[0] = -14 + Math.sin(this.g_seconds);
      scene.g_lightpos[2] = 10 * Math.cos(this.g_seconds);
      scene.g_lightpos[1] = 10;
    }

    requestAnimationFrame(this.render.bind(this));
  }
}

// Lerp function to linearly interpolate between two colors
/**
 * Linearly interpolates between two colors.
 *
 * @param {number[]} color1 - The starting color.
 * @param {number[]} color2 - The ending color.
 * @param {number} t - The interpolation factor (between 0 and 1).
 * @returns {number[]} The interpolated color.
 */
function lerpColor(color1, color2, t) {
  return color1.map((v, i) => v + t * (color2[i] - v));
}

export { WebGLRenderer };
