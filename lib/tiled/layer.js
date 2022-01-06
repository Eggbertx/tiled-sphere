import { TiledProperties } from './properties';
const atob = require("base64").toByteArray;
const pako = require("pako");

const delimiter = /,\s*/g;
let noProperties = new TiledProperties();

function parseCSV(/** @type {string} */ csvStr) {
	csvStr = csvStr.trim();
	if(csvStr == "")
		return new Uint32Array();

	let csvArr = csvStr.split(delimiter);
	let u32a = new Uint32Array(csvArr.length);
	for(let i = 0; i < u32a.length; i++) {
		u32a[i] = parseInt(csvArr[i], 10);
	}
	return u32a;
}

function layerToArray(data, encoding, compression) {
	if(encoding == "csv") {
		return parseCSV(data);
	} else if(encoding != "base64") {
		throw new EncodingMethodError(encoding);
	}
	let decoded = atob(data);
	/** @type {ArrayBufferLike} */
	let inflated;
	if(compression == "gzip")
		inflated = pako.inflate(decoded).buffer;
	else if(compression == "zlib")
		inflated = pako.inflate(decoded).buffer;
	else {
		let fixed = [];
		// shrink down the array into an array of 32-bit ints (even though it probably only needs 8-bit)
		for(let i = 0; i < decoded.length; i += 4) {
			fixed.push(decoded[i] || (decoded[i+1] << 1) || (decoded[i+2] << 2) || (decoded[i+3] << 3));
		}
		return fixed;
	}

	return new Uint32Array(inflated);
}

export class CompressionMethodError extends Error {
	constructor(compressionMethod) {
		super(`Invalid compression format (${compressionMethod}). Only zlib and uncompressed layers are currently supported`);
		this.compressionMethod = compressionMethod;
		this.name = "CompressionMethodError"
	}
}

export class EncodingMethodError extends Error {
	constructor(encoding) {
		super(`Invalid encoding format (${encoding}). Only base64 and CSV are supported`);
		this.name = "EncodingMethodError";
		this.encoding = encoding;
	}
}


export class TiledLayer {
	constructor(options, data, customProperties = noProperties) {
		this.options = options;
		this.customProperties = customProperties;
		this.encoding = options.encoding;
		this.compression = options.compression;
		this.data = data;
		this._decompressed = null;
	}
	get id() {
		return this.options["id"];
	}
	get name() {
		return this.options["name"];
	}
	set name(name) {
		this.options["name"] = name;
	}
	get visible() {
		return this.options["visible"] != false;
	}
	set visible(visible) {
		this.options["visible"] = visible;
	}
	get locked() {
		return this.options["locked"] != "0";
	}
	set locked(locked) {
		this.options["locked"] = locked;
	}
	get opacity() {
		if(this.options['opacity'] === undefined)
			return 1.0;
		return parseFloat(this.options["opacity"]);
	}
	set opacity(op) {
		this.options["opacity"] = op;
	}
	get width() {
		return parseInt(this.options["width"])
	}
	get height() {
		return parseInt(this.options["height"])
	}
	get tintColor() {
		return this.options["tintcolor"];
	}
	set tintColor(col) {
		this.options["tintColor"] = col;
	}
	get xOffset() {
		return this.options["offsetx"];
	}
	set xOffset(x) {
		this.options["offsetx"] = x;
	}
	get yOffset() {
		return this.options["offsety"];
	}
	set yOffset(y) {
		this.options["offsety"] = y;
	}

	decompressData() {
		if(this._decompressed != null)
			return;

		if(!this.encoding && this.data instanceof Array)
			// we're assuming this is from a CSV-encoded layer,
			// which doesn't need to be decompressed
			this._decompressed = Uint32Array.from(this.data)
		else{
			this._decompressed = layerToArray(this.data, this.encoding, this.compression);
		}
	}

	tileAt(x, y) {
		this.decompressData();
		let i = y * this.width + x;
		return this._decompressed[i] - 1;
	}

	static fromJSONNode(layer) {
		return new TiledLayer(layer, layer['data'],
			TiledProperties.fromJSON(layer['properties'])
		);
	}
	static fromXMLNode(layer) {
		let layerProperties = null;
		let attributes = layer.attributes;
		let data = "";
		for(const node of layer.nodes) {
			if(node.type != "tag")
				continue;
			switch(node.name) {
				case "properties":
					layerProperties = TiledProperties.fromXMLNode(node);
					break;
				case "data":
					attributes["encoding"] = node.attributes["encoding"];
					attributes["compression"] = node.attributes["compression"];
					data = node.nodes[0].text;
					break;
				case "chunk":
					throw new TypeError("Layer chunk data for infinite maps not supported yet");
				case "tile":
					throw new TypeError("tile node in layer not supported yet");
			}
		}
		return new TiledLayer(layer.attributes, data, layerProperties?layerProperties:noProperties);
	}
}