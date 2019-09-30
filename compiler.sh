#!/bin/bash -e

if [ -z "$1" ]
then
    VERSION='0.0.2';
else 
    VERSION=$1;
fi
echo 'Start with linting. Let us verify the file is capable of being built.';
LINT=`eslint --quiet src/js/jquery.mapper.js`;
LINT2=`sass -c src/scss/basic.scss --trace --stop-on-error`;

if [ -z "$LINT" ] && [ {$LINT2} != *"Sass::SyntaxError"* ]
then
    echo "Using Version $VERSION";
    echo 'Clearing dev data.';
    rm -f build/js/*.js
    rm -f build/css/*.css
    rm -f build/css/*.css.map
    echo 'Compiling JS file...';
    terser src/js/jquery.mapper.js -o build/js/$VERSION-jquery.mapper.min.js --compress --mangle --ie8 --safari10;
    terser src/js/jquery.mapper.js -o build/js/latest-jquery.mapper.min.js --compress --mangle --ie8 --safari10;
    echo 'Done!';
    echo 'Compiling SCSS Files...';
    sass src/scss/basic.scss:build/css/$VERSION-basic.min.css --style compressed
    sass src/scss/basic.scss:build/css/latest-basic.min.css --style compressed
    echo 'Build complete!';
    echo "## Version [$VERSION]" >> CHANGELOG.md;
else
    echo 'Unable to compile new version. Please solve the following errors.';
    echo "$LINT";
    echo "$LINT2";
fi