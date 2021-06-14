const server = require( 'oxyz-express' );

server({
	watcher: { globs: [ 'dev/**/*.js', 'dev/**/*.html' ] },
	pug: { enable: false },
	sass: { enable: false }
});
