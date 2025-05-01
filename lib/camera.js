import { Vector3, Matrix4, Vector4 } from "./third-party/cuon-matrix-cse160.js";
import { debugLog, degToRad } from "./utils.js";

const debugkey = "camera";

debugLog(debugkey, "Loading camera...");

export const CameraType = {
  FPS_CAMERA: 0,
  ARCBALL_CAMERA: 1
};

/**
 * Represents a camera in a 3D graphics application.
 * @class
 */
export class Camera {
  /**
   * Represents a camera in a 3D graphics application.   
   * @param {number} speed - The movemet speed of the camera.
   * @param {number} sensitivity - The panning sensitivity of the camera.
   * @param {Vector3} g_eye - The position of the camera.
   * @param {Vector3} g_at - The point the camera is looking at.
   * @param {Vector3} g_up - The up direction of the camera.
   * @param {number} field_angle - The field of view angle in degrees.
   * @param {number} asp_ratio - The aspect ratio of the camera.
   * @param {number} near_plane - The distance to the near clipping plane.
   * @param {number} far_plane - The distance to the far clipping plane.
   */
  constructor(speed, sensitivity, g_eye, g_at, g_up, field_angle, asp_ratio, near_plane, far_plane, gl, scene) {
    this.eye = new Vector3(g_eye);
    this.at = new Vector3(g_at);
    this.up = new Vector3(g_up);

    this.fov = field_angle;
    this.near = near_plane;
    this.far = far_plane;
    this.aspect = asp_ratio;

    this.type = CameraType.ARCBALL_CAMERA; // default FPS

    this.right = Vector3.cross(this.at, this.up);
    this.right.normalize();

    this.speed = speed;
    this.sensitivity = sensitivity;

    this.pitch = 0.0;
    this.yaw = -90.0;

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.gl = gl;
    this.scene = scene;
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
  }

  /**
   * Changes the value of the 'near' property and updates the projection matrix.
   * @param {number} near - The new value for the 'near' property.
   */
  changeNEAR(near) {
    this.near = near;
    this.updateProjectionMatrix();
  }

  /**
   * Changes the far clipping plane of the camera.
   * @param {number} far - The new value for the far clipping plane.
   */
  changeFAR(far) {
    this.far = far;
    this.updateProjectionMatrix();
  }

  /**
   * Changes the target point of the camera.
   * @param {number} x - The target X Coordinate.
   * @param {number} y - The target Y Coordinate.
   * @param {number} z - The target Z Coordinate.
   * 
   */
  changeAt(x, y, z) {
    this.at.elements[0] = x;
    this.at.elements[1] = y;
    this.at.elements[2] = z;
    this.updateViewMatrix();
  }

  /**
   * Changes the speed of the camera.
   * @param {number} newSpeed - The new speed value to set for the camera.
   */
  changeSpeed(newSpeed) {
    this.speed = Math.max(0.1, Math.min(newSpeed, 5)); // Clamp between 0.1 and 5
  }

  /**
   * Changes the pan sensitivity value of the camera.
   * @param {number} newSensitivity - The new sensitivity value to set.
   */
  changeSensitivity(newSensitivity) {
    this.sensitivity = Math.max(0.01, Math.min(newSensitivity, 2.0)); // Clamp between 0.1 and 5  }
  }

  /**
   * Changes the camera type.
   * @param {CameraType} CameraType - What type of camera will this be now
   */
  changeCameraType(cameraType) {
    this.type = cameraType;
  }

  /**
   * Checks if the camera is colliding with a given position.
   * @param {Object} newPos - The new position to check for collision.
   * @returns {boolean} - True if the camera is colliding, false otherwise.
   */
  isColliding(newPos) {
    return false;
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
   * Pan the camera.
   */
  panCamera(offsetX, offsetY) {
    this.yaw += this.sensitivity*offsetX;
    this.pitch -= this.sensitivity*offsetY;

    this.pitch = Math.max(-89.9, Math.min(89.9, this.pitch));

    var direction = new Vector3();
    direction.elements[0] = Math.cos(degToRad(this.yaw)) * Math.cos(degToRad(this.pitch));
    direction.elements[1] = Math.sin(degToRad(this.pitch));
    direction.elements[2] = Math.sin(degToRad(this.yaw)) * Math.cos(degToRad(this.pitch));
    direction.normalize();

    if(this.type == CameraType.FPS_CAMERA)
      this.panFPSCamera(direction);
    else if(this.type == CameraType.ARCBALL_CAMERA)
      this.panArcballCamera(direction);
  }

  /**
   * FPS Camera panning function
   */
  panFPSCamera(direction) {
    this.at = this.eye.clone().add(direction);
    this.updateViewMatrix();
  }

  /**
   * Arcball Camera panning function
   */
  panArcballCamera(direction) {
    const radiusVec = this.eye.clone().sub(this.at);
    const radius    = radiusVec.magnitude();
    this.eye = this.at.clone().add(direction.mul(radius));
    this.updateViewMatrix();
  }

  /**
   * Updates the view matrix of the camera.
   */
  updateViewMatrix() {
    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
  }

  /**
   * Updates the projection matrix of the camera.
   */
  updateProjectionMatrix() {
    this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
  }
}
