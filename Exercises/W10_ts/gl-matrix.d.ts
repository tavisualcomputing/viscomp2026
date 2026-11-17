// Descriptions of the gl-matrix functions for your editor, so that it can suggest them while you
// type. The browser never loads this file. Only the common functions are listed here. The others
// still work, and the full list is at https://glmatrix.net/docs/
//
// Most functions write their result into the first argument `out`, so create that vector first.

type Vector = Float32Array | number[];
type Matrix = Float32Array | number[];

declare const vec3: {
  /** Creates a new vector (0, 0, 0). */
  create(): Float32Array;
  /** Creates a new vector from three numbers. */
  fromValues(x: number, y: number, z: number): Float32Array;
  /** out = a + b */
  add(out: Vector, a: Vector, b: Vector): Vector;
  /** out = a - b */
  subtract(out: Vector, a: Vector, b: Vector): Vector;
  /** out = a * s, for a number s */
  scale(out: Vector, a: Vector, s: number): Vector;
  /** out = a with length 1 */
  normalize(out: Vector, a: Vector): Vector;
  /** out = cross product of a and b */
  cross(out: Vector, a: Vector, b: Vector): Vector;
  /** Returns the dot product of a and b. */
  dot(a: Vector, b: Vector): number;
  /** Returns the length of a. */
  length(a: Vector): number;
};

declare const vec4: {
  /** Creates a new vector (0, 0, 0, 0). */
  create(): Float32Array;
  /** Creates a new vector from four numbers. */
  fromValues(x: number, y: number, z: number, w: number): Float32Array;
  /** out = a * s, for a number s */
  scale(out: Vector, a: Vector, s: number): Vector;
};

declare const mat4: {
  /** Creates a new identity matrix. */
  create(): Float32Array;
  /** Creates a new matrix from 16 numbers, column by column. */
  fromValues(
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number,
  ): Float32Array;
  /** out = a * b */
  multiply(out: Matrix, a: Matrix, b: Matrix): Matrix;
  /** out = a * rotation by `rad` radians around `axis`, for example [0, 0, 1] */
  rotate(out: Matrix, a: Matrix, rad: number, axis: Vector): Matrix;
  /** out = a * translation by v */
  translate(out: Matrix, a: Matrix, v: Vector): Matrix;
  /** out = a * scaling by v */
  scale(out: Matrix, a: Matrix, v: Vector): Matrix;
  /** out = perspective projection. `fovy` is the vertical field of view in radians. */
  perspective(out: Matrix, fovy: number, aspect: number, near: number, far: number): Matrix;
};
