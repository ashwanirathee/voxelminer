import { debugLog } from "./utils.js";

const debugkey = "scene";

debugLog(debugkey, "Loading scene.js");

/**
 * Represents a scene graph for managing shapes in a graphics scene.
 */
export class SceneGraph {
  constructor() {
    this.shapesList = [];
  }
}
