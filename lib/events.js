import { toggleOverlay } from "./utils.js";
import { renderer, camera } from "./global.js";
import { debugLog, pickBlock } from "./utils.js";

const debugkey = "events";

debugLog(debugkey, "Loading events.js");

/**
 * Adds event listeners to the canvas and other elements.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {Camera} camera - The camera object.
 * @param {WebGLUniformLocation} u_ViewMatrix - The uniform location for the view matrix.
 * @param {WebGLUniformLocation} u_ProjectionMatrix - The uniform location for the projection matrix.
 */
export function addEventListeners(canvas, gl, camera, u_ViewMatrix, u_ProjectionMatrix) {
  debugLog(debugkey, "Adding event listeners");
  canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
  });

  canvas.onmousemove = (event) => handleMouseMove(event, gl, camera, u_ViewMatrix);
  canvas.onmousedown = handleMouseDown;

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault(); // Disable right-click menu
  });

  normalController.addEventListener("click", () => {
    renderer.normalControllerState = !renderer.normalControllerState;
    renderer.buildCubeInstances();
    renderer.normalController.textContent = "Turn " + (renderer.normalControllerState ? "Off" : "On");
  });

  spotlightController.addEventListener("click", () => {
    renderer.light2Status = !renderer.light2Status;
    spotlightController.textContent = "Turn " + (renderer.light2Status ? "Off" : "On");
  });

  document.querySelector(".toggle-button").addEventListener("click", () => {
    toggleOverlay();
  });

  lightController.addEventListener("click", () => {
    renderer.lightStatus = !renderer.lightStatus;
    if (renderer.lightStatus == false) {
      renderer.animate_light = false;
      lightAnimationController.textContent = "Turn " + (animate_light ? "Off" : "On");
    }
    lightController.textContent = "Turn " + (renderer.lightStatus ? "Off" : "On");
  });

  lightAnimationController.addEventListener("click", () => {
    renderer.animate_light = !renderer.animate_light;
    lightAnimationController.textContent = "Turn " + (renderer.animate_light ? "Off" : "On");
  });

  lightX.addEventListener("input", () => {
    renderer.g_lightpos[0] = parseFloat(lightX.value);
  });

  lightY.addEventListener("input", () => {
    renderer.g_lightpos[1] = parseFloat(lightY.value);
  });

  lightZ.addEventListener("input", () => {
    renderer.g_lightpos[2] = parseFloat(lightZ.value);
  });

  lightXc.addEventListener("input", () => {
    renderer.lightR = parseFloat(lightXc.value);
  });

  lightYc.addEventListener("input", () => {
    renderer.lightG = parseFloat(lightYc.value);
  });

  lightZc.addEventListener("input", () => {
    renderer.lightB = parseFloat(lightZc.value);
  });

  // camera related
  cameraFOVc.addEventListener("input", () => {
    camera.changeFov(parseFloat(cameraFOVc.value), gl, u_ProjectionMatrix);
  });

  cameraNEARc.addEventListener("input", () => {
    camera.changeNEAR(parseFloat(cameraNEARc.value), gl, u_ProjectionMatrix);
  });

  cameraFARc.addEventListener("input", () => {
    camera.changeFAR(parseFloat(cameraFARc.value), gl, u_ProjectionMatrix);
  });

  cameraSpeedc.addEventListener("input", () => {
    camera.changeSpeed(parseFloat(cameraSpeedc.value));
  });

  cameraAlphac.addEventListener("input", () => {
    camera.changeAlpha(parseFloat(cameraAlphac.value));
  });

  debugLog(debugkey, "Adding keyboard event listeners");
  document.addEventListener("keydown", function (event) {
    debugLog(debugkey, "Pressed:", event.key);
    switch (event.key) {
      case "w":
        camera.moveForward(gl, u_ViewMatrix);
        break;
      case "a":
        camera.moveLeft(gl, u_ViewMatrix);
        break;
      case "s":
        camera.moveBackward(gl, u_ViewMatrix);
        break;
      case "d":
        camera.moveRight(gl, u_ViewMatrix);
        break;
      case "q":
        camera.panLeft(gl, u_ViewMatrix);
        break;
      case "e":
        camera.panRight(gl, u_ViewMatrix);
        break;
      case "r":
        camera.moveUp(gl, u_ViewMatrix);
        break;
      case "f":
        camera.moveDown(gl, u_ViewMatrix);
        break;
      case "t":
        camera.changeSpeed(camera.speed + 0.1);
        break;
      case "g":
        camera.changeSpeed(camera.speed - 0.1);
        break;
      case "y":
        camera.changeAlpha(camera.alpha + 0.1);
        break;
      case "h":
        camera.changeAlpha(camera.alpha - 0.1);
        break;
      default:
        // Handle other keys if needed
        break;
    }
  });
}

/**
 * Handles the mouse move event.
 * @param {MouseEvent} event - The mouse move event object.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {Camera} camera - The camera object.
 * @param {WebGLUniformLocation} u_ViewMatrix - The uniform location for the view matrix.
 */
function handleMouseMove(event, gl, camera, u_ViewMatrix) {
  // const currentMousePosition = [event.clientX, event.clientY];
  const currentMousePosition = [event.movementX, event.movementY];
  // console.log("Mouse move event:",currentMousePosition);
  if (currentMousePosition[0] > 0) {
    camera.panLeft(gl, u_ViewMatrix);
  } else {
    camera.panRight(gl, u_ViewMatrix);
  }
}

/**
 * Handles the mouse down event.
 * @param {MouseEvent} event - The mouse event object.
 */
function handleMouseDown(event) {
  if (event.button === 0) {
    var res = pickBlock(camera, renderer, 1);
    if (res.gridX != null) {
      renderer.g_map[res.gridX][res.gridY] = 0;
    }
  } else if (event.button === 2) {
    var res = pickBlock(camera, renderer, 1);
    if (res.gridX != null) {
      if (renderer.g_map[res.gridX][res.gridY] == 0) {
        renderer.g_map[res.gridX][res.gridY] = 1;
      }
    }
  }
  renderer.buildCubeInstances();
}
