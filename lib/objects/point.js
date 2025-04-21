import { debugLog } from "../utils.js";

const debugkey = "objects_point";

debugLog(debugkey, "Loading point.js");

/**
 * Represents a point in a graphics library.
 */
class Point {
  /**
   * Represents a point in a graphics library.
   * @constructor
   * @param {number[]} loc - The location of the point as an array of coordinates.
   * @param {string} color - The color of the point.
   * @param {number} size - The size of the point.
   */
  constructor(loc, color, size) {
    this.type = "point";
    this.vertices = new Float32Array(loc);
    this.color = color;
    this.size = size;
  }

  /**
   * Renders the point on the WebGL canvas.
   *
   * @param {number} a_Position - The attribute location of the position.
   * @param {number} a_Size - The attribute location of the size.
   * @param {WebGLUniformLocation} u_FragColor - The uniform location of the fragment color.
   */
  render(a_Position, a_Size, u_FragColor) {
    gl.disableVertexAttribArray(a_Position);
    gl.vertexAttrib3f(a_Position, this.vertices[0], this.vertices[1], 0.0);
    // gl.uniform1f(a_Size, this.size);
    // gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    // gl.drawArrays(gl.POINTS, 0, 2);
  }
}
