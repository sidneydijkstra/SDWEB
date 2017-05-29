// global gl variable
var gl;

// global canvas variable
var canvas;

// shader
var shader;

// constructor
function renderer(){
    // get the canvas
    canvas = document.getElementById("canvas");

    // Initialize the GL context
    gl = initWebGL(canvas);

    // Only continue if WebGL is available and working
    if (!gl) {
      return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // get shader
    shader = new shader("shader-fs","shader-vs");

    // use the run function
    run();
}

// set the gl to use webGL functions
function initWebGL(canvas) {
  gl = null;

  // Try to grab the standard context. If it fails, fallback to experimental.
  gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now
  if (!gl) {
    alert("Unable to initialize WebGL. Your browser may not support it.");
  }

  return gl;
}

// the run function
function run() {

  // Only continue if WebGL is available and working
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // create the buffer
    initBuffers();

    // use the shader program
    shader.use();

    // Set up to draw the scene periodically.
    setInterval(drawScene, 15);
  }else{
    alert("ERROR: Unable to load webGL!");
  }
}

// draw the scene [main loop]
function drawScene() {
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  mvMatrix = Matrix.I(4);
  mvMatrix = mvMatrix.x(mvMatrix.x(Matrix.Translation($V([-0.0, 0.0, -6.0])).ensure4x4()));


  // Draw the square by binding the array buffer to the square's vertices
  // array, setting attributes, and pushing it to GL.
  var vertexPositionAttribute = gl.getAttribLocation(shader.program(), "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  // bind the squareVerticesBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, SVB);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  // bind the pUniform
  var pUniform = gl.getUniformLocation(shader.program(), "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  // bind the mvUniform
  var mvUniform = gl.getUniformLocation(shader.program(), "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

  // draw arrays
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function initBuffers() {
  // Now create an array of vertices for the square. Note that the Z
  // coordinate is always 0 here.
  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];

  // Create a buffer for the square's vertices.
  SVB = gl.createBuffer();

  // bind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, SVB);

  // Now pass the list of vertices into WebGL to build the shape. We
  // do this by creating a Float32Array from the JavaScript array,
  // then use it to fill the current vertex buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}
