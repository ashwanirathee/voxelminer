import {Cube} from './cube.js';
import {Sphere} from './sphere.js';

class WebGLRenderer {
  constructor() {
    this.dayColor = [0.53, 0.81, 0.92]; // Day Sky color
    this.nightColor = [0.2, 0.2, 0.2];   // Night Sky color
    this.rows = 32;
    this.cols = 32;
    this.g_map = null;
    // Array to hold cube instances
    this.cubeInstances = [];
  }

  drawMap(u_whichTexture,  u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal, normalControllerState, gl) {
    // Generate the maze if needed
    if (this.g_map == null) {
      this.g_map = this.generateMaze(this.rows, this.cols);
      // Also, build the cubes once:
      this.buildCubeInstances(normalControllerState);
    }
    // Now simply render each pre-created cube:
    for (let i = 0; i < this.cubeInstances.length; i++) {
      this.cubeInstances[i].render(gl, u_whichTexture,  u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);
    }
  }

  buildCubeInstances(normalControllerState) {
    // Clear any existing instances.
    this.cubeInstances = [];

    // Loop over the grid and create cubes only once.
    for (let x = 0; x <= this.rows; x++) {
      for (let y = 0; y <= this.cols; y++) {
        if (this.g_map[x][y] > 0) {
          for (let h = 1; h <= this.g_map[x][y]; h++) {
            let type;
            if (x === 0 || y === 0) {
              type = 3;
            } else if (h <= 1) {
              type = 3;
            } else {
              type = 2;
            }
            let cube = new Cube(2, type);
            cube.color = [1.0, 1.0, 1.0, 1.0];
            // Position cube relative to maze center:
            cube.matrix.translate(x - this.rows / 2, h - 1, y - this.cols / 2);
            if(normalControllerState) cube.textureAtlasNum = -3;
            this.cubeInstances.push(cube);
          }
        }
        if (this.g_map[x][y] == -1) {
          // For special cells (e.g., pillars)
          let cube = new Cube(2, 4);
          cube.matrix.setTranslate(x - this.rows / 2, 1, y - this.cols / 2);
          cube.color = [1.0, 0.0, 0.0, 1.0];
          cube.matrix.scale(1, 10, 1);
          this.cubeInstances.push(cube);
        }
      }
    }
  }

  generateMaze(width, height) {
    // ... your maze generation code ...
    const maze = [
      [3, 4, 4, 4, 2, 3, 2, 3, 2, 3, 3, 2, 2, 4, 3, 4, 3, 4, 3, 3, 2, 4, 4, 3, 2, 2, 3, 2, 4, 4, 3, 2, 4],
      [2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4],
      [3, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3],
      [4, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
      [3, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 4],
      [3, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 2],
      [3, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 2],
      [2, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 3],
      [2, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2],
      [4, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 4],
      [2, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 4],
      [2, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 3],
      [2, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 4],
      [3, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 3],
      [4, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
      [2, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 4],
      [4, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 2],
      [2, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 3],
      [4, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 3],
      [2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 4],
      [2, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 4],
      [3, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 2],
      [2, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 4],
      [4, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4],
      [2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 3],
      [4, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 2],
      [3, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 2],
      [2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 4],
      [2, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 4],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 2],
      [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 3],
      [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
      [3, 4, 4, 2, 2, 2, 2, 4, 2, 2, 3, 2, 3, 3, 4, 2, 4, 2, 3, 3, 4, 4, 2, 3, 3, 3, 2, 4, 2, 2, 4, 2, 3]
    ];
    
    // Set start and end points or modify values as needed.
    maze[1][1] = 0;
    maze[height - 2][width - 2] = 0;
    for (let x = 0; x < height; x++) {
      for (let y = 0; y < width; y++) {
        if (maze[x][y] > 0) {
          maze[x][y] += Math.floor(Math.random() * 3) + 1;
        }
      }
    }
    maze[31][2] = -1;
    return maze;
  }

  render(scene, gl, u_GlobalRotateMatrix, u_lightStatus, u_light2Status, u_FragColor, u_lightPos, u_light2Pos, u_LightColor, a_CameraPos, lightStatus, g_lightpos, light2Status, g_light2pos, camera, lightR, lightG, lightB, g_seconds, ntex, normalControllerState, u_whichTexture, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal) {
    console.log("Rendering scene...");
    let g_globalAngleX = 0;
    let g_globalAngleY = 0;

    var startTime = performance.now();
    
    var globalRotMat = new Matrix4().rotate(g_globalAngleX, 0, 1, 0);
    globalRotMat.rotate(0, 1, 0, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // don't delete these!
    gl.uniform1i(u_lightStatus, lightStatus);
    gl.uniform4fv(u_FragColor, new Float32Array([0.5, 0.5, 0.5, 1.0]));
    gl.uniform3fv(u_lightPos, g_lightpos);
    gl.uniform3fv(u_LightColor, new Float32Array([lightR, lightG, lightB]));

    gl.uniform1i(u_light2Status, light2Status);
    gl.uniform4fv(u_FragColor, new Float32Array([0.5, 0.5, 0.5, 1.0]));
    gl.uniform3fv(u_light2Pos, g_light2pos);

    gl.uniform3f(a_CameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let t = Math.sin(0.1 * g_seconds * Math.PI); 
    let currentColor = lerpColor(this.dayColor, this.nightColor, (t + 1) / 2);
    gl.clearColor(...currentColor, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let sky = new Cube(-6, 2);
    sky.color = [0.235, 0.639, 1, 1.0];
    sky.matrix.scale(-50, -100, -50);
    if(normalControllerState) sky.textureAtlasNum = -3;
    sky.render(gl, u_whichTexture,  u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    // let body = new Cube(2,2);
    // body.color = [0.49, 0.788, 0.29, 1.0];
    // body.matrix.translate(2, 0, 0);
    // body.matrix.scale(0.2, 0.2, 0.2);
    // // if(normalControllerState) body.textureAtlasNum = -3;
    // body.render();

    var ball = new Sphere(1, 10,10, -6, 2); // radius 50, 20x20 resolution
    ball.matrix.translate(-15,-0.2, 10);
    ball.matrix.scale(0.5, 0.5, 0.5);
    if(normalControllerState) ball.textureAtlasNum = -3;
    ball.render(gl, camera, u_whichTexture, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    var light = new Cube(-5, 1);
    light.color = [1, 1, 1, 1.0];
    light.matrix.translate(g_lightpos[0], g_lightpos[1], g_lightpos[2]);
    light.matrix.scale(1, 1, 1);
    if(normalControllerState) light.textureAtlasNum = -5;
    light.render(gl, u_whichTexture,  u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    var light2 = new Cube(-5, 1);
    light2.color = [1, 1, 1, 1.0];
    light2.matrix.translate(g_light2pos[0], g_light2pos[1], g_light2pos[2]);
    light2.matrix.scale(0.3, 0.3, 0.3);
    if(normalControllerState) light2.textureAtlasNum = -5;
    light2.render(gl, u_whichTexture,  u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    let floor = new Cube(2, 3);
    floor.color = [0.49, 0.788, 0.29, 1.0];
    floor.matrix.translate(0, -0.5, 0);
    floor.matrix.scale(-32, 0.01, -32);
    floor.render(gl, u_whichTexture,  u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    var ball2 = new Sphere(1, 10,10, -6, 2); // radius 50, 20x20 resolution
    ball2.matrix.translate(-11,-0.2, 13);
    ball2.matrix.scale(0.5, 0.5, 0.5);
    if(normalControllerState) ball2.textureAtlasNum = -3;
    ball2.render(gl, camera, u_whichTexture, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal);

    // // Draw the maze cubes from the cached instances.
    this.drawMap(u_whichTexture,  u_FragColor, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal, normalControllerState, gl);
    // Optionally, measure and display performance.
    var duration = performance.now() - startTime;
    document.getElementById("perf").innerHTML =
      "Time Taken in rendering: " + duration.toFixed(3) + " ms, fps: " + (1000 / duration).toFixed(2);
  }
}

// Lerp function to linearly interpolate between two colors
function lerpColor(color1, color2, t) {
  return color1.map((v, i) => v + t * (color2[i] - v));
}

        
function drawCrosshair() {
  console.log("ASd")
  const centerX = overlayCanvas.width / 2;
  const centerY = overlayCanvas.height / 2;
  const size = 20;
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  
  // Draw horizontal line
  ctx.beginPath();
  ctx.moveTo(centerX - size, centerY);
  ctx.lineTo(centerX + size, centerY);
  ctx.stroke();
  
  // Draw vertical line
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - size);
  ctx.lineTo(centerX, centerY + size);
  ctx.stroke();
}

export { WebGLRenderer };