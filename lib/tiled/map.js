import XML from '@/lib/xml';
import { BadExtensionError } from './errors';
import { TiledLayer } from './layer';
import { TiledProperties } from './properties';

const mapOptionsKeys = ["compressionlevel", "editorsettings", "height", "infinite", "nextlayerid", "nextobjectid", "orientation", "renderorder", "tiledversion", "tileheight", "tilewidth", "type", "version", "width"];


export class TiledMap {
	constructor(options, customProperties = {}) {
		/** @type {TiledLayer[]} */
		this.layers = [];
		this.objects = [];
		this.options = options;
		this.customProperties = customProperties;
	}

	get orientation() {
		return this.options["orientation"];
	}
	set orientation(orientation) {
		this.options["orientation"] = orientation;
	}

	get renderOrder() {
		return this.options["renderorder"];
	}
	set renderOrder(order) {
		this.options["renderorder"] = order;
	}

	get width() {
		return this.options["width"];
	}
	get height() {
		return this.options["height"];
	}

	get tileWidth() {
		return this.options["tilewidth"];
	}
	set tileWidth(width) {
		this.options["tilewidth"] = width;
	}

	get tileHeight() {
		return this.options["tilewidth"];
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

	get nextLayerID() {
		return this.layers.length + 1;
	}
	get nextObjectID() {
		return this.objects.length + 1;
	}

	debugPrint(printFunc) {
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
	}

	static fromXML(xmlStr) {
		let tmx = XML.parse(xmlStr, { normalize: true, trim: true });
		
		if(tmx.nodes.length == 0 || tmx.nodes[0].type != "tag" || tmx.nodes[0].name != "map")
			throw new TypeError("This does not appear to be a valid Tiled TMX map");
		tmx = tmx.nodes[0];

		let mapOptions = tmx.attributes;

		let tilesets = [];
		let tilesetNodes = tmx.nodes.filter(node => node.name == "tileset");
		for(const tileset of tilesetNodes) {
			tilesets.push(tileset.attributes);
		}
		let map = new TiledMap(mapOptions, TiledProperties.fromXMLNode(tmx));
		let layerNodes = tmx.nodes.filter(node => node.name == "layer");
		for(const layer of layerNodes) {
			let layerAttributes = layer.attributes;
			let layerData = "";
			let layerProperties = {};
			for(const node of layer.nodes) {
				switch (node.name) {
					case "properties":
						layerProperties = TiledProperties.fromXMLNode(node);
						break;
					case "data":
						layerAttributes["encoding"] = node.attributes["encoding"]
						layerAttributes["compression"] = node.attributes["compression"]
						if(node.nodes.length != 1 || node.nodes[0].type != "text")
							throw new Error("Layer contains invalid data node");
						layerData = node.nodes[0].text;
						break;
					case "chunk":
						throw new Error("Layer chunk data for infinite maps not supported yet");
					case "tile":
						throw new Error("tile node in layer not supported yet");
				}
			}
			map.layers.push(new TiledLayer(layerAttributes, layerData, layerProperties))
		}
		return map;
	}

	static fromJSON(jsonStr) {
		let jsonMap = JSON.parse(jsonStr);

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
			TiledProperties.fromJSONNode(jsonMap["properties"])
		);
		map.layers = layers;
		return map;
	}
}
