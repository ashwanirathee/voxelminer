import * as VoxelMiner from "./../lib/index.js";
import { CameraManager } from "./camera-manager.js";
import { SceneManager } from "./scene-manager.js";
import { RenderManager } from "./render-manager.js";
import { InputManager } from "./input-manager.js";

export const { canvas, gl } = VoxelMiner.setupWebGL();

/**
 * Represents a game.
 */
export class Game {
  constructor() {
    this.sceneManager = new SceneManager();
    this.cameraManager = new CameraManager(this.sceneManager.scene);
    this.renderManager = new RenderManager(this.sceneManager, this.cameraManager);
    this.inputManager = new InputManager(this.sceneManager, this.cameraManager);
    VoxelMiner.resizeCanvas(this.cameraManager.camera, canvas, gl);
  }

  /**
   * Initializes the game.
   */
  init() {
    requestAnimationFrame(this.renderManager.render.bind(this.renderManager));
  }
}
