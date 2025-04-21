// import {canvas, gl, a_Position, a_UV, a_Normal, a_Size} from './global2.js';
import { setupWebGL } from "./custom-utils.js";
import { WebGLRenderer } from "./renderer.js";
import { VSHADER_SOURCE, FSHADER_SOURCE } from "./shaders.js";

import { SceneGraph } from "./scene.js";
import { Camera } from "./camera.js";
import { initTextures } from "./texture.js";
import { addEventListeners } from "./events.js";
import { initShaders, createProgram } from "./cuon-utils.js";
import { Vector3, Matrix4 } from "./cuon-matrix-cse160.js";

export const { canvas, gl } = setupWebGL();
export const renderer = new WebGLRenderer();
export const scene = new SceneGraph();
export const camera = new Camera([-14, 0, 14], [-0.01, 0.5, -0.01], [0, 1, 0], 45.0, canvas.width / canvas.height, 0.001, 100, gl, canvas);

let a_Position;
let a_UV;
let a_Normal;
let a_Size;
let a_CameraPos;

let u_FragColor;
let u_ModelMatrix;
let u_NormalMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_lightPos;
let u_LightColor;
let u_light2Pos;
let u_GlobalRotateMatrix;
var u_Sampler0;
var u_Sampler1;
var u_Sampler2;
var u_whichTexture;

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

const lightX = document.getElementById("lightX");
const lightY = document.getElementById("lightY");
const lightZ = document.getElementById("lightZ");
const lightXc = document.getElementById("lightXc");
const lightYc = document.getElementById("lightYc");
const lightZc = document.getElementById("lightZc");
const spotlightController = document.getElementById("spotlightController");
const lightController = document.getElementById("lightController");
const lightAnimationController = document.getElementById("lightAnimationController");
const cameraFOVc = document.getElementById("cameraFOVc");
const cameraNEARc = document.getElementById("cameraNEARc");
const cameraFARc = document.getElementById("cameraFARc");
const normalController = document.getElementById("normalController");

/**
 * Connects variables to GLSL shaders.
 * 
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {string} VSHADER_SOURCE - The vertex shader source code.
 * @param {string} FSHADER_SOURCE - The fragment shader source code.
 */
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

  renderer.u_lightStatus = gl.getUniformLocation(gl.program, "u_lightStatus");
  if (!renderer.u_lightStatus) {
    console.log("Failed to get the storage location of u_lightStatus");
    return;
  }

  renderer.u_light2Status = gl.getUniformLocation(gl.program, "u_light2Status");
  if (!renderer.u_light2Status) {
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

function tick() {
  g_seconds = performance.now() / 1000 - g_startTime;
  renderer.render(scene, gl, u_GlobalRotateMatrix, u_FragColor, u_lightPos, u_light2Pos, u_LightColor, a_CameraPos, g_seconds, u_whichTexture, u_ModelMatrix, u_NormalMatrix, a_Position, a_UV, a_Normal, camera);
  requestAnimationFrame(tick);

  if (renderer.animate_light) {
    renderer.g_lightpos[0] = -14 + Math.sin(g_seconds);
    renderer.g_lightpos[2] = 10 * Math.cos(g_seconds);
    renderer.g_lightpos[1] = 10;
  }
}

/**
 * The main function that initializes and starts the graphics rendering.
 */
export function main() {
  // connects the variables and setup the GLSL shader
  connectVariablesToGLSL(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  camera.init(gl, u_ViewMatrix, u_ProjectionMatrix);

  initTextures(gl, u_Sampler0, u_Sampler1, u_Sampler2);
  addEventListeners(canvas, gl, camera, u_ViewMatrix, u_ProjectionMatrix);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}
