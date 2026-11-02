// Import the shader code
import vsSource from './shaders/vertexShader.js';
import fsSource from './shaders/fragmentShader.js';

let rotationAngle = 0.0;
let deltaTime = 0;

main();

// == HELPER FUNCTION FOR TASK 3a ==
function calcVertexColor(pCoordinate) {
  // TODO: assign a new color
  return vec4.fromValues(0.3, 0.3, 0.3, 1.0);
}
// ==== END HELPER FUNCTION ====

function main() {

  // Get the canvas declared in the html
  const canvas = document.getElementById("glcanvas");

  if (canvas == null) {
    alert ("Cannot instantiate canvas. Open index.html through a local web server (see readme.md).");
  }

  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  // We use unsigned short (16bit) to represent vertex indices. Uncomment the line below if you want
  // to use unsigned ints (i.e., if there are more than 2^16 vertices, up to 2^32 vertices). And don't
  // forget to adjust the array type from Uint16 to Uint32 when initializing the index buffer.
  // ...
  // gl.getExtension('OES_element_index_uint');

  // load in the mesh (this reads all vertex and face information from the .obj file)
  var objStr = document.getElementById('decorations.obj').innerHTML;
  var mesh = new OBJ.Mesh(objStr);
  OBJ.initMeshBuffers(gl, mesh);

  // initialize the normals to zero (will overwrite later)
  for (var i = 0; i < mesh.vertices.length; i++) {
    mesh.vertexNormals[i] = 0;
  }
  
  // helper function: returns the 3 numbers of vertex `index` from a flat array
  // (3 numbers per vertex, such as mesh.vertices or mesh.vertexNormals) as a vec3
  function vec3FromArray(array, index) {
    return vec3.fromValues(array[3*index+0], array[3*index+1], array[3*index+2]);
  }

  // ======== TASK 2 ========
  
  // go through all triangles
  for (var i = 0; i < mesh.indices.length/3; i++) {

    // get vertices of this triangle (vec3FromArray is our own helper function, defined above)
    var v0 = vec3FromArray(mesh.vertices, mesh.indices[3*i+0]);
    var v1 = vec3FromArray(mesh.vertices, mesh.indices[3*i+1]);
    var v2 = vec3FromArray(mesh.vertices, mesh.indices[3*i+2]);

    // compute edges `a` and `b`
    // TODO ...

    // normal is normalized cross product of edges
    // TODO ...

    // add normal to all vertex normals of this triangle
    // (Hint: mesh.vertexNormals is a flat array of single numbers, 3 per vertex: [x0, y0, z0, x1, y1, z1, ...].
    // Its length is 3 * number of vertices. The x, y and z of vertex v sit at index 3*v, 3*v+1 and 3*v+2,
    // so add the normal one component at a time.)
    // TODO ...
  }
  
  // since we've added normals of all triangles a vertex is connected to, 
  // we need to normalize the vertex normals
  for (var i = 0; i < mesh.vertexNormals.length/3; i++) {
    // TODO ...
  }
  // ====== END TASK 2 ======

  // ======== TASK 3a ========

  // initialize the color array. A color has 4 numbers (r, g, b, a), so the array needs
  // 4 numbers per vertex: [r0, g0, b0, a0, r1, g1, b1, a1, ...]. (Hint: mesh.vertices has
  // 3 numbers per vertex, so the number of vertices is mesh.vertices.length / 3.)
  // TODO ...

  // for each vertex set a custom color (calcVertexColor returns a vec4)
  // (Hint: calcVertexColor is our own helper function at the very top of this file, above main.
  // It takes the position of one vertex as a vec3, e.g. from vec3FromArray(mesh.vertices, i), and
  // returns its color. The template version returns the same grey for every vertex, so change it
  // there to pick a color based on the position.)
  // TODO ...

  // ====== END TASK 3a ======
  
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // ======== TASK 1a ========

  // Vertices
  // TODO ...

  // Vertex Normals
  // TODO ...

  // Vertex Colors (added in Task 3a, leave this empty until then)
  // TODO ...

  // Faces (i.e., vertex indices for forming the triangles)
  // TODO ...

  // ====== END TASK 1a ======

  // Draw the scene
  let then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001; // convert to seconds
    deltaTime = now - then;
    then = now;

    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // define a light position in camera coordinates
    let r = 55.0;
    var lightPos = vec4.fromValues(Math.sin(Math.PI/2) * r, Math.cos(Math.PI/2) * r, -60.0, 1.0);
    
    // build the projection and model-view matrices
    const fieldOfView = (45 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

    // maps object space to camera space
    // translation by (0, -25, -60), rotation by -pi/2 around x, rotation by pi/3 around z
    const modelViewMatrix = mat4.fromValues(
           0.5,       0,  -0.86602,       0, 
      -0.86602,       0,      -0.5,       0, 
             0,       1,         0,       0, 
             0,     -25,       -60,       1
      );

    // ======== TASK 3b ========

    // rotate the mesh around its own z-axis
    // (Hint: rotationAngle is the time in seconds since the start. It is updated at the end of
    // render, so you can use it directly as the rotation angle in radians. Multiply or divide it
    // to change the speed.)
    // TODO ...

    // ====== END TASK 3b ======

    // ======== TASK 1b ========

    // set the shader program
    // TODO ...

    // bind the location of the uniform variables
    // TODO ...

    // finally, draw the mesh
    // TODO ...

    // ====== END TASK 1b ======

    // rotation update based on the elapsed time
    rotationAngle += deltaTime;

    // render the output on the screen
    requestAnimationFrame(render);
  }

  // render the output on the screen
  requestAnimationFrame(render);
}

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram,
      )}`,
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
