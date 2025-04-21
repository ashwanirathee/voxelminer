import { debugLog } from "../utils.js";

const debugkey = "objects_triangle";

debugLog(debugkey, "Loading triangle.js");

/**
 * Represents a triangle shape.
 */
class Triangle {
  /**
   * Represents a triangle shape.
   * @constructor
   * @param {Array} vertices - The vertices of the triangle.
   * @param {string} color - The color of the triangle.
   * @param {number} size - The size of the triangle.
   */
  constructor(vertices, color, size) {
    this.type = "triangle";
    this.vertices = vertices;
    this.color = color;
    this.size = size;
  }

  /**
   * Renders the triangle on the canvas.
   * @param {WebGLUniformLocation} a_Position - The position attribute location.
   * @param {WebGLUniformLocation} a_Size - The size attribute location.
   * @param {WebGLUniformLocation} u_FragColor - The fragment color uniform location.
   */
  render(a_Position, a_Size, u_FragColor) {
    // gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    // gl.uniform1f(a_Size, this.size);
    var d = this.size / 20.0;
    drawTriangle([this.vertices[0] - d / 2, this.vertices[1], this.vertices[0] + d / 2, this.vertices[1], this.vertices[0], this.vertices[1] + d]);
  }
}

/**
 * Draws a triangle using the provided vertices.
 *
 * @param {number[]} vertices - The vertices of the triangle.
 */
function drawTriangle(vertices) {
  var n = 3;
  var vertexBuffer1 = gl.createBuffer();
  if (!vertexBuffer1) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}

/**
 * Draws a 3D triangle using WebGL.
 *
 * @param {number[]} vertices - The array of vertex coordinates for the triangle.
 */
function drawTriangle3D(vertices) {
  var n = 3;
  var vertexBuffer1 = gl.createBuffer();
  if (!vertexBuffer1) {
    console.log("Failed to create the buffer object");
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}
