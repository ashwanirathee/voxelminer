import * as VoxelMiner from "./../lib/index.js";
import { canvas, gl } from "./game.js";

const debugkey = "input_manager";

VoxelMiner.debugLog(debugkey, "Loading input_manager...");

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
 * Class representing an Input Manager.
 */
export class InputManager {
  constructor(sceneManager, cameraManager) {
    this.scene = sceneManager.scene;
    this.camera = cameraManager.camera;
    this.addEventListeners();
  }

  /**
   * Adds event listeners for the input manager.
   */
  addEventListeners() {
    VoxelMiner.debugLog(debugkey, "Adding event listeners");

    const scene = this.scene;
    const camera = this.camera;

    window.addEventListener("resize", () => {
      VoxelMiner.resizeCanvas(camera, canvas, gl);
    });

    canvas.addEventListener("click", async () => {
      await canvas.requestPointerLock();
    });

    document.addEventListener("pointerlockchange", () => {
      const isLocked = document.pointerLockElement === canvas;
      console.log("Pointer lock: ", isLocked ? "active" : "inactive");
    });

    canvas.onmousemove = (event) => this.handleMouseMove(event);

    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // Disable right-click menu
    });

    normalController.addEventListener("click", () => {
      scene.normalControllerState = !scene.normalControllerState;
      normalController.textContent = "Turn " + (scene.normalControllerState ? "Off" : "On");
    });

    document.querySelector(".toggle-button").addEventListener("click", () => {
      this.toggleOverlay();
    });

    lightAnimationController.addEventListener("click", () => {
      scene.animate_light = !scene.animate_light;
      lightAnimationController.textContent = "Turn " + (scene.animate_light ? "Off" : "On");
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

    VoxelMiner.debugLog(debugkey, "Adding keyboard event listeners");
    document.addEventListener("keydown", function (event) {
      VoxelMiner.debugLog(debugkey, "Pressed:", event.key);
      if (document.pointerLockElement !== canvas) return;
      switch (event.key.toLowerCase()) {
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
   *
   * @param {MouseEvent} event - The mouse move event.
   */
  handleMouseMove(event) {
    if (document.pointerLockElement !== canvas) return;

    const currentMousePosition = [event.movementX, event.movementY];
    if (currentMousePosition[0] > 0) {
      this.camera.panLeft();
    } else {
      this.camera.panRight();
    }
  }

  /**
   * Toggles the visibility of the overlay element.
   */
  toggleOverlay() {
    const overlay = document.querySelector(".overlay");
    overlay.classList.toggle("hidden");
  }
}
