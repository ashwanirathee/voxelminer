import { renderer } from "./global.js";
import { Vector3, Matrix4 } from "./third-party/cuon-matrix-cse160.js";
import { debugLog } from "./utils.js";
import { scene } from "./global.js";
import { shaderVars, gl, camera } from "./global.js";

const debugkey = "camera";

debugLog(debugkey, "Loading camera.js");

/**
 * Represents a camera in a 3D graphics application.
 * @class
 */
export class Camera {
  /**
   * Represents a camera in a 3D graphics application.
   * @param {Vector3} g_eye - The position of the camera.
   * @param {Vector3} g_at - The point the camera is looking at.
   * @param {Vector3} g_up - The up direction of the camera.
   * @param {number} field_angle - The field of view angle in degrees.
   * @param {number} asp_ratio - The aspect ratio of the camera.
   * @param {number} near_plane - The distance to the near clipping plane.
   * @param {number} far_plane - The distance to the far clipping plane.
   */
  constructor(speed, alpha, g_eye, g_at, g_up, field_angle, asp_ratio, near_plane, far_plane) {
    this.eye = new Vector3(g_eye);
    this.at = new Vector3(g_at);
    this.up = new Vector3(g_up);

    this.fov = field_angle;
    this.near = near_plane;
    this.far = far_plane;
    this.aspect = asp_ratio;

    this.right = Vector3.cross(this.at, this.up);
    this.right.normalize();

    this.speed = speed;
    this.alpha = alpha;

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
  }

  /**
   * Initializes the camera.
   */
  init() {
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }

  /**
   * Changes the aspect ratio of the camera.
   * @param {number} aspect - The new aspect ratio.
   */
  changeAspect(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
  }

  /**
   * Changes the field of view (FOV) of the camera.
   * @param {number} fov - The new field of view in degrees.
   */
  changeFov(fov) {
    this.fov = fov;
    this.updateProjectionMatrix();
    cameraFOVcValue.innerText = this.fov;
    cameraFOVc.value = this.fov;
  }

  /**
   * Changes the value of the 'near' property and updates the projection matrix.
   * @param {number} near - The new value for the 'near' property.
   */
  changeNEAR(near) {
    this.near = near;
    this.updateProjectionMatrix();
    cameraNEARcValue.innerText = this.near;
    cameraNEARc.value = this.near;
  }

  /**
   * Changes the far clipping plane of the camera.
   * @param {number} far - The new value for the far clipping plane.
   */
  changeFAR(far) {
    this.far = far;
    this.updateProjectionMatrix();
    cameraFARcValue.innerText = this.far;
    cameraNEARc.value = this.far;
  }

  /**
   * Changes the speed of the camera.
   * @param {number} newSpeed - The new speed value to set for the camera.
   */
  changeSpeed(newSpeed) {
    this.speed = Math.max(0.1, Math.min(newSpeed, 5)); // Clamp between 0.1 and 5
    cameraSpeedcValue.innerText = this.speed.toFixed(2);
    cameraSpeedc.value = this.speed;
  }

  /**
   * Changes the alpha value of the camera.
   * @param {number} newAlpha - The new alpha value to set.
   */
  changeAlpha(newAlpha) {
    this.alpha = Math.max(0.1, Math.min(newAlpha, 5)); // Clamp between 0.1 and 5  }
    cameraAlphacValue.innerText = this.alpha.toFixed(2);
    cameraAlphac.value = this.alpha;
  }

  /**
   * Checks if the new position is colliding with any occupied cell in the grid.
   * @param {Vector3} newPos - The new position to check for collision.
   * @returns {boolean} - Returns true if the new position is colliding, false otherwise.
   */
  isColliding(newPos) {
    let gridX = Math.floor(newPos.elements[0] + scene.rows / 2);
    let gridY = Math.floor(newPos.elements[2] + scene.cols / 2);

    // Check if we're out of bounds. You might decide whether that is allowed or not.
    if (gridX < 0 || gridX >= scene.rows || gridY < 0 || gridY >= scene.cols) {
      return true; // Prevent movement out of bounds.
    }

    //Return true if the cell is occupied (nonzero)
    return scene.g_map[gridX][gridY] !== 0;
  }

  /**
   * Moves the camera forward in the direction it is facing.
   */
  moveForward() {
    var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
    f.sub(this.eye);
    f.normalize();

    f.mul(this.speed);

    let newEye = this.eye.clone().add(f);

    // Check if the new position would be inside a block.
    if (!this.isColliding(newEye)) {
      // If not, update the camera position.
      this.eye = newEye;
      this.at = this.at.clone().add(f);
      this.updateViewMatrix();
    } else {
      debugLog(debugkey, "Collision detected! Movement blocked.");
    }
  }

  /**
   * Moves the camera backward based on its current orientation and speed.
   * If the new position would result in a collision with a block, the movement is blocked.
   */
  moveBackward() {
    var b = new Vector3([this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]]);
    b.sub(this.at);
    b.normalize();

    b.mul(this.speed);

    let newEye = this.eye.clone().add(b);

    // Check if the new position would be inside a block.
    if (!this.isColliding(newEye)) {
      // If not, update the camera position.
      this.eye = newEye;
      this.at = this.at.clone().add(b);
      this.updateViewMatrix();
    } else {
      debugLog(debugkey, "Collision detected! Movement blocked.");
    }
  }

  /**
   * Moves the camera to the left.
   */
  moveLeft() {
    var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
    f.sub(this.eye);
    f.normalize();

    var s = Vector3.cross(this.up, f);
    s.normalize();
    s.mul(this.speed);

    let newEye = this.eye.clone().add(s);

    // Check if the new position would be inside a block.
    if (!this.isColliding(newEye)) {
      // If not, update the camera position.
      this.eye = newEye;
      this.at = this.at.clone().add(s);
      this.updateViewMatrix();
    } else {
      debugLog(debugkey, "Collision detected! Movement blocked.");
    }
  }

  /**
   * Moves the camera to the right based on its current orientation.
   * @returns {void}
   */
  moveRight() {
    var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
    f.sub(this.eye);
    f.normalize();

    var s = Vector3.cross(f, this.up);
    s.normalize();
    s.mul(this.speed);

    let newEye = this.eye.clone().add(s);

    // Check if the new position would be inside a block.
    if (!this.isColliding(newEye)) {
      // If not, update the camera position.
      this.eye = newEye;
      this.at = this.at.clone().add(s);
      this.updateViewMatrix();
    } else {
      debugLog(debugkey, "Collision detected! Movement blocked.");
    }
  }

  /**
   * Moves the camera up by a specified speed.
   * If the new position would result in a collision with a block, the movement is blocked.
   */
  moveUp() {
    var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
    f.sub(this.eye);
    f.normalize();

    var u = Vector3.cross(f, this.right);
    u.normalize();
    u.mul(this.speed);

    let newEye = this.eye.clone().add(u);

    // Check if the new position would be inside a block.
    if (!this.isColliding(newEye)) {
      // If not, update the camera position.
      this.eye = newEye;
      this.at = this.at.clone().add(u);
      this.updateViewMatrix();
    } else {
      debugLog(debugkey, "Collision detected! Movement blocked.");
    }
  }

  /**
   * Moves the camera down by a certain distance.
   */
  moveDown() {
    var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
    f.sub(this.eye);
    f.normalize();

    var u = Vector3.cross(this.right, f);
    u.normalize();
    u.mul(this.speed);

    let newEye = this.eye.clone().add(u);

    // Check if the new position would be inside a block.
    if (!this.isColliding(newEye)) {
      // If not, update the camera position.
      this.eye = newEye;
      this.at = this.at.clone().add(u);
      this.updateViewMatrix();
    } else {
      debugLog(debugkey, "Collision detected! Movement blocked.");
    }
  }

  /**
   * Pan the camera to the left.
   */
  panLeft() {
    var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
    f.sub(this.eye);
    f.normalize();

    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    var f_prime = rotationMatrix.multiplyVector3(f);

    this.at.elements[0] = this.eye.elements[0];
    this.at.elements[1] = this.eye.elements[1];
    this.at.elements[2] = this.eye.elements[2];
    this.at.add(f_prime);

    this.updateViewMatrix();
  }

  /**
   * Pans the camera to the right.
   */
  panRight() {
    var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
    f.sub(this.eye);
    f.normalize();

    var rotationMatrix = new Matrix4();
    rotationMatrix.setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    var f_prime = rotationMatrix.multiplyVector3(f);

    this.at.elements[0] = this.eye.elements[0];
    this.at.elements[1] = this.eye.elements[1];
    this.at.elements[2] = this.eye.elements[2];
    this.at.add(f_prime);

    this.updateViewMatrix();
  }

  /**
   * Updates the view matrix of the camera.
   */
  updateViewMatrix() {
    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    gl.uniformMatrix4fv(shaderVars.attribs.u_ViewMatrix, false, this.viewMatrix.elements);
  }

  /**
   * Updates the projection matrix of the camera.
   */
  updateProjectionMatrix() {
    this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
    gl.uniformMatrix4fv(shaderVars.attribs.u_ProjectionMatrix, false, this.projectionMatrix.elements);
  }
}
