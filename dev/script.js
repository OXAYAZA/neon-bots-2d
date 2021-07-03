import Canvas from './objects/Canvas.js';
import Vector from './util/Vector.js';
import Particle from './objects/Particle.js';
import Unit from './objects/Unit.js';
import Dummy from './objects/Dummy.js';
import Simple from './bots/Simple.js';

// Debug
function debug ( data ) {
	document.getElementById( 'debug' ).innerText = JSON.stringify( data, null, 2 );
}

// Main
window.addEventListener( 'load', function () {
	let
		btnPlay = document.querySelector( '#play' ),
		btnPause = document.querySelector( '#pause' ),
		btnTick = document.querySelector( '#tick' ),
		canvas = window.canvas = new Canvas(),
		hero = null;

	function spawnHero () {
		hero = window.hero = new Unit({
			canvas: canvas,
			x: canvas.rect.width / 2,
			y: canvas.rect.height / 2
		});

		canvas.add( hero );
	}

	function spawnRed () {
		canvas.add( new Dummy({
			canvas: canvas,
			mind: Simple,
			fraction: 'red',
			color: 'rgb(255, 0, 100)',
			x: -20,
			y: Math.random() * canvas.rect.height,
			d: ( new Vector({ x: 1, y: 0 }) )
		}));
	}

	function spawnBlue () {
		canvas.add( new Dummy({
			canvas: canvas,
			mind: Simple,
			fraction: 'blue',
			color: 'rgb(0, 100, 255)',
			x: canvas.rect.width + 20,
			y: Math.random() * canvas.rect.height,
			d: ( new Vector({ x: -1, y: 0 }) )
		}));
	}

	function spawnParticle () {
		canvas.add( new Particle({
			canvas: canvas,
			friction: 0,
			x: Math.random() * canvas.rect.width,
			y: 0,
			d: new Vector({ x: 0, y: -1 }),
			v: new Vector({ x: 0, y: 5 }),
			hpInitial: Math.random() * 400
		}));
	}

	window.keys = {};

	document.addEventListener( 'keydown', function ( event ) {
		window.keys[ event.code ] = true;
	});

	document.addEventListener( 'keyup', function ( event ) {
		window.keys[ event.code ] = false;
	});

	btnPlay.addEventListener( 'click', function () {
		if ( canvas.state !== 'play' ) {
			canvas.state = 'play';
			canvas.render();
		}
	});

	btnPause.addEventListener( 'click', function () {
		canvas.state = 'pause';
	});

	btnTick.addEventListener( 'click', function () {
		canvas.render();
	});

	spawnHero();
	setInterval( spawnRed, 1000 );
	setInterval( spawnBlue, 1000 );
	setInterval( spawnParticle, 50 );

	setInterval( () => {
		debug( {
			objects: Object.keys( canvas.objects ).length,
			collisionLayer: Object.keys( canvas.collisionLayer ).length,
			unitLayer: Object.keys( canvas.unitLayer ).length,
			keys: window.keys,
			hero: hero.info()
		});
	}, 50 );

	setInterval( () => {
		if ( window.keys[ 'KeyR' ] ) {
			if ( hero && hero.alive ) hero.die();
			spawnHero();
		}

		if ( window.keys[ 'KeyW' ] ) {
			hero.moveForward();
		}

		if ( window.keys[ 'KeyS' ] ) {
			hero.moveBackward();
		}

		if ( window.keys[ 'KeyQ' ] ) {
			hero.moveLeft();
		}

		if ( window.keys[ 'KeyE' ] ) {
			hero.moveRight();
		}

		if ( window.keys[ 'KeyA' ] ) {
			hero.rotateLeft();
		}

		if ( window.keys[ 'KeyD' ] ) {
			hero.rotateRight();
		}

		if ( window.keys[ 'Space' ] ) {
			hero.shot();
		}
	}, 10 );
});
