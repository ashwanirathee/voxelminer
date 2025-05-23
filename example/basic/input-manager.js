import * as VoxelMiner from "../../lib/index.js";
import { canvas, gl, gui, obj } from "./game.js";

const debugkey = "input_manager";

VoxelMiner.debugLog(debugkey, "Loading input_manager...");

/**
 * Class representing an Input Manager.
 */
export class InputManager {
  constructor(sceneManager, cameraManager) {
    this.scene = sceneManager.scene;
    this.camera = cameraManager.camera;
    this.addEventListeners(sceneManager, cameraManager);
  }

  /**
   * Adds event listeners for the input manager.
   */
  addEventListeners(sceneManager, cameraManager) {
    VoxelMiner.debugLog(debugkey, "Adding event listeners");

    const scene = this.scene;
    const camera = this.camera;

    window.addEventListener("resize", () => {
      obj.camera_aspect = VoxelMiner.resizeCanvas(
        camera,
        scene,
        canvas,
        gl
      ).toFixed(2);
    });

    canvas.addEventListener("click", async () => {
      await canvas.requestPointerLock();
    });

    document.addEventListener("pointerlockchange", () => {
      const isLocked = document.pointerLockElement === canvas;
      console.log("Pointer lock: ", isLocked ? "active" : "inactive");
    });

    canvas.onmousemove = (event) => this.handleMouseMove(event);

    canvas.addEventListener('wheel', this.handleWheel.bind(this));

    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // Disable right-click menu
    });

    // nested controllers
    const general_folder = gui.addFolder("General");
    general_folder.add(obj, "frame_rate").listen().disable();
    general_folder.add(obj, "frame_time").listen().disable();
    general_folder.add(obj, "draw_calls").listen().disable();
    general_folder.add(obj, "show_normals").onChange((value) => {
      scene.normalControllerState = value;
    });

    // nested controllers
    const light_folder = gui.addFolder("Light");
    light_folder.add(obj, "animate_light").onChange((value) => {
      scene.animate_light = value;
    });

    light_folder.addColor(obj, "light1_color").onChange((value) => {
      scene.pointLights[0].color = value;
    });

    light_folder.add(obj, "ambientLightFactor", 0, 1).onChange((value) => {
      scene.ambientLightFactor = value;
    });

    light_folder.add(obj, "diffuseLightFactor", 0, 1).onChange((value) => {
      scene.diffuseLightFactor = value;
    });

    light_folder.add(obj, "specularLightFactor", 0, 1).onChange((value) => {
      scene.specularLightFactor = value;
    });

    light_folder.add(obj, "specularExponent", 1, 100).onChange((value) => {
      scene.specularExponent = value;
    });

    const cameraTypeOptions = {
      "FPS Camera": VoxelMiner.CameraType.FPS_CAMERA,
      "Arcball Camera": VoxelMiner.CameraType.ARCBALL_CAMERA
    };

    const camera_folder = gui.addFolder("Camera");

    camera_folder
      .add(obj, "camera_type", cameraTypeOptions)
      .name("Camera Type")
      .onChange((selectedType) => {
        camera.changeCameraType(selectedType);
      });

    camera_folder.add(obj, "camera_fov", 15, 135).onChange((value) => {
      camera.changeFov(value);
    });

    camera_folder.add(obj, "camera_near", 0.1, 10.0).onChange((value) => {
      camera.changeNEAR(value);
    });

    camera_folder.add(obj, "camera_far", 11, 200).onChange((value) => {
      camera.changeFAR(value);
    });

    camera_folder.add(obj, "camera_speed", 0.1, 2).onChange((value) => {
      camera.changeSpeed(value);
    });

    camera_folder.add(obj, "camera_sensitivity", 0.01, 2.0).onChange((value) => {
      camera.changeSensitivity(value);
    });

    camera_folder.add(obj, "camera_aspect").listen().disable();

    camera_folder.add(obj, "fallOffStart", 0.1, 1.0).onChange((value) => {
      scene.fallOffStart = value;
    });

    camera_folder.add(obj, "fallOffEnd", 0.1, 1.0).onChange((value) => {
      scene.fallOffEnd = value;
    });

    camera_folder.add(obj, "fallOffStepExponent", 0.1, 10).onChange((value) => {
      scene.fallOffStepExponent = value;
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

    gui.add(obj, "help"); // button
  }

  /**
   * Handles the mouse move event.
   *
   * @param {MouseEvent} event - The mouse move event.
   */
  handleMouseMove(event) {
    if (document.pointerLockElement !== canvas) return;

    const currentMousePosition = [event.movementX, event.movementY];
    this.camera.panCamera(currentMousePosition[0], currentMousePosition[1]);
  }

  /**
 * Handles mouse wheel (scroll) event to move camera forward/backward.
 *
 * @param {WheelEvent} event - The wheel event.
 */
  handleWheel(event) {
    if (document.pointerLockElement !== canvas) return;

    if (event.deltaY < 0) {
      if (this.camera.type === VoxelMiner.CameraType.FPS_CAMERA)
        this.camera.moveForward(-event.deltaY);
      else this.camera.changeOrbitRadiusByOffset(event.deltaY);
    }

    else {
      if (this.camera.type === VoxelMiner.CameraType.FPS_CAMERA)
        this.camera.moveBackward(event.deltaY);
      else this.camera.changeOrbitRadiusByOffset(event.deltaY);
    }

    event.preventDefault();
  }

  /**
   * Toggles the visibility of the overlay element.
   */
  toggleOverlay() {
    const overlay = document.querySelector(".overlay");
    overlay.classList.toggle("hidden");
  }
}
