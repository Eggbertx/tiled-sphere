/*
 * Tiled Map Reader
 * a simple test for parsing Tiled map and tileset files
 * Supported map formats: tmx, json
 * Supported layer formats: base64, csv
 * Supported layer compression formats: none, gzip, zlib
 * (c) 2021 Eggbertx
 */

import { Thread, Console, Prim } from 'sphere-runtime';
import { TiledMap, TiledTileset } from 'tiled/tiled';

const testPadding = 16;

const screen = Surface.Screen;
const font = Font.Default;

let testMaps = [
	// "maps/base-empty.tmx",
	"maps/map-b64-gzip.json",
	"maps/map-b64-gzip.tmx",
	"maps/map-b64-zlib.json",
	"maps/map-b64-zlib.tmx", 
	"maps/map-b64.json",
	"maps/map-b64.tmx",
	"maps/map-csv.json",
	"maps/map-csv.tmx"
];

const console = new Console();

export default class TiledReaderTest extends Thread {
	constructor() {
		super();
		/** @type {TiledMap[]} */
		this.maps = [];
		for(const map of testMaps) {
			this.maps.push(this.loadMap(map, true));
		}

		this.surfaces = [];

		this.tileSetPath = "@/maps/simple-tileset.png";
		// todo: make this actually load a given map's tileset. This is just a temporary placeholder
		this.tilesetSurface = null;
		Surface.fromFile(this.tileSetPath).then(tileset => {
			this.tilesetSurface = tileset;
			for(const m in this.maps) {
				let map = this.maps[m];
				this.surfaces.push(this.getMapSurface(map, testMaps[m]));
			}
		});
	}
	getMapSurface(/** @type {TiledMap} */ map, filename = "") {
		let mW = map.width * map.tileWidth;
		let mH = map.height * map.tileHeight;
		let surface = new Surface(mW, mH, Color.Black);

		for(let l = 0; l < map.layers.length; l++) {
			let layerSurface = this.getLayerSurface(map, l, filename);
			if(layerSurface == null)
				continue;
			Prim.blit(surface, 0, 0, layerSurface);
		}
		return surface;
	}
	getLayerSurface(/** @type {TiledMap} */ map, /** @type {Number} */ l, filename = "") {
		if(!map.layers[l].visible || this.tilesetSurface == null)
			return null;

		let tw = map.tileWidth;
		let th = map.tileHeight;
		let surface = new Surface(tw * map.width, th * map.tileHeight, Color.Transparent);
		for(let y = 0; y < map.height; y++) {
			for(let x = 0; x < map.width; x++) {
				let tileIndex = map.tileAt(x, y, l) - 1;
				if(tileIndex == -1)
					continue;

				// draw the portion of the tileset image onto the map
				Prim.blitSection(surface,
					x*tw, y*th, this.tilesetSurface,
					tileIndex*tw, 0, tw, th);
			}
		}
		return surface;
	}

	loadMap(path, verbose = false) {
		let str = FS.readFile(path, DataType.Text);
		let start = Date.now();

		if(verbose)
			console.log(`Parsing map file: ${path}`);
		/** @type {TiledMap} */
		let map = null;

		let fnLower = path.toLowerCase();
		if(fnLower.endsWith(".tmx"))
			map = TiledMap.fromXML(str);
		else if(fnLower.endsWith(".json"))
			map = TiledMap.fromJSON(str);
		else
			Sphere.abort(`${path} does not appear to be a supported Tiled map (accepted file extensions are .tmx and json)`)

		for(const l in map.layers) {
			if(verbose)
				console.log(`	Decompressing layer #${map.layers[l].id}`);
			map.layers[l].decompressData();
			let decompressed = map.layers[l]._decompressed;
			for(const d of decompressed) {
				// console.log(d);
			}
		}
		if(verbose)
			console.log(`	${path} parsed and layers decompressed, took ${Date.now() - start} ms`);
		return map;
	}
	loadTileset(path, verbose = false) {
		let start = Date.now();
		let str = FS.readFile(path, DataType.Text);
		let tsx = null;
		let isXML = path.toLowerCase().endsWith(".tsx");
		if(isXML)
			tsx = TiledTileset.fromXMLstr(str);
		else
			tsx = TiledTileset.fromJSONstr(str);
		if(verbose)
			console.log(`${path} parsed, took ${Date.now() - start} ms`);
		return tsx;
	}

	on_update() {
		if(Keyboard.Default.isPressed(Key.Escape))
			Sphere.shutDown();
	}

	on_render() {
		let x = testPadding;
		let y = testPadding + 8;
		Prim.drawSolidRectangle(screen, 0, 0, screen.width, screen.height, Color.DarkBlue);
		for (const m in this.surfaces) {
			/** @type {Surface} */
			let surface = this.surfaces[m];
			if(x + surface.width > screen.width) {
				x = testPadding;
				y += testPadding + surface.height;
			}
			Prim.blit(screen, x, y, surface);
			let split = testMaps[m].split("/");
			let text = split[split.length-1];
			font.drawText(screen,
				x + surface.width/2 - font.widthOf(text)/2,
				y - 12,
				text, Color.Green);
			x += testPadding + surface.width;
		}
	}
}
