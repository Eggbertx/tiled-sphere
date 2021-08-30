Object.assign(Sphere.Game, {
	version: 2,
	apiLevel: 3,

	name: "Tiled Map Reader",
	author: "Eggbertx",
	summary: "An experimental Tiled -> Sphere map converter",
	resolution: '800x600',
	saveID: "Eggbertx.tiled-sphere",

	main: '@/scripts/main.js',
});

install('@/scripts',files('src/*.js'));
install('@/lib',	files('lib/*.js', true));
install('@/maps',	files('maps/*', true));
// install('@/',		files('icon.png'));
