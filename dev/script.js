import Canvas from './objects/Canvas.js';
import Vector from './util/Vector.js';
import Unit from './objects/Unit.js';
import Bullet from './objects/Bullet.js';
import Particle from './objects/Particle.js';

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

	function spawnBoss () {
		canvas.add( new _Unit({
			canvas: canvas,
			x: canvas.rect.width / 2,
			y: canvas.rect.height * .1,
			d: new Vector({ x: 1, y: 0 }),
			fhp: 2000,
			mass: 200,
			reloadTime: 10,
			figureInitial: [
				{ x: 0,  y: 0 },
				{ x: -10,  y: -10 },
				{ x: 0,  y: -50 },
				{ x: 20,   y: -50 },
				{ x: 60,  y: -10 },
				{ x: 60,  y: 10 },
				{ x: 20,  y: 50 },
				{ x: 0,  y: 50 },
				{ x: -10,  y: 10 }
			],
			bulletSlots: [
				{ x: 21, y: -50 },
				{ x: 61, y: -10 },
				{ x: 61, y: 10 },
				{ x: 21, y: 50 },
			],
			cb: {
				liveS: function () {
					this.v.add( ( new Vector( this.d ) ).multiply( .2 ) );
					this.d.rotateD( .6 );
				},
				liveE: function () {
					this.fire();
				},
				die: spawnBoss
			}
		}));
	}

	function spawnDummy () {
		canvas.add( new Unit({
			canvas: canvas,
			x: canvas.rect.width / 2,
			y: 100,
			d: ( new Vector({ x: 0, y: 1 }) ),
			v: ( new Vector({ x: 0, y: 10 }) ),
			mass: 100,
			figureInitial: [
				{ x: 20, y: -3 },
				{ x: 10,   y: -10 },
				{ x: -10,  y: -10 },
				{ x: 0,  y: 0 },
				{ x: -10,  y: 10 },
				{ x: 10,  y: 10 },
				{ x: 20, y: 3 }
			]
		}));
	}

	function spawnWall () {
		canvas.add( new Unit({
			canvas: canvas,
			x: canvas.rect.width * .95,
			y: canvas.rect.height / 2,
			d: new Vector({ x: 0, y: -1 }),
			mass: 1000,
			hpInitial: 8000,
			figureInitial: [
				{ x: 200,  y: 0 },
				{ x: 200,  y: 10 },
				{ x: -200,  y: 10 },
				{ x: -200,  y: 0 },
			]
		}));
	}

	function spawnBullet () {
		canvas.add( new Bullet({
			canvas: canvas,
			friction: 0,
			x: Math.random() * canvas.rect.width,
			y: canvas.rect.height,
			d: new Vector({ x: 0, y: -1 }),
			v: new Vector({ x: 0, y: -8 }),
			hpInitial: 120
		}));
	}

	function spawnParticle () {
		canvas.add( new Particle({
			canvas: canvas,
			friction: 0,
			x: Math.random() * canvas.rect.width,
			y: canvas.rect.height,
			d: new Vector({ x: 0, y: -1 }),
			v: new Vector({ x: 0, y: -5 }),
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
	// spawnBoss();
	spawnWall();
	spawnDummy();
	// setInterval( spawnDummy, 500 );
	setInterval( spawnBullet, 100 );
	setInterval( spawnParticle, 50 );

	setInterval( () => {
		debug( {
			objects: Object.keys( canvas.objects ).length,
			collisionLayer: Object.keys( canvas.collisionLayer ).length,
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
