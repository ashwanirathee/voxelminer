import { debugLog } from "./utils.js";
import { Sphere } from "./objects/sphere.js";
import { Cube } from "./objects/cube.js";
import { initTextures } from "./texture.js";

const debugkey = "scene";

debugLog(debugkey, "Loading scene...");

/**
 * Represents a scene graph for managing shapes in a graphics scene.
 */
export class SceneGraph {
  /**
   * Represents a Scene object.
   * @constructor
   */
  constructor(gl) {
    this.shapesList = [];
    this.pointLights = [];

    this.gl = gl;

    this.animate_light = true;
    this.normalControllerState = false;
  }

  init() {}

  /**
   * Adds objects to the scene.
   */
  push(object) {
    this.shapesList.push(object);
  }

  addLight(light) {
    this.pointLights.push(light);
  }
}
