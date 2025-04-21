function clearCanvas() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Specify the color for clearing <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>
  scene.shapesList = [];
  renderAllShapes();
}

function setupWebGL() {
  // Retrieve <canvas> element
  let canvas = document.getElementById("webgl_canvas");

  // Get the rendering context for WebGL
  let gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  return { canvas, gl };
}

// Function to reset the initial position when the mouse button is released
function onMouseUp(ev) {
  initialX = null;
  initialY = null;
}

// Variables to store the initial mouse position
let initialX = null;
let initialY = null;

function click(ev) {
  // if(isChecking == false) return;
  // if (ev.buttons != 1) return;
  // console.log("We noticed something!")
  // Convert the event coordinates to WebGL coordinates
  let [x, y] = convertCoordinatesEventToGL(ev);
  x = parseFloat(x) || 0;
  y = parseFloat(y) || 0;
  console.log(x);

  // // If this is the start of the drag, store the initial position
  // if (initialX === null || isNaN(initialX) || initialY === null || isNaN(initialY)) {
  //   initialX = x;
  //   initialY = y;
  // }

  // // Calculate the difference between the current and initial positions
  // let deltaX = x - initialX;
  // let deltaY = y - initialY;
  // console.log(g_globalAngleY," ", g_globalAngleX)
  // if (!isNaN(deltaX) && !isNaN(deltaY)) {
  //   if (Math.abs(deltaY) > Math.abs(deltaX)) {
  //     g_globalAngleY += deltaY * 50;
  //     g_globalAngleY = Math.max(0, Math.min(360, Math.floor(g_globalAngleY))); // Limit between 0 and 360

  //   } else {
  //     g_globalAngleX -= deltaX * 50;
  //     g_globalAngleX = Math.max(0, Math.min(360, Math.floor(g_globalAngleX))); // Limit between 0 and 360
  //   }
  // }
  // if(deltaX > 0){
  camera.panLeft();
  // } else {
  // camera.panRight()
  // }

  // if (!isNaN(g_globalAngleX)) {
  //   angleSlideX_component.value = g_globalAngleX;
  // } else {
  //   g_globalAngleX = angleSlideX_component.value;
  // }
  // if (!isNaN(g_globalAngleY)) {
  //   angleSlideY_component.value = g_globalAngleY;
  // } else {
  //   g_globalAngleY = angleSlideY_component.value;
  // }
  // console.log(g_globalAngleY," ", g_globalAngleX)

  // Log the changes (optional)
  // console.log(`Delta X: ${deltaX}, Delta Y: ${deltaY}`);

  // Update the initial position to the current position for the next iteration
  // initialX = x;
  // initialY = y;

  renderAllShapes();
}

function handleMouseDown(event) {
  if (event.button === 0) {
    console.log("Left click on canvas!");
    // we destroy!
    // let cam
    // console.log(camera.eye, camera.at);
    var res = pickBlock(camera, renderer, 1);
    // console.log("Res:",res);
    if (res.gridX != null) {
      // console.log("GMAP:",renderer.g_map)
      renderer.g_map[res.gridX][res.gridY] = 0;
      // console.log("GMAPAfter:",renderer.g_map)
    }
    // if()
  } else if (event.button === 2) {
    // console.log("Right click on canvas!");
    // console.log(camera.eye, camera.at);
    var res = pickBlock(camera, renderer, 1);
    // console.log("Res:",res);
    if (res.gridX != null) {
      if (renderer.g_map[res.gridX][res.gridY] == 0) {
        renderer.g_map[res.gridX][res.gridY] = 1;
      }
    }
    // we add!
  }
  renderer.buildCubeInstances();
}

function pickBlock(camera, world, distance = 1) {
  let forward = camera.at.clone().sub(camera.eye);
  forward.normalize();

  // Compute a point "distance" units in front of the camera
  let targetPos = camera.eye.clone().add(forward.mul(distance));

  // Convert world coordinates to grid indices.
  // Note: camera.eye and targetPos are in world coordinates.
  let gridX = Math.round(targetPos.elements[0] + world.rows / 2);
  let gridY = Math.round(targetPos.elements[2] + world.cols / 2);

  return { gridX, gridY };
}

function convertCoordinates(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  x1 = (x - 30 - rect.left - canvas.width / 2) / (canvas.width / 2);
  y1 = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  x2 = (x + 30 - rect.left - canvas.width / 2) / (canvas.width / 2);
  y2 = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  x3 = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y3 = (canvas.height / 2 - (y - 30 - rect.top)) / (canvas.height / 2);
  return [x1, y1, x2, y2, x3, y3];
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return [x, y];
}

function renderAllShapes() {
  renderer.render(scene); // i will add camera here later.
}

export { setupWebGL };
