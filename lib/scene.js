import { debugLog } from "./utils.js";
import { Sphere } from "./objects/sphere.js";
import { Cube } from "./objects/cube.js";
import { gl, canvas, renderer, shaderVars } from "./global.js";
import { initTextures } from "./texture.js";

const debugkey = "scene";

debugLog(debugkey, "Loading scene.js");

/**
 * Represents a scene graph for managing shapes in a graphics scene.
 */
export class SceneGraph {
  /**
   * Represents a Scene object.
   * @constructor
   */
  constructor() {
    this.shapesList = [];

    this.cubeInstances = [];
    this.g_map = null;
    this.rows = 32;
    this.cols = 32;

    this.g_lightpos = [2, 1, 2];
    this.g_light2pos = [-12, 1.5, 13];
    this.lightStatus = true;
    this.animate_light = true;
    this.light2Status = true;

    this.lightR = 0.0;
    this.lightG = 0.0;
    this.lightB = 0.0;

    this.dayColor = [0.53, 0.81, 0.92]; // Day Sky color
    this.nightColor = [0.2, 0.2, 0.2]; // Night Sky color

    this.light = null;
    this.light2 = null;
    
    this.normalControllerState = false;

  }

  init(){
    initTextures(gl, [
      { url: "./lib/assets/uvCoords.png", unit: 0, sampler: shaderVars.attribs.u_Sampler0 },
      { url: "./lib/assets/dice.png", unit: 1, sampler: shaderVars.attribs.u_Sampler1 },
      { url: "./lib/assets/texture.png", unit: 2, sampler: shaderVars.attribs.u_Sampler2 },
    ]);
    this.addObjects();
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
   * Builds cube instances based on the grid and adds them to the scene.
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

            let cube = new Cube(2, type, this.gl, this.u_whichTexture, this.u_FragColor, this.u_ModelMatrix, this.u_NormalMatrix, this.a_Position, this.a_UV, this.a_Normal);
            cube.color = [1.0, 1.0, 1.0, 1.0];
            // Position cube relative to maze center:
            cube.matrix.translate(x - this.rows / 2, h - 1, y - this.cols / 2);
            if (this.normalControllerState) cube.textureAtlasNum = -3;
            this.cubeInstances.push(cube);
          }
        }
        if (this.g_map[x][y] == -1) {
          // For special cells (e.g., pillars)
          let cube = new Cube(2, 4, this.gl, this.u_whichTexture, this.u_FragColor, this.u_ModelMatrix, this.u_NormalMatrix, this.a_Position, this.a_UV, this.a_Normal);
          cube.matrix.setTranslate(x - this.rows / 2, 1, y - this.cols / 2);
          cube.color = [1.0, 0.0, 0.0, 1.0];
          cube.matrix.scale(1, 10, 1);
          this.cubeInstances.push(cube);
        }
      }
    }
  }


  /**
   * Adds objects to the scene graph.
   */
  addObjects() {
    debugLog(debugkey, "Adding objects to scene graph");

    var ball = new Sphere(1, 10, 10, -6, 2); // radius 50, 20x20 resolution
    ball.matrix.translate(-15, -0.2, 10);
    ball.matrix.scale(0.5, 0.5, 0.5);

    var ball2 = new Sphere(1, 10, 10, -6, 2); // radius 50, 20x20 resolution
    ball2.matrix.translate(-11, -0.2, 13);
    ball2.matrix.scale(0.5, 0.5, 0.5);

    let sky = new Cube(-6, 2);
    sky.color = [0.235, 0.639, 1, 1.0];
    sky.matrix.scale(-50, -100, -50);

    this.light = new Cube(-5, 1);
    this.light.color = [0.5, 0.5, 0.5, 1.0];
    this.light.matrix.translate(this.g_lightpos[0], this.g_lightpos[1], this.g_lightpos[2]);
    this.light.matrix.scale(1, 1, 1);

    this.light2 = new Cube(-5, 1);
    this.light2.color = [0.5, 0.5, 0.5, 1.0];
    this.light2.matrix.translate(this.g_light2pos[0], this.g_light2pos[1], this.g_light2pos[2]);
    this.light2.matrix.scale(0.3, 0.3, 0.3);

    let floor = new Cube(2, 3);
    floor.color = [0.49, 0.788, 0.29, 1.0];
    floor.matrix.translate(0, -0.5, 0);
    floor.matrix.scale(-32, 0.01, -32);

    this.shapesList.push(ball);
    this.shapesList.push(ball2);
    this.shapesList.push(this.light);
    this.shapesList.push(this.light2);
    this.shapesList.push(sky);
    this.shapesList.push(floor);

    if (this.g_map == null) {
      this.g_map = this.generateMaze(this.rows, this.cols);
      this.buildCubeInstances();
    }
  }
}
