import { TiledMap } from "./tiled/tiled";

const mapTool = new Tool((outDir, inFiles) => {
	const inDir = FS.directoryOf(inFiles[0]);
	for(const tiledMap of inFiles) {
		let extension = FS.extensionOf(tiledMap);
		let outFile = tiledMap.slice(0,tiledMap.lastIndexOf(".")) + ".rmp";

		warn(`converting ${tiledMap} to ${outFile}`);
		try {
			let m = TiledMap.fromFile(tiledMap);
			// warn(`Map size: ${m.width}x${m.height}`);
		} catch(e) {
			// because cell doesn't automatically print the stack of an uncaught error,
			// we need to do that manually
			error(e.stack);
			throw e;
		}
		
	}
}, "converting map(s)");

export function tiledconv(outDir, targets) {
	return mapTool.stage(`${outDir}/`, targets);
}