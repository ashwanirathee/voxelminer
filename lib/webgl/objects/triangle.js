import { debugLog, ObjectClass} from "../utils.js";
import { Matrix4 } from "../third-party/cuon-matrix-cse160.js";

const debugkey = "objects_triangle";

debugLog(debugkey, "Loading triangle.js");

/**
 * Represents a triangle shape.
 */
export class Triangle {
  /**
   * Represents a triangle shape.
   * @constructor
   * @param {Array} vertices - The vertices of the triangle.
   * @param {string} color - The color of the triangle.
   * @param {number} size - The size of the triangle.
   */
  constructor(center, color, size, gl) {
    this.type = ObjectClass.TRIANGLE;
    this.center = center;
    this.d = size / 20.0;
    this.vertices = new Float32Array([
      this.center[0] - this.d / 2, this.center[1], this.center[2],
      this.center[0] + this.d / 2, this.center[1], this.center[2],
      this.center[0], this.center[1] + this.d, this.center[2]
    ]);
    this.color = color;
    this.size = size;

    this.texture = -2;
    this.buffer = null;
    this.bufferInitialized = false;
    this.gl = gl;

    // this is the model matrix
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
  }

  /**
   * Renders the triangle on the canvas.
   * @param {WebGLUniformLocation} a_Position - The position attribute location.
   * @param {WebGLUniformLocation} a_Size - The size attribute location.
   * @param {WebGLUniformLocation} u_FragColor - The fragment color uniform location.
   */
  render(shaderVars) {
    const gl = this.gl;
    const { vertices, color, size, texture } = this;
    const d = this.d;

    if (this.buffer === null) {
      this.buffer = gl.createBuffer();
    }

    // Only upload the buffer data once.
    if (!this.bufferInitialized) {
      // Upload vertex data with STATIC_DRAW since the geometry is static.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

      this.bufferInitialized = true;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.uniform1f(shaderVars.uniforms.u_Size, size);
    gl.uniform1i(shaderVars.uniforms.u_whichTexture, texture);
    gl.uniform4f(shaderVars.uniforms.u_FragColor, ...color);
    gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);

    this.normalMatrix.set(this.matrix).invert().transpose();
    gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}