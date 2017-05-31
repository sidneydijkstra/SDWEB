// global gl variable
var gl;

// global canvas variable
var canvas;

// shader
var shader;

// texture
var texture;

// my texture
var myTexture;

// meshes
var mesh_1;
var mesh_2;

// camera
var Camera;

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

    // get texture
    texture = new texture();

    // get camera
    camera = new camera();

    // get meshes
    mesh_1 = new mesh();
    mesh_2 = new mesh();

    mesh_1.texture = texture.loadTexture("assets/stone.jpg");s
    mesh_2.texture = texture.loadTexture("assets/galax.jpg");

    mesh_1.position[1] = 1;
    mesh_2.position[1] = -2;

    mesh_1.rotation[1] = 40;
    mesh_1.rotation[0] = 40;

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

  camera.update();

  // Clear the canvas before we start drawing on it.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // render 3d cubes
  render3DCube(mesh_1, camera, shader);
  render3DCube(mesh_2, camera, shader);

}

// render a 3D cube
function render3DCube(_mesh, _camera, _shader){
    // make matrixes
    perspectiveMatrix = mat4.create();
    viewMatrix = mat4.create();
    modelMatrix = mat4.create();

    // set perspective
    mat4.perspective(perspectiveMatrix, 45, 640.0/480.0, 0.1, 100.0);

    // set view
    viewMatrix = _camera.getViewMatrix();

    // set position for modelMatrix
    mat4.translate(modelMatrix, modelMatrix, _mesh.position);

    // set rotation for modelMatrix
    mat4.rotateX(modelMatrix, modelMatrix, _mesh.rotation[0]);
    mat4.rotateY(modelMatrix, modelMatrix, _mesh.rotation[1]);
    mat4.rotateZ(modelMatrix, modelMatrix, _mesh.rotation[2]);

    // set scale for modelMatrix
    mat4.scale(modelMatrix, modelMatrix, _mesh.scale);

    // get texture cord attribute
    var textureCoordAttribute = gl.getAttribLocation(_shader.program(), "aTextureCoord");
    gl.enableVertexAttribArray(textureCoordAttribute);

    // get vertex position attribute
    var vertexPositionAttribute = gl.getAttribLocation(_shader.program(), "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);

    // bind the CVB
    gl.bindBuffer(gl.ARRAY_BUFFER, CVB);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    // bind the CVTB
    gl.bindBuffer(gl.ARRAY_BUFFER, CVTB);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    // bind the CVIB
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CVIB);

    // bind the pUniform
    var perspectiveUniform = gl.getUniformLocation(_shader.program(), "perspective");
    gl.uniformMatrix4fv(perspectiveUniform, false, new Float32Array(perspectiveMatrix));

    // bind the view
    var viewUniform = gl.getUniformLocation(_shader.program(), "view");
    gl.uniformMatrix4fv(viewUniform, false, new Float32Array(viewMatrix));

    // bind the mvUniform
    var modelUniform = gl.getUniformLocation(_shader.program(), "model");
    gl.uniformMatrix4fv(modelUniform, false, new Float32Array(modelMatrix));

    // bind the aColor
    //var cUniform = gl.getUniformLocation(shader.program(), "aColor");
    //gl.uniform4fv(cUniform, [1.0, 3.8, 0.5, 1]);  // offset it to the right half the screen

    // bind the texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, _mesh.texture);
    gl.uniform1i(gl.getUniformLocation(_shader.program(), "uSampler"), 0);

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

  // normal texture coordinates
  var textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
  ];

  // Create a buffer for the cubeVerticesTextureCoordBuffer
  CVTB = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, CVTB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

  // Create a buffer for the cubeVerticesBuffer
  CVB = gl.createBuffer(); //cubeVerticesBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, CVB);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


  // Create a buffer for the cubeVerticesIndexBuffer
  CVIB = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, CVIB);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
}
