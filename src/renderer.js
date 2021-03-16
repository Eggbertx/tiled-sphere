// this is mainly just used for testing to make sure that Tiled maps are being loaded correctly
import { Thread } from "sphere-runtime";

export class TiledMapRenderer extends Thread {
	constructor(map, surface) {
		super();
		this.map = map;
		this.surface = surface;
		this.readyToDraw = false;
	}
	static mapToTexture(map) {
		
	}
	on_render() {
		if(!this.readyToDraw) return;
	}
}