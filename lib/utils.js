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
