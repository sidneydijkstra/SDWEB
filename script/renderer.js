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
var rot = 90;
// draw the scene [main loop]
function drawScene() {
  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Establish the perspective with which we want to view the
  // scene. Our field of view is 45 degrees, with a width/height
  // ratio of 640:480, and we only want to see objects between 0.1 units
  // and 100 units away from the camera.
  perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

  // rotate
  var inRadians = rot * Math.PI / 180.0;
  rot++;

  // set matrix vars
  mvMatrix = Matrix.I(4);
  mvMatrix = mvMatrix.x(mvMatrix.x(Matrix.Translation($V([-0.0, 0.0, -6.0])).ensure4x4()));
  mvMatrix = mvMatrix.x(Matrix.Rotation(inRadians, $V([1.0, -1.0, 1.0])).ensure4x4());


  // Draw the square by binding the array buffer to the square's vertices
  // array, setting attributes, and pushing it to GL.
  var vertexPositionAttribute = gl.getAttribLocation(shader.program(), "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  // bind the squareVerticesBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, CVB);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

  // bind the pUniform
  var pUniform = gl.getUniformLocation(shader.program(), "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  // bind the mvUniform
  var mvUniform = gl.getUniformLocation(shader.program(), "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

  // bind the aColor
  var cUniform = gl.getUniformLocation(shader.program(), "aColor");
  gl.uniform4fv(cUniform, [1.0, 3.8, 0.5, 1]);  // offset it to the right half the screen

  // bind guffer
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
  // draw arrays
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

// init buffer
function initBuffers() {
  // normal vertices
  var vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  // normal vertex indices
  var cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ];

  // Create a buffer for the cubeVerticesBuffer
  CVB = gl.createBuffer(); //cubeVerticesBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, CVB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex array for each face's vertices.
  cubeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}
