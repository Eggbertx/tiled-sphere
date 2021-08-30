// this is mainly just used for testing to make sure that Tiled maps are being loaded correctly
import { TiledMap } from "tiled/tiled";
import { Thread, Prim } from "sphere-runtime";

export class TiledMapRenderer extends Thread {
	constructor(/** @type {TiledMap} */ map,  /** @type {Surface} */ target) {
		super();
		/** @type {TiledMap} */
		this.map = map;
		/** @type {Surface} */
		this.target = target;
		this.filename = "";

		this.surfaceWidth = map.width * map.tileWidth;
		this.surfaceHeight = map.height * map.tileHeight;
		/** @type {Surface} */
		this.surface = new Surface(this.surfaceWidth, this.surfaceHeight, Color.Black);
		this.font = Font.Default;

		let tilesetFile = "@/maps/monobomber-tileset.png"
		Surface.fromFile(tilesetFile).then(tileset => {
			for(let l = 0; l < this.map.layers.length; l++) {
			// for(let l = this.map.layers.length-1; l >= 0; l--) {
				this.drawLayer(l, tileset);
			}
		});
	}
	drawLayer(/** @type {Number} */ l, /** @type {Surface} */ tileset) {
		if(!this.map.layers[l].visible)
			return;

		let tw = this.map.tileWidth;
		let th = this.map.tileHeight;
		// let fw = this.font.widthOf("X");
		// let fh = this.font.height;

		for(let y = 0; y < this.map.height; y++) {
			for(let x = 0; x < this.map.width; x++) {
				let tileIndex = this.map.tileAt(x, y, l) - 1;
				if(tileIndex == -1)
					continue;

				// draw the portion of the tileset image onto the map
				Prim.blitSection(this.surface,
					x*tw, y*th, tileset,
					tileIndex*tw, 0, tw, th);

				// draw tile index (for debugging)
				/* this.font.drawText(this.surface,
					x*tw + tw/2 - fw/2,
					y*th + th/2 - fh/2,
					tileIndex, Color.Red); */
			}
		}
	}
	on_render() {
		Prim.blit(this.target, 0, 0, this.surface);
		if(this.filename != "")
			Font.Default.drawText(this.target,
				this.surfaceWidth/2 - this.font.widthOf(this.filename)/2,
				this.surfaceHeight + this.font.height,
				this.filename);
	}
}