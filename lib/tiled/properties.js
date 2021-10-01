const validTypes = [
	"string", "int", "float", "bool", //base
	"color" , "file", // 0.16
	"object" //0.17
];

export class InvalidTypeError extends TypeError {
	constructor(type) {
		super(`Invalid or unsupported property type (${type})`);
		this.name = "InvalidTypeError"
		this.type = type;
	}
}

export class InvalidPropertyTagError extends TypeError {
	constructor(tag) {
		super(`Invalid XML node passed to TiledProperties.fromXMLNode (name: ${tag.name}, type: ${tag.type})`);
		this.tag = tag;
		this.name = "InvalidPropertyTagError";
	}
}

export class TiledProperties {
	constructor() {
		/**
		 * @private
		 * @type {TiledPropertiesAttributes}
		 */
		this._properties = {};
	}
	delete(name) {
		if(this._properties.hasOwnProperty(name)) {
			delete this._properties[name];
			return true;
		}
		return false;
	}
	forEach(cb) {
		let keys = Object.keys(this._properties);
		if(cb !== undefined && cb !== null) {
			for(const key of keys) {
				cb(key, this._properties[key].value, this._properties[key].type);
			}
		}
		return keys.length;
	}
	getType(name) {
		if(this._properties[name] !== undefined)
			return this._properties[name].value;
	}
	getValue(name) {
		if(this._properties[name] !== undefined)
			return this._properties[name].value;
	};
	hasValidType(name) {
		if(this._properties[name] === undefined)
			return undefined;
		return validTypes.indexOf(this._properties[name].type) > -1;
	};
	numProperties() {
		return this.forEach();
	}
	set(name, value, type = "string") {
		if(validTypes.indexOf(type) == -1) {
			throw new InvalidTypeError(type);
		}
		this._properties[name] = {value: value, type: type};
	}

	/**
	 * takes a JSON-parsed object (or creates one of it's a string) and creates
	 * a new `TiledProperties` from it
	 * @param jsonIn {string|TiledTilesetAttributes} The incoming JSON map or string
	 * @returns {TiledProperties}
	 */
	static fromJSON(propertiesIn) {
		var properties = {};
		if(typeof properties === "string")
			properties = JSON.parse(propertiesIn);
		else
			properties = propertiesIn;

		let m = new TiledProperties();
		if(!properties)
			return m;
		for (const property of properties) {
			m.set(property.name, property.value, property.type);
		}
		return m;
	}
	static fromXMLNode(properties) {
		if(properties.type != "tag") {
			throw new InvalidPropertyTagError(properties);
		}
		let m = new TiledProperties();
		if(properties.name != "properties") {
			properties = properties.nodes.find(tag => tag.name == "properties");
			if(properties === undefined)
				return m;
		}
		for(const node of properties.nodes) {
			m.set(node.attributes["name"], node.attributes["value"], node.attributes["type"]);
		}
		return m;
	}
}
