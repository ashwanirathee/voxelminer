import { debugLog } from "../utils.js";

const debugkey = "objects_circle";

debugLog(debugkey, "Loading circle.js");

/**
 * Represents a Circle object.
 */
class Circle {
  /**
   * Represents a circle shape.
   * @constructor
   * @param {Array} vertices - The vertices of the circle.
   * @param {string} color - The color of the circle.
   * @param {number} size - The size of the circle.
   */
  constructor(vertices, color, size) {
    this.type = "circle";
    this.vertices = vertices;
    this.color = color;
    this.size = size;
    this.segment_count = 10;
  }

  /**
   * Renders the circle on the WebGL canvas.
   * 
   * @param {WebGLUniformLocation} a_Position - The position attribute location.
   * @param {WebGLUniformLocation} a_Size - The size attribute location.
   * @param {WebGLUniformLocation} u_FragColor - The fragment color uniform location.
   */
  render(a_Position, a_Size, u_FragColor) {
    gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    var d = this.size / 20.0;
    let angleStep = 360 / this.segment_count;
    for (var angle = 0; angle < 360; angle = angle + angleStep) {
      let angle1 = angle;
      let angle2 = angle + angleStep;
      let vec1 = [Math.cos((angle1 * Math.PI) / 180) * d, Math.sin((angle1 * Math.PI) / 180) * d];
      let vec2 = [Math.cos((angle2 * Math.PI) / 180) * d, Math.sin((angle2 * Math.PI) / 180) * d];
      let pt1 = [this.vertices[0] + vec1[0], this.vertices[1] + vec1[1]];
      let pt2 = [this.vertices[0] + vec2[0], this.vertices[1] + vec2[1]];
      drawTriangle([this.vertices[0], this.vertices[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
    }
  }
}
