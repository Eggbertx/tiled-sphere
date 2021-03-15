
const validTypes = [
	"string", "int", "float", "bool", //base
	"color" //, "file", // 0.16
	// "object" //0.17
];

// stores property types that will eventually be supported but currently aren't
// (hence why) they're commented out of validTypes
const currentlyUnsupportedTypes = [
	"file", "object"
];

function getXMLProperties(node) {
	let props = [];
	if(!node || !node.nodes || node.nodes.length == 0) return props;
	if(node.name == "properties") {
		for(const property of node.nodes) {
			props.push(property.attributes);
		}
		return props;
	}
	return getProperties(node.nodes.find(node => node.name == "properties"));
}

export class InvalidTypeError extends TypeError {
	constructor(type) {
		super(`Invalid or unsupported property type (${type})`);
		this.name = "InvalidTypeError"
		this.type = type;
		this.currentlyUnsupported = currentlyUnsupportedTypes.indexOf(type) > -1;
	}
}

export class TiledProperties {
	constructor() {
		/** @private */
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
	static fromJSONNode(properties) {
		let m = new TiledProperties();
		if(!properties)
			return m;
		for (const property of properties) {
			m.set(property.name, property.value, property.type);
		}
		return m;
	}
	static fromXMLNode(properties) {
		let m = new TiledProperties();
		let propList = getXMLProperties(properties);
		for(const prop of propList) {
			m.set(prop.name, prop.value, prop.string);
		}
		return m;
	}
}
