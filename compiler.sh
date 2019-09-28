#!/bin/bash

echo 'Compiling JS files...';
for filename in src/js/*.js; do
    NAME=basename $filename .js;
    minify $filename -o ../../build/js/$NAME.min.js;
done
echo 'Done!';
echo 'Compiling SCSS Files...';
sass src/scss/basic.scss:build/css/basic.min.css --style compressed
echo 'Build complete!';