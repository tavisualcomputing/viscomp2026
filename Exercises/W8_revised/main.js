// (The next line is for your editor. It loads the descriptions of vec3, vec4 and mat4 from
// gl-matrix.d.ts, so that the editor can suggest these functions. The browser ignores it.)
/// <reference path="./gl-matrix.d.ts" />

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

  // Where to start: the tasks are not in order in this file. Search for "TASK 1a" further down and
  // begin there, then do TASK 1b, TASK 2, TASK 3a and TASK 3b.
  // The comments refer to the script, chapter 22:
  // https://moodle-app2.let.ethz.ch/pluginfile.php/2649827/mod_folder/content/0/vc_graphics_WebGL.pdf?forcedownload=1

  // Get the canvas declared in the html
  // (The next comment is for your editor. It says that this element is a canvas, so that the editor
  // can suggest all the gl functions and show their parameters while you type.)
  /** @type {HTMLCanvasElement} */
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
  // (The next two comments are for your editor. They list the properties of mesh, so that the
  // editor can suggest them while you type and explain them when you hover over them.)
  /**
   * @typedef {Object} Mesh
   * @property {number[]} vertices Positions, 3 numbers per vertex: [x0, y0, z0, x1, y1, z1, ...]
   * @property {number[]} vertexNormals Normals, same layout as vertices
   * @property {number[]} indices Triangles as vertex numbers, 3 per triangle: [a0, b0, c0, a1, b1, c1, ...]
   * @property {number[]} [vertexColors] Colors, 4 numbers per vertex. You create this array in Task 3a.
   */
  /** @type {Mesh} */
  var mesh = new OBJ.Mesh(objStr);
  OBJ.initMeshBuffers(gl, mesh);

  // What is in `mesh`: OBJ.Mesh reads the file and stores everything in flat arrays of single numbers.
  // This mesh has 10377 vertices and 19059 triangles. These are the properties you need:
  //
  //   mesh.vertices        Positions, 3 numbers per vertex: [x0, y0, z0, x1, y1, z1, ...]
  //                        The x, y and z of vertex v are at index 3*v, 3*v+1 and 3*v+2.
  //   mesh.vertexNormals   Normals, with the same layout as mesh.vertices.
  //                        At first they come from the file. In Task 2 you replace them with your own.
  //   mesh.indices         Triangles, 3 numbers per triangle: [a0, b0, c0, a1, b1, c1, ...]
  //                        Each number is a vertex number, not a position in an array.
  //                        Triangle i uses the vertices mesh.indices[3*i], [3*i+1] and [3*i+2].
  //   mesh.vertexColors    Doesn't exist yet. You create it in Task 3a, with 4 numbers per vertex.
  //
  // The loader adds more properties that this exercise doesn't use. The section "The mesh object"
  // in the readme lists them and shows examples. To look at the mesh yourself, use console.log(mesh).

  
  // helper function: returns the 3 numbers of vertex `index` from a flat array
  // (3 numbers per vertex, such as mesh.vertices or mesh.vertexNormals) as a vec3
  function vec3FromArray(array, index) {
    return vec3.fromValues(array[3*index+0], array[3*index+1], array[3*index+2]);
  }

  // ======== TASK 2 ========

  // Task 1 used the normals from the file. Now you compute your own, so they have to start at zero.
  // Begin Task 2 by removing the slashes in front of the next three lines. The baubles turn flat
  // and dark, and they get their shading back once your normals are done.
  // for (var i = 0; i < mesh.vertices.length; i++) {
  //   mesh.vertexNormals[i] = 0;
  // }

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
  //
  // What this task is about: main.js runs on the CPU, the shaders run on the GPU, and they can't see
  // each other's variables. Look at the lines starting with `attribute` at the top of
  // shaders/vertexShader.js. Those are inputs of the shader, with a different value for every vertex.
  // Here you connect them to the arrays in `mesh`. Figure 22.2 of the script shows how the data flows.
  //
  // Right now the baubles are dark and flat, because the shader doesn't get any normals yet.
  // When this task works, you should see bright, shaded baubles.

  // Vertices: this block is done for you. Read what each line does. Section 22.2.4 of the script
  // explains it in more detail.
  var tmpBuffer = gl.createBuffer();                 // make an empty buffer on the GPU
  gl.bindBuffer(gl.ARRAY_BUFFER, tmpBuffer);         // select it, so that the next calls work on this buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW); // copy the data from JavaScript to the GPU
  var location = gl.getAttribLocation(shaderProgram, "aVertexPosition"); // ask the shader where its input is (the name must match exactly)
  gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0); // say how to read the buffer: 3 floats per vertex
  gl.enableVertexAttribArray(location);              // switch the attribute on

  // Vertex Normals: this is your part. Connect mesh.vertexNormals to the attribute aVertexNormal.
  // It works exactly like the block above. Copy the six lines and change the array and the attribute name.
  // TODO ...

  // Vertex Colors (added in Task 3a, leave this empty until then)
  // TODO ...

  // Faces (i.e., vertex indices for forming the triangles): this block is done for you.
  // The buffer says which three vertices form each triangle. It is not an attribute, so it
  // doesn't go through gl.getAttribLocation. gl.drawElements reads it directly.
  var tmpBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tmpBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

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
    //
    // What this task is about: the second kind of shader input. A uniform has one value for the whole
    // mesh, for example a matrix. Look at the lines starting with `uniform` in shaders/vertexShader.js.
    // Two of the three are already set below. Your part is the third one, the light position.
    // Section 22.2.6 of the script explains the calls ("Setting uniforms").

    // set the shader program: this line is done for you. It has to come before the uniforms and the drawing.
    gl.useProgram(shaderProgram);

    // bind the location of the uniform variables: the two matrices are done for you.
    // Each line finds the uniform by its name and sends the value computed above.
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uProjectionMatrix"), false, projectionMatrix);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModelViewMatrix"), false, modelViewMatrix);

    // Light position: this is your part. Send the variable lightPos to the uniform uLightPos.
    // (Hint: one line, like the two above. But lightPos is a vec4, so use gl.uniform4fv(location, value).
    // It has no `false` argument.)
    //
    // You should see: the light moves from the camera to the right side. Most of each bauble is
    // now in the shadow, so the picture gets darker. That is correct.
    // TODO ...

    // finally, draw the mesh: this line is done for you. It draws all triangles from the index buffer.
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

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
