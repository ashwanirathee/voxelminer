import { Vector3, Matrix4 } from "./../third-party/cuon-matrix-cse160.js";
import { debugLog, ObjectClass} from "../utils.js";

const debugkey = "objects_sphere";

debugLog(debugkey, "Loading sphere...");

/**
 * Represents a sphere in 3D space.
 */
class Sphere {
  /**
   * Represents a Sphere object.
   * @constructor
   * @param {number} [radius=0.5] - The radius of the sphere.
   * @param {number} [widthSegments=3] - The number of horizontal segments.
   * @param {number} [heightSegments=2] - The number of vertical segments.
   * @param {number} textureAtlasNum - The texture atlas number.
   * @param {vector} color - The color of the sphere.
   */
  constructor(radius = 0.5, widthSegments = 3, heightSegments = 2, textureAtlasNum, color, gl) {
    this.type = ObjectClass.SPHERE;
    // buffers
    this.vertexBuffer = null;
    this.indexBuffer = null;
    this.uvBuffer = null;
    this.normalBuffer = null;

    // data arrays
    this.vertices = null;
    this.indices = null;
    this.uvs = null;
    this.normals = null;
    this.textureAtlasNum = textureAtlasNum;
    this.color = color;

    // transformations
    this.position = new Vector3([0, 0, 0]);
    this.rotation = new Vector3([0, 0, 0]);
    this.scale = new Vector3([1, 1, 1]);
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();

    this.gl = gl;

    widthSegments = Math.max(3, Math.floor(widthSegments));
    heightSegments = Math.max(2, Math.floor(heightSegments));

    this.generateSphere(radius, widthSegments, heightSegments);
  }

  /**
   * Generates a sphere geometry.
   *
   * @param {number} radius - The radius of the sphere.
   * @param {number} widthSegments - The number of horizontal segments.
   * @param {number} heightSegments - The number of vertical segments.
   */
  generateSphere(radius, widthSegments, heightSegments) {
    let index = 0;
    const grid = [];

    const vertex = new Vector3();
    const normal = new Vector3();

    // buffers

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    for (let j = 0; j <= heightSegments; j++) {
      const row = [];

      const v = j / heightSegments;

      let uOffset = 0;
      // special cases for poles
      if (j === 0) {
        uOffset = 0.5 / widthSegments;
      } else if (j === heightSegments) {
        uOffset = -0.5 / widthSegments;
      }

      for (let i = 0; i <= widthSegments; i++) {
        const u = i / widthSegments;

        vertex.elements[0] = -radius * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI);

        vertex.elements[1] = radius * Math.cos(v * Math.PI);

        vertex.elements[2] = radius * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI);

        vertices.push(...vertex.elements);
        normal.set(vertex).normalize();

        normals.push(...normal.elements);

        uvs.push(u + uOffset, 1 - v);

        row.push(index++);
      }

      grid.push(row);
    }

    for (let j = 0; j < heightSegments; j++) {
      for (let i = 0; i < widthSegments; i++) {
        const a = grid[j][i + 1];
        const b = grid[j][i];
        const c = grid[j + 1][i];
        const d = grid[j + 1][i + 1];

        if (j !== 0) indices.push(a, b, d);
        if (j !== heightSegments - 1) indices.push(b, c, d);
      }
    }

    this.vertices = new Float32Array(vertices);
    this.indices = new Uint16Array(indices);
    this.uvs = new Float32Array(uvs);
    this.normals = new Float32Array(normals);
  }

  /**
   * Calculates the transformation matrix and normal matrix for the sphere.
   */
  calculateMatrix() {
    let [x, y, z] = this.position.elements;
    let [rx, ry, rz] = this.rotation.elements;
    let [sx, sy, sz] = this.scale.elements;

    this.matrix.setTranslate(x, y, z).rotate(rx, 1, 0, 0).rotate(ry, 0, 1, 0).rotate(rz, 0, 0, 1).scale(sx, sy, sz);

    this.normalMatrix.set(this.matrix).invert().transpose();
  }

  /**
   * Renders the sphere object.
   */
  render(shaderVars, normalControllerState) {
    const gl = this.gl;

    if (normalControllerState) this.textureAtlasNum = -3;
    else this.textureAtlasNum = -2;
    gl.uniform1i(shaderVars.uniforms.u_ShapeType, ObjectClass.SPHERE);
    gl.uniform1i(shaderVars.uniforms.u_ShapeType2, ObjectClass.SPHERE);
    gl.uniform1i(shaderVars.uniforms.u_whichTexture, this.textureAtlasNum);
    gl.uniform4fv(shaderVars.uniforms.u_FragColor, this.color);
    gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);

    this.normalMatrix.set(this.matrix).invert().transpose();
    gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);

    if (this.vertexBuffer === null) this.vertexBuffer = gl.createBuffer();
    if (this.indexBuffer === null) this.indexBuffer = gl.createBuffer();
    if (this.uvBuffer === null) this.uvBuffer = gl.createBuffer();
    if (this.normalBuffer === null) this.normalBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(shaderVars.attribs.a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.attribs.a_UV);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(shaderVars.attribs.a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.attribs.a_Normal);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);

    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
  }
}

export { Sphere };
