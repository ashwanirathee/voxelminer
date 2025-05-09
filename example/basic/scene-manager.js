import * as VoxelMiner from "../../lib/index.js";
import { gl, obj } from "./game.js";
import alea from 'https://cdn.jsdelivr.net/npm/alea@1.0.1/+esm';
import { createNoise3D, createNoise2D } from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.3/+esm';
const debugkey = "scene_manager";

VoxelMiner.debugLog(debugkey, "Loading scene_manager...");

/**
 * Represents a scene manager that manages the scene graph, objects, skybox, and lights.
 */
export class SceneManager {
  constructor() {
    console.log(obj);
    this.scene = new VoxelMiner.SceneGraph(gl, obj.ambientLightFactor, obj.diffuseLightFactor, obj.specularLightFactor, obj.specularExponent);
    this.scene.init();
    this.ball = null;
    this.addObjects();
    this.addSkyBox();
    this.addLights();
    this.addCrosshair();
  }

  /**
   * Adds objects to the scene graph.
   */
  addObjects() {
    const prng = alea('seed');
    const noise3D = createNoise3D(prng);
    const noise2D = createNoise2D(prng);
    VoxelMiner.debugLog(debugkey, "Adding objects to scene graph");

    // Generate noise for some x, y coordinates
    for (let y = -15; y < 0; y++) {
      for (let x = -15; x < 15; x++) {
        for (let z = -15; z < 15; z++) {
          // Generate noise for the current x, y, z coordinates
          const noiseValue = noise3D(x / 10, y / 10, z / 10);
          if (noiseValue > 0.2) {
            let cube = new VoxelMiner.Cube(2, 3, gl);
            cube.color = [0.49, 0.788, 0.29, 1.0];
            cube.matrix.translate(x, y, z);
            cube.matrix.scale(1, 1, 1);
            this.scene.push(cube);
          }

        }
      }
    }

    for (let z = -15; z < 15; z++) {
      for (let x = -15; x < 15; x++) {
        // Generate noise for the current x, y coordinates
        const noiseValue = noise2D(x / 10, z / 10);
        if (noiseValue >= 0) {
          const height = Math.floor(noiseValue * 5);
          for (let y = 0; y <= height; y++) {
            let cube = new VoxelMiner.Cube(2, 2, gl);
            cube.color = [0.49, 0.788, 0.29, 1.0];
            cube.matrix.translate(x, y, z);
            cube.matrix.scale(1, 1, 1);
            this.scene.push(cube);
          }
        } else {
          let cube = new VoxelMiner.Cube(2, 2, gl);
          cube.color = [0.49, 0.788, 0.29, 1.0];
          cube.matrix.translate(x, 0, z);
          cube.matrix.scale(1, 1, 1);
          this.scene.push(cube);
        }
      }
    }

    let bedrock = new VoxelMiner.Cube(2, 3, gl);
    bedrock.color = [0.49, 0.788, 0.29, 1.0];
    bedrock.matrix.translate(0, -15, 0);
    bedrock.matrix.scale(-32, 0.01, -32);
    this.scene.push(bedrock);
  }

  /**
   * Adds a skybox to the scene graph.
   */
  addSkyBox() {
    VoxelMiner.debugLog(debugkey, "Adding skybox to scene graph");
    this.scene.skybox = new VoxelMiner.Skybox(gl, VoxelMiner.SkyBox_BlueCloud);
  }

  /**
   * Adds lights to the scene graph.
   */
  addLights() {
    VoxelMiner.debugLog(debugkey, "Adding lights to scene graph");
    const light1 = new VoxelMiner.PointLight(gl, [15, 3, -15], obj.light1_color, 1);
    this.scene.addLight(light1);
  }

  addCrosshair() {
    this.scene.crosshair = new VoxelMiner.Crosshair(gl);
  }
}