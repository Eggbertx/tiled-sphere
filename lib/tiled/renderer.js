import { Thread } from "sphere-runtime";

export class TiledMapRenderer extends Thread {
	constructor(map, onUpdate, onRender, onInputCheck, onStartup, onShutdown) {
		super();
		this.map = map;
		this.surface = surface;
		this.on_update = onUpdate;
		this.onRender = onRender;

		if(onInputCheck)
			this.on_inputCheck = onInputCheck;
		if(onStartup)
			this.on_startUp = onStartup;
		if(onShutdown)
			this.on_shutDown = onShutdown;
	}
	on_render() {
		this.onRender();
	}
}