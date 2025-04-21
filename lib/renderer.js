import { Cube } from "./cube.js";
import { Sphere } from "./sphere.js";
import { camera } from "./global.js";
import { Vector3, Matrix4 } from "./cuon-matrix-cse160.js";

/**
 * Represents a WebGL renderer for a graphics library.
 */
class WebGLRenderer {
  /**
   * Renderer class constructor.
   */
  constructor() {
    this.dayColor = [0.53, 0.81, 0.92]; // Day Sky color
    this.nightColor = [0.2, 0.2, 0.2]; // Night Sky color
    this.rows = 32;
    this.cols = 32;
    this.g_map = null;
    this.cubeInstances = [];

    this.u_lightStatus;
    this.lightStatus = true;
    this.animate_light = true;
    this.g_lightpos = [2, 1, 2];

    this.u_light2Status;
    this.light2Status = true;

    this.lightR = 0.0;
    this.lightG = 0.0;
    this.lightB = 0.0;

    this.g_light2pos = [-12, 1.5, 13];
    this.normalControllerState = false;
  }

  /**
   * Draws the map by rendering each pre-created cube.
   *
   * @param {WebGLUniformLocation} u_whichTexture - The WebGLUniformLocation for the texture uniform.
   * @param {WebGLUniformLocation} u_FragColor - The WebGLUniformLocation for the fragment color uniform.
   * @param {WebGLUniformLocation} u_ModelMatrix - The WebGLUniformLocation for the model matrix uniform.
   * @param {WebGLUniformLocation} u_NormalMatrix - The WebGLUniformLocation for the normal matrix uniform.
   * @param {WebGLAttributeLocation} a_Position - The WebGLAttributeLocation for the position attribute.
   * @param {WebGLAttributeLocation} a_UV - The WebGLAttributeLocation for the UV attribute.
   * @param {WebGLAttributeLocation} a_Normal - The WebGLAttributeLocation for the normal attribute.
   * @param {WebGLRenderingContext} gl - The WebGLRenderingContext.
   */
  drawMap(u_whichTexture, u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal, gl) {
    // Generate the maze if needed
    if (this.g_map == null) {
      this.g_map = this.generateMaze(this.rows, this.cols);
      // Also, build the cubes once:
      this.buildCubeInstances(this.normalControllerState);
    }
    // Now simply render each pre-created cube:
    for (let i = 0; i < this.cubeInstances.length; i++) {
      this.cubeInstances[i].render(gl, u_whichTexture, u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);
    }
  }

  /**
   * Builds cube instances based on the grid and adds them to the cubeInstances array.
   */
  buildCubeInstances() {
    // Clear any existing instances.
    this.cubeInstances = [];

    // Loop over the grid and create cubes only once.
    for (let x = 0; x <= this.rows; x++) {
      for (let y = 0; y <= this.cols; y++) {
        if (this.g_map[x][y] > 0) {
          for (let h = 1; h <= this.g_map[x][y]; h++) {
            let type;
            if (x === 0 || y === 0) {
              type = 3;
            } else if (h <= 1) {
              type = 3;
            } else {
              type = 2;
            }
            let cube = new Cube(2, type);
            cube.color = [1.0, 1.0, 1.0, 1.0];
            // Position cube relative to maze center:
            cube.matrix.translate(x - this.rows / 2, h - 1, y - this.cols / 2);
            if (this.normalControllerState) cube.textureAtlasNum = -3;
            this.cubeInstances.push(cube);
          }
        }
        if (this.g_map[x][y] == -1) {
          // For special cells (e.g., pillars)
          let cube = new Cube(2, 4);
          cube.matrix.setTranslate(x - this.rows / 2, 1, y - this.cols / 2);
          cube.color = [1.0, 0.0, 0.0, 1.0];
          cube.matrix.scale(1, 10, 1);
          this.cubeInstances.push(cube);
        }
      }
    }
  }

  /**
   * Generates a maze of the specified width and height.
   * @param {number} width - The width of the maze.
   * @param {number} height - The height of the maze.
   * @returns {number[][]} - The generated maze.
   */
  generateMaze(width, height) {
    // ... your maze generation code ...
    const maze = [
      [3, 4, 4, 4, 2, 3, 2, 3, 2, 3, 3, 2, 2, 4, 3, 4, 3, 4, 3, 3, 2, 4, 4, 3, 2, 2, 3, 2, 4, 4, 3, 2, 4],
      [2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4],
      [3, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3],
      [4, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [3, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 4],
      [3, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 2],
      [3, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 2],
      [2, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 3],
      [2, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [4, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 4],
      [2, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 4],
      [2, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 3],
      [2, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 4],
      [3, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 3],
      [4, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
      [2, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4],
      [4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
      [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
      [4, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 3],
      [2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 4],
      [2, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 4],
      [3, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 2],
      [2, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4],
      [4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4],
      [2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 3],
      [4, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 2],
      [3, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 2],
      [2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 4],
      [2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 2],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 3],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 4, 4, 2, 2, 2, 2, 4, 2, 2, 3, 2, 3, 3, 4, 2, 4, 2, 3, 3, 4, 4, 2, 3, 3, 3, 2, 4, 2, 2, 4, 2, 3],
    ];

    // Set start and end points or modify values as needed.
    maze[1][1] = 0;
    maze[height - 2][width - 2] = 0;
    for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
        if (maze[x][y] > 0) {
          maze[x][y] += Math.floor(Math.random() * 3) + 1;
        }
      }
    }
    maze[31][2] = -1;
    return maze;
  }

  /**
   * Renders the scene using WebGL.
   * 
   * @param {Scene} scene - The scene to be rendered.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_GlobalRotateMatrix - The uniform location for the global rotation matrix.
   * @param {WebGLUniformLocation} u_FragColor - The uniform location for the fragment color.
   * @param {WebGLUniformLocation} u_lightPos - The uniform location for the light position.
   * @param {WebGLUniformLocation} u_light2Pos - The uniform location for the second light position.
   * @param {WebGLUniformLocation} u_LightColor - The uniform location for the light color.
   * @param {WebGLUniformLocation} a_CameraPos - The attribute location for the camera position.
   * @param {number} g_seconds - The time in seconds.
   * @param {WebGLUniformLocation} u_whichTexture - The uniform location for the texture.
   * @param {WebGLUniformLocation} u_ModelMatrix - The uniform location for the model matrix.
   * @param {WebGLUniformLocation} u_NormalMatrix - The uniform location for the normal matrix.
   * @param {WebGLAttribLocation} a_Position - The attribute location for the position.
   * @param {WebGLAttribLocation} a_UV - The attribute location for the UV coordinates.
   * @param {WebGLAttribLocation} a_Normal - The attribute location for the normal vectors.
   */
  render(scene, gl, u_GlobalRotateMatrix, u_FragColor, u_lightPos, u_light2Pos, u_LightColor, a_CameraPos, g_seconds, u_whichTexture, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal) {
    // console.log("Rendering scene...");
    let g_globalAngleX = 0;
    let g_globalAngleY = 0;

    var startTime = performance.now();

    var globalRotMat = new Matrix4().rotate(g_globalAngleX, 0, 1, 0);
    globalRotMat.rotate(0, 1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // don't delete these!
    gl.uniform1i(this.u_lightStatus, this.lightStatus);
    gl.uniform4fv(u_FragColor, new Float32Array([0.5, 0.5, 0.5, 1.0]));
    gl.uniform3fv(u_lightPos, this.g_lightpos);
    gl.uniform3fv(u_LightColor, new Float32Array([this.lightR, this.lightG, this.lightB]));

    gl.uniform1i(this.u_light2Status, this.light2Status);
    gl.uniform4fv(u_FragColor, new Float32Array([0.5, 0.5, 0.5, 1.0]));
    gl.uniform3fv(u_light2Pos, this.g_light2pos);

    gl.uniform3f(a_CameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let t = Math.sin(0.1 * g_seconds * Math.PI);
    let currentColor = lerpColor(this.dayColor, this.nightColor, (t + 1) / 2);
    gl.clearColor(...currentColor, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let sky = new Cube(-6, 2);
    sky.color = [0.235, 0.639, 1, 1.0];
    sky.matrix.scale(-50, -100, -50);
    if (this.normalControllerState) sky.textureAtlasNum = -3;
    sky.render(gl, u_whichTexture, u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    var ball = new Sphere(1, 10, 10, -6, 2); // radius 50, 20x20 resolution
    ball.matrix.translate(-15, -0.2, 10);
    ball.matrix.scale(0.5, 0.5, 0.5);
    if (this.normalControllerState) ball.textureAtlasNum = -3;
    ball.render(gl, camera, u_whichTexture, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    var light = new Cube(-5, 1);
    light.color = [1, 1, 1, 1.0];
    light.matrix.translate(this.g_lightpos[0], this.g_lightpos[1], this.g_lightpos[2]);
    light.matrix.scale(1, 1, 1);
    if (this.normalControllerState) light.textureAtlasNum = -5;
    light.render(gl, u_whichTexture, u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    var light2 = new Cube(-5, 1);
    light2.color = [1, 1, 1, 1.0];
    light2.matrix.translate(this.g_light2pos[0], this.g_light2pos[1], this.g_light2pos[2]);
    light2.matrix.scale(0.3, 0.3, 0.3);
    if (this.normalControllerState) light2.textureAtlasNum = -5;
    light2.render(gl, u_whichTexture, u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    let floor = new Cube(2, 3);
    floor.color = [0.49, 0.788, 0.29, 1.0];
    floor.matrix.translate(0, -0.5, 0);
    floor.matrix.scale(-32, 0.01, -32);
    floor.render(gl, u_whichTexture, u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    var ball2 = new Sphere(1, 10, 10, -6, 2); // radius 50, 20x20 resolution
    ball2.matrix.translate(-11, -0.2, 13);
    ball2.matrix.scale(0.5, 0.5, 0.5);
    if (this.normalControllerState) ball2.textureAtlasNum = -3;
    ball2.render(gl, camera, u_whichTexture, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    // // Draw the maze cubes from the cached instances.
    this.drawMap(u_whichTexture, u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal, gl);
    // Optionally, measure and display performance.
    var duration = performance.now() - startTime;
    document.getElementById("perf").innerHTML = "Time Taken in rendering: " + duration.toFixed(3) + " ms, fps: " + (1000 / duration).toFixed(2);
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
