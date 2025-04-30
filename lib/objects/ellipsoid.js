import { debugLog, ObjectClass } from "../utils.js";
import { Matrix4 } from "../third-party/cuon-matrix-cse160.js";

const debugkey = "objects_ellipsoid";

debugLog(debugkey, "Loading ellipsoid.js");

/**
 * Represents an Ellipsoid object.
 */
export class Ellipsoid {
  /**
   * @param {Array} center - [x, y, z] center of the ellipsoid.
   * @param {Array} color - [r, g, b, a] color of the ellipsoid.
   * @param {number} xRadius - Radius along the X axis.
   * @param {number} yRadius - Radius along the Y axis.
   * @param {number} zRadius - Radius along the Z axis.
   * @param {number} segmentCount - Number of segments (default 32).
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   */
  constructor(center, color, xRadius, yRadius, zRadius, segmentCount = 32, gl) {
    this.center = center;
    this.color = color;
    this.xRadius = xRadius;
    this.yRadius = yRadius;
    this.zRadius = zRadius;
    this.segmentCount = segmentCount;
    this.gl = gl;
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();

    // Create geometry on CPU (in view-aligned XYZ space)
    this.vertexData = this._generateEllipsoidVertices();

    this.program = null;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.a_position = null;
    this.u_FragColor = null;
    this.u_ModelMatrix = null;
    this.u_ViewMatrix = null;
    this.u_ProjectionMatrix = null;
    this.u_Radius = null;
    this.vertexBuffer = null;
    this.u_Center = null;

    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexData), gl.STATIC_DRAW);
  }

  /**
   * Generates 3D triangle vertices for the ellipsoid.
   */
  _generateEllipsoidVertices() {
    const verts = [];
    const angleStep = (Math.PI * 2) / this.segmentCount;
    const halfPi = Math.PI / 2;

    // Generate ellipsoid vertices
    for (let i = 0; i < this.segmentCount; i++) {
      const angle1 = i * angleStep;
      const angle2 = (i + 1) * angleStep;

      // Vertices for the first triangle
      const x1 = this.center[0] + Math.cos(angle1) * this.xRadius;
      const y1 = this.center[1] + Math.sin(angle1) * this.yRadius;
      const z1 = this.center[2] + Math.sin(angle1) * this.zRadius;

      // Vertices for the second triangle
      const x2 = this.center[0] + Math.cos(angle2) * this.xRadius;
      const y2 = this.center[1] + Math.sin(angle2) * this.yRadius;
      const z2 = this.center[2] + Math.sin(angle2) * this.zRadius;

      // Add the center vertex, followed by the two consecutive perimeter vertices
      verts.push(this.center[0], this.center[1], this.center[2]); // center of the ellipsoid
      verts.push(x1, y1, z1); // first perimeter vertex
      verts.push(x2, y2, z2); // second perimeter vertex
    }
    return verts;
  }

  /**
   * Render the 3D ellipsoid.
   * @param {Object} shaderVars - Object containing uniform and attribute locations.
   */
  render(shaderVars, aasd, camera) {
    const gl = this.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(shaderVars.uniforms.u_ShapeType, ObjectClass.ELLIPSOID);
    gl.uniform1i(shaderVars.uniforms.u_ShapeType2, ObjectClass.ELLIPSOID);

    // Bind buffer and set uniforms
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);
    this.normalMatrix.set(this.matrix).invert().transpose();
    gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);

    // Set attribute for position
    gl.vertexAttribPointer(shaderVars.attribs.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(shaderVars.attribs.a_Position);

    // Set color and radii
    gl.uniform4fv(shaderVars.uniforms.u_FragColor, this.color);
    gl.uniform3fv(shaderVars.uniforms.u_Center, [this.center[0], this.center[1], this.center[2]]);
    gl.uniform3fv(shaderVars.uniforms.u_Radius, [this.xRadius, this.yRadius, this.zRadius]);

    // Draw the ellipsoid
    gl.drawArrays(gl.TRIANGLES, 0, this.segmentCount * 3); // 3 vertices per triangle
  }
}
