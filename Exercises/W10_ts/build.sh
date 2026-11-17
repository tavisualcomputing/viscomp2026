#!/bin/bash

set -e

tsc
cd dist
ln -sf ../images/ ./images || true
ln -sf ../shaders/ ./shaders || true
ln -sf ../index.html ./index.html || true
cp ../webgl-obj-loader.js ./webgl-obj-loader.js
sed --in-place '3d;2d' ./main.js
