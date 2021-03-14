const parser = require("sax").parser;

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

	static fromXML(xmlStr) {
		let sax = parser(true, { normalize: true });
		let customTileProperties = [];
		
		sax.onopentag = tag => {
			switch(tag.name) {
				case "tileset":
					
					break;
			
				default:
					break;
			}
		};
		sax.onclosetag = tag => {
			
		}
		sax.onerror = err => {
			throw err;
		}
		sax.write(xmlStr);
		sax.close();
	}
}