#!/bin/bash

VERSION='0.0.2';
echo "Using Version $VERSION";
echo 'Compiling JS file...';
terser src/js/jquery.mapper.js -o build/js/$VERSION-jquery.mapper.min.js --compress --mangle --ie8 --safari10;
terser src/js/jquery.mapper.js -o build/js/latest-jquery.mapper.min.js --compress --mangle --ie8 --safari10;
echo 'Done!';
echo 'Compiling SCSS Files...';
sass src/scss/basic.scss:build/css/$VERSION-basic.min.css --style compressed
sass src/scss/basic.scss:build/css/latest-basic.min.css --style compressed
echo 'Build complete!';
echo "## Version [$VERSION]" >> CHANGELOG.md;