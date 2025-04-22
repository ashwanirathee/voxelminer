import { toggleOverlay } from "./utils.js";
import { gl, canvas, renderer, camera, scene, shaderVars } from "./global.js";
import { debugLog, pickBlock, resizeCanvas } from "./utils.js";

const debugkey = "events";

debugLog(debugkey, "Loading events.js");

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
const cameraSpeedc = document.getElementById("cameraSpeedc");
const cameraAlphac = document.getElementById("cameraAlphac");
const cameraFOVcValue = document.getElementById("cameraFOVcValue");
const cameraNEARcValue = document.getElementById("cameraNEARcValue");
const cameraFARcValue = document.getElementById("cameraFARcValue");
const cameraSpeedcValue = document.getElementById("cameraSpeedcValue");
const cameraAlphacValue = document.getElementById("cameraAlphacValue");

/**
 * Adds event listeners to the canvas and other elements.
 */
export function addEventListeners() {
  debugLog(debugkey, "Adding event listeners");

  window.addEventListener('resize', resizeCanvas);

  canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', () => {
    const isLocked = document.pointerLockElement === canvas;
    console.log("Pointer lock: ", isLocked ? "active" : "inactive");
  });

  canvas.onmousemove = handleMouseMove;
  canvas.onmousedown = handleMouseDown;

  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault(); // Disable right-click menu
  });

  normalController.addEventListener("click", () => {
    scene.normalControllerState = !scene.normalControllerState;
    scene.buildCubeInstances();
    normalController.textContent = "Turn " + (scene.normalControllerState ? "Off" : "On");
  });

  spotlightController.addEventListener("click", () => {
    scene.light2Status = !scene.light2Status;
    spotlightController.textContent = "Turn " + (scene.light2Status ? "Off" : "On");
  });

  document.querySelector(".toggle-button").addEventListener("click", () => {
    toggleOverlay();
  });

  lightController.addEventListener("click", () => {
    scene.lightStatus = !scene.lightStatus;
    if (scene.lightStatus == false) {
      scene.animate_light = false;
      lightAnimationController.textContent = "Turn " + (scene.animate_light ? "Off" : "On");
    }
    lightController.textContent = "Turn " + (scene.lightStatus ? "Off" : "On");
  });

  lightAnimationController.addEventListener("click", () => {
    scene.animate_light = !scene.animate_light;
    lightAnimationController.textContent = "Turn " + (scene.animate_light ? "Off" : "On");
  });

  lightX.addEventListener("input", () => {
    scene.g_lightpos[0] = parseFloat(lightX.value);
  });

  lightY.addEventListener("input", () => {
    scene.g_lightpos[1] = parseFloat(lightY.value);
  });

  lightZ.addEventListener("input", () => {
    scene.g_lightpos[2] = parseFloat(lightZ.value);
  });

  lightXc.addEventListener("input", () => {
    scene.lightR = parseFloat(lightXc.value);
  });

  lightYc.addEventListener("input", () => {
    scene.lightG = parseFloat(lightYc.value);
  });

  lightZc.addEventListener("input", () => {
    scene.lightB = parseFloat(lightZc.value);
  });

  // camera related
  cameraFOVc.addEventListener("input", () => {
    camera.changeFov(parseFloat(cameraFOVc.value));
  });

  cameraNEARc.addEventListener("input", () => {
    camera.changeNEAR(parseFloat(cameraNEARc.value));
  });

  cameraFARc.addEventListener("input", () => {
    camera.changeFAR(parseFloat(cameraFARc.value));
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
    if (document.pointerLockElement !== canvas) return;

    switch (event.key) {
      case "w":
        camera.moveForward();
        break;
      case "a":
        camera.moveLeft();
        break;
      case "s":
        camera.moveBackward();
        break;
      case "d":
        camera.moveRight();
        break;
      case "q":
        camera.panLeft();
        break;
      case "e":
        camera.panRight();
        break;
      case "r":
        camera.moveUp();
        break;
      case "f":
        camera.moveDown();
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
 * @param {MouseEvent} event - The mouse move event.
 */
function handleMouseMove(event) {
  if (document.pointerLockElement !== canvas) return;

  const currentMousePosition = [event.movementX, event.movementY];
  if (currentMousePosition[0] > 0) {
    camera.panLeft();
  } else {
    camera.panRight();
  }
}

/**
 * Handles the mouse down event involving add and break blocks
 * @param {MouseEvent} event - The mouse event object.
 */
function handleMouseDown(event) {
  if (event.button === 0) {
    var res = pickBlock(camera, scene, 1);
    if (!Number.isNaN(res.gridX)) {
      scene.g_map[res.gridX][res.gridY] = 0;
    }
  } else if (event.button === 2) {
    var res = pickBlock(camera, scene, 1);
    if (!Number.isNaN(res.gridX)) {
      if (scene.g_map[res.gridX][res.gridY] == 0) {
        scene.g_map[res.gridX][res.gridY] = 1;
      }
    }
  }
  scene.buildCubeInstances();
}
