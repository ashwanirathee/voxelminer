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
    this.gl = gl;
    this.phong_shader = new PhongShader(gl);
  }

  /**
   * Renders the scene and updates the display.
   */
  render(scene, camera) {
    const gl = this.gl; // Use this.gl to access WebGL context

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Pass 1: Render the skybox
    if (scene.skybox) {
      scene.skybox.render(scene, camera);
    }

    // Pass 2: Render the scene
    this.phong_shader.setUniforms(scene, camera);
    for (let i = 0; i < scene.shapesList.length; i++) {
      this.phong_shader.render(scene.shapesList[i], scene.normalControllerState);
    }

    // Pass 3: Render the crosshair
    if (scene.crosshair) {
      scene.crosshair.render(scene, camera);
    }
  }
}

export { WebGLRenderer };
