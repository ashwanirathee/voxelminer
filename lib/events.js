export function addEventListeners(canvas, gl, camera, u_ViewMatrix, normalControllerState) {
    canvas.addEventListener("click", async () => {
      await canvas.requestPointerLock();
    });
  
    canvas.onmousemove = (event) => handleMouseMove(event, gl, camera, u_ViewMatrix);

    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // Disable right-click menu
    });
  
    normalController.addEventListener("click", () => {
      normalControllerState = !normalControllerState;
      renderer.buildCubeInstances();
      normalController.textContent = "Turn " + (normalControllerState ? "Off" : "On");
    });
  
    spotlightController.addEventListener("click", () => {
      light2Status = !light2Status;
      spotlightController.textContent = "Turn " + (light2Status ? "Off" : "On");
    });
  
  
    document.querySelector(".toggle-button").addEventListener("click", () => {
      toggleOverlay();
    });
  
    lightController.addEventListener("click", () => {
      lightStatus = !lightStatus;
      if (lightStatus == false) {
        animate_light = false;
        lightAnimationController.textContent = "Turn " + (animate_light ? "Off" : "On");
      }
      lightController.textContent = "Turn " + (lightStatus ? "Off" : "On");
    });
  
    lightAnimationController.addEventListener("click", () => {
      animate_light = !animate_light;
      lightAnimationController.textContent = "Turn " + (animate_light ? "Off" : "On");
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