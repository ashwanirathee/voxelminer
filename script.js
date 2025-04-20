
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
