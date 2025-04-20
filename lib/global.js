// import {canvas, gl, a_Position, a_UV, a_Normal, a_Size} from './global2.js';
import {setupWebGL} from './custom-utils.js';
import {WebGLRenderer} from './renderer.js';

// import {renderAllShapes} from './renderer.js';
// Vertex shader program
var VSHADER_SOURCE = `
    precision mediump float;

    uniform mat4 u_ModelMatrix;
    uniform mat4 u_NormalMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;

    uniform vec3 a_CameraPos;
    varying vec3 u_CameraPos;

    attribute vec4 a_Position;
    attribute vec2 a_UV;
    attribute vec3 a_Normal;

    varying vec4 v_VertPos;
    varying vec2 v_UV;
    varying vec3 v_Normal;

    void main(){
      gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
      v_UV = a_UV;
      v_Normal = (u_NormalMatrix * vec4(a_Normal,1.0)).xyz;
      v_Normal = a_Normal;
      v_VertPos = u_ModelMatrix * a_Position;
      u_CameraPos = a_CameraPos;
    }
`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;

    uniform int u_lightStatus; // 0 for off, 1 for on
    uniform vec3 u_lightPos;

    uniform int u_light2Status; // 0 for off, 1 for on
    uniform vec3 u_light2Pos;

    varying vec3 u_CameraPos;

    uniform vec4 u_FragColor;  // frag color, default is 0.5,0.5,0.5,1.0 

    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;

    uniform int u_whichTexture;
    varying vec3 v_Normal;
    varying vec4 v_VertPos;
    varying vec2 v_UV;
    uniform vec3 u_LightColor;

    void main() {
      if(u_whichTexture == -6){
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); 
      } else if(u_whichTexture == -5){
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); 
      } else if (u_whichTexture == -4){
        vec3 norm = normalize(v_Normal);
        gl_FragColor = vec4(norm, 1.0);
      } else if(u_whichTexture == -3){
        gl_FragColor = vec4((v_Normal+1.0)/2.0,1.0);
      } else if(u_whichTexture == -2){
        gl_FragColor = u_FragColor;
      } else if(u_whichTexture == -1){
        gl_FragColor = vec4(v_UV,1.0,1.0);
      } else if(u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0, v_UV);
      } else if(u_whichTexture == 1){
        gl_FragColor = texture2D(u_Sampler1, v_UV);
      } else if(u_whichTexture == 2){
        gl_FragColor = texture2D(u_Sampler2, v_UV);
      } else {
        gl_FragColor = vec4(1,.2,.2,1);
      }
      vec3 lightVector = u_lightPos - vec3(v_VertPos);
      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N, L), 0.0);
      vec3 R = reflect(-L, N);
      vec3 E = normalize(u_CameraPos - vec3(v_VertPos));
      float specular = pow(max(dot(E, R), 0.0), 5.0) * 0.8;
    
      vec3 diffuse = u_LightColor * vec3(gl_FragColor) * nDotL * 0.7;
      vec3 ambient = vec3(gl_FragColor) * 0.3;
      vec3 light1Color = (u_lightStatus == 1) ? (diffuse + ambient + specular) : ambient;
    
      // Second light (u_light2Status)
      vec3 lightDir = normalize(u_light2Pos - vec3(v_VertPos));
      vec3 spotDir = vec3(0.5, -1.0, 0.0);
      float theta = dot(lightDir, normalize(-spotDir));
    
      vec3 light2Vector = u_light2Pos - vec3(v_VertPos);
      float cutoffAngle = radians(20.0);
      vec3 L2 = normalize(light2Vector);
      vec3 N2 = normalize(v_Normal);
      float nDotL2 = max(dot(N2, L2), 0.0);
    
      vec3 R2 = reflect(-L2, N2);
      vec3 E2 = normalize(u_CameraPos - vec3(v_VertPos));
      float specular2 = pow(max(dot(E2, R2), 0.0), 5.0) * 0.8;
    
      // Diffuse and ambient components for the second light
      vec3 diffuse2 = u_LightColor * vec3(gl_FragColor) * nDotL2 * 0.7;
      vec3 ambient2 = vec3(gl_FragColor) * 0.3;
    
      // Smooth transition based on theta (light angle)
      float cutoff = cos(cutoffAngle);
      float smoothFactor = smoothstep(cutoff - 0.1, cutoff + 0.1, theta);
    
      vec3 light2Color = (u_light2Status == 1) ? mix(ambient2, diffuse2 + specular2 + ambient2, smoothFactor) : ambient2;
    
      // Final blending of both light sources
      vec3 finalLighting = light1Color + light2Color;
    
      // Apply the final color
      gl_FragColor = vec4(finalLighting, 1.0);

    }
    
`;
export let canvas;
export let gl;
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
export let u_ModelMatrix;
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

function connectVariablesToGLSL(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
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


function addEventListeners(canvas, gl){

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
        camera.moveForward(gl, u_ViewMatrix)
        break;
      case 'a':
        // console.log("A")
        camera.moveLeft(gl, u_ViewMatrix)
        break;
      case 's':
        // console.log("S")
       camera.moveBackward(gl, u_ViewMatrix)
        break;
      case 'd':
        // console.log("D")
        camera.moveRight(gl, u_ViewMatrix) 
        break;
      case 'q':
        camera.panLeft(gl, u_ViewMatrix)
        break;
      case 'e':
        camera.panRight(gl, u_ViewMatrix);
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
  // renderAllShapes(); // this is same as renderScene();
  renderer.render(scene, gl, u_GlobalRotateMatrix, u_lightStatus, u_light2Status, u_FragColor, u_lightPos, u_light2Pos, u_LightColor, a_CameraPos, lightStatus, g_lightpos, light2Status, g_light2pos, camera, lightR, lightG, lightB, g_seconds, ntex, normalControllerState, u_whichTexture, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal, normalControllerState); // i will add camera here later.
  requestAnimationFrame(tick);

  if(animate_light){
    g_lightpos[0] = -14  + Math.sin(g_seconds);
    g_lightpos[2] = 10 * Math.cos(g_seconds);
    g_lightpos[1] = 10;
  }

}


var lastMousePosition = [0,0];
var mouseDelta = [0,0];
function handleMouseMove(event) {
  // const currentMousePosition = [event.clientX, event.clientY];
  const currentMousePosition = [event.movementX, event.movementY];
  // console.log("Mouse move event:",currentMousePosition);
  if(currentMousePosition[0] > 0){
    camera.panLeft(gl, u_ViewMatrix);
  } else {
    camera.panRight(gl, u_ViewMatrix);
  }
}


function handleMouseLeave(event){
  lastMousePosition = [0,0];
}

function init() {
  // scene graph which holds all the shapes
  scene = new SceneGraph();

  // render which has the function that actually renders everything
  renderer = new WebGLRenderer();
}

function main() {
  // // setup webgl in general
  // gl = setupWebGL(canvas, gl);
  ({ canvas, gl } = setupWebGL(canvas, gl));
  
  // connects the variables and setup the GLSL shader
  connectVariablesToGLSL(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  // setup the scene graph and the renderer
  init();
  initTextures();
  addEventListeners(canvas, gl);

  g_eye = [0, 0, 30];
  g_at = [0, 0, -1];
  g_up = [0, 1, 0];
  g_aspectRatio = canvas.width / canvas.height;
  camera = new Camera(g_eye, g_at, g_up, g_cameraFOV, g_aspectRatio, g_cameraNEAR, g_cameraFAR, gl, u_ViewMatrix, u_ProjectionMatrix);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

export {main};