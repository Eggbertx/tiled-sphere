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
const console = new Console();
const tileSetPath = "@/maps/simple-tileset.png";

let testMaps = [
	"maps/map-b64-gzip.json",
	"maps/map-b64-gzip.tmx",
	"maps/map-b64-zlib.json",
	"maps/map-b64-zlib.tmx", 
	"maps/map-b64.json",
	"maps/map-b64.tmx",
	"maps/map-csv.json",
	"maps/map-csv.tmx"
];

let testTilesets = [
	"maps/external.json",
	"maps/external.tsx"
];

// used as a cache so images don't have to be reloaded/parsed
// tilesetSurfaces[path] -> Surface
let tilesetSurfaces = {};

// mapSurfaces[mapPath] -> Surface
let mapSurfaces = {}

export default class TiledReaderTest extends Thread {
	constructor() {
		super();
		this.debugPrint = true;
		this.verbosePrint = true;
		/** @type {TiledMap[]} */
		this.maps = [];
		/** @type {Surface[]} */
		this.surfaces = [];
	}
	start() {
		super.start();
		for(const arg of arguments) {
			if(arg == "--nodebug")
				this.debugPrint = false;
			else if(arg == "--noverbose")
				this.verbosePrint = false;
			else if(arg == "--help") {
				Sphere.abort("usage: neosphere [--noverbose|--nodebug] path/to/map.[tmx|json]")
			} else {
				this.maps.push(this.loadMap(arg));
				return;
			}
		}
		this.testMapLoading();
	}
	async testMapLoading() {
		console.log("Testing map loading/parsing");
		for(const mapPath of testMaps) {
			let map = this.loadMap(mapPath);
			let width = map.width * map.tileWidth;
			let height = map.height * map.tileHeight;
			for(const t in map.tilesets) {
				let tileset = map.tilesets[t];
				if(tileset.isExternal) {
					map.tilesets[t] = this.loadTileset(FS.fullPath(tileset.source, "@/maps"));
					tileset = map.tilesets[t];
				}
				let imgPath = FS.fullPath(tileset.image, "@/maps");
				if(tileset.image != "" && tilesetSurfaces[imgPath] === undefined) {
					tilesetSurfaces[imgPath] = await Surface.fromFile(imgPath);
					console.log(`Loading tileset image ${imgPath}`);
				}
			}

			for(const layer of map.layers) {

			}
			this.maps.push(map);
			console.log(`done processing map ${mapPath}`);
		}
	}
	/**
	 * @param {TiledMap} map
	 * @param {string} filename
	 */
	getMapSurface(map, filename = "") {
		let mW = map.width * map.tileWidth;
		let mH = map.height * map.tileHeight;
		let surface = new Surface(mW, mH, Color.Black);

		for(const tileset of map.tilesets) {
			// SSj.log(tileset);
		}

		for(let l = 0; l < map.layers.length; l++) {
			let layerSurface = this.getLayerSurface(map, l, filename);
			if(layerSurface == null)
				continue;
			Prim.blit(surface, 0, 0, layerSurface);
		}
		return surface;
	}
	/**
	 * @param {TiledMap} map
	 * @param {number} l
	 * @param {string} filename
	 */
	getLayerSurface(map, l, filename = "") {
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

	/**
	 * @param {string} path
	 */
	loadMap(path) {
		// let start = Date.now();
		let map = TiledMap.fromFile(path);
		
		for(const l in map.layers) {
			if(this.verbosePrint)
				console.log(`	Decompressing layer #${map.layers[l].id}`);
			map.layers[l].decompressData();
			let decompressed = map.layers[l]._decompressed;
			for(const d in decompressed) {
				// console.log(`${path} layer[${l}] decompressed[${d}]: ${decompressed[d]}`);
			}
		}
		return map;
	}
	/**
	 * @param {string} path
	 */
	loadTileset(path) {
		let start = Date.now();
		let str = FS.readFile(path, DataType.Text);
		let tsx = null;
		let isXML = path.toLowerCase().endsWith(".tsx");
		if(isXML)
			tsx = TiledTileset.fromXML(str);
		else
			tsx = TiledTileset.fromJSON(str);

		if(this.verbosePrint)
			console.log(`${path} parsed, took ${Date.now() - start} ms`);
		if(this.debugPrint) {
			tsx.debugPrint(args => {
				console.log(args);
			});
		}
		return tsx;
	}

	on_update() {
		if(Keyboard.Default.isPressed(Key.Escape))
			Sphere.shutDown();
	}

	on_render() {
		let x = testPadding;
		let y = testPadding + 8;
		Prim.fill(screen, Color.DarkBlue);
		for (const m in testMaps) {
			// /** @type {Surface} */
			// let surface = this.surfaces[m];
			// if(x + surface.width > screen.width) {
			// 	x = testPadding;
			// 	y += testPadding + surface.height;
			// }
			// Prim.blit(screen, x, y, surface);
			// let split = testMaps[m].split("/");
			// let text = split[split.length-1];
			// font.drawText(screen,
			// 	x + surface.width/2 - font.widthOf(text)/2,
			// 	y - 12,
			// 	text, Color.White);
			// x += testPadding + surface.width;
		}
	}
}
