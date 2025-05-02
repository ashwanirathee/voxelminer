// # Copyright 2021, GFXFundamentals.
// # All rights reserved.
// #
// # Redistribution and use in source and binary forms, with or without
// # modification, are permitted provided that the following conditions are
// # met:
// #
// #     * Redistributions of source code must retain the above copyright
// # notice, this list of conditions and the following disclaimer.
// #     * Redistributions in binary form must reproduce the above
// # copyright notice, this list of conditions and the following disclaimer
// # in the documentation and/or other materials provided with the
// # distribution.
// #     * Neither the name of GFXFundamentals. nor the names of his
// # contributors may be used to endorse or promote products derived from
// # this software without specific prior written permission.
// #
// # THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// # "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// # LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// # A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// # OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// # SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// # LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// # DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// # THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// # (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// # OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
import { createProgram } from "./../third-party/cuon-utils.js";
import { debugLog, ObjectClass } from "../utils.js";
import { Matrix4 } from "../third-party/cuon-matrix-cse160.js";
import { getAttrib, getUniform } from "../utils.js";
import {load} from 'https://cdn.jsdelivr.net/npm/@loaders.gl/core@3.3.1/+esm';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/@loaders.gl/obj@3.3.1/+esm';
import { ImageLoader } from 'https://cdn.jsdelivr.net/npm/@loaders.gl/images@3.3.1/+esm';

const debugkey = "objects_scan";

debugLog(debugkey, "Loading Scan...");

/**
 * Represents a crosshair object.
 */
export class Scan {
    constructor(textureAtlasNum, textureNum, gl, objUrl =  "") {
        this.type = ObjectClass.SCAN;
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();

        this.buffer = null;
        this.uvBuffer = null;
        this.vertices = null;
        this.uvs = null;
        this.normals = null;
        this.normalbuffer = null;
        this.textureAtlasNum = textureAtlasNum;
        this.textureNum = textureNum;
        this.bufferInitialized = false;

        this.gl = gl;
        const basePath = new URL('.', import.meta.url).href;
        this.objUrl = basePath + "../assets/scan/" + objUrl;

        if (this.objUrl) {
            this.loadObjModel(this.objUrl);
        } else {
            console.log("No objUrl provided, using default cube.");
        }
    }

    async loadObjModel(url) {
        // console.log(`Loading OBJ model from ${url}`);
        try {
            const data = await load(url, OBJLoader);
            // console.log("Model loaded:", data);
            
            const mesh = Array.isArray(data) ? data[0]?.attributes : data?.attributes;

            if (!mesh?.POSITION?.value) {
                console.error("No vertex POSITION data found.");
                return;
            }
            
            this.vertices = new Float32Array(mesh.POSITION.value.map(v => v / 200));
            this.uvs = new Float32Array(mesh.TEXCOORD_0?.value || []);
            this.normals = new Float32Array(mesh.NORMAL?.value || []);

            this.modelLoaded = true;
        } catch (err) {
            console.error('Error loading OBJ model:', err);
        }
    }
    
    render(shaderVars, normalControllerState) {
        if(!this.modelLoaded) {
            console.warn("Model not loaded yet, skipping render.");
            return;
        }
        const gl = this.gl;
        if (!shaderVars || !this.vertices) return;
        let tex = normalControllerState ? -3 : this.textureAtlasNum;

        gl.uniform1i(shaderVars.uniforms.u_ShapeType, ObjectClass.SCAN);
        gl.uniform1i(shaderVars.uniforms.u_ShapeType2, ObjectClass.SCAN);
        gl.uniform1i(shaderVars.uniforms.u_whichTexture, tex);
        gl.uniform4f(shaderVars.uniforms.u_FragColor, ...this.color);
        gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);

        this.normalMatrix.set(this.matrix).invert().transpose();
        gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);

        if (!this.buffer) this.buffer = gl.createBuffer();
        if (!this.uvBuffer) this.uvBuffer = gl.createBuffer();
        if (!this.normalbuffer) this.normalbuffer = gl.createBuffer();

        if (!this.bufferInitialized) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

            this.bufferInitialized = true;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(shaderVars.attribs.a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderVars.attribs.a_UV);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalbuffer);
        gl.vertexAttribPointer(shaderVars.attribs.a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderVars.attribs.a_Normal);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
    }
}