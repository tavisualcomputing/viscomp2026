import {
    mat4,
    vec3,
    vec4
} from 'gl-matrix';
import {
    OBJ
} from './webgl-obj-loader.js';

//
// All the shader code ...
// No need to change this part!
//
const fsFloorSource = /* glsl*/ `
precision highp float;
varying lowp vec4 position; 

void main(void) {
    vec4 p = position; 
    vec2 ab = .1 * p.xz;
    vec3 A = .25 + .25 * vec3(sin(ab.x), sin(ab.y), 1.);
    vec2 uv = floor(p.xz);
    vec3 B = .5 - .5 * vec3(mod(uv.x + uv.y, 2.));
    gl_FragColor = vec4(mix(A, B, .5), 1.);
}
`;
const vsFloorSource = /* glsl*/ `
attribute vec4 vPosition;
attribute vec4 vColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec4 position; 
varying lowp vec4 color; 

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vPosition;
    color = vec4(0.1, 0.1, 0.1, 1.0);
    position = vPosition;
} 
`;
const fsSource = /* glsl*/ `
varying lowp vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
} 
`;
const vsSource = /* glsl*/ `
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec3 aVertexNormal;

uniform mat4 uModelMatrix;
uniform mat4 uModelNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 uLightPos;

varying lowp vec4 vColor;

float computeDiffuseIntens(in vec4 position, in vec3 normal, in vec4 lightPos)
{
  // since the lightPos is in world coordinates, need to transform the vertex position and normal first
  position = uModelMatrix * position;
  normal = (uModelNormalMatrix * vec4(normal, 0.0)).xyz;
  normal = normalize(normal);    
  
  // compute the light direction
  vec3 vecToLight = normalize(lightPos.xyz - position.xyz);
  
  // the intensity is proportional to the angle between the surface and the light direction
  float diffuseIntensity = dot(normal, vecToLight);
  diffuseIntensity = clamp(diffuseIntensity, 0.0, 1.0);
  
  return diffuseIntensity;
}

void main(void) {

  // transform the vertex position from object space to camera space 
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

  // === very simplistic lighting model ===
  float ambientIntensity = 0.3; // controls how much ambient light there is in the scene, some value between 0.0 and 1.0
  float diffuseIntensity = computeDiffuseIntens(aVertexPosition, aVertexNormal, uLightPos); // accounts for direct light
  vColor = aVertexColor * (diffuseIntensity + ambientIntensity);
  
  // make sure we don't overshoot
  vColor = clamp(vColor, 0.0, 1.0);
  vColor[3] = 1.0; // alpha value
}
`;
// /////////////////////////////////////////////////////////////////////
//
// Initialize WebGL rendering context
//
const canvas = document.getElementById( 'canvas' ) as HTMLCanvasElement;

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
const gl = canvas.getContext( 'webgl' )!;
const textCanvas = document.getElementById( 'text' ) as HTMLCanvasElement;

textCanvas.width = document.body.clientWidth;
textCanvas.height = document.body.clientHeight;
const ctx = textCanvas.getContext( '2d' )!;
// Shader programs
const floorShaderProgram = initShaderProgram( gl, vsFloorSource, fsFloorSource );
const objectShaderProgram = initShaderProgram( gl, vsSource, fsSource );
const shaderPrograms = [
    floorShaderProgram,
    objectShaderProgram
];

// Helper for setting the projection, view, and model matrices (and optionally the light position)
function setPVM ( P: mat4, V: mat4, M: mat4, lightPos: null | number[] = null ) {
    const VM = mat4.create(); // uModelViewMatrix

    mat4.multiply( VM, V, M );

    const Mn = mat4.create(); // uModelNormalMatrix

    mat4.invert( Mn, M );
    mat4.transpose( Mn, Mn );

    shaderPrograms.forEach( shaderProgram => {
        gl.useProgram( shaderProgram );
        const uModelMatrix = gl.getUniformLocation( shaderProgram, 'uModelMatrix' );
        const uModelNormalMatrix = gl.getUniformLocation( shaderProgram, 'uModelNormalMatrix' );
        const uModelViewMatrix = gl.getUniformLocation( shaderProgram, 'uModelViewMatrix' );
        const uProjectionMatrix = gl.getUniformLocation( shaderProgram, 'uProjectionMatrix' );

        gl.uniformMatrix4fv( uModelMatrix, false, M );
        gl.uniformMatrix4fv( uModelNormalMatrix, false, Mn );
        gl.uniformMatrix4fv( uModelViewMatrix, false, VM );
        gl.uniformMatrix4fv( uProjectionMatrix, false, P );

        if ( lightPos != null ) {
            const uLightPos = gl.getUniformLocation( shaderProgram, 'uLightPos' );

            gl.uniform4fv( uLightPos, lightPos );
        }
    } );
}

// ///////////////////////////////////////////////////

let globalTime = 0.0;
let shouldRotate = false;

const camUp = [
    0.0,
    1.0,
    0.0
]; // camera up-vector
const camPos = [
    0.0,
    1.0,
    0.0
]; // initial camera position
const camDir = [
    0,
    0,
    -1.0
]; // camera viewing direction
const lightPos = [
    -50,
    50,
    20.0,
    1
]; // initial light position
const objectRotation = [
    -Math.PI / 2,
    0.0,
    0.0
]; // initial object rotation
const objectPosition = [
    0.0,
    -4.0,
    -70.0
]; // initial object position
const objectScale = [
    0.05,
    0.05,
    0.05
]; // initial object scaling

// Variables for handling keyboard and mouse events
let isMousePressed = false;
let mouseButtonPressed = -1;
let mousePosLast = [
    0,
    0
];

const keyPressed = new Map();

//
// Mouse and keyboard event handling functions
//
function mouseDown ( event: MouseEvent ) {
    mouseButtonPressed = event.which;
    isMousePressed = true;
}

function mouseUp () {
    isMousePressed = false;
}

function mouseMoved ( event: MouseEvent ) {
    const x = [
        event.clientX / canvas.width,
        event.clientY / canvas.height
    ];

    if ( isMousePressed ) {
        if ( mouseButtonPressed == 1 && !event.shiftKey ) {
            rotateCameraY( ( x[0] - mousePosLast[0] ) * 2 );
            rotateCameraX( ( x[1] - mousePosLast[1] ) * 2 );
        } else if ( mouseButtonPressed == 1 && event.shiftKey ) {
            objectRotation[1] += 2 * ( x[0] - mousePosLast[0] );
            objectRotation[0] += 2 * ( x[1] - mousePosLast[1] );
        }
    }

    mousePosLast = x;
}

// ====== TASK 2 ======
function moveCamera ( dist: number, sideways: boolean ) {

    // Move the camera by 'dist' either forward/backward or sideways
    // Hint: compute the direction of the translation first,
    // then translate 'camPos' by the appropriate amount in this direction.
    // Helpful functions: vec3.cross(...), vec3.normalize(...), vec3.scale(...), vec3.add(...)

    // ...

}

function rotateCameraY ( angle: number ) {

    // Rotate the camera by 'angle' around the y-axis.
    // Hint: use vec3.rotateY(...) (what's the origin of rotation?)

    // ...

}

function rotateCameraX ( angle: number ) {

    // Rotate the camera by 'angle' around its own x-axis, i.e. the axis pointing to the right of the camera.
    // This is the world x-axis only as long as the camera has not been turned with rotateCameraY(...).
    // Hint: compute the axis with vec3.cross(...) and vec3.normalize(...), then rotate 'camDir' with a quaternion:
    // quat.setAxisAngle(...) and vec3.transformQuat(...)

    // ...

}

function moveLight ( d: number[] ) {

    // Translate the light position by 'd'

    // ...

}
// ==== END TASK 2 ====

function keyDown ( event: KeyboardEvent ) {
    if ( event.code == 'Space' )
        shouldRotate = !shouldRotate;
    else
        keyPressed.set( event.code, true );
}

function keyUp ( event: KeyboardEvent ) {
    keyPressed.set( event.code, false );
}

function processKeyPressed () {
    keyPressed.forEach( function ( value, key ) {
        if ( value ) {
            switch ( key ) {
                case 'KeyW': moveCamera( 0.1, false );
                    break;
                case 'KeyS': moveCamera( -0.1, false );
                    break;
                case 'KeyA': moveCamera( 0.1, true );
                    break;
                case 'KeyD': moveCamera( -0.1, true );
                    break;
                case 'KeyE': rotateCameraY( -0.02 );
                    break;
                case 'KeyQ': rotateCameraY( 0.02 );
                    break;
                case 'KeyI': moveLight( [
                    0,
                    0,
                    -1
                ] );
                    break;
                case 'KeyK': moveLight( [
                    0,
                    0,
                    1
                ] );
                    break;
                case 'KeyL': moveLight( [
                    1,
                    0,
                    0
                ] );
                    break;
                case 'KeyJ': moveLight( [
                    -1,
                    0,
                    0
                ] );
                    break;
                case 'KeyU': moveLight( [
                    0,
                    -1,
                    0
                ] );
                    break;
                case 'KeyO': moveLight( [
                    0,
                    1,
                    0
                ] );
                    break;
                case 'ArrowUp': objectPosition[2] -= 0.1;
                    break;
                case 'ArrowDown': objectPosition[2] += 0.1;
                    break;
                case 'ArrowLeft': objectPosition[0] -= 0.1;
                    break;
                case 'ArrowRight': objectPosition[0] += 0.1;
                    break;
            }
        }
    } );
}

// ====== TASK 1 ======
function getCameraMatrix () {
    // Calculate the camera matrix (see the ModelView transform from the lecture slides)
    const TR = mat4.create();

    // Hints: use mat4.targetTo(TR, eye, target, upvec) and the variables defined in lines 141-143
    // 'eye' is the camera position
    // 'target' is where the camera points at
    // 'upvec' is to ensure that the camera is oriented upwards

    // ...

    return TR;
}

function getViewMatrix () {
    // Calculate the view matrix
    const V = mat4.create();

    // Hint: the view matrix does the opposite of the camera matrix (why?)

    // ...

    return V;
}

function getModelMatrix () {
    // Calculate the model matrix
    const M = mat4.create();

    // Hint: take a look at the object variables in lines 146-148.
    // Construct the model matrix by applying the corresponding transformations in that order
    // such that a point is first rotated, then translated, then scaled (keep in mind that the first transformation is applied last)
    // Helpful functions: mat4.rotateX(...), mat4.translate(...), mat4.scale(...)

    // ...

    // Rotation around the object's z-axis (pointing up after the initial object rotation) for when pressing the space key
    mat4.rotateZ( M, M, globalTime );

    return M;
}
// ==== END TASK 1 ====

function getProjectionMatrix () {
    const fieldOfView = 45.0 * Math.PI / 180.0;
    const aspect = ( gl.canvas as HTMLCanvasElement ).clientWidth / ( gl.canvas as HTMLCanvasElement ).clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const P = mat4.create();

    mat4.perspective( P, fieldOfView, aspect, zNear, zFar );

    return P;
}

// Floor tiles
const d = 50.0;
const floor_vertices = [
    d,
    0.0,
    d,
    -d,
    0.0,
    d,
    d,
    0.0,
    -d,
    d,
    0.0,
    -d,
    -d,
    0.0,
    d,
    -d,
    0.0,
    -d
];
const squareRotation = 0.0;
const deltaTime = 0;

main();

function main () {
    /** @type {WebGLRenderingContext} */

    if ( canvas == null || textCanvas == null ) {
        alert( 'Cannot instantiate canvas. Consider using vscode-preview-server.' );
    }

    // Only continue if WebGL is available and working
    if ( gl === null ) {
        alert(
            'Unable to initialize WebGL. Your browser or machine may not support it.'
        );

        return;
    }

    // We use unsigned short (16bit) to represent vertex indices. Uncomment the line below if you want
    // to use unsigned ints (i.e., if there are more than 2^16 vertices, up to 2^32 vertices). And don't
    // forget to adjust the array type from Uint16 to Uint32 when initializing the index buffer.
    // ...
    // gl.getExtension('OES_element_index_uint');

    // load in the mesh (this reads all vertex and face information from the .obj file)
    const objStr = document.getElementById( 'decorations.obj' )!.innerHTML;
    const mesh = new OBJ.Mesh( objStr );

    OBJ.initMeshBuffers( gl, mesh );

    // calculate vertex normals and colors (see exercise 06)
    calcNormalsAndColors( mesh );

    // Draw the scene repeatedly
    function render () {
        if ( shouldRotate )
            globalTime += 0.01;

        // Handle key events
        processKeyPressed();

        gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); // Clear to black, fully opaque
        gl.clearDepth( 1.0 ); // Clear everything
        gl.enable( gl.DEPTH_TEST ); // Enable depth testing
        gl.depthFunc( gl.LEQUAL ); // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        // Get the P, V, and M matrices and bind them to the shader files
        const P = getProjectionMatrix();
        const V = getViewMatrix();
        const M = getModelMatrix();
        const M_floor = mat4.create();

        // Draw the floor first
        setPVM( P, V, M_floor );
        drawFloor();

        // Then draw the object
        setPVM( P, V, M, lightPos );
        drawObject();

        // Text to display key instructions
        const lineHeight = 30;

        ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height );
        ctx.font = 'bold 24px monospace ';
        ctx.fillStyle = '#ffffff';
        const controlText = [
            'controls:',
            '  camera move  : AD/WS',
            '  camera rotate: QE or leftclick + drag',
            '  object move  : arrows',
            '  object rotate: shift + leftclick + drag',
            '  auto-rotate  : space',
            '  move light   : JL/UO/IK'
        ];

        for ( let i = 0; i < controlText.length; i++ ) {
            ctx.fillText( controlText[i], 0, ( i + 1 ) * lineHeight );
        }

        const infoText = [
            'light position:',
            '  ' + lightPos.slice( 0, 3 )
        ];

        for ( let i = 0; i < infoText.length; i++ ) {
            ctx.fillText( infoText[i], 0, ( controlText.length + i + 1 ) * lineHeight );
        }

        // Render the output on the screen
        requestAnimationFrame( render );
    }

    // Render the output on the screen
    requestAnimationFrame( render );

    // Helper function for drawing the floor
    function drawFloor () {
        gl.useProgram( floorShaderProgram );

        const vertexBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( floor_vertices ), gl.STATIC_DRAW );
        const vPosition = gl.getAttribLocation( floorShaderProgram, 'vPosition' );

        gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );

        gl.drawArrays( gl.TRIANGLES, 0, 6 );
    }

    // Helper function for drawing the object (code from solution 06)
    function drawObject () {
    // Vertices
        let tmpBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, tmpBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( mesh.vertices ), gl.STATIC_DRAW );
        let location = gl.getAttribLocation( objectShaderProgram, 'aVertexPosition' );

        gl.vertexAttribPointer( location, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( location );

        // Vertex Normals
        tmpBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, tmpBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( mesh.vertexNormals ), gl.STATIC_DRAW );
        location = gl.getAttribLocation( objectShaderProgram, 'aVertexNormal' );

        gl.vertexAttribPointer( location, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( location );

        // Vertex Colors
        tmpBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, tmpBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( mesh.vertexColors ), gl.STATIC_DRAW );
        location = gl.getAttribLocation( objectShaderProgram, 'aVertexColor' );

        gl.vertexAttribPointer( location, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( location );

        // Faces (i.e., vertex indices for forming the triangles)
        tmpBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, tmpBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( mesh.indices ), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, tmpBuffer );

        // Draw the mesh
        gl.drawElements( gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0 );
    }
}

// ========= HELPER FUNCTIONS =========

// Helper: Calculate the vertex normals and colors (see exercise 06)
function calcNormalsAndColors ( mesh: OBJ.Mesh ) {
    // initialize the normals to zero (will overwrite later)
    for ( let i = 0; i < mesh.vertices.length; i++ ) {
        mesh.vertexNormals[i] = 0;
    }

    // helper function to extract vertex position from array of vertices
    function vec3FromArray ( vertices: number[], index: number ) {
        return vec3.fromValues( vertices[( 3 * index ) + 0], vertices[( 3 * index ) + 1], vertices[( 3 * index ) + 2] );
    }

    // go through all triangles
    for ( let i = 0; i < mesh.indices.length / 3; i++ ) {
    // get vertices of this triangle
        const v0 = vec3FromArray( mesh.vertices, mesh.indices[( 3 * i ) + 0] );
        const v1 = vec3FromArray( mesh.vertices, mesh.indices[( 3 * i ) + 1] );
        const v2 = vec3FromArray( mesh.vertices, mesh.indices[( 3 * i ) + 2] );
        // compute edges `a` and `b`
        const a = vec3.create();

        vec3.subtract( a, v1, v0 );
        const b = vec3.create();

        vec3.subtract( b, v2, v0 );
        // normal is normalized cross product of edges
        const n = vec3.create();

        vec3.cross( n, a, b );
        vec3.normalize( n, n );
        // add normal to all vertex normals of this triangle, weighted by the angle of the triangle at that vertex
        // Note: weighting by the angle is more accurate, but not necessary in this example (negligible effect)
        const corners = [
            v0,
            v1,
            v2
        ];

        for ( let j = 0; j < 3; j++ ) {
            const e1 = vec3.create();

            vec3.subtract( e1, corners[( j + 1 ) % 3], corners[j] );
            const e2 = vec3.create();

            vec3.subtract( e2, corners[( j + 2 ) % 3], corners[j] );
            const weight = vec3.angle( e1, e2 );
            const vIndex = mesh.indices[( 3 * i ) + j];

            for ( let k = 0; k < 3; k++ ) {
                mesh.vertexNormals[( 3 * vIndex ) + k] += n[k] * weight;
            }
        }
    }

    // since we've added normals of all triangles a vertex is connected to,
    // we need to normalize the vertex normals
    for ( let i = 0; i < mesh.vertexNormals.length / 3; i++ ) {
        const n = vec3FromArray( mesh.vertexNormals, i );

        vec3.normalize( n, n );

        // and copy back to mesh normal array
        for ( let k = 0; k < 3; k++ ) {
            mesh.vertexNormals[( 3 * i ) + k] = n[k];
        }
    }

    // initialize the color array (Hint: remember that mesh.vertices is of length 3 * number of vertices (x, y, z each))
    mesh.vertexColors = new Array( mesh.vertices.length / 3 * 4 ).fill( 1.0 );

    // for each vertex set a custom color
    for ( let i = 0; i < mesh.vertices.length / 3; i++ ) {
        const new_color = calcVertexColor( vec3FromArray( mesh.vertices, i ) );

        for ( let k = 0; k < 4; k++ )
            mesh.vertexColors[( 4 * i ) + k] = new_color[k];
    }
}

// Helper: Calculate the new vertex color
function calcVertexColor ( pCoordinate: vec3 ) {
    if ( pCoordinate[1] < -8 )
        return vec4.fromValues( 0.8, 0.25, 0.25, 1.0 );

    if ( pCoordinate[1] < 9 )
        return vec4.fromValues( 0.25, 0.8, 0.25, 1.0 );

    return vec4.fromValues( 0.25, 0.25, 1.0, 1.0 );
}

// Helper: Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram ( gl: WebGLRenderingContext, vsSource: string, fsSource: string ) {
    const vertexShader = loadShader( gl, gl.VERTEX_SHADER, vsSource );
    const fragmentShader = loadShader( gl, gl.FRAGMENT_SHADER, fsSource );
    // Create the shader program
    const shaderProgram = gl.createProgram();

    gl.attachShader( shaderProgram, vertexShader );
    gl.attachShader( shaderProgram, fragmentShader );
    gl.linkProgram( shaderProgram );

    // If creating the shader program failed, alert
    if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
        alert(
            `Unable to initialize the shader program: ${ gl.getProgramInfoLog(
                shaderProgram
            ) }`
        );

        throw new Error( `Unable to initialize shader program with error : ${ gl.getProgramInfoLog( shaderProgram ) }` );
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader ( gl: WebGLRenderingContext, type: number, source: string ) {
    const shader = gl.createShader( type )!;

    // Send the source to the shader object
    gl.shaderSource( shader, source );

    // Compile the shader program
    gl.compileShader( shader );

    // See if it compiled successfully
    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
        alert(
            `An error occurred compiling the shaders: ${ gl.getShaderInfoLog( shader ) }`
        );
        gl.deleteShader( shader );

        throw new Error( `shaders could not be compiled with error ${ gl.getShaderInfoLog( shader ) }` );
    }

    return shader;
}

window.addEventListener( 'mousedown', mouseDown );
window.addEventListener( 'mousemove', mouseMoved );
window.addEventListener( 'mouseup', mouseUp );
window.addEventListener( 'keydown', keyDown );
window.addEventListener( 'keyup', keyUp );
