Object.assign(Sphere.Game, {
	version: 2,
	apiLevel: 2,

	name: "Tiled Map Reader",
	author: "Eggbertx",
	summary: "An experimental map engine that uses maps created in the Tiled editor",
	resolution: '800x600',

	main: '@/scripts/main.js',
});

install('@/node_modules',	files('node_modules/*', true));
install('@/scripts',		files('src/*.js'));
install('@/lib',			files('lib/*.js', true));
install('@/maps',			files('maps/*', true));
install('@/',				files('icon.png'));
