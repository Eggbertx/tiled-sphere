import XML from '../xml';
import { TiledLayer } from './layer';
import { TiledProperties } from './properties';
import { TiledTileset } from './tileset';

export class TiledMap {
	/**
	 * An object holding map data
	 * 
	 * @param {object} options
	 * @param {object} customProperties
	 */
	constructor(options, customProperties = {}) {
		/** @type {TiledTileset[]} */
		this.tilesets = [];
		/** @type {TiledLayer[]} */
		this.layers = [];
		this.objects = [];
		this.options = options;
		this.customProperties = customProperties;
	}

	/**
	 * @type {string}
	 */
	get orientation() {
		return this.options["orientation"];
	}
	set orientation(orientation) {
		this.options["orientation"] = orientation;
	}

	/**
	 * @type {string}
	 */
	get renderOrder() {
		return this.options["renderorder"];
	}
	set renderOrder(order) {
		this.options["renderorder"] = order;
	}

	/**
	 * The width of the map in tiles
	 * @returns {number}
	 */
	get width() {
		return this.options["width"];
	}
	/**
	 * The height of the map in tiles
	 * @returns {number}
	 */
	get height() {
		return this.options["height"];
	}

	/** @type {number} */
	get tileWidth() {
		return parseInt(this.options["tilewidth"]);
	}
	set tileWidth(width) {
		this.options["tilewidth"] = width;
	}

	/** @type {number} */
	get tileHeight() {
		return parseInt(this.options["tilewidth"]);
	}
	set tileHeight(height) {
		this.options["tileheight"] = height;
	}

	get infinite() {
		return this.options["infinite"] == "1";
	}
	set infinite(inf) {
		this.options["infinite"] = inf?"1":"0";
	}

	/** @type {number} */
	get nextLayerID() {
		return this.layers.length + 1;
	}
	/** @type {number} */
	get nextObjectID() {
		return this.objects.length + 1;
	}

	/**
	 * Returns the tile ID at the given X-Y position and layer
	 * @param {number} x X coordinate of the requested tile on the map
	 * @param {number} y Y coordinate of the requested tile on the map
	 * @param {number} layer Layer ID of the requested tile on the map
	 * @returns {number} The tile ID
	 */
	tileAt(x, y, layer) {
		return this.layers[layer].tileAt(x, y);
	}

	/**
	 * Print out information about the map for testing/debugging
	 * @param {(args:string) => void} printFunc The function to pass the strings to
	 * @param {boolean} debugTilesets If true, `TiledTileset#debugPrint` will also
	 * 	be called for each tileset
	 */
	debugPrint(printFunc, debugTilesets = false) {
		printFunc("Map custom properties:");
		this.customProperties.forEach((name, value, type) => {
			printFunc(`	properties[name: ${name}, type: ${type}] = ${value}`);
		});
		const optionKeys = Object.keys(this.options);
		printFunc("Map attributes:")
		for(const key of optionKeys) {
			printFunc(`	${key}: ${this.options[key]}`)
		}
		printFunc("Map layers:");
		let layerID = 1;
		for(const layer of this.layers) {
			let layerKeys = Object.keys(layer);
			for(const key of layerKeys) {
				if(key === "options") {
					let layerKeys = Object.keys(layer[key]);
					printFunc(`	Layer #${layerID} attributes:`);
					for(const optionKey of layerKeys) {
						printFunc(`		${optionKey}: ${layer[key][optionKey]}`);
					}
					continue
				} else if(key == "customProperties") {
					if(layer[key].numProperties() == 0)
						continue;
					printFunc(`	Layer #${layerID} properties:`);
					layer[key].forEach(
						function(name, value, type) {
							printFunc(`		customProperty[name: '${name}', type: ${type}] = ${value}`);
						}
					);
					continue;
				}
			}
			layerID++;
		}
		if(debugTilesets) {
			printFunc("Tilesets:");
			for(const tileset of this.tilesets) {
				tileset.debugPrint(printFunc);
			}
			printFunc("");
		}
	}

	/**
	 * takes an XML string, parses it, and returns a new `TiledMap` from the XML data
	 * @param {string} xmlStr
	 * @returns {TiledMap}
	 */
	static fromXML(xmlStr) {
		let tmx = XML.parse(xmlStr, { normalize: true, trim: true });
		
		if(tmx.nodes.length == 0 || tmx.nodes[0].type != "tag" || tmx.nodes[0].name != "map")
			throw new TypeError("This does not appear to be a valid Tiled TMX map");
		tmx = tmx.nodes[0];

		let mapOptions = tmx.attributes;

		let tilesets = [];
		let tilesetNodes = tmx.nodes.filter(node => node.name == "tileset");
		for(const tileset of tilesetNodes) {
			tilesets.push(TiledTileset.fromJSON(tileset.attributes));
		}
		let map = new TiledMap(mapOptions, TiledProperties.fromXMLNode(tmx));
		let layerNodes = tmx.nodes.filter(node => node.name == "layer");
		for(const layer of layerNodes) {
			map.layers.push(TiledLayer.fromXMLNode(layer));
		}
		map.tilesets = tilesets;
		return map;
	}

	/**
	 * takes a JSON-parsed object (or creates one of it's a string) and creates
	 * a new `TiledMap` from it
	 * @param jsonIn {string|object} The incoming JSON map or string
	 * @returns {TiledMap}
	 */
	static fromJSON(jsonIn) {
		let jsonMap = {};
		if(typeof jsonIn === "string")
			jsonMap = JSON.parse(jsonIn);
		else
			jsonMap = jsonIn;
		
		/** @type {TiledMapAttributes} */
		let attributes = {
			compressionlevel: jsonMap['compressionlevel'],
			width: jsonMap['width'],
			height: jsonMap['height'],
			infinite: jsonMap['infinite'],
			nextlayerid: jsonMap['nextlayerid'],
			nextobjectid: jsonMap['nextobjectid'],
			orientation: jsonMap['orientation'],
			renderorder: jsonMap['renderorder'],
			tilewidth: jsonMap['tilewidth'],
			tileheight: jsonMap['tileheight'],
			type: jsonMap['type'],
		};

		let layersRaw = jsonMap['layers'];
		let layers = [];
		for (const layerRaw of layersRaw) {
			layers.push(TiledLayer.fromJSONNode(layerRaw));
		}

		let tilesetsRaw = jsonMap['tilesets'];

		let map = new TiledMap(
			attributes, 
			TiledProperties.fromJSON(jsonMap["properties"])
		);
		map.layers = layers;
		for(const tileset of tilesetsRaw) {
			map.tilesets.push(TiledTileset.fromJSON(tileset));
		}
		return map;
	}
}
