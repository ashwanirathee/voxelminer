import { createProgram } from "./../third-party/cuon-utils.js";
import { Matrix4 } from "./../third-party/cuon-matrix-cse160.js";
import { getAttrib, getUniform } from "./../utils.js";
import { debugLog } from "./../utils.js";

const debugkey = "objects_skybox";

debugLog(debugkey, "Loading objects_skybox...");

export const SkyBox_HydroPlanet = "hydro_planet/";
export const SkyBox_BlueCloud = "blue_cloud/";
export const SkyBox_BrownCloud = "brown_cloud/";
export const SkyBox_GrayCloud = "gray_cloud/";
export const SkyBox_YellowCloud = "yellow_cloud/";

export class Skybox {
  constructor(gl, type = VoxelMiner.SkyBox_BlueCloud) {
    this.gl = gl;
    this.program = null;
    this.vertexShader = null;
    this.fragmentShader = null;
    this.cubeBuffer = null;
    this.skyboxTexture = null;
    this.isCubemapReady = false;

    debugLog(debugkey, `Skybox type: ${type}`);

    this.type = type;

    this.setProgram();
    this.initCubeBuffer();
    this.loadCubeMap();
  }

  setProgram() {
    this.vertexShader = `
      attribute vec4 a_position;
      varying vec4 v_position;

      void main() {
        v_position = a_position;
        gl_Position = a_position;
        gl_Position.z = 1.0; // Force far clipping
      }
    `;

    this.fragmentShader = `
      precision mediump float;
      uniform samplerCube u_skybox;
      uniform mat4 u_viewDirectionProjectionInverse;
      varying vec4 v_position;

      void main() {
        vec4 t = u_viewDirectionProjectionInverse * v_position;
        gl_FragColor = textureCube(u_skybox, normalize(t.xyz / t.w));
      }
    `;

    this.program = createProgram(this.gl, this.vertexShader, this.fragmentShader);
    this.gl.useProgram(this.program);
    this.positionLoc = getAttrib(this.gl, this.program, "a_position");
    this.uSkyboxLoc = getUniform(this.gl, this.program, "u_skybox");
    this.uInvVPLoc = getUniform(this.gl, this.program, "u_viewDirectionProjectionInverse");
  }

  initCubeBuffer() {
    const positions = new Float32Array([
      -1, -1, 1, 1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,

      -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1,

      -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, 1,

      -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, 1,

      1, -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1,

      -1, -1, -1, -1, -1, 1, -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1,
    ]);

    this.cubeBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
  }

  loadCubeMap() {
    const gl = this.gl;
    const texture = gl.createTexture();
    if (!texture) {
      console.error(`Failed to create texture for cubemap`);
      return false;
    }

    const faces = [
      ["pos-x.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
      ["neg-x.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
      ["pos-y.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
      ["neg-y.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
      ["pos-z.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
      ["neg-z.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z],
    ];
    let loaded = 0;
    const totalFaces = faces.length;
    const basePath = new URL('.', import.meta.url).href;  // Get the base path of the current module
    for (const [src, target] of faces) {
      const image = new Image();
      image.src = basePath + "./../assets/skybox/" + this.type + src;

      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        loaded++;
        if (loaded === totalFaces) {
          gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

          debugLog(debugkey, "Cubemap loaded successfully.");
          this.isCubemapReady = true;
        }
      };
    }

    this.skyboxTexture = texture;
    this.isCubemapReady = false;
  }

  /**
   * Renders the skybox in the specified scene using the provided camera.
   * @param {Scene} scene - The scene to render the skybox in.
   * @param {Camera} camera - The camera to use for rendering.
   */
  render(scene, camera) {
    if (!this.isCubemapReady) {
      debugLog(debugkey, "Cubemap not ready yet.");
      return;
    }

    const gl = this.gl;
    gl.depthFunc(gl.LEQUAL);
    gl.useProgram(this.program);

    // Check if the program is correctly set before setting uniforms
    const activeProgram = gl.getParameter(gl.CURRENT_PROGRAM);
    if (activeProgram !== this.program) {
      console.error("Incorrect program active when setting uniforms!");
    }

    // Matrices
    const viewMatrix = new Matrix4(camera.viewMatrix);
    viewMatrix.elements[12] = 0;
    viewMatrix.elements[13] = 0;
    viewMatrix.elements[14] = 0;

    const projectionMatrix = camera.projectionMatrix;
    const viewProj = new Matrix4(projectionMatrix).multiply(viewMatrix);
    const inverseVP = new Matrix4();
    inverseVP.setInverseOf(viewProj);

    // Upload data
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeBuffer);
    gl.enableVertexAttribArray(this.positionLoc);
    gl.vertexAttribPointer(this.positionLoc, 3, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(this.uInvVPLoc, false, inverseVP.elements);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.skyboxTexture);
    gl.uniform1i(this.uSkyboxLoc, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.depthFunc(gl.LESS); // Restore depth function
  }
}
