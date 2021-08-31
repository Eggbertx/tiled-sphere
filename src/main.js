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

const external_tsx = "@/maps/external.tsx";

const console = new Console();

export default class TiledReaderTest extends Thread {
	constructor(mapFile) {
		super();
		/*for(const map of maps) {
			this.loadMap(map, true);
		}*/
		/** @type {TiledMap} */
		this.map = null;
		/** @type {TiledMapRenderer} */
		this.renderer = null;
	}
	start(mapFile) {
		super.start();
		if(arguments.length == 0)
			Sphere.abort("usage: neosphere|spherun path/to/map")

		let map = this.loadMap(mapFile, false);
		this.loadTileset("@/maps/external.tsx");
		this.renderer = new TiledMapRenderer(map, Surface.Screen);
		this.renderer.filename = mapFile;
		this.renderer.start();
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
			let decompressed = map.layers[l].decompressedData();
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

	}
}
