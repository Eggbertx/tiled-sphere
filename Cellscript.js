import { tiledconv } from "./cell/tiledconv";

Object.assign(Sphere.Game, {
	version: 2,
	apiLevel: 3,

	name: "Tiled map reader demo",
	author: "Eggbertx",
	summary: "An experimental Tiled -> Sphere map converter",
	resolution: '640x480',
	saveID: "Eggbertx.tiled-sphere",

	main: '@/scripts/main.js',
});

install('@/scripts',files('src/*.js'));
// install('@/lib',	files('lib/*.js', true));
// install('@/maps',	files('maps/*', true));
tiledconv("@/maps/", files("maps/*.tmx", true));
// install('@/',		files('icon.png'));
