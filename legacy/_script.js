import initControl from './util/initControl.js';
import Canvas from './util/Canvas.js';
import Map from './util/Map.js';
import Vector from './util/Vector.js';

import Wall from './objects/Wall.js';
import Particle from './objects/Particle.js';
import Bullet from './objects/Bullet.js';
import Unit from './objects/Unit.js';
import Dummy from './objects/Dummy.js';

import Simple from './bots/Simple.js';
import Turret from './bots/Turret.js';
import PathFinder from './bots/PathFinder.js';
import ControlType2 from './bots/ControlType2.js';

window.Vector = Vector;

// Debug
function debug ( data ) {
  document.getElementById( 'debug' ).innerHTML = JSON.stringify( data, null, 2 );
}

// Main
window.addEventListener( 'DOMContentLoaded', function () {
  let
    canvas,
    map,
    hero = null,
    enemies = window.enemies = {},
    allies = window.allies = {};

  initControl();

  window.spawnHero = function spawnHero () {
    hero = window.hero = new Unit({
      mind: ControlType2,
      // fraction: 'ally',
      hpInitial: 1000000,
      x: 750,
      y: 350,
      d: new Vector({ x: 0, y: -1 }),
      figureInitial: [
        { x: 0,  y: 0 },
        { x: -20,  y: -20 },
        { x: -8,  y: -20 },
        { x: 40, y: 0 },
        { x: -8,  y: 20 },
        { x: -20,  y: 20 }
      ],
      bulletSlots: [
        { x: 45, y: 0, a: 0, s: 0 }
      ]
    });

    map.add( hero );
    return hero;
  }

  function spawnTurret () {
    if ( Object.keys( allies ).length < 1 ) {
      let unit = new Unit({
        mind:       Turret,
        fraction:   'ally',
        color:      'rgb(255,230,0)',
        x:          750,
        y:          550,
        figureInitial: [
          { x: -10, y: -5 },
          { x: -5, y: -10 },
          { x: 5, y: -10 },
          { x: 10, y: -5 },

          { x: 15, y: -5 },
          { x: 15, y: -1 },
          { x: 10, y: -1 },

          { x: 10, y: 1 },
          { x: 15, y: 1 },
          { x: 15, y: 5 },

          { x: 10, y: 5 },
          { x: 5, y: 10 },
          { x: -5, y: 10 },
          { x: -10, y: 5 },
        ],
        bulletSlots: [
          { x: 20, y: -4, a: 0, s: 0 },
          { x: 20, y: 4, a: 0, s: 0 }
        ],
        onDead:     function () {
          delete allies[ this.id ];
        }
      });

      map.add( unit );
      allies[ unit.id ] = unit;
      return unit;
    }
  }

  function spawnEnemy () {
    if ( Object.keys( enemies ).length < 10 ) {
      let unit = new Dummy({
        mind:     PathFinder,
        fraction: 'enemy',
        color:    'rgb(255, 0, 100)',
        x:        Math.random() * map.width,
        y:        30,
        d:        (new Vector( { x: 0, y: 1 } )),
        v:        (new Vector( { x: 0, y: 500 } )),
        onDead:   function () {
          delete enemies[ this.id ];
        }
      });

      map.add( unit );
      enemies[ unit.id ] = unit;
      return unit;
    }
  }

  function spawnParticle () {
    map.add( new Particle({
      friction: 0,
      x: Math.random() * map.width,
      y: Math.random() * map.height,
      hpInitial: Math.random() * 5
    }));
  }

  window.spawnBullet = function spawnBullet ( x, y, a = 0, hp = 2 ) {
    map.add( new Bullet({
      x: x,
      y: y,
      friction: 0,
      hpInitial: hp,
      d: new Vector({ x: 1, y: 0 }).rotateD( a ),
      v: new Vector({ x: 500, y: 0 }).rotateD( a )
    }));
  }

  window.spawnWall = function spawnWall ( x1, y1, x2, y2 ) {
    let
      hw = Math.abs( ( x2 - x1 ) / 2 ),
      hh = Math.abs( ( y2 - y1 ) / 2 ),
      x = x1 + hw,
      y = y1 + hh,
      figure = [
        { x: -hw, y: -hh },
        { x: +hw, y: -hh },
        { x: +hw, y: +hh },
        { x: -hw, y: +hh }
      ];

    map.add( new Wall({
      friction: 0,
      x: x,
      y: y,
      figureInitial: figure
    }));
  }

  canvas = window.canvas = new Canvas({
    node: document.querySelector( '#root' ),
  });

  map = window.map = new Map({
    width: 800,
    height: 600
  });

  canvas.init( map );

  canvas.onTickStart.push( function () {
    if ( window.keys && window.keys[ 'KeyR' ] ) {
      if ( window.hero && window.hero.alive ) window.hero.die();
      window.spawnHero();
    }

    if ( window.touchButtons && window.touchButtons[ 'respawnButton' ] ) {
      if ( window.hero && window.hero.alive ) window.hero.die();
      window.spawnHero();
    }

    // if ( window.mouse && window.mouse[2] ) {
    // 	if ( window.mouse[2] === 'pressed' ) {
    // 		console.log( 'btn 2 pressed' );
    //
    // 		window.newWall = {
    // 			sx: window.mouse.x,
    // 			sy: window.mouse.y
    // 		}
    //
    // 		window.mouse[2] = 'holding';
    // 	}
    //
    // 	if ( window.mouse[2] === 'released' ) {
    // 		console.log( 'btn 2 released' );
    //
    // 		window.newWall.ex = window.mouse.x;
    // 		window.newWall.ey = window.mouse.y;
    //
    // 		window.newWall.hw = Math.abs( ( window.newWall.ex - window.newWall.sx ) / 2 );
    // 		window.newWall.hh = Math.abs( ( window.newWall.ey - window.newWall.sy ) / 2 );
    //
    // 		window.newWall.x = window.newWall.hw + window.newWall.sx;
    // 		window.newWall.y = window.newWall.hh + window.newWall.sy;
    //
    // 		window.newWall.figure = [
    // 			{ x: -window.newWall.hw, y: -window.newWall.hh },
    // 			{ x: +window.newWall.hw, y: -window.newWall.hh },
    // 			{ x: +window.newWall.hw, y: +window.newWall.hh },
    // 			{ x: -window.newWall.hw, y: +window.newWall.hh }
    // 		];
    //
    // 		console.log( 'newWall', window.newWall );
    // 		spawnWall( window.newWall.x, window.newWall.y, window.newWall.figure );
    // 		window.newWall = null;
    //
    // 		window.mouse[2] = null;
    // 	}
    // }
  });

  canvas.onTickEnd.push( function () {
    debug( {
      objects: window.map && Object.keys( window.map.objects ).length,
      collisionLayer: window.map && Object.keys( window.map.collisionLayer ).length,
      unitLayer: window.map && Object.keys( window.map.unitLayer ).length,
      lastTime: window.canvas && window.canvas.lastTime,
      deltaTime: window.canvas && window.canvas.deltaTime,
      keys: window.keys,
      mouse: window.mouse,
      touch: window.touchButtons,
      dco: window.directionControllerOffset,
      gamepad: window.gamepad && window.gamepad.id,
      allies: Object.keys( allies ).length,
      enemies: Object.keys( enemies ).length,
      hero: window.hero && window.hero.info()
    });
  });

  spawnWall( 105, 405, 800, 415 );
  spawnWall( 105, 420, 115, 530 );
  spawnWall( 290, 460, 300, 599 );

  spawnHero();
  spawnTurret();
  setInterval( spawnTurret, 5000 );
  setInterval( spawnEnemy, 1000 );
  setInterval( spawnParticle, 50 );
});
