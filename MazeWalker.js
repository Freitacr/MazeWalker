// The WebGL object
var gl;

// The HTML canvas
var canvas;

var camera;  // The camera
var moveSpeed = 2.1;

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

var lightPos = vec3.fromValues(0,0,0);

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

var HorizontalWallMaterial = new Material();
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
    


    gl.useProgram(program);

    // Find the uniform variable locations
    getLocations(program, uni);

    gl.uniform3fv(uni.uLightIntensity, Float32Array.from([1,1,1]));
    gl.uniform3fv(uni.uAmbientLight, Float32Array.from([1,1,1]));

    // Initialize our shapes
    Shapes.init(gl);

    // Initialize the camera
    camera = new Camera( canvas.width / canvas.height );

    HorizontalWallMaterial.diffuseTexture = "BlenderMockups/HorizontalWallUV.png";

    setupEventHandlers();
    camera = new Camera( canvas.width / canvas.height );

    gl.uniform1i(uni.uDiffuseTex, 0);
    var mazeSize = 32;
    var pathSize = 15;
    maze = createMaze(mazeSize)

    // Start the animation sequence
    Promise.all([
        Utils.loadTexture(gl, "BlenderMockups/HorizontalWallUV.png"),
        Utils.loadTexture(gl, "media/Cube/CubeTex.png"),
        Obj.load(gl, "media/Cube/cube.obj")
    ]).then (function(values) {
        Textures["BlenderMockups/HorizontalWallUV.png"] = values[0];
        Textures["CubeTex.png"] = values[1];
        Shapes.skybox = values[2];
        //Sets the meshes forcefully because the object loader is... whack sometimes.
        Shapes.skybox.meshes.forEach( function(m) {
            m.material.diffuseTexture = "CubeTex.png"
        })
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



    gl.uniform3fv(uni.uLightPos, Float32Array.from(lightPos)); // The overall lighting should be attatched to the player

    
    drawScene();
};

/**
 * Draw the objects in the scene.  
 */
var drawScene = function() {
    let model = mat4.create();


    mat4.fromTranslation(model, vec3.fromValues(1.0,0.5,1.5));
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.cube.render(gl,uni,HorizontalWallMaterial);

    model = mat4.create();
    mat4.scale(model, model, vec3.fromValues(0.5,0.5,0.5))
    gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.skybox.render(gl, uni)
    
    //model = mat4.create();
    //mat4.scale(model, model, vec3.fromValues(mazeSize,mazeSize,mazeSize))
    //gl.uniformMatrix4fv(uni.uModel, false, model);
    Shapes.quad.render(gl,uni);
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


var cameraMode = 1;          // Mouse = 0, Fly = 1


var downKeys = new Set();    // Keys currently pressed

var setupEventHandlers = function() {
    // Disable the context menu in the canvas in order to make use of
    // the right mouse button.
    canvas.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    canvas.addEventListener("mousemove", 
        function(e) {
            if(mouseState.down) {
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
        }
        if (downKeys.has("KeyA"))
                camera.track(-moveSpeed, 0)
        if (downKeys.has("KeyD"))
                camera.track(moveSpeed, 0)
        if (downKeys.has("KeyQ"))
                camera.track(0, -moveSpeed);
        if (downKeys.has("KeyE")) 
                camera.track(0, moveSpeed);
        if (downKeys.has("KeyW"))
                camera.dolly(-moveSpeed / 16)
        if (downKeys.has("KeyS"))
                camera.dolly(moveSpeed / 16)
    }
};

/**
 * Called when a mouse motion event occurs and a mouse button is 
 * currently down.
 */
var mouseDrag = function () {
    if (mouseState.button == 2) {
        camera.turn(mouseState.x - mouseState.prevX, mouseState.y - mouseState.prevY);
    }
};

// When the HTML document is loaded, call the init function.
window.addEventListener("load", init);
