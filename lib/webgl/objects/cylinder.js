import { debugLog, ObjectClass } from "../utils.js";

const debugkey = "objects_cylinder";

debugLog(debugkey, "Loading cylinder.js");

/**
 * Represents a Cylinder object.
 */
class Cylinder {
  /**
   * Represents a Cylinder object.
   * @constructor
   * @param {Array} vertices - The vertices of the cylinder.
   * @param {Array} color - The color of the cylinder.
   * @param {number} size - The size of the cylinder.
   */
  constructor(vertices, color, size) {
    this.type = ObjectClass.CYLINDER;
    this.vertices = [0, 0, 0];
    this.color = [0.5, 0.5, 0.5, 1.0];
    this.size = 4;
    this.segment_count = 10;
    this.matrix = new Matrix4();
  }

  /**
   * Renders the cylinder object.
   */
  render() {
    // gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    // gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

    var radius = this.size / 20.0;
    var height = 0.4;
    let angleStep = 360 / this.segment_count;
    let topVertices = [];
    let bottomVertices = [];

    for (var angle = 0; angle < 360; angle += angleStep) {
      let radian = (angle * Math.PI) / 180;
      let x = Math.cos(radian) * radius;
      let y = Math.sin(radian) * radius;
      topVertices.push(this.vertices[0] + x);
      topVertices.push(this.vertices[1] + y);
      topVertices.push(this.vertices[2] + height);
      bottomVertices.push(this.vertices[0] + x);
      bottomVertices.push(this.vertices[1] + y);
      bottomVertices.push(this.vertices[2]);
    }

    for (let i = 0; i < this.segment_count; i++) {
      let nextIdx = (i + 1) % this.segment_count;

      let t1 = [topVertices[i * 3], topVertices[i * 3 + 1], topVertices[i * 3 + 2]];
      let t2 = [topVertices[nextIdx * 3], topVertices[nextIdx * 3 + 1], topVertices[nextIdx * 3 + 2]];
      let b1 = [bottomVertices[i * 3], bottomVertices[i * 3 + 1], bottomVertices[i * 3 + 2]];
      let b2 = [bottomVertices[nextIdx * 3], bottomVertices[nextIdx * 3 + 1], bottomVertices[nextIdx * 3 + 2]];
      drawTriangle3D([...t1, ...b1, ...t2]);
      drawTriangle3D([...b1, ...b2, ...t2]);
    }

    for (let i = 1; i < this.segment_count - 1; i++) {
      let nextIdx = (i + 1) % this.segment_count;

      drawTriangle3D([
        topVertices[0],
        topVertices[1],
        topVertices[2], // Center of the top circle
        topVertices[i * 3],
        topVertices[i * 3 + 1],
        topVertices[i * 3 + 2],
        topVertices[nextIdx * 3],
        topVertices[nextIdx * 3 + 1],
        topVertices[nextIdx * 3 + 2],
      ]);

      drawTriangle3D([
        bottomVertices[0],
        bottomVertices[1],
        bottomVertices[2], // Center of the bottom circle
        bottomVertices[i * 3],
        bottomVertices[i * 3 + 1],
        bottomVertices[i * 3 + 2],
        bottomVertices[nextIdx * 3],
        bottomVertices[nextIdx * 3 + 1],
        bottomVertices[nextIdx * 3 + 2],
      ]);
    }
  }
}
