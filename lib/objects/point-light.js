// PointLight.js
import { Vector3 } from "../third-party/cuon-matrix-cse160.js";
import { Cube } from "./cube.js";
import { debugLog, ObjectClass } from "../utils.js";

const debugkey = "objects_point_light";

debugLog(debugkey, "Loading objects_point_light...");

/**
 * Represents a point light in a 3D scene.
 */
export class PointLight {
  constructor(gl, pos = [0, 0, 0], color = [1, 1, 1], status = 1) {
    this.type = ObjectClass.POINT_LIGHT;
    this.pos = pos;
    this.color = color;
    this.status = status;
    this.cube = new Cube(-6, 1, gl);
    this.cube.color = [0.0, 0.0, 0.0, 1.0];
    this.cube.matrix.translate(this.pos[0], this.pos[1], this.pos[2]);
    this.cube.matrix.scale(0.01, 0.01, 0.01);
  }

  /**
   * Sets the position of the point light.
   * @param {number} x - The x-coordinate of the position.
   * @param {number} y - The y-coordinate of the position.
   * @param {number} z - The z-coordinate of the position.
   */
  setPosition(x, y, z) {
    this.pos = [x, y, z];
  }

  /**
   * Sets the color of the point light.
   * @param {number} r - The red component of the color.
   * @param {number} g - The green component of the color.
   * @param {number} b - The blue component of the color.
   */
  setColor(r, g, b) {
    this.color = [r, g, b];
  }

  toggle(on) {
    this.status = on ? 1 : 0;
  }

  /**
   * Enables the point light.
   */
  enable() {
    this.status = 1;
  }

  /**
   * Disables the point light.
   */
  disable() {
    this.status = 0;
  }
}
