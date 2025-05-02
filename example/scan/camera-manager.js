import * as VoxelMiner from "../../lib/index.js";
import { canvas, gl, obj } from "./game.js";

const debugkey = "camera_manager";

VoxelMiner.debugLog(debugkey, "Loading camera_manager...");

/**
 * Manages the camera for the game scene.
 */
export class CameraManager {
  constructor(scene) {
    this.camera = new VoxelMiner.Camera(obj.camera_speed, obj.camera_sensitivity, obj.camera_eye, obj.camera_at, obj.camera_up, obj.camera_fov, obj.camera_aspect, obj.camera_near, obj.camera_far, gl, scene);
    this.camera.init();
    this.camera.changeAt(0, 1, 0);
  }
}
