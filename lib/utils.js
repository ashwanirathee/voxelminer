import { debugConfig } from "./debug-config.js";

const debugkey = "utils";

debugLog(debugkey, "Loading utils.js");

/**
 * Clears the canvas by setting the background color and clearing the canvas.
 * Also clears the shapes list in the scene.
 */
function clearCanvas() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Specify the color for clearing <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT); // Clear <canvas>
  scene.shapesList = [];
}

/**
 * Sets up the WebGL context for rendering.
 * @returns {Object} An object containing the canvas and WebGL context.
 */
export function setupWebGL() {
  // Retrieve <canvas> element
  let canvas = document.getElementById("webgl_canvas");

  // Get the rendering context for WebGL
  let gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log("Failed to get the rendering context for WebGL");
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  return { canvas, gl };
}

/**
 * Handles the mouse down event.
 * @param {MouseEvent} event - The mouse event object.
 */
function handleMouseDown(event) {
  if (event.button === 0) {
    console.log("Left click on canvas!");

    var res = pickBlock(camera, renderer, 1);
    if (res.gridX != null) {
      renderer.g_map[res.gridX][res.gridY] = 0;
    }
    // if()
  } else if (event.button === 2) {
    var res = pickBlock(camera, renderer, 1);
    if (res.gridX != null) {
      if (renderer.g_map[res.gridX][res.gridY] == 0) {
        renderer.g_map[res.gridX][res.gridY] = 1;
      }
    }
    // we add!
  }
  renderer.buildCubeInstances();
}

/**
 * Picks a block in the world based on the camera position and distance.
 * @param {Camera} camera - The camera object.
 * @param {World} world - The world object.
 * @param {number} [distance=1] - The distance from the camera to the target position.
 * @returns {Object} - The grid coordinates of the picked block.
 * @property {number} gridX - The X coordinate of the picked block in the grid.
 * @property {number} gridY - The Y coordinate of the picked block in the grid.
 */
function pickBlock(camera, world, distance = 1) {
  let forward = camera.at.clone().sub(camera.eye);
  forward.normalize();

  // Compute a point "distance" units in front of the camera
  let targetPos = camera.eye.clone().add(forward.mul(distance));

  // Convert world coordinates to grid indices.
  // Note: camera.eye and targetPos are in world coordinates.
  let gridX = Math.round(targetPos.elements[0] + world.rows / 2);
  let gridY = Math.round(targetPos.elements[2] + world.cols / 2);

  return { gridX, gridY };
}

/**
 * Converts mouse coordinates to normalized canvas coordinates.
 * @param {MouseEvent} ev - The mouse event object.
 * @returns {number[]} - An array of normalized coordinates [x1, y1, x2, y2, x3, y3].
 */
function convertCoordinates(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  x1 = (x - 30 - rect.left - canvas.width / 2) / (canvas.width / 2);
  y1 = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  x2 = (x + 30 - rect.left - canvas.width / 2) / (canvas.width / 2);
  y2 = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  x3 = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y3 = (canvas.height / 2 - (y - 30 - rect.top)) / (canvas.height / 2);
  return [x1, y1, x2, y2, x3, y3];
}

/**
 * Converts mouse event coordinates to WebGL coordinates.
 * @param {MouseEvent} ev - The mouse event object.
 * @returns {number[]} - The converted WebGL coordinates [x, y].
 */
function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return [x, y];
}

/**
 * Toggles the visibility of the overlay element.
 */
export function toggleOverlay() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.toggle("hidden");
}

/**
 * Updates the value of a given key in the angles object and updates the output element with the new value.
 * @param {string} id - The id of the input element.
 * @param {string} key - The key in the angles object to update.
 * @param {string} outputId - The id of the output element to update.
 */
export function updateValue(id, key, outputId) {
  let value = document.getElementById(id).value;
  angles[key] = parseInt(value);
  document.getElementById(outputId).textContent = value;
}

/**
 * Checks if a number is a power of 2.
 *
 * @param {number} value - The number to check.
 * @returns {boolean} Returns true if the number is a power of 2, false otherwise.
 */
export function isPowerOf2(value) {
  return (value & (value - 1)) === 0 && value > 0;
}

/**
 * Logs debug information to the console.
 *
 * @param {string} fileKey - The key of the file for which the debug information is logged.
 * @param {...any} args - The debug information to be logged.
 */
export function debugLog(fileKey, ...args) {
  if (!debugConfig.global) return;
  if (!debugConfig.files[fileKey]) return;

  console.log(`[DEBUG][${fileKey}]`, ...args);
}