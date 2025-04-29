import { debugLog, ObjectClass } from "../utils.js";
import { Matrix4 } from "../third-party/cuon-matrix-cse160.js";

const debugkey = "objects_point";

debugLog(debugkey, "Loading point.js");

/**
 * Represents a point in VoxelMiner
 */
export class Point {
  /**
   * Represents a point in VoxelMiner
   * @constructor
   * @param {number[]} loc - The location of the point as an array of coordinates.
   * @param {string} color - The color of the point.
   * @param {number} size - The size of the point.
   * @param {WebGLRenderingContext} gl - The WebGL context.
   */
  constructor(loc, color, size, gl) {
    this.type = ObjectClass.POINT;
    this.vertices = new Float32Array(loc); // loc is assumed [x, y, z]
    this.color = new Float32Array(color);  // assuming [r, g, b, a]
    this.size = size;
    this.texture = -2;
    this.gl = gl;

        // this is the model matrix
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();
  }

  /**
   * Renders the point on the WebGL canvas.
   * @param {object} shaderVars - The shader attribute/uniform locations.
   */
  render(shaderVars) {
    const gl = this.gl;
    const { vertices, color, size, texture } = this;

    gl.disableVertexAttribArray(shaderVars.attribs.a_Position);
    gl.vertexAttrib3fv(shaderVars.attribs.a_Position, vertices); // single call instead of vertexAttrib3f
    gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);

    this.normalMatrix.set(this.matrix).invert().transpose();
    gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);

    gl.uniform1f(shaderVars.uniforms.u_Size, size);
    gl.uniform1i(shaderVars.uniforms.u_whichTexture, texture);
    gl.uniform4fv(shaderVars.uniforms.u_FragColor, color); // single call instead of 4 floats

    gl.drawArrays(gl.POINTS, 0, 1);
  }
}
