import { TiledProperties } from 'tiled/tiled';
import XML from '../xml';

export class TiledTileset {
	/**
	 * An object holding map data
	 * 
	 * @param {object} options
	 * @param {object} customTiles
	 * @param {TiledProperties} customProperties
	 */
	constructor(options, customTiles = [], customProperties = null) {
		this.options = options;
		this.customTiles = customTiles;
		this.customProperties = customProperties;
		if(this.customProperties == null) {
			this.customProperties = new TiledProperties();
		}

		/** @type {Surface} */
		this.surface = null;
		/** @type {Color} */
		this.transColor = Color.White;
		this.source = options["source"]?options["source"]:"";
	}
	/** @type {string} */
	get name() {
		return this.options.name;
	}
	set name(name) {
		this.options["name"] = name;
	}

	/** @type {string} */
	get image() {
		return this.options["image"]?this.options["image"]:"";
	}
	/** @type {number} */
	get spacing() {
		return this.options["spacing"]?this.options["spacing"]:0;
	}
	/** @type {number} */
	get tileWidth() {
		return this.options["tilewidth"]?this.options["tilewidth"]:0;
	}
	/** @type {number} */
	get tileHeight() {
		return this.options["tileheight"]?this.options["tileheight"]:0;
	}
	/** @type {number} */
	get tileCount() {
		return this.options["tilecount"]?this.options["tilecount"]:0;
	}
	get isExternal() {
		return this.source != "";
	}

	/**
	 * Print out information about the tileset for testing/debugging
	 * @param {(args:string) => void} printFunc The function to pass the strings to
	 */
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

	/**
	 * takes a JSON-parsed object (or creates one of it's a string) and creates
	 * a new `TiledTileset` from it
	 * @param jsonIn {string|TiledTilesetAttributes} The incoming JSON map or string
	 * @returns {TiledTileset}
	 */
	static fromJSON(jsonIn) {
		let jsonMap = {};
		if(typeof jsonIn === "string")
			jsonMap = JSON.parse(jsonIn);
		else
			jsonMap = jsonIn;

		if(jsonMap['source']) {
			return new TiledTileset(jsonMap, [], []);
		}
		/** @type {TiledTilesetAttributes} */
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
		return new TiledTileset(attributes, customTiles, TiledProperties.fromJSON(jsonMap["properties"]));
	}

	/**
	 * takes an XML string, parses it, and returns a new `TiledTileset` from the XML data
	 * @param {string} xmlStr
	 * @returns {TiledTileset}
	 */
	static fromXML(xmlStr) {
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