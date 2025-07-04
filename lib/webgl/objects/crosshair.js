import { createProgram } from "./../third-party/cuon-utils.js";
import { debugLog, ObjectClass } from "../utils.js";

const debugkey = "objects_crosshair";

debugLog(debugkey, "Loading crosshiar...");

/**
 * Represents a crosshair object.
 */
export class Crosshair {
    constructor(gl) {
        this.type = ObjectClass.CROSSHAIR;
        this.gl = gl;

        this.lineLength = 0.02; // Half-size
        this.aspect = window.innerWidth * devicePixelRatio / (window.innerHeight * devicePixelRatio); // Initial aspect
        this.vertices = new Float32Array([
            -this.lineLength,
            0.0, // horizontal left
            this.lineLength,
            0.0, // horizontal right
            0.0,
            -this.lineLength * this.aspect, // vertical down (corrected)
            0.0,
            this.lineLength * this.aspect, // vertical up (corrected)
        ]);

        this.program = null;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.a_position = null;
        this.setProgram();
    }

    /**
     * Recalculates the crosshair vertices based on the current aspect ratio.
     */
    changeAspect(aspect) {
        this.aspect = aspect;

        // Recalculate the vertices based on the new aspect ratio
        this.vertices = new Float32Array([
            -this.lineLength,
            0.0, // horizontal left
            this.lineLength,
            0.0, // horizontal right
            0.0,
            -this.lineLength * this.aspect, // vertical down (corrected)
            0.0,
            this.lineLength * this.aspect, // vertical up (corrected)
        ]);

        // Update the vertex buffer with the new vertices
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        
    }

    // sets the program(shaders)
    setProgram() {
        const gl = this.gl;
        this.vertexShader = `#version 300 es

        layout(location = 0) in vec2 a_position;

        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
        `;

        this.fragmentShader = `#version 300 es
        precision mediump float;

        out vec4 fragColor;

        void main() {
            fragColor = vec4(1.0); // white
        }
        `;
        // Shaders
        this.program = createProgram(gl, this.vertexShader, this.fragmentShader);
        gl.useProgram(this.program);

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    }


    // utilize its own program to render crosshair
    render() {
        const gl = this.gl;
        const oldProgram = gl.getParameter(gl.CURRENT_PROGRAM); // Save current program

        gl.useProgram(this.program);
        gl.disable(gl.DEPTH_TEST); // so it draws over everything

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, 4);

        gl.enable(gl.DEPTH_TEST); // restore state if needed
        gl.useProgram(oldProgram); // Restore previous program
    }
}
