import { CompressionMethodError, EncodingMethodError } from 'tiled/errors';
import { TiledProperties } from './properties';
const base64 = require("base64");
const pako = require("pako");

const delimiter = /,\s*/g;

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
	let decoded = base64.atob(data);
	if(compression == "gzip" || compression == "zlib") {
		let inflated = pako.ungzip(decoded);
		return new Uint32Array(inflated.buffer);
	}
	throw new CompressionMethodError(compression);
}

export class TiledLayer {
	constructor(options, data, customProperties = {}) {
		this.options = options;
		this.customProperties = customProperties;
		this.encoding = options.encoding;
		this.compression = options.compression;
		this.data = data;
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
		return this.options["visible"];
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
		return 0;
	}
	get height() {
		return 0;
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

	decompressedData() {
		return layerToArray(this.data, this.encoding, this.compression);
	}

	tileAt(x, y, layer) {
		return -1;
	}
	static fromJSONNode(layer) {
		// let keys = Object.keys(layer);
		// for(const key of keys) {
		// 	SSj.log(`${key}: ${layer[key]}`);
		// }
		return new TiledLayer(layer, layer['data'],
			TiledProperties.fromJSONNode(layer['properties'])
		);
	}
	static fromXMLNode() {

	}
}