/**
 * A constructor function for a Camera object.  Sets a default
 * camera frustum, position and orientation.
 * 
 * @param {Number} aspect camera's (viewport's) aspect ratio
 */
var Camera = function(aspect) {
    //
    // Parameters for the perspective frustum
    //
    this.fov = Math.PI / 3.0;     // The field of view
    this.near = 0.5;              // The distance to the near plane
    this.far = 200.0;             // The distance to the far plane
    this.aspect = aspect;         // The aspect ratio

    //
    // Parameters for the camera's position and orientation
    //
    this.eye = vec3.create();          // The camera's position

    // The camera's orientation as a rotation matrix.  This rotation should contain
    // the camera's u, v and n vectors in world space.  Should they be the first 
    // three rows or columns of this matrix?    
    this.rotation = mat4.create();

    // Defaults for when the camera is reset (reset method)
    this.lookAt( vec3.fromValues(3,.5,1), vec3.fromValues(0,0,0), vec3.fromValues(0,1,0) );
    this.defaultEye = vec3.clone( this.eye );
    this.defaultRotation = mat4.clone( this.rotation );
};

/**
 * Resets this camera to the default position and orientation.
 */
Camera.prototype.reset = function() {
    this.lookAt( vec3.fromValues(0,5,10), vec3.fromValues(0,0,0), vec3.fromValues(0,1,0) );
};

/**
 * Set the position and orientation of this camera based on the
 * given parameters.  This method should only modify this.eye and
 * this.rotation.
 * 
 * @param {vec3} pos camera position
 * @param {vec3} at point that the camera is facing toward
 * @param {vec3} up the general upward direction for the camera 
 */
Camera.prototype.lookAt = function( pos, at, up ) {
    // TODO: Implement this method
    let vecN = vec3.create();
    vec3.sub(vecN, pos, at);
    let vecU = vec3.create();
    vec3.cross(vecU, up, vecN);
    let vecV = vec3.create();
    vec3.cross(vecV, vecN, vecU);

    vec3.normalize(vecN, vecN);
    vec3.normalize(vecU, vecU);
    vec3.normalize(vecV, vecV);

    let newRotation = mat4.create();

    let vecs = [vecN, vecU, vecV]
    

    newRotation[0] = vecU[0]
    newRotation[4] = vecU[1]
    newRotation[8] = vecU[2]
    
    newRotation[1] = vecV[0]
    newRotation[5] = vecV[1]
    newRotation[9] = vecV[2]
    
    newRotation[2] = vecN[0]
    newRotation[6] = vecN[1]
    newRotation[10] = vecN[2]
    
    mat4.copy(this.rotation, newRotation)
    vec3.copy(this.eye, pos)
};

/**
 * Sets this camera's rotation matrix based on the camera's axes in 
 * world coordinates.
 * 
 * @param {vec3} u camera's u/x axis
 * @param {vec3} v camera's v/y axis
 * @param {vec3} n camera's n/z axis
 */
Camera.prototype.setRotation = function(u, v, n) {
    // TODO: implement this method.
};

/**
 * Computes and returns the view matrix for this camera.  
 * Essentially the product of this.rotation and an appropriate
 * translation based on this.eye.
 * 
 * @returns {mat4} the view matrix for this camera
 */
Camera.prototype.viewMatrix = function() {
    // TODO: Implement this function to return the view matrix 
    // using this.eye and this.rotation.  Hint, it should be the product
    // of a translation and a rotation.  In what order?

    // This is a placeholder only and should be replaced
    let ret = mat4.create();
    ret = mat4.fromTranslation(ret, vec3.fromValues(-this.eye[0], -this.eye[1], -this.eye[2]) );
    ret = mat4.multiply(ret, this.rotation, ret);

    return ret;
};

/**
 * Computes and returns the projection matrix based on this camera.
 * @returns {mat4} the projection matrix.
 */
Camera.prototype.projectionMatrix = function() {
    return mat4.perspective(mat4.create(), this.fov, this.aspect, this.near, this.far);
};

/**
 * Orbits this camera object by changing this.eye and this.rotation.  
 * The mouse's delta x corresponds to a rotation around the world y axis, 
 * and the mouse's delta y corresponds to a rotation round the camera's 
 * x axis through the origin.
 * 
 * @param {Number} dx the change in the mouse's x coordinate
 * @param {Number} dy the change in the mouse's y coordinate
 */
Camera.prototype.orbit = function(dx, dy) {
    var rotationMat = mat4.create();
    mat4.rotate(rotationMat, rotationMat, dy / 16, vec3.fromValues(this.rotation[0], this.rotation[4], this.rotation[8]))
    mat4.rotateY(rotationMat, rotationMat, dx / 16);
    //mat4.multiply(rotationMat, rotationMat, mat4.fromRotation(mat4.create(), dy / 16, vec3.fromValues(this.rotation[0], this.rotation[4], this.rotation[8])))

    var tempMat = mat4.create();
    mat4.multiply(tempMat, this.viewMatrix(), rotationMat);
    //mat4.multiply(rotationMat, this.rotation, rotationMat)

    this.rotation = mat4.create();

    this.rotation[0] = tempMat[0]
    this.rotation[1] = tempMat[1]
    this.rotation[2] = tempMat[2]
    this.rotation[4] = tempMat[4]
    this.rotation[5] = tempMat[5]
    this.rotation[6] = tempMat[6]
    this.rotation[8] = tempMat[8]
    this.rotation[9] = tempMat[9]
    this.rotation[10] = tempMat[10]

    var transMat = mat4.create();

    mat4.transpose(transMat, this.rotation)
    
    mat4.multiply(transMat, transMat, tempMat);

    //console.log(transMat[12])
    //console.log(transMat[13])
    //console.log(transMat[14])

    this.eye[0] = -transMat[12]
    this.eye[1] = -transMat[13]
    this.eye[2] = -transMat[14]

    //this.lookAt(this.eye, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0))

    //vec3.rotateY(this.eye, this.eye, vec3.fromValues(0,this.eye[1],0), dx / 16)
    /*
    rotationMat = this.turn(-dx, dy);
    
    mat4.transpose(rotationMat, rotationMat);

    var transMat = mat4.create();
    mat4.multiply(transMat, rotationMat, this.rotation);
    console.log(transMat);

    //Now begins the portion that will likely fail.
    var angleX, angleY;
    angleX = vec3.dot(vec3.fromValues(this.rotation[0],this.rotation[4],this.rotation[8]), vec3.fromValues(1,0,0))
    //angleY = vec3.dot(vec3.fromValues(0, 0, 0), vec3.fromValues(0,0,0))
    angleX = Math.acos(angleX)
    //angleY = Math.acos(angleY)

    var eyeClone = vec3.clone(this.eye);
    var transPos = vec3.create();
    vec3.rotateY(eyeClone, eyeClone, vec3.fromValues(0,0,0), angleX);
    console.log("CurrPos: " + this.eye)
    console.log("ClonePos: " + eyeClone)
    vec3.subtract(transPos, this.eye, eyeClone)
    console.log("TransPos: " + vec3.normalize(transPos, transPos))
    console.log(angleX)
    console.log("\n")
    */
    
    // TODO: Implement this method 
};

/**
 * Moves this camera along it's z/n axis.  Updates this.eye 
 * 
 * @param {Number} delta the mouse wheel's delta
 */
Camera.prototype.dolly = function(delta) {
    var vecN = vec3.fromValues(this.rotation[2], this.rotation[6], this.rotation[10])

    vecN[0] *= delta;
    vecN[1] *= delta;
    vecN[2] *= delta;

    vec3.add(this.eye, this.eye, vecN);
    //console.log(vecN)
    //this.lookAt(this.eye, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0))
    //console.log("Dolly was called");
    
};

/**
 * Moves this camera along it's x/y axes.  Updates this.eye 
 * 
 * @param {Number} dx the change in the mouse's x coordinate
 * @param {Number} dy the change in the mouse's y coordinate
 */
Camera.prototype.track = function(dx, dy) {
    //so change the dx, dy into their components in terms of this.eye[0:3]
    var vecU = vec3.fromValues(this.rotation[0], this.rotation[4], this.rotation[8])
    var speedX = dx / 16
    this.eye[0] += vecU[0] * (speedX);
    this.eye[2] += vecU[2] * speedX;
    //For this I'm going to assume that the up direction is (0,1,0), and not account for scenarios in which this is not true.
    this.eye[1] -= (dy / 16);
    //this.lookAt(this.eye, vec3.fromValues(0,0,0), vec3.fromValues(0,1,0))
    // TODO: Implement this method
};

/**
 * Update this camera by changing rotating the camera's three axes.
 * The mouse's delta x corresponds to a rotation around the 
 * world y axis (0,1,0), the mouse's delta y corresponds to a rotation
 * around the camera's u/x axis.
 * 
 * @param {Number} dx the change in the mouse's x coordinate
 * @param {Number} dy the change in the mouse's y coordinate
 */
Camera.prototype.turn = function( dx, dy ) {
    var rotMat = mat4.fromRotation(mat4.create(), dy / 16, vec3.fromValues(this.rotation[0], this.rotation[4], this.rotation[8]))
    mat4.multiply(rotMat, rotMat, mat4.fromRotation(mat4.create(), dx / 16, vec3.fromValues(0,1,0)))

    mat4.multiply(this.rotation, this.rotation, rotMat)

    //mat4.multiply(this.rotation, this.rotation, mat4.fromRotation(mat4.create(), dx / 16, vec3.fromValues(0,1,0)));
    //mat4.multiply(this.rotation, this.rotation, mat4.fromRotation(mat4.create(), dy / 16, vec3.fromValues(this.rotation[0], this.rotation[4], this.rotation[8])))
    // TODO: Implement this method
};
