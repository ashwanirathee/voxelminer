import { createProgram } from "../third-party/cuon-utils.js";
import { getAttrib, getUniform } from "../utils.js";
import { Vector3, Matrix4 } from "./../third-party/cuon-matrix-cse160.js";
import { initTextures } from "../texture.js";
import { debugLog } from "../utils.js";

const debugkey = "shader_models_phong_shader";

debugLog(debugkey, "Loading shader_models_phong_shader...");

/**
 * Represents a Phong shader for rendering 3D objects with lighting.
 */
export class PhongShader {
  constructor(gl) {
    this.gl = gl;
    this.program = null;

    this.shaderVars = {
      attribs: {
        a_Position: null,
        a_UV: null,
        a_Normal: null,
        a_Size: null,
      },
      uniforms: {
        u_CameraPos: null,
        u_FragColor: null,
        u_ModelMatrix: null,
        u_NormalMatrix: null,
        u_ViewMatrix: null,
        u_ProjectionMatrix: null,
        u_Sampler0: null,
        u_Sampler1: null,
        u_Sampler2: null,
        u_whichTexture: null,
        u_PointLightPos: null,
        u_PointLightColor: null,
        u_PointLightStatus: null,
        u_NumPointLights: null,
      },
    };
  }

  /**
   * Sets up the program by compiling the vertex and fragment shaders, creating the program,
   * and retrieving the attribute and uniform locations.
   */
  setProgram() {
    const gl = this.gl;
    this.vertexShader = `
        precision mediump float;

        attribute vec4 a_Position;
        attribute vec2 a_UV;
        attribute vec3 a_Normal;
    
        uniform mat4 u_ModelMatrix;
        uniform mat4 u_NormalMatrix;
        uniform mat4 u_ViewMatrix;
        uniform mat4 u_ProjectionMatrix;
        uniform vec3 u_CameraPos;
    
        varying vec4 v_VertPos;
        varying vec2 v_UV;
        varying vec3 v_Normal;
        varying vec3 v_CameraPos;
    
        void main(){
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_Normal = (u_NormalMatrix * vec4(a_Normal,1.0)).xyz;
        v_VertPos = u_ModelMatrix * a_Position;
        v_CameraPos = u_CameraPos;
        v_UV = a_UV;
        }
    `;

    this.fragmentShader = `
        precision mediump float;

        const int MAX_POINT_LIGHTS = 4;

        uniform vec3 u_PointLightPos[MAX_POINT_LIGHTS];
        uniform vec3 u_PointLightColor[MAX_POINT_LIGHTS];
        uniform int u_PointLightStatus[MAX_POINT_LIGHTS];
        uniform int u_NumPointLights;

        uniform vec4 u_FragColor;  // frag color, default is 0.5,0.5,0.5,1.0 
    
        uniform sampler2D u_Sampler0;
        uniform sampler2D u_Sampler1;
        uniform sampler2D u_Sampler2;
    
        uniform int u_whichTexture;
    
        varying vec3 v_Normal;
        varying vec4 v_VertPos;
        varying vec2 v_UV;
        varying vec3 v_CameraPos;
    
        void main() {
            if(u_whichTexture == -6){
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); 
            } else if(u_whichTexture == -5){
                gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); 
            } else if (u_whichTexture == -4){
                vec3 norm = normalize(v_Normal);
                gl_FragColor = vec4(norm, 1.0);
            } else if(u_whichTexture == -3){
                gl_FragColor = vec4((v_Normal+1.0)/2.0,1.0);
            } else if(u_whichTexture == -2){
                gl_FragColor = u_FragColor;
            } else if(u_whichTexture == -1){
                gl_FragColor = vec4(v_UV,1.0,1.0);
            } else if(u_whichTexture == 0){
                gl_FragColor = texture2D(u_Sampler0, v_UV);
            } else if(u_whichTexture == 1){
                gl_FragColor = texture2D(u_Sampler1, v_UV);
            } else if(u_whichTexture == 2){
                gl_FragColor = texture2D(u_Sampler2, v_UV);
            } else {
                gl_FragColor = vec4(1,.2,.2,1);
            }

            vec3 finalLighting = vec3(gl_FragColor) * 0.5; // Ambient

            vec3 N = normalize(v_Normal);
            vec3 E = normalize(v_CameraPos - vec3(v_VertPos));
            
            for (int i = 0; i < MAX_POINT_LIGHTS; ++i) {
                if (i >= u_NumPointLights) break;
                if (u_PointLightStatus[i] != 1) continue;
            
                vec3 L = normalize(u_PointLightPos[i] - vec3(v_VertPos));
                float nDotL = max(dot(N, L), 0.0);
            
                vec3 R = reflect(-L, N);
                float specular = pow(max(dot(E, R), 0.0), 16.0) * 0.6;
            
                vec3 diffuse = u_PointLightColor[i] * vec3(gl_FragColor) * nDotL * 0.7;
            
                finalLighting += diffuse + specular;
            }
            
            gl_FragColor = vec4(finalLighting, 1.0);
        }
    `;

    this.program = createProgram(this.gl, this.vertexShader, this.fragmentShader);
    if (!this.program) {
      console.log("Failed to create program");
      return false;
    }

    gl.useProgram(this.program);

    // console.log(this.gl, this.program);
    this.shaderVars.attribs.a_Position = getAttrib(gl, this.program, "a_Position");
    this.shaderVars.attribs.a_UV = getAttrib(gl, this.program, "a_UV");
    this.shaderVars.attribs.a_Normal = getAttrib(gl, this.program, "a_Normal");

    this.shaderVars.uniforms.u_CameraPos = getUniform(gl, this.program, "u_CameraPos");
    this.shaderVars.uniforms.u_FragColor = getUniform(gl, this.program, "u_FragColor");
    this.shaderVars.uniforms.u_whichTexture = getUniform(gl, this.program, "u_whichTexture");
    this.shaderVars.uniforms.u_ModelMatrix = getUniform(gl, this.program, "u_ModelMatrix");
    this.shaderVars.uniforms.u_NormalMatrix = getUniform(gl, this.program, "u_NormalMatrix");
    this.shaderVars.uniforms.u_ViewMatrix = getUniform(gl, this.program, "u_ViewMatrix");
    this.shaderVars.uniforms.u_ProjectionMatrix = getUniform(gl, this.program, "u_ProjectionMatrix");
    this.shaderVars.uniforms.u_Sampler0 = getUniform(gl, this.program, "u_Sampler0");
    this.shaderVars.uniforms.u_Sampler1 = getUniform(gl, this.program, "u_Sampler1");
    this.shaderVars.uniforms.u_Sampler2 = getUniform(gl, this.program, "u_Sampler2");

    this.shaderVars.uniforms.u_PointLightPos = getUniform(gl, this.program, "u_PointLightPos[0]");
    this.shaderVars.uniforms.u_PointLightColor = getUniform(gl, this.program, "u_PointLightColor[0]");
    this.shaderVars.uniforms.u_PointLightStatus = getUniform(gl, this.program, "u_PointLightStatus[0]");
    this.shaderVars.uniforms.u_NumPointLights = getUniform(gl, this.program, "u_NumPointLights");

    // console.log(this.shaderVars.uniforms.u_CameraPos, this.shaderVars.uniforms.u_FragColor, this.shaderVars.uniforms.u_whichTexture);
    // Identity Model Matrix
    const identityM = new Matrix4();
    this.gl.uniformMatrix4fv(this.shaderVars.uniforms.u_ModelMatrix, false, identityM.elements);
    // console.log("Loading textures...");
    initTextures(this.gl, [
      { url: "/lib/assets/uvCoords.png", unit: 0, sampler: this.shaderVars.uniforms.u_Sampler0 },
      { url: "/lib/assets/dice.png", unit: 1, sampler: this.shaderVars.uniforms.u_Sampler1 },
      { url: "/lib/assets/texture.png", unit: 2, sampler: this.shaderVars.uniforms.u_Sampler2 },
    ]);
  }

  use() {
    this.gl.useProgram(this.program);
  }

  setUniforms(scene, camera) {
    const gl = this.gl;
    if (!this.program) this.setProgram();
    this.use();
    // Check if the program is correctly set before setting uniforms
    const activeProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
    if (activeProgram !== this.program) {
      console.error("Incorrect program active when setting uniforms!");
    }
    // console.log(camera.eye.elements)
    gl.uniform3f(this.shaderVars.uniforms.u_CameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);
    gl.uniformMatrix4fv(this.shaderVars.uniforms.u_ViewMatrix, false, camera.viewMatrix.elements);
    gl.uniformMatrix4fv(this.shaderVars.uniforms.u_ProjectionMatrix, false, camera.projectionMatrix.elements);

    const MAX_LIGHTS = 4;
    if (scene.pointLights.length > MAX_LIGHTS) {
      console.warn(`Only first ${MAX_LIGHTS} lights will be used. (${scene.pointLights.length} provided)`);
    }

    const lights = scene.pointLights.slice(0, MAX_LIGHTS);

    gl.uniform1i(this.shaderVars.uniforms.u_NumPointLights, lights.length);

    const posArray = [],
      colorArray = [],
      statusArray = [];

    lights.forEach((light) => {
      posArray.push(...light.pos);
      colorArray.push(...light.color);
      statusArray.push(light.status);
      light.cube.matrix.setTranslate(light.pos[0], light.pos[1], light.pos[2]);
      light.cube.render(this.shaderVars, 0);
    });

    gl.uniform3fv(this.shaderVars.uniforms.u_PointLightPos, posArray);
    gl.uniform3fv(this.shaderVars.uniforms.u_PointLightColor, colorArray);
    gl.uniform1iv(this.shaderVars.uniforms.u_PointLightStatus, statusArray);
  }

  render(shape, normalControllerState) {
    shape.render(this.shaderVars, normalControllerState);
  }
}
