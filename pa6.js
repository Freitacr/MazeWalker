// The WebGL object
var gl;

// The HTML canvas
var canvas;

var grid;    // The reference grid
var axes;    // The coordinate axes
var camera;  // The camera

var angle = 0;

// Uniform variable locations
var uni = {
    uModel: null,
    uView: null,
    uProj: null,
    uEmissive: null,
    uAmbient: null,
    uDiffuse: null,
    uSpecular: null,
    uShine: null,
    uLightPos: null,
    uLightIntensity: null,
    uAmbientLight: null,
    uHasDiffuseTex: null,
    uDiffuseTex: null
};

var moveSpeed = 2.1;

var lightPos = vec3.fromValues(1,0,0);
var lightDist = 1;
var lightRotation = 0;

var lightMode = 0;

var getLocations = function(program, uni) {
    uni.uModel = gl.getUniformLocation(program, "uModel");
    uni.uView = gl.getUniformLocation(program, "uView");
    uni.uProj = gl.getUniformLocation(program, "uProj");

    uni.uEmissive = gl.getUniformLocation(program, "uEmissive");
    uni.uAmbient = gl.getUniformLocation(program, "uAmbient");
    uni.uDiffuse = gl.getUniformLocation(program, "uDiffuse");
    uni.uSpecular = gl.getUniformLocation(program, "uSpecular");
    uni.uShine = gl.getUniformLocation(program, "uShine");
    
    uni.uLightPos = gl.getUniformLocation(program, "uLightPos");
    uni.uLightIntensity = gl.getUniformLocation(program, "uLightIntensity");
    uni.uAmbientLight = gl.getUniformLocation(program, "uAmbientLight");

    uni.uHasDiffuseTex = gl.getUniformLocation(program, "uHasDiffuseTex");
    uni.uDiffuseTex = gl.getUniformLocation(program, "uDiffuseTex");
}

/**
 * Initialize the WebGL context, load/compile shaders, and initialize our shapes.
 */
var init = function() {
    
    // Set up WebGL
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    // Set the viewport transformation
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Set the background color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    
    // Enable the z-buffer
    gl.enable(gl.DEPTH_TEST);

    // Load and compile shaders
    program = Utils.loadShaderProgram(gl, "vertex-shader", "fragment-shader");
    //program2 = Utils.loadShaderProgram(gl, "gouraud-vert-shader", "gouraud-frag-shader")
    gl.useProgram(program);

    // Find the uniform variable locations
    getLocations(program, uni);

    gl.uniform3fv(uni.uLightIntensity, Float32Array.from([1,1,1]));
    gl.uniform3fv(uni.uAmbientLight, Float32Array.from([1,1,1]));

    // Initialize our shapes
    Shapes.init(gl);
    grid = new Grid(gl, 20.0, 20, Float32Array.from([0.7,0.7,0.7]));
    axes = new Axes(gl, 2.5, 0.05);

    // Initialize the camera
    camera = new Camera( canvas.width / canvas.height );

    setupEventHandlers();

    gl.uniform1i(uni.uDiffuseTex, 0);

    // Start the animation sequence
    Promise.all([
        Obj.load(gl, "media/Teapot/teapot.obj"),
        Utils.loadTexture(gl, "media/Teapot/default.png"),
        Utils.loadTexture(gl, "media/DiskUV.png"),
        Utils.loadTexture(gl, "media/CylinderUV.png")
    ]).then (function(values) {
        Shapes.spot = values[0];
        Textures["default.png"] = values[1];
        Textures["DiskUV.png"] = values[2];
        Textures["CylinderUV.png"] = values[3];
        console.log(Textures);

        Shapes.spot.meshes.forEach(function(m) {
            console.log("Material of Cube: " + toString(m.material));
            m.material = new Material();
            m.material.diffuseTexture = "default.png";
        });

        render();
    });
    
};

/**
 * Render the scene!
 */
var render = function() {
    // Request another draw
    window.requestAnimFrame(render, canvas);

    // Update camera when in fly mode
    updateCamera();

    // Clear the color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set projection and view matrices 
    gl.uniformMatrix4fv(uni.uView, false, camera.viewMatrix());
    gl.uniformMatrix4fv(uni.uProj, false, camera.projectionMatrix());

    if (lightMode == 0) {
        let currCamLightPos = vec3.create();
        vec3.transformMat4(currCamLightPos, lightPos, camera.viewMatrix());
        gl.uniform3fv(uni.uLightPos, Float32Array.from(currCamLightPos));
    }
    else
        gl.uniform3fv(uni.uLightPos, Float32Array.from([0,0,0]));

    

    drawAxesAndGrid();
    drawScene();
};

/**
 * Draw the objects in the scene.  
 */
var drawScene = function() {
    let model = mat4.create();

    // Draw a red cube, translated
    mat4.fromTranslation(model, vec3.fromValues(1.0,0.5,1.5));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    var redMaterial = new Material();
    redMaterial.diffuse = vec3.fromValues(1.0, 0.1, 0.1);
    redMaterial.specular = vec3.fromValues(0.5, 0.5, 0.5);
    redMaterial.diffuseTexture = "CubeTex.png";
    Shapes.cube.render(gl, uni, redMaterial);

    if (!lightMode) {
    // Draw a cube to represent the light's current position
    mat4.fromTranslation(model, lightPos);
    gl.uniformMatrix4fv(uni.uModel, false, model);
    var lightMaterial = new Material();
    lightMaterial.emissive = vec3.fromValues(1.0, 1.0, 1.0);
    Shapes.cube.render(gl, uni, lightMaterial);
    }

    // Draw a blue cube, translated and scaled
    mat4.fromTranslation(model, vec3.fromValues(-0.75,1.0,0.75));
    mat4.rotateX(model, model, -(angle))
    mat4.rotateY(model, model, -(angle))
    mat4.scale(model, model, vec3.fromValues(0.5, 2.0, 0.5));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cube.render(gl, uni);

    //Draw a green disk, translated and rotated
    mat4.fromTranslation(model, vec3.fromValues(0.0, 1.0, 0.0));
    mat4.rotateX(model, model, -(Math.PI / 2) );
    gl.uniformMatrix4fv(uni.uModel, false, model);
    var greenMaterial = new Material();
    greenMaterial.diffuseTexture = "DiskUV.png";
    Shapes.disk.render(gl, uni, greenMaterial);

    //Draw a yellow cylinder, translated

    mat4.fromTranslation(model, vec3.fromValues(2.0, 1.0, 2.0));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    var yellowMaterial = new Material();
    yellowMaterial.diffuse = vec3.fromValues(1.0, 1.0, 0.0);
    //yellowMaterial.specular = vec3.fromValues(0.5, 0.5, 0.5);
    yellowMaterial.diffuseTexture = "CylinderUV.png"

    Shapes.cylinder.render(gl, uni, yellowMaterial);

    mat4.fromTranslation(model, vec3.fromValues(-5.0, 0.0, 0.0));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.spot.render(gl, uni);

    angle = angle + 0.1;
    angle = angle >= 2 * Math.PI ? angle - (2 * Math.PI) : angle;

};

/**
 * Draws the reference grid and coordinate axes.
 */
var drawAxesAndGrid = function() {
    // Set model matrix to identity
    gl.uniformMatrix4fv(uni.uModel, false, mat4.create());
    // Draw grid
    grid.render(gl,uni);
    // Draw Axes
    axes.render(gl,uni);
};

//////////////////////////////////////////////////
// Event handlers
//////////////////////////////////////////////////

/**
 * An object used to represent the current state of the mouse.
 */
mouseState = {
    prevX: 0,     // position at the most recent previous mouse motion event
    prevY: 0, 
    x: 0,          // Current position
    y: 0,      
    button: 0,     // Left = 0, middle = 1, right = 2
    down: false,   // Whether or not a button is down
    wheelDelta: 0  // How much the mouse wheel was moved
};
var cameraMode = 0;          // Mouse = 0, Fly = 1
var downKeys = new Set();    // Keys currently pressed

var setupEventHandlers = function() {
    let modeSelect = document.getElementById("camera-mode-select");
    let lightModeSelect = document.getElementById("light-mode-select");
    let shaderSelect = document.getElementById("shader-selection");
    // Disable the context menu in the canvas in order to make use of
    // the right mouse button.
    canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    modeSelect.addEventListener("change", 
        function(e) {
            let val = e.target.value;
            if( val === "0" )
                cameraMode = 0;
            else if( val === "1" ) 
                cameraMode = 1;
        }
    );

    lightModeSelect.addEventListener("change",
        function(e) {
            let val = e.target.value;
            if (val === "0")
                lightMode = 0;
            else if ( val === "1")
                lightMode =1;
        }
    );

    canvas.addEventListener("mousemove", 
        function(e) {
            if( mouseState.down ) {
                mouseState.x = e.pageX - this.offsetLeft;
                mouseState.y = e.pageY - this.offsetTop;
                mouseDrag();
                mouseState.prevX = mouseState.x;
                mouseState.prevY = mouseState.y;
            }
        });
    canvas.addEventListener("mousedown", function(e) {
        mouseState.x = e.pageX - this.offsetLeft;
        mouseState.y = e.pageY - this.offsetTop;    
        mouseState.down = true;
        mouseState.prevX = mouseState.x;
        mouseState.prevY = mouseState.y;
        mouseState.button = e.button;
    } );
    canvas.addEventListener("mouseup", function(e) {
        mouseState.x = e.pageX - this.offsetLeft;
        mouseState.y = e.pageY - this.offsetTop;
        mouseState.down = false;
        mouseState.prevX = 0;
        mouseState.prevY = 0;
    } );
    canvas.addEventListener("wheel", function(e) {
        e.preventDefault();
        mouseState.wheelDelta = e.deltaY;
        if (!cameraMode)
            camera.dolly(mouseState.wheelDelta / 16);
        // TODO: Update camera if necessary.
    } );
    document.addEventListener("keydown", function(e) {
        downKeys.add(e.code);
    });
    document.addEventListener("keyup", function(e) {
        downKeys.delete(e.code);
    });
};

/**
 * Check the list of keys that are currently pressed (downKeys) and
 * update the camera appropriately.  This function is called 
 * from render() every frame.
 */
var updateCamera = function() {
    if (downKeys.size) {
        if (downKeys.has("Space")) {
            camera.reset();   
        } else if (cameraMode) {
            //Do the further checks
            if (downKeys.has("KeyA"))
                camera.track(-moveSpeed, 0)
            else if (downKeys.has("KeyD"))
                camera.track(moveSpeed, 0)
            if (downKeys.has("KeyQ"))
                camera.track(0, -moveSpeed);
            else if (downKeys.has("KeyE")) 
                camera.track(0, moveSpeed);
            if (downKeys.has("KeyW"))
                camera.dolly(-moveSpeed / 16)
            else if (downKeys.has("KeyS"))
                camera.dolly(moveSpeed / 16)
            //console.log(downKeys);
        }
        if (!lightMode) {
            if (downKeys.has("ArrowLeft")) { 
                lightDist += moveSpeed / 10;
            } else if (downKeys.has("ArrowRight")) {
                lightDist -= moveSpeed / 10;
            }
            if (downKeys.has("KeyR")) {
                lightRotation += moveSpeed / (10 / (1 / lightDist)) ;
                lightRotation %= Math.PI * 2;
            }
            if (downKeys.has("ArrowUp")) {
                lightPos[1] += moveSpeed / 10;
            } else if (downKeys.has("ArrowDown")) {
                lightPos[1] -= moveSpeed / 10;
            }
            lightPos[0] = Math.cos(lightRotation) * lightDist;
            lightPos[2] = Math.sin(lightRotation) * lightDist;
        }
    }
    // TODO: Implement this method
};

/**
 * Called when a mouse motion event occurs and a mouse button is 
 * currently down.
 */
var mouseDrag = function () {
    // TODO: Implement this method
    
    if (mouseState.button == 2) {
        if (!cameraMode)
            camera.track(mouseState.x - mouseState.prevX, mouseState.y - mouseState.prevY);
        else
            camera.turn(mouseState.x - mouseState.prevX, mouseState.y - mouseState.prevY);
    } else if (!mouseState.button) {
        if (!cameraMode)
            camera.orbit(mouseState.x - mouseState.prevX, mouseState.y - mouseState.prevY)
        else
            camera.turn(mouseState.x - mouseState.prevX, mouseState.y - mouseState.prevY)    
        
    }
};

// When the HTML document is loaded, call the init function.
window.addEventListener("load", init);
