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

// triangle3d.js
// import { debugLog, ObjectClass } from "../utils.js";
// import { Matrix4 } from "../third-party/cuon-matrix-cse160.js";

// const debugkey = "objects_triangle3d";
// debugLog(debugkey, "Loading triangle3d.js");

/**
 * Triangle3D: a single 3D triangle (one face), with per-vertex positions & normals.
 * Attribute locations expected in the shader:
 *   layout(location=0) vec3 a_Position;
 *   layout(location=1) vec3 a_Normal;
 * Uniforms expected:
 *   u_ModelMatrix (mat4), u_NormalMatrix (mat4), u_FragColor (vec4), u_whichTexture (int), [u_Size (float)]
 */
export class Triangle3D {
  constructor(center, color, size, gl, vertices = null) {
    this.type = ObjectClass.TRIANGLE3D ?? "TRIANGLE3D";
    this.gl = gl;

    this.center = Float32Array.from(center);
    this.color = color;
    this.size = size;
    this.texture = -2;

    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();

    // Positions
    if (vertices && vertices.length === 9) {
      this.positions = new Float32Array(vertices);
    } else {
      const d = size / 20.0;
      const [cx, cy, cz] = this.center;
      this.positions = new Float32Array([
        cx - 0.5 * d, cy - 0.5 * d, cz,
        cx + 0.5 * d, cy - 0.5 * d, cz,
        cx,           cy + 0.5 * d, cz,
      ]);
    }

    // Per-face normal (same for all 3 verts)
    this.normals = this._computeFaceNormalRepeated(this.positions);

    // Default UVs (triangle)
    this.uvs = new Float32Array([
      0.0, 0.0,
      1.0, 0.0,
      0.5, 1.0,
    ]);

    // GPU buffers (CREATE THEM NOW)
    this.buffer = gl.createBuffer();        // positions
    this.uvBuffer = gl.createBuffer();      // uvs
    this.normalBuffer = gl.createBuffer();  // normals

    this.bufferInitialized = false;

    this.faceTriIds = new Uint16Array([0, 1, 2]); // Default faceTriIds for a single triangle
    if (vertices && vertices.length === 9) {
      this.faceTriIds = new Uint16Array([0, 1, 2]); // Update if vertices are provided
    }
  }

  setVertices(vertices) {
    if (!vertices || vertices.length !== 9) return;
    this.positions.set(vertices);
    this.normals = this._computeFaceNormalRepeated(this.positions);

    if (this.bufferInitialized) {
      const gl = this.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positions);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.normals);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }

  translate(x, y, z) { this.matrix.translate(x, y, z); return this; }
  rotate(angleDeg, x, y, z) { this.matrix.rotate(angleDeg, x, y, z); return this; }
  scale(x, y, z) { this.matrix.scale(x, y, z); return this; }

  render(shaderVars, normalControllerState) {
    const gl = this.gl;
    if (!shaderVars) return;

    // Uniforms you’re using in your pipeline
    const tex = normalControllerState ? -3 : (this.textureAtlasNum ?? this.texture);
    if (shaderVars.uniforms.u_ShapeType)  gl.uniform1i(shaderVars.uniforms.u_ShapeType,  ObjectClass.TRIANGLE);
    if (shaderVars.uniforms.u_ShapeType2) gl.uniform1i(shaderVars.uniforms.u_ShapeType2, ObjectClass.TRIANGLE);
    gl.uniform1i(shaderVars.uniforms.u_whichTexture, tex);
    gl.uniform4f(shaderVars.uniforms.u_FragColor, ...this.color);

    gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);
    this.normalMatrix.set(this.matrix).invert().transpose();
    gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);

    // ---- Upload once (NOW the buffers are real & bound) ----
    if (!this.bufferInitialized) {
      // positions -> attrib 0
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      // uvs -> attrib shaderVars.attribs.a_UV (required)
      if (shaderVars.attribs?.a_UV == null) {
        console.warn("Triangle3D: a_UV location missing.");
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderVars.attribs.a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderVars.attribs.a_UV);
      }

      // normals -> attrib shaderVars.attribs.a_Normal (required for lighting)
      if (shaderVars.attribs?.a_Normal == null) {
        console.warn("Triangle3D: a_Normal location missing.");
      } else {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shaderVars.attribs.a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderVars.attribs.a_Normal);
      }

      // unbind ARRAY_BUFFER to avoid accidental re-use
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      this.bufferInitialized = true;
    } else {
      // Re-bind attrib arrays to their buffers before drawing
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

      if (shaderVars.attribs?.a_UV != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(shaderVars.attribs.a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderVars.attribs.a_UV);
      }
      if (shaderVars.attribs?.a_Normal != null) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(shaderVars.attribs.a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderVars.attribs.a_Normal);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  _computeFaceNormalRepeated(positions) {
    const p0 = positions.subarray(0, 3);
    const p1 = positions.subarray(3, 6);
    const p2 = positions.subarray(6, 9);
    const e1 = [p1[0]-p0[0], p1[1]-p0[1], p1[2]-p0[2]];
    const e2 = [p2[0]-p0[0], p2[1]-p0[1], p2[2]-p0[2]];
    const nx = e1[1]*e2[2] - e1[2]*e2[1];
    const ny = e1[2]*e2[0] - e1[0]*e2[2];
    const nz = e1[0]*e2[1] - e1[1]*e2[0];
    const invL = 1.0 / Math.hypot(nx, ny, nz);
    const n = [nx*invL, ny*invL, nz*invL];
    return new Float32Array([...n, ...n, ...n]);
  }
}
