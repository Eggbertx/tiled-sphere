# tiled-sphere
A library for loading [Tiled](mapeditor.org/) XML and JSON maps to be used by a game engine. It's designed to be relatively platform agnostic (so no file I/O or image drawing in the library itself), but it's developed with the [Sphere game engine](https://github.com/fatcerberus/sphere) in mind 

## Usage
This doesn't really do anything interesting yet. It currently just parses a specific map file for testing and prints out some info about it for debugging purposes. When both XML and JSON map and tileset files can be parsed reliably, I'll start working on being able to render them in the Sphere game engine so that they can also be used elsewhere.

## Tiled support
 * Supported map formats: tmx (xml), json
 * Supported layer formats: base64, csv
 * Supported layer compression formats: gzip, zlib

Layer compression isn't required, and the tiled-sphere library should be able to detect if it isn't necessary.

## Attribution
[sax-js](lib/sax.js) is developed by [isaacs](https://github.com/isaacs/sax-js).

[xml.js](lib/xml.js) was originally developed by [Bruce Pascoe](https://github.com/fatcerberus/) for Sphere (with a couple small modifications by me), but is no longer in development.

The [Sphere 2.x API definition file](types/sphere2-api.d.ts) was also developed by Bruce Pascoe.

[Base64.js](lib/base64.js) is developed by [davidchambers](https://github.com/davidchambers/Base64.js).

[pako](https://github.com/nodeca/pako/) is developed by nodeka

These libraries are packaged with tiled-sphere for convenience, since it's simpler to package them than to have to import the npm packages.
