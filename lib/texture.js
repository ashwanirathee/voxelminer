var texture0 = null;
var texture1 = null;
var texture2 = null;

/**
 * Initializes textures and loads images for the specified WebGL context.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {WebGLUniformLocation} u_Sampler0 - The uniform location for texture 0.
 * @param {WebGLUniformLocation} u_Sampler1 - The uniform location for texture 1.
 * @param {WebGLUniformLocation} u_Sampler2 - The uniform location for texture 2.
 * @returns {boolean} - Returns true if the textures are successfully initialized, false otherwise.
 */
export function initTextures(gl, u_Sampler0, u_Sampler1, u_Sampler2) {
  var image = new Image(); // Create the image object
  if (!image) {
    console.log("Failed to create the image object");
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function () {
    sendTextureToTEXTURE0(image, gl, u_Sampler0);
  };
  // Tell the browser to load an image
  image.src = "./lib/uvCoords.png";

  var image1 = new Image(); // Create the image object
  if (!image1) {
    console.log("Failed to create the image object");
    return false;
  }
  // Register the event handler to be called on loading an image
  image1.onload = function () {
    sendTextureToTEXTURE1(image1, gl, u_Sampler1);
  };
  // Tell the browser to load an image
  image1.src = "./lib/dice.png";

  var image2 = new Image(); // Create the image object
  if (!image2) {
    console.log("Failed to create the image object");
    return false;
  }
  // Register the event handler to be called on loading an image
  image2.onload = function () {
    sendTextureToTEXTURE2(image2, gl, u_Sampler2);
  };
  // Tell the browser to load an image
  image2.src = "./lib/texture.png";

  // add more textures
  return true;
}

/**
 * Sends a texture to TEXTURE0 in WebGL.
 * @param {HTMLImageElement} image - The image to be used as the texture.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {WebGLUniformLocation} u_Sampler0 - The uniform location for the texture sampler.
 * @returns {boolean} Returns true if the texture is successfully sent, false otherwise.
 */
function sendTextureToTEXTURE0(image, gl, u_Sampler0) {
  texture0 = gl.createTexture(); // Create a texture object
  if (!texture0) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
}

/**
 * Sends a texture to TEXTURE1 in WebGL.
 * @param {Image} image - The image to be used as the texture.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {WebGLUniformLocation} u_Sampler1 - The uniform location of the sampler.
 * @returns {boolean} - Returns true if the texture is successfully sent, false otherwise.
 */
function sendTextureToTEXTURE1(image, gl, u_Sampler1) {
  texture1 = gl.createTexture(); // Create a texture object
  if (!texture1) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // gl.pixelStorei(gl.UNPACK_FLIP_X_WEBGL, 0);;
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE1);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler1, 1);
}

/**
 * Sends a texture to the TEXTURE2 unit in WebGL.
 * @param {HTMLImageElement} image - The image to be used as the texture.
 * @param {WebGLRenderingContext} gl - The WebGL rendering context.
 * @param {WebGLUniformLocation} u_Sampler2 - The uniform location for the texture sampler.
 * @returns {boolean} Returns true if the texture is successfully sent, false otherwise.
 */
function sendTextureToTEXTURE2(image, gl, u_Sampler2) {
  texture2 = gl.createTexture(); // Create a texture object
  if (!texture2) {
    console.log("Failed to create the texture object");
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y-axis
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture2);

  // Set the texture image first
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  // Function to check if a value is a power of two
  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    // If texture is power-of-two, enable mipmaps
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    // If texture is NOT power-of-two, use LINEAR filtering (NO mipmaps allowed)
    console.warn("Texture is NPOT, disabling mipmaps.");
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.uniform1i(u_Sampler2, 2);
}
