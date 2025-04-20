class Dinosaur {
  constructor(vertices, color, size) {
    var base = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    var output = base[0].map((_, colIndex) => base.map((row) => row[colIndex]));
    this.shape = output.map((row) => row.reverse());
    this.vertices = vertices;
    this.color = color;
    this.size = size;
    this.rows = 15;
    this.cols = 15;
  }

  render() {

    // gl.uniform1f(a_Size, 5);
    // var d = 5 / 70.0;
    // for (let i = 0; i < this.rows; i++) {
    //   for (let j = 0; j < this.cols; j++) {
    //     if (this.shape[i][j] == 1) {
    //       if(i<4){
    //         gl.uniform4f(u_FragColor, 0.0,0.9,0.2,1.0);
    //       } else if(i>=4 && i<12){
    //         if(j<5){
    //           gl.uniform4f(u_FragColor, 0.0,0.9,0.2,1.0);
    //         } else if (j>=5 && j<10){
    //           gl.uniform4f(u_FragColor, 0.0,0.0,0.9,1.0);
    //         } else{
    //           gl.uniform4f(u_FragColor, 0.9,0.0,0.2,1.0);
    //         }
    //       } else{
    //         if(j<10){
    //           gl.uniform4f(u_FragColor, 0.0,0.9,0.2,1.0);
    //         }
    //         else {
    //           gl.uniform4f(u_FragColor, 0.9,0.0,0.2,1.0);
    //         }
    //       }
    //       drawTriangle([this.vertices[0] + i / 15, this.vertices[1] + j / 15, this.vertices[0] + (d + i / 15), this.vertices[1] + j / 15, this.vertices[0] + i / 15, this.vertices[1] + (d + j / 15)]);
    //       drawTriangle([this.vertices[0] + d + i / 15, this.vertices[1] + d + j / 15, this.vertices[0] + d + i / 15, this.vertices[1] + j / 15, this.vertices[0] + i / 15, this.vertices[1] + d + j / 15]);
    //     }
    //   }
    // }
  }
}
