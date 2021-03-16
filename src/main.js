/*
 * Tiled Map Reader
 * (c) 2021 Eggbertx
 */

import { Thread } from 'sphere-runtime';
import { TiledMap, TiledTileset } from 'tiled/tiled';

const json_b64_gzip_path = "@/maps/tmx-b64-gzip.json";
const tmx_b64_gzip_path = "@/maps/tmx-b64-gzip.tmx";
const external_tsx = "@/maps/external.tsx";

export default class TiledReaderTest extends Thread {
	constructor() {
		super();
		// this.loadMap(json_b64_gzip_path);
		this.loadMap(tmx_b64_gzip_path, true);
		// this.loadTileset("@/maps/external.tsx");
	}
	loadMap(path, xml) {
		let str = FS.readFile(path, DataType.Text);
		let start = Date.now();
		SSj.log("Parsing XML file into map");
		/** @type {TiledMap} */
		let map = null;
		if(xml)
			map = TiledMap.fromXML(str);
		else
			map = TiledMap.fromJSON(str);

		map.debugPrint(SSj.log);
		for(const l in map.layers) {
			SSj.log(`Decompressing layer #${map.layers[l].id}`);
			let decompressed = map.layers[l].decompressedData();
			for(const d of decompressed) {
				// SSj.log(d);
			}
		}
		SSj.log(`${path} parsed and layers decompressed, took ${Date.now() - start} ms`);
		return map;
	}
	loadTileset(path, xml) {
		let start = Date.now();
		let str = FS.readFile(path, DataType.Text);
		let tsx = null;
		if(xml)
			tsx = TiledTileset.fromXMLstr(str);
		else
			tsx = TiledTileset.fromJSONstr(str);
		SSj.log(`${path} parsed, took ${Date.now() - start} ms`);
		return tsx;
	}

	on_update() {
		if(Keyboard.Default.isPressed(Key.Escape))
			Sphere.shutDown();
	}

	on_render() {

	}
}
