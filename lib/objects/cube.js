import { Vector3, Matrix4 } from "./../third-party/cuon-matrix-cse160.js";
import { debugLog, ObjectClass} from "../utils.js";

const debugkey = "objects_cube";
var ntex = 16.0;

debugLog(debugkey, "Loading cube...");

/**
 * Represents a cube object.
 */
export class Cube {
  /**
   * Represents a Cube object.
   * @constructor
   * @param {number} textureAtlasNum - The number of the texture atlas.
   * @param {number} textureNum - The number of the texture.
   */
  constructor(textureAtlasNum, textureNum, gl) {
    // this.type = "cube";
    this.type = ObjectClass.CUBE
    this.color = [1.0, 1.0, 1.0, 1.0];

    // this is the model matrix
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();

    this.buffer = null;
    this.uvBuffer = null;
    this.vertices = null;
    this.uvs = null;
    this.normals = null;
    this.normalbuffer = null;
    this.textureAtlasNum = textureAtlasNum;
    this.textureNum = textureNum;
    // Flag to check if buffers are already uploaded.
    this.bufferInitialized = false;

    this.gl = gl;
    this.setUvs();
    this.setNormals();
  }

  /**
   * Generates the vertices for the cube.
   */
  generateVertices() {
    this.vertices = new Float32Array([
      // FRONT
      -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
      // LEFT
      -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5,
      // RIGHT
      0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
      // TOP
      -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
      // BACK
      0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
      // BOTTOM
      -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
    ]);
  }

  /**
   * Sets the UV coordinates for the cube object.
   */
  setUvs() {
    if (this.textureNum === 2) {
      var x = 0;
      var y = 1;
      var eps = 0.1;
      this.uvs = new Float32Array([
        // FRONT
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        // LEFT
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        // RIGHT (same as FRONT)
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        // TOP
        (x + eps) / ntex,
        (y + 2 - eps) / ntex,
        (x + eps) / ntex,
        (y + 1 + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + 2 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 2 - eps) / ntex,
        // BACK (same as FRONT)
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        // BOTTOM
        (x + eps) / ntex,
        (y - eps) / ntex,
        (x + eps) / ntex,
        (y - 1 + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y - 1 + eps) / ntex,
        (x + eps) / ntex,
        (y - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y - 1 + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y - eps) / ntex,
      ]);
    } else if (this.textureNum === 3) {
      var x = 10;
      var y = 0;
      var eps = 0.1;
      // var offx = 1
      this.uvs = new Float32Array([
        // FRONT
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        // LEFT
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,

        // RIGHT
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,

        // TOP
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        // BACK
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,

        // BOTTOM
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
      ]);
    } else if (this.textureNum === 4) {
      // gold target
      var x = 0;
      var y = 11;
      var eps = 0.1;
      // var offx = 1
      this.uvs = new Float32Array([
        // FRONT
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        // LEFT
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,

        // RIGHT
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,

        // TOP
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
        // BACK
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,

        // BOTTOM
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + eps) / ntex,
        (y + 1 - eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + eps) / ntex,
        (x + 1 - eps) / ntex,
        (y + 1 - eps) / ntex,
      ]);
    } else {
      this.uvs = new Float32Array([
        // FRONT
        0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
        // LEFT
        0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
        // RIGHT
        0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
        // TOP
        1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0,
        // BACK
        0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0,
        // BOTTOM
        0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1,
      ]);
    }
  }

  /**
   * Sets the normals for the cube.
   */
  setNormals() {
    this.normals = new Float32Array([
      // FRONT
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      // LEFT
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      // RIGHT
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      // TOP
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      // BACK
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      // BOTTOM
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    ]);
  }

  /**
   * Renders the cube object.
   */
  render(shaderVars, normalControllerState) {
    const gl = this.gl;
    if (shaderVars === undefined) {
      console.log("Shader variables are undefined.");
      return;
    }

    let tex = normalControllerState ? -3 : this.textureAtlasNum;

    gl.uniform1i(shaderVars.uniforms.u_whichTexture, tex);
    gl.uniform4f(shaderVars.uniforms.u_FragColor, ...this.color);
    gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);

    this.normalMatrix.set(this.matrix).invert().transpose();
    gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);

    if (this.vertices === null) {
      this.generateVertices();
    }

    // Create buffers if they haven't been created yet.
    if (this.buffer === null) {
      this.buffer = gl.createBuffer();
    }
    if (this.uvBuffer === null) {
      this.uvBuffer = gl.createBuffer();
    }

    if (this.normalbuffer === null) {
      this.normalbuffer = gl.createBuffer();
    }

    // Only upload the buffer data once.
    if (!this.bufferInitialized) {
      // Upload vertex data with STATIC_DRAW since the geometry is static.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
      // Upload UV data.
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
      this.bufferInitialized = true;
    }

    // Bind the vertex buffer and set the attribute pointer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(shaderVars.attribs.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.attribs.a_Position);

    // Bind the UV buffer and set the attribute pointer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.vertexAttribPointer(shaderVars.attribs.a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.attribs.a_UV);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
    gl.vertexAttribPointer(shaderVars.attribs.a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.attribs.a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
  }
}
