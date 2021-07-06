import Canvas from './util/Canvas.js';
import Vector from './util/Vector.js';
import TouchController from './util/TouchController.js';

import Particle from './objects/Particle.js';
import Unit from './objects/Unit.js';
import Dummy from './objects/Dummy.js';
import Simple from './bots/Simple.js';
import Manual from './bots/Manual.js';

window.Vector = Vector;

// Debug
function debug ( data ) {
	document.getElementById( 'debug' ).innerText = JSON.stringify( data, null, 2 );
}

// Main
window.addEventListener( 'DOMContentLoaded', function () {
	let
		btnPlay = document.querySelector( '#play' ),
		btnPause = document.querySelector( '#pause' ),
		btnTick = document.querySelector( '#tick' ),
		canvas = window.canvas = new Canvas({
			middle: function () {
				if ( window.keys && window.keys[ 'KeyR' ] ) {
					if ( window.hero && window.hero.alive ) window.hero.die();
					window.spawnHero();
				}
			}
		}),
		hero = null,
		enemies = window.enemies = {},
		allies = window.allies = {};

	new TouchController( 'directionController', document.querySelector( '#direction-control' ) );

	window.spawnHero = function spawnHero () {
		hero = window.hero = new Unit({
			canvas: canvas,
			mind: Manual,
			fraction: 'ally',
			hpInitial: 1000,
			x: canvas.rect.width / 2,
			y: canvas.rect.height,
			d: new Vector({ x: 0, y: -1 }),
			v: new Vector({ x: 0, y: -canvas.rect.height / 2 })
		});

		canvas.add( hero );
		return hero;
	}

	function spawnAlly () {
		if ( Object.keys( allies ).length < 1 ) {
			let unit = new Unit( {
				canvas:     canvas,
				mind:       Simple,
				fraction:   'ally',
				color:      'rgb(0, 100, 255)',
				x:          Math.random() * canvas.rect.width,
				y:          canvas.rect.height,
				d:          (new Vector( { x: 0, y: -1 } )),
				v:          (new Vector( { x: 0, y: -500 * Math.random() } )),
				onDead:     function () {
					delete allies[ this.id ];
				}
			});

			canvas.add( unit );
			allies[ unit.id ] = unit;
			return unit;
		}
	}

	function spawnEnemy () {
		if ( Object.keys( enemies ).length < 10 ) {
			let unit = new Dummy( {
				canvas:   canvas,
				mind:     Simple,
				fraction: 'enemy',
				color:    'rgb(255, 0, 100)',
				x:        Math.random() * canvas.rect.width,
				y:        0,
				d:        (new Vector( { x: 0, y: 1 } )),
				v:        (new Vector( { x: 0, y: 500 * Math.random() } )),
				onDead:   function () {
					delete enemies[ this.id ];
				}
			});

			canvas.add( unit );
			enemies[ unit.id ] = unit;
			return unit;
		}
	}

	function spawnParticle () {
		canvas.add( new Particle({
			canvas: canvas,
			friction: 0,
			x: Math.random() * canvas.rect.width,
			y: 0,
			d: new Vector({ x: 0, y: -1 }),
			v: new Vector({ x: 0, y: 300 }),
			hpInitial: Math.random() * 5
		}));
	}

	window.keys = {};

	document.addEventListener( 'keydown', function ( event ) {
		window.keys[ event.code ] = true;
	});

	document.addEventListener( 'keyup', function ( event ) {
		window.keys[ event.code ] = false;
	});

	document.addEventListener( 'directionController:offset', function ( event ) {
		window.directionControllerOffset = {
			x: event.x,
			y: event.y
		};
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
	setInterval( spawnEnemy, 1000 );
	setInterval( spawnAlly, 5000 );
	setInterval( spawnParticle, 50 );

	setInterval( () => {
		debug( {
			objects: Object.keys( canvas.objects ).length,
			collisionLayer: Object.keys( canvas.collisionLayer ).length,
			unitLayer: Object.keys( canvas.unitLayer ).length,
			lastTime: canvas.lastTime,
			deltaTime: canvas.deltaTime,
			keys: window.keys,
			dco: window.directionControllerOffset,
			allies: Object.keys( allies ).length,
			enemies: Object.keys( enemies ).length,
			hero: hero.info()
		});
	}, 50 );
});
