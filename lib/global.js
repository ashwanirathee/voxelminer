// global variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let a_Size;
var size_val = 5.0;
let red_val = 0.5;
let green_val = 0.5;
let blue_val = 0.5;
let segment_count_val = 10;
let u_FragColor;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_lightStatus;
let u_lightPos;
let u_LightColor;
let u_light2Pos;
let u_light2Status;
let u_GlobalRotateMatrix;
var u_Sampler0;
var u_Sampler1;
var u_Sampler2;
let a_CameraPos;

var texture0 = null;
var texture1 =null;
var texture2=null;
var u_whichTexture;
var texture;
var image; // TEXTIRE image
  // draw every shape that's supposed to be on the canvas
var g_eye;
var g_at;
var g_up;

var ntex = 16.0;


let g_lightpos  = [2,1,2]
let g_light2pos  = [-12,1.5,13]

const normalController = document.getElementById("normalController");
let normalControllerState  = false;

let lightR = 0.0;
let lightG = 0.0;
let lightB = 0.0;
const spotlightController = document.getElementById("spotlightController");
const lightController = document.getElementById("lightController");
const lightAnimationController = document.getElementById("lightAnimationController");
const lightX = document.getElementById("lightX");
const lightY = document.getElementById("lightY");
const lightZ = document.getElementById("lightZ");
const lightXc = document.getElementById("lightXc");
const lightYc = document.getElementById("lightYc");
const lightZc = document.getElementById("lightZc");

// camera related global vars
var camera;
let g_aspectRatio;
const cameraFOVc = document.getElementById("cameraFOVc");
let g_cameraFOV = 45.0;

const cameraNEARc = document.getElementById("cameraNEARc");
let g_cameraNEAR = 0.001;

const cameraFARc = document.getElementById("cameraFARc");
let g_cameraFAR = 100;

// let u_lightPos;
const shape_size = document.getElementById("shape_size");
const size_change = document.getElementById("shape_size");
const clear_canvas_button = document.getElementById("clear_canvas");
const red_update = document.getElementById("red_val");
const green_update = document.getElementById("green_val");
const blue_update = document.getElementById("blue_val");

const square_choice = document.getElementById("square_choice");
const triangle_choice = document.getElementById("triangles_choice");
const circle_choice = document.getElementById("circles_choice");
const dinosaur_choice = document.getElementById("dinosaur");
const segment_count = document.getElementById("circle_segment_count");
var shape = 0;
const setup_game_button = document.getElementById('setup_game')
let scene;
let renderer;
var vertexBuffer;

let g_globalAngleX = 0;
let g_globalAngleY = 0;

function updateValue(id, key, outputId) {
  let value = document.getElementById(id).value;
  angles[key] = parseInt(value);
  document.getElementById(outputId).textContent = value;
}


var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function isPowerOf2(value) {
  return (value & (value - 1)) === 0 && value > 0;
}

function initTextures() {
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ sendTextureToTEXTURE0(image); };
  // Tell the browser to load an image
  image.src = './lib/uvCoords.png';

  var image1 = new Image();  // Create the image object
  if (!image1) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image1.onload = function(){ sendTextureToTEXTURE1(image1); };
  // Tell the browser to load an image
  image1.src = './lib/dice.png';

  var image2 = new Image();  // Create the image object
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image2.onload = function(){ sendTextureToTEXTURE2(image2); };
  // Tell the browser to load an image
  image2.src = './lib/texture.png';

  // add more textures
  return true;
}

function sendTextureToTEXTURE0(image) {
  texture0 = gl.createTexture();   // Create a texture object
  if (!texture0) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
  
}

function sendTextureToTEXTURE1(image) {
  texture1 = gl.createTexture();   // Create a texture object
  if (!texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, 0);;
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
}


function sendTextureToTEXTURE2(image) {
  texture2 = gl.createTexture(); // Create a texture object
  if (!texture2) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-axis
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture2);

  // Set the texture image first
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Function to check if a value is a power of two
  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    // If texture is power-of-two, enable mipmaps
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    // If texture is NOT power-of-two, use LINEAR filtering (NO mipmaps allowed)
    console.warn("Texture is NPOT, disabling mipmaps.");
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.uniform1i(u_Sampler2, 2);
}

var lightStatus = true;
var light2Status = true;


function addEventListeners(){

  canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
  });

  canvas.onmousemove = handleMouseMove;
  // canvas.onmouseleave = handleMouseLeave;
  // canvas.onmousedown = handleMouseDown;
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault(); // Disable right-click menu
    // console.log("Right-click menu disabled on canvas!");
  });

  normalController.addEventListener("click", () => {
    normalControllerState = !normalControllerState;
    renderer.buildCubeInstances();
    normalController.textContent = 'Turn ' + (normalControllerState ? 'Off' : 'On');
  });

  spotlightController.addEventListener("click", () => {
    light2Status = !light2Status;
    spotlightController.textContent = 'Turn ' + (light2Status ? 'Off' : 'On');
  });

  lightController.addEventListener("click", () => {
    lightStatus = !lightStatus;
    if(lightStatus == false){
      animate_light = false;
      lightAnimationController.textContent = 'Turn ' + (animate_light ? 'Off' : 'On');
    }
    lightController.textContent = 'Turn ' + (lightStatus ? 'Off' : 'On');
  });

  lightAnimationController.addEventListener("click", () => {
    animate_light = !animate_light;
    lightAnimationController.textContent = 'Turn ' + (animate_light ? 'Off' : 'On');
  });

  lightX.addEventListener("input", () => {
    g_lightpos[0] = parseFloat(lightX.value);
  });

  lightY.addEventListener("input", () => {
    g_lightpos[1] = parseFloat(lightY.value);
  });

  lightZ.addEventListener("input", () => {
    g_lightpos[2] = parseFloat(lightZ.value);
  });

  lightXc.addEventListener("input", () => {
    lightR = parseFloat(lightXc.value);
  });

  lightYc.addEventListener("input", () => {
    lightG = parseFloat(lightYc.value);
  });

  lightZc.addEventListener("input", () => {
    lightB = parseFloat(lightZc.value);
  });

  // camera related
  cameraFOVc.addEventListener("input", () => {
    g_cameraFOV = parseFloat(cameraFOVc.value);
    camera.changeFov(g_cameraFOV);
  });

  cameraNEARc.addEventListener("input", () => {
    g_cameraNEAR = parseFloat(cameraNEARc.value);
    camera.changeNEAR(g_cameraNEAR);
  });

  cameraFARc.addEventListener("input", () => {
    g_cameraFAR = parseFloat(cameraFARc.value);
    camera.changeFAR(g_cameraFAR);
  });



  document.addEventListener('keydown', function(event) {
    switch(event.key) {
      case 'w':
        // console.log("W")
        camera.moveForward()
        break;
      case 'a':
        // console.log("A")
        camera.moveLeft()
        break;
      case 's':
        // console.log("S")
       camera.moveBackward()
        break;
      case 'd':
        // console.log("D")
        camera.moveRight() 
        break;
      case 'q':
        camera.panLeft()
        break;
      case 'e':
        camera.panRight();
        break;
      default:
        // Handle other keys if needed
        break;
    }})  
}

function toggleOverlay() {
  const overlay = document.querySelector('.overlay');
  overlay.classList.toggle('hidden');
}


let animate_light = true;

function tick() {
  g_seconds = performance.now() / 1000 - g_startTime;
  renderAllShapes(); // this is same as renderScene();
  requestAnimationFrame(tick);

  if(animate_light){
    g_lightpos[0] = -14  + Math.sin(g_seconds);
    g_lightpos[2] = 10 * Math.cos(g_seconds);
    g_lightpos[1] = 10;
  }

}




function init() {
  // scene graph which holds all the shapes
  scene = new SceneGraph();

  // render which has the function that actually renders everything
  renderer = new WebGLRenderer();
}

function main() {
  // setup webgl in general
  setupWebGL();

  // connects the variables and setup the GLSL shader
  connectVariablesToGLSL();

  // setup the scene graph and the renderer
  init();
  initTextures();
  addEventListeners();

  g_eye = [0, 0, 30];
  g_at = [0, 0, -1];
  g_up = [0, 1, 0];
  g_aspectRatio = canvas.width / canvas.height;
  camera = new Camera(g_eye, g_at, g_up, g_cameraFOV, g_aspectRatio, g_cameraNEAR, g_cameraFAR);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

