# Static Assets

Everyting under dist/ directory will be copied to the final output template. We use Grunt task to compile, minify and
optimize all assets.

Files that are required for the final template, but do not undergo a compilation process (fonts and images directory
for example), should be placed directly into dist/ directory.

## Stylesheets

We compile [Less](http://lesscss.org) with Grunt into CSS. The final result is a single, minified and optimized CSS
file, copied to dist/ directory.

## JS
All files are combined and minified using Grunt and then copied to dist/ directory.