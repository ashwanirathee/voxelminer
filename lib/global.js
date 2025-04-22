import { setupWebGL } from "./utils.js";
import { WebGLRenderer } from "./renderer.js";
import { SceneGraph } from "./scene.js";
import { Camera } from "./camera.js";
import { addEventListeners } from "./events.js";
import { debugLog, connectVariablesToGLSL, resizeCanvas } from "./utils.js";
import { VSHADER_SOURCE, FSHADER_SOURCE } from "./shaders.js";

const debugkey = "globalfile";

debugLog(debugkey, "Loading global.js");

export const { canvas, gl } = setupWebGL();
export const renderer = new WebGLRenderer(gl);
export const camera = new Camera(1, 2, [-14, 1.5, 14], [-0.01, 1.5, -0.01], [0, 1, 0], 60.0, canvas.width / canvas.height, 0.001, 100, gl, canvas);
export const scene = new SceneGraph();

// shaderVars.js or in a higher module
export const shaderVars = {
  attribs: {
    a_Position: null,
    a_UV: null,
    a_Normal: null,
    a_Size: null,
    a_CameraPos: null,
  },
  uniforms: {
    u_FragColor: null,
    u_ModelMatrix: null,
    u_NormalMatrix: null,
    u_ViewMatrix: null,
    u_ProjectionMatrix: null,
    u_Sampler0: null,
    u_Sampler1: null,
    u_Sampler2: null,
    u_whichTexture: null,
    u_LightColor: null,
  },
};

/**
 * The main function that initializes and starts the graphics rendering.
 */
export function main() {
  // connects the variables and setup the GLSL shader
  connectVariablesToGLSL(gl, VSHADER_SOURCE, FSHADER_SOURCE);
  camera.init();
  scene.init();
  resizeCanvas();
  addEventListeners();
  requestAnimationFrame(renderer.render.bind(renderer));
}
