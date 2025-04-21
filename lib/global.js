// import {canvas, gl, a_Position, a_UV, a_Normal, a_Size} from './global2.js';
import { setupWebGL } from "./custom-utils.js";
import { WebGLRenderer } from "./renderer.js";
import { VSHADER_SOURCE, FSHADER_SOURCE } from './shaders.js';
import { toggleOverlay } from "./utils.js";
import { SceneGraph } from "./scene.js";
import { Camera } from "./camera.js";
import { initTextures } from "./texture.js";
import { addEventListeners } from "./events.js";

export let canvas;
export let gl;

export const renderer = new WebGLRenderer();;
export const scene = new SceneGraph();

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


var u_whichTexture;
var texture;
var image; // TEXTIRE image
// draw every shape that's supposed to be on the canvas
var g_eye;
var g_at;
var g_up;

var ntex = 16.0;

let g_lightpos = [2, 1, 2];
let g_light2pos = [-12, 1.5, 13];

let normalControllerState = false;

let lightR = 0.0;
let lightG = 0.0;
let lightB = 0.0;
let animate_light = true;


// camera related global vars
var camera;
let g_aspectRatio;
let g_cameraFOV = 45.0;
let g_cameraNEAR = 0.001;
let g_cameraFAR = 100;

var shape = 0;
var vertexBuffer;

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

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

var lightStatus = true;
var light2Status = true;

function tick() {
  g_seconds = performance.now() / 1000 - g_startTime;
  // renderAllShapes(); // this is same as renderScene();
  renderer.render(
    scene,
    gl,
    u_GlobalRotateMatrix,
    u_lightStatus,
    u_light2Status,
    u_FragColor,
    u_lightPos,
    u_light2Pos,
    u_LightColor,
    a_CameraPos,
    lightStatus,
    g_lightpos,
    light2Status,
    g_light2pos,
    camera,
    lightR,
    lightG,
    lightB,
    g_seconds,
    ntex,
    normalControllerState,
    u_whichTexture,
    u_ModelMatrix,
    u_NormalMatrix,
    a_Position,
    a_UV,
    a_Normal,
    normalControllerState, 
    camera
  );
  requestAnimationFrame(tick);

  if (animate_light) {
    g_lightpos[0] = -14 + Math.sin(g_seconds);
    g_lightpos[2] = 10 * Math.cos(g_seconds);
    g_lightpos[1] = 10;
  }
}

function main() {
  // // setup webgl in general
  ({ canvas, gl } = setupWebGL(canvas, gl));

  // connects the variables and setup the GLSL shader
  connectVariablesToGLSL(gl, VSHADER_SOURCE, FSHADER_SOURCE);

  g_eye = [0, 0, 30];
  g_at = [0, 0, -1];
  g_up = [0, 1, 0];
  g_aspectRatio = canvas.width / canvas.height;
  camera = new Camera(g_eye, g_at, g_up, g_cameraFOV, g_aspectRatio, g_cameraNEAR, g_cameraFAR, gl, u_ViewMatrix, u_ProjectionMatrix);

  initTextures(gl, u_Sampler0, u_Sampler1, u_Sampler2);
  addEventListeners(canvas, gl, camera, u_ViewMatrix, normalControllerState);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

export { main };

