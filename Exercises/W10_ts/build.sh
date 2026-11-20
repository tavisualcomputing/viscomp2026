#!/bin/bash

set -e

tsc
cd dist
ln -sf ../task01.PNG ./task01.PNG || true
ln -sf ../task02.PNG ./task02.PNG || true
ln -sf ../task03.PNG ./task03.PNG || true
ln -sf ../task04.PNG ./task04.PNG || true
ln -sf ../teaser_09.PNG ./teaser_09.PNG || true
ln -sf ../index.html ./index.html || true
cp ../webgl-obj-loader.js ./webgl-obj-loader.js
cp ../gl-matrix.js ./gl-matrix.js

# Strip imports
sed --in-place '1d;2d' ./ex09.js
