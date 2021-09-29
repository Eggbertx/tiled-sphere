import { TiledProperties } from 'tiled/tiled';
import XML from '../xml';

export class TiledTileset {
	constructor(options, customTiles = [], customProperties = {}) {
		this.options = options;
		this.customTiles = customTiles;
		this.customProperties = customProperties;

		/** @type {Surface} */
		this.surface = null;
		/** @type {Color} */
		this.transColor = Color.White;
		this.source = options["source"]?options["source"]:"";
	}
	get name() {
		return this.options.name;
	}
	/** @param name {string} */
	set name(name) {
		this.options["name"] = name;
	}
	/** @returns {string} */
	get image() {
		return this.options["image"]?this.options["image"]:"";
	}
	/** @returns {number} */
	get spacing() {
		return this.options["spacing"]?this.options["spacing"]:0;
	}
	/** @returns {number} */
	get tileWidth() {
		return this.options["tilewidth"]?this.options["tilewidth"]:0;
	}
	/** @returns {number} */
	get tileHeight() {
		return this.options["tileheight"]?this.options["tileheight"]:0;
	}
	/** @returns {number} */
	get tileCount() {
		return this.options["tilecount"]?this.options["tilecount"]:0;
	}
	get isExternal() {
		return this.source != "";
	}

	debugPrint(printFunc) {
		if(this.isExternal) {
			printFunc(`External tileset source: ${this.source}`);
			return;
		}
		printFunc(`Tileset name: ${this.name}`);
		printFunc(`Tileset image: ${this.image}`);
		printFunc(`Tile size: (${this.tileWidth},${this.tileHeight})`);
		printFunc(`Tile count: ${this.tileCount}`);
		printFunc(`Tile spacing: ${this.spacing}`);
		printFunc("Tileset custom properties:");
		this.customProperties.forEach((name, value, type) => {
			printFunc(`	properties[name: ${name}, type: ${type}] = ${value}`);
		});
	}

	static fromJSON(jsonIn, isString) {
		let jsonMap = {};
		if(isString)
			jsonMap = JSON.parse(jsonIn);
		else
			jsonMap = jsonIn;

		if(jsonMap['source']) {
			return new TiledTileset(jsonMap, [], []);
		}
		let attributes = {
			tilewidth: jsonMap['tilewidth'],
			tileheight: jsonMap['tileheight'],
			image: jsonMap["image"],
			margin: jsonMap["margin"],
			spacing: jsonMap["spacing"],
			name: jsonMap["name"],
			tilecount: jsonMap["tilecount"]
		}
		let customTiles = [];
		if(jsonMap["tiles"] !== undefined)
			customTiles = jsonMap["tiles"];
		return new TiledTileset(attributes, customTiles, TiledProperties.fromJSONNode(jsonMap["properties"]));
	}

	static fromXMLstr(xmlStr) {
		let tsx = XML.parse(xmlStr, { normalize: true, trim: true });
		if(tsx.nodes.length == 0 || tsx.nodes[0].type != "tag" || tsx.nodes[0].name != "tileset")
			throw new TypeError("This does not appear to be a valid Tiled TSX tileset");
		tsx = tsx.nodes[0];

		let options = tsx.attributes;
		let tiles = tsx.nodes.filter(node => node.name == "tile");
		let customProperties = tsx.nodes.filter(node => node.name == "properties");
		TiledProperties.fromXMLNode(customProperties[0]);
		return new TiledTileset(options, tiles, []);
	}
}