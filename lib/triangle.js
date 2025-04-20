class Triangle {
  constructor(vertices, color, size) {
    this.type = "triangle";
    this.vertices = vertices;
    this.color = color;
    this.size = size;
  }

  render(a_Position, a_Size, u_FragColor) {
    // gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
    // gl.uniform1f(a_Size, this.size);
    var d = this.size / 20.0;
    drawTriangle([this.vertices[0]-d/2, this.vertices[1], this.vertices[0] + d/2, this.vertices[1], this.vertices[0], this.vertices[1] + d]);
  }
}

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
