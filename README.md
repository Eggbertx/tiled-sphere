# tiled-sphere
An experimental map reader for [Tiled](mapeditor.org/) XML and JSON maps that will hopefully eventually turn into a useful Sphere map engine. Maybe I'll make it platform agnostic so it can be used for other JavaScript stuff, but that won't be a priority.

## Usage
Currently this doesn't actually do anything interesting, it just parses the map files for testing. When that fully works, I'll start working on actually rendering them.

## Attribution
[sax-js](lib/sax.js) is developed by [isaacs](https://github.com/isaacs/sax-js).

[xml.js](lib/xml.js) was originally developed by [Bruce Pascoe](https://github.com/fatcerberus/) for [Sphere](https://github.com/fatcerberus/sphere) (with a couple small modifications by me), but is no longer in development.

The [Sphere 2.x API definition file](types/sphere2-api.d.ts) was also developed by Bruce Pascoe.

[Base64.js](lib/base64.js) is developed by [davidchambers](https://github.com/davidchambers/Base64.js).

[pako](https://github.com/nodeca/pako/) is developed by nodeka

These libraries are packaged with tiled-sphere for convenience, since it's simpler to package them than to have to import the npm packages.
