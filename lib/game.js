class Game {
  constructor() {
    this.rows = 15;
    this.cols = 15;
    this.player = [1, 1];
    this.end = [this.rows - 2, this.cols - 2];
    this.maze = generateMaze(this.rows, this.cols);
    this.vertices = [];
    this.offset_all = -0.7;
    this.scaling_factor = 10;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.maze[i][j] == 1) this.vertices.push(this.offset_all + i / this.scaling_factor, this.offset_all + j / this.scaling_factor);
      }
    }
    this.you_won = [
      [1,0,1,0,1,1,1,0,1,0,1,0,0,0,0,0],
      [1,1,1,0,1,0,1,0,1,0,1,0,0,0,0,0],
      [0,1,0,0,1,1,1,0,1,1,1,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,1],
      [1,0,0,0,1,0,1,0,1,0,1,1,0,1,0,1],
      [1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0],
      [1,1,1,1,1,0,1,1,1,0,1,0,0,1,0,1],
    ]
  }
  render(a_Position, a_Size, u_FragColor) {
    var vertexBuffer1 = gl.createBuffer();
    if (!vertexBuffer1) {
      console.log("Failed to create the buffer object");
      return -1;
    }
    gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
    gl.uniform1f(a_Size, 15);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer1);
    if (this.player[0] == this.end[0] && this.player[1] == this.end[1]) {
      var output =  this.you_won[0].map((_, colIndex) =>  this.you_won.map((row) => row[colIndex]));
      let reversedArray2D = output.map((row) => row.reverse());
      let newvertices = []
      for (let i = 0; i < this.you_won[0].length; i++) {
        for (let j = 0; j < this.you_won.length; j++) {
          if (reversedArray2D[i][j] == 1) newvertices.push(this.offset_all + i / this.scaling_factor, this.offset_all + j / this.scaling_factor);
        }
      }
      console.log(newvertices)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(newvertices), gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
      gl.drawArrays(gl.POINTS, 0, newvertices.length/ 2);
    } else {
      // console.log(vertices);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_Position);
      gl.drawArrays(gl.POINTS, 0, this.vertices.length / 2);

      gl.disableVertexAttribArray(a_Position);
      gl.vertexAttrib3f(a_Position, this.offset_all + this.player[0] / this.scaling_factor, this.offset_all + this.player[1] / this.scaling_factor, 0.0);
      gl.uniform1f(a_Size, 15);
      gl.uniform4f(u_FragColor, 0.5, 0.5, 0.5, 0.5);
      gl.drawArrays(gl.POINTS, 0, 2);
      gl.vertexAttrib3f(a_Position, this.offset_all + this.end[0] / this.scaling_factor, this.offset_all + this.end[1] / this.scaling_factor, 0.0);
      gl.uniform1f(a_Size, 15);
      gl.uniform4f(u_FragColor, 0.9, 0.0, 0.0, 0.5);
      gl.drawArrays(gl.POINTS, 0, 2);
    }
  }
}

function generateMaze(width, height) {
  // Ensure odd dimensions for proper walls
  width = Math.floor(width / 2) * 2 + 1;
  height = Math.floor(height / 2) * 2 + 1;

  const maze = Array.from({ length: height }, () => Array(width).fill(1)); // 1 represents walls
  const stack = [[1, 1]];
  maze[1][1] = 0; // 0 represents a path

  const directions = [
    [0, 2],
    [2, 0],
    [0, -2],
    [-2, 0],
  ]; // Move in grid

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const neighbors = [];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx > 0 && nx < height - 1 && ny > 0 && ny < width - 1 && maze[nx][ny] === 1) {
        neighbors.push([nx, ny]);
      }
    }

    if (neighbors.length > 0) {
      const [nx, ny] = neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[(x + nx) / 2][(y + ny) / 2] = 0; // Remove the wall
      maze[nx][ny] = 0; // Mark as part of the maze
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }

  // Define starting and ending points
  maze[1][1] = 0; // Start point at the top-left corner
  maze[height - 2][width - 2] = 0; // End point at the bottom-right corner

  return maze;
}

function printMaze(maze) {
  console.log(maze.map((row) => row.map((cell) => (cell === 1 ? "██" : "  ")).join("")).join("\n"));
}
