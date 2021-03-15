/*
 * Tiled Map Reader
 * (c) 2021 Eggbertx
 */

import { Thread } from 'sphere-runtime';
import { TiledMap, TiledTileset } from 'tiled/tiled';
import { TiledProperties } from 'tiled/tiled';

function printMapData(/** @type {TiledMap} */ map) {
	SSj.log("Map custom properties:");
	map.customProperties.forEach((name, value, type) => {
		SSj.log(`	properties[name: ${name}, type: ${type}] = ${value}`);
	});
	const optionKeys = Object.keys(map.options);
	SSj.log("Map attributes:")
	for(const key of optionKeys) {
		SSj.log(`	${key}: ${map.options[key]}`)
	}
	SSj.log("Map layers:");
	let layerID = 1;
	for(const layer of map.layers) {
		let layerKeys = Object.keys(layer);
		for(const key of layerKeys) {
			if(key === "options") {
				let layerKeys = Object.keys(layer[key]);
				SSj.log(`	Layer #${layerID} attributes:`);
				for(const optionKey of layerKeys) {
					SSj.log(`		${optionKey}: ${layer[key][optionKey]}`);
				}
				continue
			} else if(key == "customProperties") {
				if(layer[key].numProperties() == 0)
					continue;
				SSj.log(`	Layer #${layerID} properties:`);
				layer[key].forEach(
					function(name, value, type) {
						// SSj.log("property goes here");
						SSj.log(`		customProperty[name: '${name}', type: ${type}] = ${value}`);
					}
				);
				continue;
			}
		}
		layerID++;
	}
}

export default class TiledReaderTest extends Thread {
	constructor() {
		super();
		this.loadMap("@/maps/tmx-b64-gzip.json");
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
		for(const l in map.layers) {
			SSj.log(`Decompressing layer #${map.layers[l].id}`);
			let decompressed = map.layers[l].decompressedData();
			for(const d of decompressed) {
				// SSj.log(d);
			}
		}
		SSj.log(`${path} parsed and layers decompressed, took ${Date.now() - start} ms`);
		printMapData(map);
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
