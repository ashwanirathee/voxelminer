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
import { debugLog, ObjectClass } from "../utils.js";
import { Matrix4 } from "../third-party/cuon-matrix-cse160.js";
import { load } from "https://cdn.jsdelivr.net/npm/@loaders.gl/core@3.3.1/+esm";
import { OBJLoader } from "https://cdn.jsdelivr.net/npm/@loaders.gl/obj@3.3.1/+esm";

const debugkey = "objects_scan";
debugLog(debugkey, "Loading Scan...");

export class Scan {
  constructor(textureAtlasNum, textureNum, gl, objFile = "") {
    this.type = ObjectClass.SCAN;
    this.color = [42.0 / 255.0, 76.0 / 255.0, 132.0 / 255.0, 1.0];

    this.matrix = new Matrix4();
    this.normalMatrix = new Matrix4();

    this.gl = gl;
    this.textureAtlasNum = textureAtlasNum;
    this.textureNum = textureNum;

    // CPU arrays
    this.vertices = null; // Float32Array of positions (tri list)
    this.uvs = null;      // Float32Array of uvs (tri list) or null
    this.normals = null;  // Float32Array of normals (tri list) or null

    this.hasUV = false;
    this.hasNormal = false;

    // GPU buffers
    this.vbo = null;
    this.tbo = null;
    this.nbo = null;
    this.uploaded = false;
    this.modelLoaded = false;

    // Resolve URL relative to module
    const basePath = new URL(".", import.meta.url).href;
    this.objUrl = objFile ? basePath + "../assets/scan/" + objFile : "";

    if (this.objUrl) {
      this.loadObjModel(this.objUrl);
    } else {
      console.warn("No objUrl provided; nothing to render.");
    }
  }

  // -------- OBJ Loading + Expansion ----------
  async loadObjModel(url) {
    try {
      const data = await load(url, OBJLoader);
      const mesh = Array.isArray(data) ? data[0]?.attributes : data?.attributes;
      if (!mesh?.POSITION?.value) {
        console.error("OBJ has no POSITION attribute.");
        return;
      }

      // Pull raw arrays (possibly indexed)
      const pos = mesh.POSITION.value;             // Float32Array
      const idx = mesh.indices?.value ?? mesh.indices ?? null;
      const uv  = mesh.TEXCOORD_0?.value ?? null;  // Float32Array or null
      const nrm = mesh.NORMAL?.value ?? null;      // Float32Array or null

      // Ensure we have a *triangle list* (expanded)
      const { positions, uvs, normals } = this._ensureTriList(pos, uv, nrm, idx);

      // If normals missing, compute flat normals (per tri), else trust file normals
      if (!normals) {
        this.normals = this._computeFlatNormals(positions);
        this.hasNormal = true; // we just generated them
      } else {
        this.normals = normals;
        this.hasNormal = true;
      }

      // UVs optional
      if (uvs && uvs.length === (positions.length / 3) * 2) {
        this.uvs = uvs;
        this.hasUV = true;
      } else {
        this.uvs = null;
        this.hasUV = false;
      }

      // Positions are required
      this.vertices = positions;

      // Create buffers now & upload once
      this._createAndUploadBuffers();

      this.modelLoaded = true;
    } catch (err) {
      console.error("Error loading OBJ model:", err);
    }
  }

  _ensureTriList(pos, uv, nrm, idx) {
    // If there's no index, assume pos/uv/nrm are already per-vertex
    if (!idx) {
      return {
        positions: new Float32Array(pos),
        uvs: uv ? new Float32Array(uv) : null,
        normals: nrm ? new Float32Array(nrm) : null,
      };
    }

    // Expand indexed geometry to a triangle list
    const index = Array.isArray(idx) ? idx : Array.from(idx);
    const positions = new Float32Array(index.length * 3);
    const uvs = uv ? new Float32Array(index.length * 2) : null;
    const normals = nrm ? new Float32Array(index.length * 3) : null;

    for (let i = 0; i < index.length; ++i) {
      const vi = index[i];

      // positions
      positions[i * 3 + 0] = pos[vi * 3 + 0];
      positions[i * 3 + 1] = pos[vi * 3 + 1];
      positions[i * 3 + 2] = pos[vi * 3 + 2];

      // uvs (optional)
      if (uvs && uv) {
        uvs[i * 2 + 0] = uv[vi * 2 + 0];
        uvs[i * 2 + 1] = uv[vi * 2 + 1];
      }

      // normals (optional)
      if (normals && nrm) {
        normals[i * 3 + 0] = nrm[vi * 3 + 0];
        normals[i * 3 + 1] = nrm[vi * 3 + 1];
        normals[i * 3 + 2] = nrm[vi * 3 + 2];
      }
    }
    return { positions, uvs, normals };
  }

  _computeFlatNormals(positions) {
    // positions is a triangle list: 3 verts per triangle
    const count = positions.length / 3;
    const triCount = Math.floor(count / 3);
    const normals = new Float32Array(positions.length);

    for (let t = 0; t < triCount; ++t) {
      const i0 = t * 9, i1 = i0 + 3, i2 = i0 + 6;
      const p0 = [positions[i0], positions[i0 + 1], positions[i0 + 2]];
      const p1 = [positions[i1], positions[i1 + 1], positions[i1 + 2]];
      const p2 = [positions[i2], positions[i2 + 1], positions[i2 + 2]];

      const e1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
      const e2 = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
      // face normal
      let nx = e1[1] * e2[2] - e1[2] * e2[1];
      let ny = e1[2] * e2[0] - e1[0] * e2[2];
      let nz = e1[0] * e2[1] - e1[1] * e2[0];
      const invL = 1.0 / Math.hypot(nx, ny, nz || 1e-9);
      nx *= invL; ny *= invL; nz *= invL;

      normals.set([nx, ny, nz], i0);
      normals.set([nx, ny, nz], i1);
      normals.set([nx, ny, nz], i2);
    }
    return normals;
  }

  _createAndUploadBuffers() {
    const gl = this.gl;
    const { ARRAY_BUFFER, STATIC_DRAW } = gl;

    // Create buffers
    this.vbo = gl.createBuffer();
    if (this.hasUV) this.tbo = gl.createBuffer();
    if (this.hasNormal) this.nbo = gl.createBuffer();

    // Upload positions
    gl.bindBuffer(ARRAY_BUFFER, this.vbo);
    gl.bufferData(ARRAY_BUFFER, this.vertices, STATIC_DRAW);

    // Upload UVs if present
    if (this.hasUV) {
      gl.bindBuffer(ARRAY_BUFFER, this.tbo);
      gl.bufferData(ARRAY_BUFFER, this.uvs, STATIC_DRAW);
    }

    // Upload normals if present
    if (this.hasNormal) {
      gl.bindBuffer(ARRAY_BUFFER, this.nbo);
      gl.bufferData(ARRAY_BUFFER, this.normals, STATIC_DRAW);
    }

    gl.bindBuffer(ARRAY_BUFFER, null);
    this.uploaded = true;
  }

  // ------------- Render -------------
  render(shaderVars, normalControllerState) {
    if (!this.modelLoaded || !this.uploaded || !this.vertices) return;

    const gl = this.gl;
    const tex = normalControllerState ? -3 : this.textureAtlasNum;

    // uniforms
    gl.uniform1i(shaderVars.uniforms.u_ShapeType, ObjectClass.SCAN);
    gl.uniform1i(shaderVars.uniforms.u_ShapeType2, ObjectClass.SCAN);
    gl.uniform1i(shaderVars.uniforms.u_whichTexture, tex);
    gl.uniform4f(shaderVars.uniforms.u_FragColor, ...this.color);

    // Optional feature flags
    if (shaderVars.uniforms.u_HasUV) gl.uniform1i(shaderVars.uniforms.u_HasUV, this.hasUV ? 1 : 0);
    if (shaderVars.uniforms.u_HasNormal) gl.uniform1i(shaderVars.uniforms.u_HasNormal, this.hasNormal ? 1 : 0);

    // matrices
    gl.uniformMatrix4fv(shaderVars.uniforms.u_ModelMatrix, false, this.matrix.elements);
    this.normalMatrix.set(this.matrix).invert().transpose();
    gl.uniformMatrix4fv(shaderVars.uniforms.u_NormalMatrix, false, this.normalMatrix.elements);

    // --- positions -> location 0 ---
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    // --- uvs: optional ---
    if (shaderVars.attribs?.a_UV != null) {
      if (this.hasUV) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
        gl.vertexAttribPointer(shaderVars.attribs.a_UV, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderVars.attribs.a_UV);
      } else {
        // Disable the array and set a constant (0,0)
        gl.disableVertexAttribArray(shaderVars.attribs.a_UV);
        gl.vertexAttrib2f(shaderVars.attribs.a_UV, 0.0, 0.0);
      }
    }

    // --- normals: optional ---
    if (shaderVars.attribs?.a_Normal != null) {
      if (this.hasNormal) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
        gl.vertexAttribPointer(shaderVars.attribs.a_Normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(shaderVars.attribs.a_Normal);
      } else {
        // EITHER: provide a constant normal (no lighting variation)
        gl.disableVertexAttribArray(shaderVars.attribs.a_Normal);
        gl.vertexAttrib3f(shaderVars.attribs.a_Normal, 0.0, 0.0, 1.0);

        // OR (alternative): compute CPU normals like in _computeFlatNormals and upload once.
        // To switch to that behavior, generate normals in load and set hasNormal=true.
      }
    }

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);

    // unbind for hygiene
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}