import { toggleOverlay } from "./utils.js";
import { renderer, camera } from "./global.js";

export function addEventListeners(canvas, gl, camera, u_ViewMatrix, u_ProjectionMatrix) {
  canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
  });

  canvas.onmousemove = (event) => handleMouseMove(event, gl, camera, u_ViewMatrix);

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

  document.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "w":
        // console.log("W")
        camera.moveForward(gl, u_ViewMatrix);
        break;
      case "a":
        // console.log("A")
        camera.moveLeft(gl, u_ViewMatrix);
        break;
      case "s":
        // console.log("S")
        camera.moveBackward(gl, u_ViewMatrix);
        break;
      case "d":
        // console.log("D")
        camera.moveRight(gl, u_ViewMatrix);
        break;
      case "q":
        camera.panLeft(gl, u_ViewMatrix);
        break;
      case "e":
        camera.panRight(gl, u_ViewMatrix);
        break;
      default:
        // Handle other keys if needed
        break;
    }
  });
}

var lastMousePosition = [0, 0];
var mouseDelta = [0, 0];
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

function handleMouseLeave(event) {
  lastMousePosition = [0, 0];
}
