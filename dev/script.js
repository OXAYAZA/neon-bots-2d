import Canvas from './Canvas.js';
import Unit from './Unit.js';
import Bullet from './Bullet.js';
import Particle from './Particle.js';

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
		unit = null;

	function spawnHero () {
		unit = window.unit = new Unit({
			canvas: canvas,
			fhp: 2000,
			x: canvas.rect.width / 2,
			y: canvas.rect.height / 2,
			a: 1.6,
		});

		canvas.add( unit );
	}

	function spawnLola () {
		canvas.add( new Unit({
			canvas: canvas,
			x: canvas.rect.width / 2,
			y: canvas.rect.height * .1,
			a: 0,
			v: 3,
			fhp: 2000,
			mass: 200,
			points: [
				{ x: -10,  y: -10 },
				{ x: 50,   y: -10 },
				{ x: 60,  y: 0 },
				{ x: 50,  y: 10 },
				{ x: -10,  y: 10 },
				{ x: 0,  y: 0 }
			],
			cb: {
				live: function () {
					this.a += .01;
				},
				die: spawnLola
			}
		}));
	}

	function spawnDummy () {
		canvas.add( new Unit({
			canvas: canvas,
			x: Math.random() * canvas.rect.width,
			y: 10,
			a: 1.6 + ( Math.random() - .5 ),
			v: 2,
			fhp: 40,
			mass: 100,
			points: [
				{ x: 20, y: -3 },
				{ x: 10,   y: -10 },
				{ x: -10,  y: -10 },
				{ x: 0,  y: 0 },
				{ x: -10,  y: 10 },
				{ x: 10,  y: 10 },
				{ x: 20, y: 3 }
			],
			cb: {
				live: function () {
					this.hp -= .1;
				}
			}
		}));
	}

	function spawnBullet () {
		canvas.add( new Bullet({
			canvas: canvas,
			x: Math.random() * canvas.rect.width,
			y: canvas.rect.height,
			a: 1.6,
			v: -5,
			fhp: 200
		}));
	}

	function spawnParticle () {
		canvas.add( new Particle({
			canvas: canvas,
			x: Math.random() * canvas.rect.width,
			y: canvas.rect.height,
			a: 1.6,
			v: -10,
			fhp: Math.random() * 500
		}));
	}

	document.addEventListener( 'keydown', function ( event ) {
		if ( event.code === 'KeyW' ) {
			unit.v = 10;
		}

		if ( event.code === 'KeyS' ) {
			unit.v = -10;
		}

		if ( event.code === 'KeyA' ) {
			unit.va = -.1;
		}

		if ( event.code === 'KeyD' ) {
			unit.va = .1;
		}

		if ( event.code === 'KeyR' ) {
			if ( unit && unit.alive ) unit.die();
			spawnHero();
		}

		if ( event.code === 'Space' ) {
			unit.fire();
		}
	});

	document.addEventListener( 'keyup', function ( event ) {
		if ( event.code === 'KeyW' || event.code === 'KeyS' ) {
			unit.v = 0;
		}

		if ( event.code === 'KeyA' || event.code === 'KeyD' ) {
			unit.va = 0;
		}
	});

	btnPlay.addEventListener( 'click', function () {
		canvas.state = 'play';
		canvas.render();
	});

	btnPause.addEventListener( 'click', function () {
		canvas.state = 'pause';
	});

	btnTick.addEventListener( 'click', function () {
		canvas.render();
	});

	spawnHero();
	spawnLola();
	setInterval( spawnDummy, 500 );
	setInterval( spawnBullet, 100 );
	setInterval( spawnParticle, 50 );

	setInterval( () => {
		debug( {
			x: unit.x,
			y: unit.y,
			dx: unit.dx,
			dy: unit.dy,
			v: unit.v,
			a: unit.a,
			va: unit.va,
			da: unit.da,
			hp: unit.hp,
			reloadTime: unit.reloadTime,
			reloading: unit.reloading,
			alive: unit.alive,
			objects: Object.keys( canvas.objects ).length,
			collisionLayer: Object.keys( canvas.collisionLayer ).length
		} );
	}, 50 );
});
