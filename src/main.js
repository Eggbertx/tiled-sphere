/*
 * Tiled Map Reader
 * a simple test for parsing Tiled map and tileset files
 * Supported map formats: tmx, json
 * Supported layer formats: base64, csv
 * Supported layer compression formats: none, gzip, zlib
 * (c) 2021 Eggbertx
 */

import { Thread, Console } from 'sphere-runtime';
import { TiledMap, TiledTileset } from 'tiled/tiled';
import { TiledMapRenderer } from './renderer'

const maps = [
	"@/maps/map-b64-gzip.json",
	"@/maps/map-b64-gzip.tmx",
	"@/maps/map-b64-zlib.json",
	"@/maps/map-b64-zlib.tmx",
	"@/maps/map-b64.json",
	"@/maps/map-b64.tmx",
	"@/maps/map-csv.json",
	"@/maps/map-csv.tmx",
];

const external_tsx = "@/maps/external.tsx";

const console = new Console();

export default class TiledReaderTest extends Thread {
	constructor() {
		super();
		/*for(const map of maps) {
			this.loadMap(map, true);
		}*/
		let mapFilename = "@/maps/map-csv.json";
		let map = this.loadMap(mapFilename, true);
		this.loadTileset("@/maps/external.tsx");
		this.renderer = new TiledMapRenderer(map, Surface.Screen);
		this.renderer.filename = mapFilename;
		this.renderer.start();
	}
	loadMap(path, verbose = false) {
		let str = FS.readFile(path, DataType.Text);
		let start = Date.now();

		console.log(`Parsing map file: ${path}`);
		/** @type {TiledMap} */
		let map = null;
		let isXML = path.toLowerCase().endsWith(".tmx");
		if(isXML)
			map = TiledMap.fromXML(str);
		else
			map = TiledMap.fromJSON(str);
		if(verbose) {
			map.debugPrint(function(...data) {
				console.log(...data);
			});
		}
		for(const l in map.layers) {
			console.log(`	Decompressing layer #${map.layers[l].id}`);
			let decompressed = map.layers[l].decompressedData();
			for(const d of decompressed) {
				// console.log(d);
			}
		}
		console.log(`	${path} parsed and layers decompressed, took ${Date.now() - start} ms`);
		return map;
	}
	loadTileset(path) {
		let start = Date.now();
		let str = FS.readFile(path, DataType.Text);
		let tsx = null;
		let isXML = path.toLowerCase().endsWith(".tsx");
		if(isXML)
			tsx = TiledTileset.fromXMLstr(str);
		else
			tsx = TiledTileset.fromJSONstr(str);
		console.log(`${path} parsed, took ${Date.now() - start} ms`);
		return tsx;
	}

	on_update() {
		if(Keyboard.Default.isPressed(Key.Escape))
			Sphere.shutDown();
	}

	on_render() {

	}
}
