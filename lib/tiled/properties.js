
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
		let properties = {};
		this.delete = function(name) {
			if(properties.hasOwnProperty(name))
				delete properties[name];
		}
		this.forEach = function(cb) {
			let keys = Object.keys(properties);
			for(const key of keys) {
				cb(key, properties[key].value, properties[key].type);
			}
		};
		this.getType = function(name) {
			if(properties[name] !== undefined)
				return properties[name].value;
		};
		this.getValue = function(name) {
			if(properties[name] !== undefined)
				return properties[name].value;
		};
		this.hasValidType = function(name) {
			if(this.properties[name] === undefined)
				return undefined;
			return validTypes.indexOf(this.properties[name].type) > -1;
		};
		this.numProperties = function() {
			return Object.keys(properties).length;
		}
		this.set = function(name, value, type = "string") {
			if(validTypes.indexOf(type) == -1) {
				throw new InvalidTypeError(type);
			}
			properties[name] = {value: value, type: type};
		};
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
