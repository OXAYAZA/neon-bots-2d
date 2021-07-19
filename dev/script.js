import initControl from './util/initControl.js';
import Canvas from './util/Canvas.js';
import Vector from './util/Vector.js';

import Wall from './objects/Wall.js';
import Particle from './objects/Particle.js';
import Unit from './objects/Unit.js';
import Dummy from './objects/Dummy.js';
import Simple from './bots/Simple.js';
import PathFinder from './bots/PathFinder.js';
import ControlType2 from './bots/ControlType2.js';
import pointInPoly from './util/pointInPoly.js';


// Debug
function debug ( data ) {
	document.getElementById( 'debug' ).innerHTML = JSON.stringify( data, null, 2 );
}

// Main
window.addEventListener( 'DOMContentLoaded', function () {
	let
		canvas,
		hero = null,
		enemies = window.enemies = {},
		allies = window.allies = {};

	initControl();

	window.spawnHero = function spawnHero () {
		hero = window.hero = new Unit({
			canvas: canvas,
			mind: ControlType2,
			fraction: 'ally',
			hpInitial: 10000,
			x: canvas.rect.width / 2,
			y: canvas.rect.height,
			d: new Vector({ x: 0, y: -1 }),
			v: new Vector({ x: 0, y: -canvas.rect.height / 2 }),
			figureInitial: [
				{ x: 0,  y: 0 },
				{ x: -40,  y: 40 },
				{ x: -16,  y: 40 },
				{ x: 80, y: 0 },
				{ x: -16,  y: -40 },
				{ x: -40,  y: -40 }
			],
			bulletSlots: [
				{ x: 85, y: 0, a: 0 }
			]
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
				color:      'rgb(255,230,0)',
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
		// if ( Object.keys( enemies ).length < 10 ) {
		if ( Object.keys( enemies ).length < 1 ) {
			let unit = new Dummy( {
				canvas:   canvas,
				mind:     PathFinder,
				fraction: 'enemy',
				color:    'rgb(255, 0, 100)',
				// x:        Math.random() * canvas.rect.width,
				x:        canvas.rect.width / 2,
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

	function spawnWall () {
		canvas.add( new Wall({
			canvas: canvas,
			friction: 0,
			x: canvas.rect.width / 2,
			y: canvas.rect.height / 2
		}));
	}

	canvas = window.canvas = new Canvas({
		middle: function () {
			debug( {
				objects: window.canvas && Object.keys( window.canvas.objects ).length,
				collisionLayer: window.canvas && Object.keys( window.canvas.collisionLayer ).length,
				unitLayer: window.canvas && Object.keys( window.canvas.unitLayer ).length,
				lastTime: window.canvas && window.canvas.lastTime,
				deltaTime: window.canvas && window.canvas.deltaTime,
				keys: window.keys,
				mousepos: window.mousepos,
				touch: window.touchButtons,
				dco: window.directionControllerOffset,
				gamepad: window.gamepad && window.gamepad.id,
				allies: Object.keys( allies ).length,
				enemies: Object.keys( enemies ).length,
				hero: window.hero && window.hero.info()
			});

			if ( window.keys && window.keys[ 'KeyR' ] ) {
				if ( window.hero && window.hero.alive ) window.hero.die();
				window.spawnHero();
			}

			if ( window.touchButtons && window.touchButtons[ 'respawnButton' ] ) {
				if ( window.hero && window.hero.alive ) window.hero.die();
				window.spawnHero();
			}
		}
	});

	spawnHero();
	spawnWall();
	setInterval( spawnEnemy, 1000 );
	// setInterval( spawnAlly, 5000 );
	setInterval( spawnParticle, 50 );
});
