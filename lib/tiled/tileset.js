import XML from '../xml';

export class TiledTileset {
	constructor(options) {
		this.options = options;
		
		/** @type {Surface} */
		this.surface = null;
		/** @type {Color} */
		this.transColor = Color.White;
	}
	get name() {
		return this.options.name;
	}
	/** @param name {string} */
	set name(name) {
		this.options["name"] = name;
	}
	/** @returns {number} */
	tileWidth() {
		return this.options["tilewidth"];
	}
	/** @returns {number} */
	tileWidth() {
		return this.options["tilewidth"];
	}
	/** @returns {number} */
	get tileCount() {
		return this.options["tilecount"];
	}

	static fromJSONstr(jsonStr) {
		let jsonMap = JSON.parse(jsonStr);
	}
	static fromXMLstr(xmlStr) {
		let tsx = XML.parse(xmlStr, { normalize: true, trim: true });
		if(tsx.nodes.length == 0 || tsx.nodes[0].type != "tag" || tsx.nodes[0].name != "tileset")
			throw new TypeError("This does not appear to be a valid Tiled TSX tileset");
		tsx = tsx.nodes[0];
	}
}