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

    this.skybox = null;
    this.crosshair = null;

    this.ambientLightFactor = 0.5;
    this.diffuseLightFactor = 0.7;
    this.specularLightFactor = 0.6;
    this.specularExponent = 16;

    this.fallOffStart = 1.0;
    this.fallOffEnd = 0.0;
    this.fallOffStepExponent = 1.0;
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
