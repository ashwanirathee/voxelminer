function clearCanvas() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Specify the color for clearing <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>
  scene.shapesList = [];
  renderAllShapes();
}

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl_canvas");
  // ctx = canvas.getContext("2d");
  // console.log("Trying to get rendering context")
  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }
  // console.log(gl);
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
  //Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to intialize shaders.");
    return;
  }
  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position");
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, "a_UV");
  if (a_UV < 0) {
    console.log("Failed to get the storage location of a_UV");
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, "a_Normal");
  if (a_Normal < 0) {
    console.log("Failed to get the storage location of a_Normal");
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, "u_lightPos");
  if (!u_lightPos) {
    console.log("Failed to get the storage location of u_lightPos");
    return;
  }


  u_light2Pos = gl.getUniformLocation(gl.program, "u_light2Pos");
  if (!u_light2Pos) {
    console.log("Failed to get the storage location of u_light2Pos");
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, "u_NormalMatrix");
  if (!u_NormalMatrix) {
    console.log("Failed to get the storage location of u_NormalMatrix");
    return;
  }

  u_lightStatus = gl.getUniformLocation(gl.program, "u_lightStatus");
  if (!u_lightStatus) {
    console.log("Failed to get the storage location of u_lightStatus");
    return;
  }
  u_light2Status = gl.getUniformLocation(gl.program, "u_light2Status");
  if (!u_light2Status) {
    console.log("Failed to get the storage location of u_light2Status");
    return;
  }
  
  u_LightColor = gl.getUniformLocation(gl.program, "u_LightColor");
  if (!u_LightColor) {
    console.log("Failed to get the storage location of u_LightColor");
    return;
  }

  a_CameraPos = gl.getUniformLocation(gl.program, "a_CameraPos");
  if (!a_CameraPos) {
    console.log("Failed to get the storage location of a_CameraPos");
    return;
  }
  // // // Get the storage location of a_Position
  // a_Size = gl.getUniformLocation(gl.program, "a_Size");
  // if (a_Size < 0) {
  //   console.log("Failed to get the storage location of a_Size");
  //   return;
  // }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_FragColor");
    return;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");
  if (!u_FragColor) {
    console.log("Failed to get the storage location of u_whichTexture");
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get the storage location of u_ModelMatrix");
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
  if (!u_GlobalRotateMatrix) {
    console.log("Failed to get the storage location of u_GlobalRotateMatrix");
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
  if (!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
  if (!u_Sampler0) {
    console.log("Failed to get the storage location of u_Sampler0");
    return false;
  }

  // Get the storage location of u_Sampler
  u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
  if (!u_Sampler1) {
    console.log("Failed to get the storage location of u_Sampler1");
    return false;
  }

  // Get the storage location of u_Sampler
  u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
  if (!u_Sampler2) {
    console.log("Failed to get the storage location of u_Sampler2");
    return false;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

function handleSizeChangeEvent() {
  size_val = shape_size.value;
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
  console.log(x)

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
    camera.panLeft()
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

var lastMousePosition = [0,0];
var mouseDelta = [0,0];
function handleMouseMove(event) {
  // const currentMousePosition = [event.clientX, event.clientY];
  const currentMousePosition = [event.movementX, event.movementY];
  // console.log("Mouse move event:",currentMousePosition);
  if(currentMousePosition[0] > 0){
    camera.panLeft();
  } else {
    camera.panRight();
  }
}

function handleMouseLeave(event){
  lastMousePosition = [0,0];
}

function handleMouseDown(event){
  if (event.button === 0) {
    console.log("Left click on canvas!");
    // we destroy!
    // let cam
    // console.log(camera.eye, camera.at);
    var res = pickBlock(camera, renderer, 1);
    // console.log("Res:",res);
    if(res.gridX!=null){
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
    if(res.gridX!=null){
      if(renderer.g_map[res.gridX][res.gridY] == 0){
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
