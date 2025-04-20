class Point {
  constructor(loc, color, size) {
    this.type = "point";
    this.vertices = new Float32Array(loc);
    this.color = color;
    this.size = size;
  }

  render(a_Position, a_Size, u_FragColor) {
    gl.disableVertexAttribArray(a_Position);
    gl.vertexAttrib3f(a_Position, this.vertices[0], this.vertices[1], 0.0);
    // gl.uniform1f(a_Size, this.size);
    // gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    // gl.drawArrays(gl.POINTS, 0, 2);
  }
}
