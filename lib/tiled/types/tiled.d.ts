declare interface TiledMapAttributes {
	compressionlevel: number;
	width: number;
	height: number;
	infinite: boolean;
	nextlayerid: number;
	nextobjectid: number;
	orientation: string;
	renderorder: string;
	tilewidth: number;
	tileheight: number;
	type: string;
}

declare interface TiledPropertiesAttributes {
	name: string;
	type: string;
	value: any;
}

declare interface TiledTilesetAttributes {
	tilewidth: number;
	tileheight: number;
	string: string;
	margin: number;
	spacing: number;
	string: number;
	tilecount: number;
	source?: string;
}

