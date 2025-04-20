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
var asp_ratio;
var field_angle;
var ntex = 16.0;
var camera;

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
