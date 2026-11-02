# Running the exercise

Open `index.html` through a local web server. If you open the file directly from disk (the address starts with `file://`), the browser blocks the exercise's JavaScript modules and the page only shows an error message.

Use one of these:

- **VS Code:** right-click `index.html` and choose *Open in Integrated Browser*.
- **Python 3:** open a terminal in this folder and run `python3 -m http.server` (use `python` on Windows). Then open http://localhost:8000 in your browser.

  8000 is the port the server uses when you don't name one. To use another port, put its number at the end of the command, for example `python3 -m http.server 8003`. The address then ends in that number too: http://localhost:8003. You need a different port if 8000 is already taken, or if you want two servers running at the same time.

## If a change doesn't show up

Browsers keep copies of the files they load. After you change a file, they sometimes keep using the old copy, so your edit seems to have no effect. The same happens if you keep several copies of the exercise folder to try things out and switch between them on the same port. The browser then runs a mix of old and new files. Giving each copy its own port avoids this.

Turn the cache off before you start working:

- **Chrome, Edge, Firefox, VS Code:** open the developer tools (see *Opening the console* below), go to the *Network* tab and tick "Disable cache". This only works while the developer tools are open, so leave them open while you work. In VS Code's integrated browser, the *Network* tab sits behind the `>>` button.
- **Safari:** choose Develop > Disable Caches. Develop > Empty Caches (Cmd+Option+E) clears the cache once.

# Debugging with the browser console

When something is wrong, WebGL almost never stops your program. A misspelled attribute name, a missing `gl.useProgram` or the wrong index type usually just leaves the canvas black. The browser does notice the mistake, though, and writes a message to the console. So if the canvas is black or looks wrong, open the console first. It usually tells you which call failed.

## Opening the console

| Browser | macOS | Windows / Linux |
|---|---|---|
| Chrome, Edge | Cmd+Option+J | Ctrl+Shift+J |
| Firefox | Cmd+Option+K | Ctrl+Shift+K |
| Safari | Cmd+Option+C | |

Safari hides its developer tools by default. Turn them on once under Safari > Settings > Advanced > "Show features for web developers".

In VS Code's integrated browser, right-click anywhere on the page and choose *Inspect*. The developer tools open next to the page. Switch to the *Console* tab.

![The Inspect entry in the right-click menu of VS Code's integrated browser, with the Console tab open next to the page](images/vscode-inspect.png)

## Reading the console

- **Red lines** are JavaScript errors. The script stops at that line, so nothing after it runs. The file name and line number on the right are links. Click one to jump to the code.
- **Yellow lines starting with `WebGL:`** are warnings. The script keeps running, but the call that caused the warning did nothing.
- **Shader compile errors** show up as a pop-up, because the code calls `alert()` for them.

The `render` function runs about 60 times per second, so a broken call inside it repeats the same warning every frame. Always fix the first message at the top. The others are often follow-up errors.

## Messages you'll likely see in this exercise

This is Chrome's wording. Firefox and Safari say the same thing in slightly different words.

| Message | Usual cause |
|---|---|
| `WebGL: INVALID_VALUE: vertexAttribPointer: index out of range` | `gl.getAttribLocation` returned -1. Either the name doesn't match the shader, or the shader declares the attribute but never uses it. The shader compiler removes unused attributes. |
| `WebGL: INVALID_OPERATION: uniformMatrix4fv: location is not from the associated program` | You set a uniform before calling `gl.useProgram(shaderProgram)`. |
| `WebGL: INVALID_OPERATION: drawElements: no valid shader program in use` | `gl.useProgram(shaderProgram)` is missing. |
| `WebGL: INVALID_OPERATION: drawElements: no buffer is bound to enabled attribute` | An attribute is enabled but has no buffer. Bind the buffer, then call `gl.vertexAttribPointer`. |
| `WebGL: INVALID_ENUM: drawElements: invalid type` | Wrong type in `gl.drawElements`. The index buffer is a `Uint16Array`, so use `gl.UNSIGNED_SHORT`. |
| `GL_INVALID_OPERATION: glDrawElements: Insufficient buffer size.` | `gl.drawElements` reads more indices than the index buffer holds. The buffer is empty or the count is too large. See the Task 1 hints below. |
| `GL_INVALID_OPERATION: glDrawElements: Vertex buffer is not big enough for the draw call.` | A vertex buffer is empty or smaller than the attribute setup says. Usually the data was not wrapped in `new Float32Array(...)`. See the Task 1 hints below. |
| `TypeError: Failed to execute 'uniform4fv' on 'WebGLRenderingContext': The provided value cannot be converted to a sequence.` | The value passed to `gl.uniform4fv` is not an array. Usually the `false` from `gl.uniformMatrix4fv` was copied over. `gl.uniform4fv` has no transpose flag, so call it as `gl.uniform4fv(location, lightPos)`. |
| `TypeError: vec3.substract is not a function` | A typo in a function name. Check the [gl-matrix docs](https://glmatrix.net/docs/). |
| `TypeError: Cannot set properties of undefined (setting '0')` | You write into an array that was never created, for example `mesh.vertexColors[...] = ...` after `const vertexColors = ...`. Those are two different names. Create the array as `mesh.vertexColors = ...`, or use your own variable name everywhere. |
| `ReferenceError: x is not defined` | A typo in a variable name, or the variable is declared in another function. |

## When there is no message

Some mistakes are silent. A misspelled uniform name is the classic one: `gl.getUniformLocation` returns `null`, and setting a `null` uniform does nothing without any warning. In that case print values with `console.log` and check them yourself:

```js
console.log(gl.getAttribLocation(shaderProgram, "aVertexNormal"));     // -1: name is wrong or unused in the shader
console.log(gl.getUniformLocation(shaderProgram, "uModelViewMatrix")); // null: name is wrong
console.log(mesh.vertexNormals.slice(0, 9));                           // first three normals: length 1, no NaN, not all 0
```

Put these before the render loop. Inside `render` they print 60 times per second.

# Hints and spoilers

If you're stuck, look for what you see on screen in the list below. Each entry opens a hint first. The exact fix sits one level deeper, so try the hint before you open the spoiler.

The blocks only fold up in a Markdown preview. In VS Code, open one with Cmd+Shift+V (macOS) or Ctrl+Shift+V (Windows / Linux).

## Any task

<details>
<summary>I saved a change, but the page looks exactly the same</summary>

The browser is probably still running an old copy of your files. Turn off the cache as described in [If a change doesn't show up](#if-a-change-doesnt-show-up), then reload.

</details>

## Task 1

<details>
<summary>Nothing shows up after Task 1a</summary>

That is expected. Task 1a only uploads the data. Nothing is drawn until Task 1b, where you call `gl.useProgram`, set the uniforms and call `gl.drawElements`.

What you can check now is the console. It should have no red errors and no `WebGL:` warnings. To make sure 1a is right before you move on, log the attribute locations:

```js
console.log(gl.getAttribLocation(shaderProgram, "aVertexPosition")); // should be 0 or higher, not -1
console.log(gl.getAttribLocation(shaderProgram, "aVertexNormal"));   // same
```

A -1 means the name doesn't match the shader.

</details>

<details>
<summary>After Task 1b, the canvas looks black, but the console shows no errors</summary>

Look closely, maybe with your screen brightness turned up. There are no normals yet at this point, so the mesh gets only a little ambient light and is a very dark grey on a black background. That is the expected result for Task 1.

<details>
<summary>Spoiler</summary>

To check that drawing works, temporarily change the clear color in `render` to white: `gl.clearColor(1.0, 1.0, 1.0, 1.0)`. The baubles should show up as dark shapes. Change it back afterwards.

</details>
</details>

<details>
<summary>The console shows <code>glDrawElements: Insufficient buffer size</code></summary>

`gl.drawElements` is told to read more indices than your index buffer holds, so WebGL skips the draw and the canvas stays black. Because `render` runs every frame, the warning repeats until the browser stops reporting it ("too many errors"). Check how you fill the index buffer in Task 1a and the count you pass in Task 1b.

<details>
<summary>Spoiler</summary>

One of these four is usually the cause:

- The indices were passed as a plain JavaScript array, as in `gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW)`. `gl.bufferData` only accepts typed arrays such as `Uint16Array`. It reads a plain array as a buffer size, which comes out as 0, and creates an empty buffer without any warning. Wrap the indices in `new Uint16Array(mesh.indices)`. The same applies to the vertex buffers, which need `new Float32Array(...)`.
- The indices went to the wrong target. Both `gl.bindBuffer` and `gl.bufferData` need `gl.ELEMENT_ARRAY_BUFFER`. With `gl.ARRAY_BUFFER` in `gl.bufferData`, the indices end up in the last vertex buffer you bound, and the index buffer stays empty.
- `gl.bufferData` for the indices is missing. The buffer exists, but it is empty.
- The count is too large. It is the number of indices, so pass `mesh.indices.length`, not `mesh.indices.length * 3`.

The correct version:

```js
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);
// ...
gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
```

</details>
</details>

<details>
<summary>The console shows <code>glDrawElements: Vertex buffer is not big enough for the draw call</code></summary>

Your index buffer is fine, but the indices point to vertices that one of your vertex buffers doesn't have. That buffer is empty, or smaller than your attribute setup says it is. Check every `gl.bufferData` and `gl.vertexAttribPointer` call in Task 1a.

<details>
<summary>Spoiler</summary>

One of these two is usually the cause:

- The vertex data was passed as a plain JavaScript array, as in `gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW)`. Just like for the index buffer, the vertex buffer then stays empty without any warning. Wrap the data in a typed array that matches `gl.FLOAT`: `new Float32Array(mesh.vertices)` and `new Float32Array(mesh.vertexNormals)`.
- The size in `gl.vertexAttribPointer` is larger than the number of values per vertex in your array. Positions and normals have 3, colors have 4.

</details>
</details>

<details>
<summary>Only part of the mesh shows up</summary>

Look at the count you pass to `gl.drawElements`. What does it count: triangles, vertices or indices?

<details>
<summary>Spoiler</summary>

It counts indices. Pass `mesh.indices.length`, not `mesh.indices.length / 3`.

</details>
</details>

<details>
<summary>The mesh is a mess of long spiky triangles</summary>

The GPU reads your index buffer with a different number type than the one you stored in it.

<details>
<summary>Spoiler</summary>

The array type and the type in `gl.drawElements` must match. Use `new Uint16Array(mesh.indices)` together with `gl.UNSIGNED_SHORT`.

</details>
</details>

## Task 2

<details>
<summary>How do I subtract or cross two vectors?</summary>

`v1 - v0` doesn't work. gl-matrix vectors are arrays of numbers, and JavaScript has no vector operators. Use the gl-matrix functions instead. They write their result into the first argument, so you have to create that vector first. Section 22.2.5 of the script ("Working with gl-matrix") explains the pattern.

<details>
<summary>Spoiler</summary>

```js
var a = vec3.create();
vec3.subtract(a, v1, v0);   // a = v1 - v0
```

`vec3.cross(out, a, b)` and `vec3.normalize(out, a)` work the same way. The full list is in the [gl-matrix vec3 docs](https://glmatrix.net/docs/module-vec3.html).

</details>
</details>

<details>
<summary>After Task 2 the mesh is still flat, with no light from the right</summary>

Your normals are probably broken. Print the first three after the Task 2 loops with `console.log(mesh.vertexNormals.slice(0, 9))`. Each one should be a vector of length 1. Look for `NaN` or all zeros.

<details>
<summary>Spoiler</summary>

If you see `NaN`, there are two common causes. Neither raises an error, and every normal computed from a `NaN` is `NaN` too, so the shader adds no diffuse light.

- You wrote `const a = v1 - v0`. gl-matrix vectors are arrays of numbers, and JavaScript has no vector operators, so subtracting two arrays gives `NaN`. Use `vec3.subtract(a, v1, v0)` (see "How do I subtract or cross two vectors?" above).
- You wrote `mesh.vertexNormals[index] += n`. `mesh.vertexNormals` is a flat array of single numbers, 3 per vertex, but `n` is a whole vector. `+=` then turns the entry into a string, which becomes `NaN` in the normalization loop. Add one component at a time, at the right position: `mesh.vertexNormals[3*vIndex + k] += n[k]` for `k` = 0, 1, 2. If you log `mesh.vertexNormals[0]` before the normalization loop, you see the string directly.

If the normals are all `0`, your loop never adds the face normals to `mesh.vertexNormals`.

If the normals look fine, they don't reach the GPU. See "The mesh is already lit after Task 1" below.

</details>
</details>

<details>
<summary>The mesh is already lit after Task 1, before you wrote any Task 2 code</summary>

After Task 1, your normals are still all zero, so the mesh should be a flat, very dark grey. If it's already shaded, the normals come from somewhere else. Your own normals never reach the GPU.

<details>
<summary>Spoiler</summary>

The OBJ loader already fills `mesh.normalBuffer` with the normals stored in the file, and they look almost the same as the ones you compute. Create your own buffer in Task 1a from `mesh.vertexNormals`, the array your Task 2 loop fills, and bind that one to `aVertexNormal`.

</details>
</details>

<details>
<summary>The shading has random dark patches or noise</summary>

You are probably adding a face normal to the wrong vertices. The loop variable `i` counts triangles, not vertices.

<details>
<summary>Spoiler</summary>

The vertex index of corner `j` of triangle `i` is `mesh.indices[3*i + j]`. Its normal starts at `mesh.vertexNormals[3 * thatIndex]`.

</details>
</details>

<details>
<summary>The light seems to come from the wrong side</summary>

Your normals probably point into the mesh. The order of the operands in the cross product decides which way the normal points.

<details>
<summary>Spoiler</summary>

With `a = v1 - v0` and `b = v2 - v0`, the outward normal is `cross(a, b)`. `cross(b, a)` points inward.

</details>
</details>

## Task 3

<details>
<summary>How do I create the color array?</summary>

Like `mesh.vertices` and `mesh.vertexNormals`, `mesh.vertexColors` is a flat array of single numbers, only with 4 per vertex instead of 3: `[r0, g0, b0, a0, r1, g1, b1, a1, ...]`. The color of vertex `i` sits at index `4*i` to `4*i + 3`, so the array has 4 * number of vertices entries in total.

<details>
<summary>Spoiler</summary>

You can create the full array up front:

```js
mesh.vertexColors = new Array(mesh.vertices.length / 3 * 4).fill(1.0);
```

`new Array(n)` makes an array with `n` empty slots, and `.fill(1.0)` sets all of them to 1.0. With r, g, b and a all at 1.0, every vertex starts out white. A vertex your loop forgets to color therefore stays white, which makes that mistake easy to spot. With `.fill(0.0)`, they would start out black.

JavaScript arrays also grow on their own, so you can start with an empty array and append 4 numbers per vertex instead:

```js
mesh.vertexColors = [];
// inside the loop over all vertices:
mesh.vertexColors.push(color[0], color[1], color[2], color[3]);
```

</details>
</details>

<details>
<summary>The mesh turned black after I added colors</summary>

Black means the shader reads (0, 0, 0) as the color. Check every step of the color attribute, just as for positions and normals in Task 1a.

If the console shows `glDrawElements: Vertex buffer is not big enough for the draw call`, nothing is drawn at all, and your color buffer is too small. See the Task 1 hint with that message. The same causes apply to colors, with 4 numbers per vertex.

<details>
<summary>Spoiler</summary>

Usually `gl.enableVertexAttribArray` is missing for `aVertexColor`. A disabled attribute reads as (0, 0, 0, 1). Also check that the shader actually uses `aVertexColor`. Otherwise the compiler removes it and its location is -1.

</details>
</details>

<details>
<summary>The baubles are still grey after Task 3a</summary>

Grey is the template's default color. Your colors have to pass three places before they reach the screen, and the baubles stay grey if any one of them is missing: `calcVertexColor`, the color buffer in Task 1a, and the vertex shader. Often there is no console warning at all, so check all three.

<details>
<summary>Spoiler</summary>

- **`calcVertexColor`** sits at the very top of `main.js`, above the `main` function, under `HELPER FUNCTION FOR TASK 3a`, so it's easy to miss. The template version returns the same grey `(0.3, 0.3, 0.3, 1.0)` for every vertex. Change it to return a color based on the vertex's y coordinate.
- **Task 1a** has an empty `Vertex Colors` block for this. Fill it just like the one for the normals: a buffer filled with `new Float32Array(mesh.vertexColors)`, `gl.getAttribLocation(shaderProgram, "aVertexColor")`, `gl.vertexAttribPointer` with size `4`, and `gl.enableVertexAttribArray`. Without it, nothing sends your colors to the GPU.
- **The vertex shader** must declare `attribute vec4 aVertexColor;` and use it in place of the constant grey: `vColor = aVertexColor * (diffuseIntensity + ambientIntensity);`. Both spots are marked as Task 3a in `vertexShader.js`. The name has to match the string in `gl.getAttribLocation` exactly. If the shader declares the attribute but never uses it, the compiler removes it, and the console shows `index out of range` for `gl.vertexAttribPointer`.

</details>
</details>

<details>
<summary>The colors are smeared or striped across the baubles</summary>

A color has a different number of components than a position. Check every place that assumes three numbers per vertex.

<details>
<summary>Spoiler</summary>

Colors are RGBA, so 4 numbers per vertex. Index the array with `4*i + k` and pass size `4` to `gl.vertexAttribPointer`.

</details>
</details>

<details>
<summary>All three baubles have the same color</summary>

Print the coordinate you compare in `calcVertexColor` with `console.log`. Is it really a number?

<details>
<summary>Spoiler</summary>

gl-matrix vectors are arrays of numbers, not objects with `x`, `y` and `z` fields. `pCoordinate.y` is `undefined`, so every comparison is false. Use `pCoordinate[1]`.

</details>
</details>

<details>
<summary>The mesh spins around the viewing direction instead of around itself</summary>

The order of matrix multiplication decides in which coordinate frame the rotation happens.

<details>
<summary>Spoiler</summary>

Use `mat4.rotate(modelViewMatrix, modelViewMatrix, angle, [0, 0, 1])`. This multiplies the rotation on the right, so it happens in the mesh's own frame, where z points up along the hanging baubles.

</details>
</details>

# Model Licences and Attributions

## Tree decorations

The mesh used in this project is based on "Tree Decorations" (https://sketchfab.com/3d-models/tree-decorations-f0d69842420f4805915f894dadf52f2f) by Emily Evans (https://sketchfab.com/emilyevans) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)

### Model Information
- title:	Tree Decorations
- source:	https://sketchfab.com/3d-models/tree-decorations-f0d69842420f4805915f894dadf52f2f
- author:	Emily Evans (https://sketchfab.com/emilyevans)

### Model License
- license type:	CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
- requirements:	Author must be credited. Commercial use is allowed.
