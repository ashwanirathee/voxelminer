import { debugLog } from "./utils.js";

const debugkey = "texture";
const textures = [];

debugLog(debugkey, "Loading texture.js");

/**
 * Initializes multiple textures with given images, samplers, and units.
 * @param {WebGLRenderingContext} gl
 * @param {Array} textureDataList - Array of objects with: { url, unit, sampler }
 * @returns {boolean}
 */
export function initTextures(gl, textureDataList) {
  for (let { url, unit, sampler } of textureDataList) {
    const image = new Image();
    if (!image) {
      console.error(`Failed to create image for ${url}`);
      return false;
    }

    image.onload = () => sendTextureToUnit(image, gl, unit, sampler);
    image.src = url;
  }

  return true;
}

/**
 * Uploads an image as a WebGL texture to a specific texture unit.
 * @param {HTMLImageElement} image
 * @param {WebGLRenderingContext} gl
 * @param {number} unit - WebGL texture unit (0, 1, 2, ...)
 * @param {WebGLUniformLocation} sampler
 */
function sendTextureToUnit(image, gl, unit, sampler) {
  const texture = gl.createTexture();
  if (!texture) {
    console.error(`Failed to create texture for unit ${unit}`);
    return false;
  }

  textures[unit] = texture;

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Power-of-two check for mipmaps (only needed for unit 2 in your original code)
  const isPowerOf2 = (value) => (value & (value - 1)) === 0;
  const enableMipmaps = isPowerOf2(image.width) && isPowerOf2(image.height);

  if (enableMipmaps && unit === 2) {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.uniform1i(sampler, unit);
}
