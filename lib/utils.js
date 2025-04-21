export function toggleOverlay() {
  const overlay = document.querySelector(".overlay");
  overlay.classList.toggle("hidden");
}

export function updateValue(id, key, outputId) {
  let value = document.getElementById(id).value;
  angles[key] = parseInt(value);
  document.getElementById(outputId).textContent = value;
}

export function isPowerOf2(value) {
  return (value & (value - 1)) === 0 && value > 0;
}
