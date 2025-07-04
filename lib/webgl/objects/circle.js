import { debugLog, ObjectClass } from "../utils.js";
import { Matrix4 } from "../third-party/cuon-matrix-cse160.js";

const debugkey = "objects_circle";

debugLog(debugkey, "Loading circle.js");

/**
 * Represents a Circle object.
 */
export class Circle {
  /**
   * @param {Array} center - [x, y, z] center of the circle.
   * @param {Array} color - [r, g, b, a] color of the circle.
   * @param {number} radius - Radius of the circle.
   * @param {number} segmentCount - Number of segments (default 32).
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   */
  constructor(center, color, radius, segmentCount = 32, gl) {
    this.center = center;
    this.color = color;
    this.radius = radius;
    this.segmentCount = segmentCount;
    this.gl = gl;
    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();

    // Create geometry on CPU (in view-aligned XY plane)
    this.vertexData = this._generateTriangleVertices();

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
    this.u_Radius = null;
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexData), gl.STATIC_DRAW);
  }

  /**
   * Generates 3D triangle vertices for the circle.
   */
  _generateTriangleVertices() {
    const verts = [];
    const angleStep = (Math.PI * 2) / this.segmentCount;

    // Center vertex (shared for all triangles)
    const center = this.center;

    // Generate triangle vertices
    for (let i = 0; i < this.segmentCount; i++) {
      const angle1 = i * angleStep;
      const angle2 = (i + 1) * angleStep;

      // Vertices for the first triangle
      const x1 = center[0] + Math.cos(angle1) * this.radius;
      const y1 = center[1] + Math.sin(angle1) * this.radius;
      const z1 = center[2];

      // Vertices for the second triangle
      const x2 = center[0] + Math.cos(angle2) * this.radius;
      const y2 = center[1] + Math.sin(angle2) * this.radius;
      const z2 = center[2];

      // Add the center vertex, followed by the two consecutive perimeter vertices
      verts.push(center[0], center[1], center[2]); // center of the circle
      verts.push(x1, y1, z1); // first perimeter vertex
      verts.push(x2, y2, z2); // second perimeter vertex
    }
    return verts;
  }

  /**
   * Render the 3D circle.
   * @param {Object} shaderVars - Object containing uniform and attribute locations.
   */
  render(shaderVars, aasd, camera) {
    const gl = this.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1i(shaderVars.uniforms.u_ShapeType, ObjectClass.CIRCLE);
    gl.uniform1i(shaderVars.uniforms.u_ShapeType2, ObjectClass.CIRCLE);
    
    // Bind buffer and set uniforms
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);
    this.normalMatrix.set(this.matrix).invert().transpose();
    gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);
    
    // Set attribute for position
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // Set color and radius
    gl.uniform4fv(shaderVars.uniforms.u_FragColor, this.color);
    gl.uniform3fv(shaderVars.uniforms.u_Center, [this.center[0], this.center[1], this.center[2]]);
    gl.uniform3fv(shaderVars.uniforms.u_Radius, [this.radius, this.radius, this.radius]);
    gl.drawArrays(gl.TRIANGLES, 0, this.segmentCount * 3); // 3 vertices per triangle
  }
}
