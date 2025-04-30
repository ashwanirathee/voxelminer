import * as VoxelMiner from "../../lib/index.js";
import { canvas, gl } from "./game.js";

const debugkey = "camera_manager";

VoxelMiner.debugLog(debugkey, "Loading camera_manager...");

/**
 * Manages the camera for the game scene.
 */
export class CameraManager {
  constructor(scene) {
    this.camera = new VoxelMiner.Camera(1, 0.05, [5, 3, 5], [-0.01, 3, -0.01], [0, 1, 0], 60.0, canvas.width / canvas.height, 0.001, 100, gl, scene);
    this.camera.init();
  }
}
