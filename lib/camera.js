class Camera {
    constructor(g_eye, g_at, g_up, field_angle, asp_ratio, near_plane, far_plane, gl, u_ViewMatrix, u_ProjectionMatrix, canvas) {

        this.eye = new Vector3([-14, 0, 14]);
        this.fov = field_angle;
        this.near = near_plane;
        this.far = far_plane;
        this.aspect = asp_ratio;
        this.at = new Vector3([-0.01, 0.5, -0.01]);
        this.up = new Vector3([0, 1, 0]);

        this.right = Vector3.cross(this.at, this.up);
        this.right.normalize();

        this.speed = 0.2;
        this.alpha = 0.5;

        this.viewMatrix = new Matrix4();
        this.projectionMatrix = new Matrix4();

        this.updateViewMatrix(gl, u_ViewMatrix);
        this.updateProjectionMatrix(gl, u_ProjectionMatrix);
        this.gl = gl;
        this.canvas = canvas;
    }

    update() {
        this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
        this.viewMatrix.setLookAt(this.cameraX, this.cameraY,this.cameraZ,this.directionX, this.directionY, this.directionZ,this.upX, this.upY, this.upZ);
        // gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projMat.elements);
        // gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMat.elements);
    }

    changeFov (fov, gl) {
        this.fov = fov;
        this.updateProjectionMatrix(this.gl);
    }

    changeNEAR (near, gl) {
        this.near = near;
        this.updateProjectionMatrix(this.gl);
    }

    changeFAR (far, gl) {
        this.far = far;
        this.updateProjectionMatrix(this.gl);
    }

    isColliding(newPos) {
        // let gridX = Math.floor(newPos.elements[0] + renderer.rows / 2);
        // let gridY = Math.floor(newPos.elements[2] + renderer.cols / 2);
      
        // // Check if we're out of bounds. You might decide whether that is allowed or not.
        // if (gridX < 0  || gridX >= renderer.rows || gridY < 0 || gridY >= renderer.cols) {
        //   return true; // Prevent movement out of bounds.
        // }
      
        // Return true if the cell is occupied (nonzero)
        // return renderer.g_map[gridX][gridY] !== 0;

        return false
    }

    moveForward (gl, u_ViewMatrix) {
        var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
        f.sub(this.eye);
        f.normalize();

        f.mul(this.speed);

        let newEye = this.eye.clone().add(f);

        // Check if the new position would be inside a block.
        if (!this.isColliding(newEye)) {
            // If not, update the camera position.
            this.eye = newEye;
            this.at = this.at.clone().add(f);
            this.updateViewMatrix(gl, u_ViewMatrix);
        } else {
            console.log("Collision detected! Movement blocked.");
        }
    }

    moveBackward(gl, u_ViewMatrix) {
        var b = new Vector3([this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]]);
        b.sub(this.at);
        b.normalize();

        b.mul(this.speed);

        let newEye = this.eye.clone().add(b);

        // Check if the new position would be inside a block.
        if (!this.isColliding(newEye)) {
            // If not, update the camera position.
            this.eye = newEye;
            this.at = this.at.clone().add(b);
            this.updateViewMatrix(gl, u_ViewMatrix);
        } else {
            console.log("Collision detected! Movement blocked.");
        }
    }

    moveLeft(gl, u_ViewMatrix) {
        var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
        f.sub(this.eye);
        f.normalize();

        var s = Vector3.cross(this.up, f);
        s.normalize();
        s.mul(this.speed);

        let newEye = this.eye.clone().add(s);

        // Check if the new position would be inside a block.
        if (!this.isColliding(newEye)) {
            // If not, update the camera position.
            this.eye = newEye;
            this.at = this.at.clone().add(s);
            this.updateViewMatrix(gl, u_ViewMatrix);
        } else {
            console.log("Collision detected! Movement blocked.");
        }
    }

    moveRight(gl, u_ViewMatrix) {
        var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
        f.sub(this.eye);
        f.normalize();

        var s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(this.speed);

        let newEye = this.eye.clone().add(s);

        // Check if the new position would be inside a block.
        if (!this.isColliding(newEye)) {
            // If not, update the camera position.
            this.eye = newEye;
            this.at = this.at.clone().add(s);
            this.updateViewMatrix(gl, u_ViewMatrix);
        } else {
            console.log("Collision detected! Movement blocked.");
        }
    }

    panLeft(gl, u_ViewMatrix) {
        var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
        f.sub(this.eye);
        f.normalize();

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.at.elements[0] = this.eye.elements[0];
        this.at.elements[1] = this.eye.elements[1];
        this.at.elements[2] = this.eye.elements[2];
        this.at.add(f_prime);

        this.updateViewMatrix(gl, u_ViewMatrix);
    }

    panRight(gl, u_ViewMatrix) {
        var f = new Vector3([this.at.elements[0], this.at.elements[1], this.at.elements[2]]);
        f.sub(this.eye);
        f.normalize();

        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-this.alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        var f_prime = rotationMatrix.multiplyVector3(f);

        this.at.elements[0] = this.eye.elements[0];
        this.at.elements[1] = this.eye.elements[1];
        this.at.elements[2] = this.eye.elements[2];
        this.at.add(f_prime);

        this.updateViewMatrix(gl, u_ViewMatrix);
    }

    updateViewMatrix(gl, u_ViewMatrix) {
        console.log("updateview matrix called");
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2],
            this.at.elements[0], this.at.elements[1], this.at.elements[2],
            this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        gl.uniformMatrix4fv(u_ViewMatrix, false, this.viewMatrix.elements);
    }

    updateProjectionMatrix(gl, u_ProjectionMatrix) {
        console.log("updateprojectionmatrix called");
        this.projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
        gl.uniformMatrix4fv(u_ProjectionMatrix, false, this.projectionMatrix.elements);
    }
}