import { renderer } from "./global.js";
import { Vector3, Matrix4 } from "./cuon-matrix-cse160.js";

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
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {HTMLCanvasElement} canvas - The HTML canvas element.
   */
  constructor(g_eye, g_at, g_up, field_angle, asp_ratio, near_plane, far_plane, gl, canvas) {
    this.eye = new Vector3(g_eye);
    this.at = new Vector3(g_at);
    this.up = new Vector3(g_up);

    this.fov = field_angle;
    this.near = near_plane;
    this.far = far_plane;
    this.aspect = asp_ratio;

    this.right = Vector3.cross(this.at, this.up);
    this.right.normalize();

    this.speed = 0.2;
    this.alpha = 0.5;

    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();

    this.gl = gl;
    this.canvas = canvas;
  }

  /**
   * Initializes the camera.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ViewMatrix - The uniform location for the view matrix.
   * @param {WebGLUniformLocation} u_ProjectionMatrix - The uniform location for the projection matrix.
   */
  init(gl, u_ViewMatrix, u_ProjectionMatrix) {
    this.updateViewMatrix(gl, u_ViewMatrix);
    this.updateProjectionMatrix(gl, u_ProjectionMatrix);
  }

  /**
   * Changes the field of view (FOV) of the camera and updates the projection matrix.
   * @param {number} fov - The new field of view in degrees.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ProjectionMatrix - The uniform location of the projection matrix in the shader program.
   */
  changeFov(fov, gl, u_ProjectionMatrix) {
    this.fov = fov;
    this.updateProjectionMatrix(gl, u_ProjectionMatrix);
  }

  /**
   * Changes the near clipping plane of the camera and updates the projection matrix.
   * @param {number} near - The new value for the near clipping plane.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ProjectionMatrix - The uniform location of the projection matrix.
   */
  changeNEAR(near, gl, u_ProjectionMatrix) {
    this.near = near;
    this.updateProjectionMatrix(gl, u_ProjectionMatrix);
  }

  /**
   * Changes the far clipping plane of the camera and updates the projection matrix.
   * @param {number} far - The new value for the far clipping plane.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ProjectionMatrix - The uniform location of the projection matrix.
   */
  changeFAR(far, gl, u_ProjectionMatrix) {
    this.far = far;
    this.updateProjectionMatrix(gl, u_ProjectionMatrix);
  }

  /**
   * Checks if the new position is colliding with any occupied cell in the grid.
   * @param {Vector3} newPos - The new position to check for collision.
   * @returns {boolean} - Returns true if the new position is colliding, false otherwise.
   */
  isColliding(newPos) {
    let gridX = Math.floor(newPos.elements[0] + renderer.rows / 2);
    let gridY = Math.floor(newPos.elements[2] + renderer.cols / 2);

    // Check if we're out of bounds. You might decide whether that is allowed or not.
    if (gridX < 0 || gridX >= renderer.rows || gridY < 0 || gridY >= renderer.cols) {
      return true; // Prevent movement out of bounds.
    }

    //Return true if the cell is occupied (nonzero)
    return renderer.g_map[gridX][gridY] !== 0;
  }

  /**
   * Moves the camera forward in the specified WebGL context using the provided view matrix.
   * @param {WebGLRenderingContext} gl - The WebGL context.
   * @param {mat4} u_ViewMatrix - The view matrix.
   */
  moveForward(gl, u_ViewMatrix) {
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
      this.updateViewMatrix(gl, u_ViewMatrix);
    } else {
      console.log("Collision detected! Movement blocked.");
    }
  }

  /**
   * Moves the camera backward along its viewing direction.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ViewMatrix - The uniform location of the view matrix.
   */
  moveBackward(gl, u_ViewMatrix) {
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
      this.updateViewMatrix(gl, u_ViewMatrix);
    } else {
      console.log("Collision detected! Movement blocked.");
    }
  }

  /**
   * Moves the camera to the left by a certain distance.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ViewMatrix - The uniform location of the view matrix.
   */
  moveLeft(gl, u_ViewMatrix) {
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
      this.updateViewMatrix(gl, u_ViewMatrix);
    } else {
      console.log("Collision detected! Movement blocked.");
    }
  }

  /**
   * Moves the camera to the right by a certain distance.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {mat4} u_ViewMatrix - The view matrix uniform.
   */
  moveRight(gl, u_ViewMatrix) {
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
      this.updateViewMatrix(gl, u_ViewMatrix);
    } else {
      console.log("Collision detected! Movement blocked.");
    }
  }

  /**
   * Pans the camera to the left.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ViewMatrix - The uniform location of the view matrix.
   */
  panLeft(gl, u_ViewMatrix) {
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

    this.updateViewMatrix(gl, u_ViewMatrix);
  }

  /**
   * Pans the camera to the right.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ViewMatrix - The uniform location of the view matrix.
   */
  panRight(gl, u_ViewMatrix) {
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

    this.updateViewMatrix(gl, u_ViewMatrix);
  }

  /**
   * Updates the view matrix and sets it as a uniform in the specified WebGL context.
   * @param {WebGLRenderingContext} gl - The WebGL context.
   * @param {WebGLUniformLocation} u_ViewMatrix - The uniform location for the view matrix.
   */
  updateViewMatrix(gl, u_ViewMatrix) {
    this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);
  }

  /**
   * Updates the projection matrix and sets it as a uniform in the WebGL context.
   * @param {WebGLRenderingContext} gl - The WebGL rendering context.
   * @param {WebGLUniformLocation} u_ProjectionMatrix - The uniform location for the projection matrix.
   */
  updateProjectionMatrix(gl, u_ProjectionMatrix) {
    this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);
  }
}
