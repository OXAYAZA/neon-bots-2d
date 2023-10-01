import merge from "../util/merge.js";
import area from "../util/areaGaussian.js";
import Vector from '../util/Vector.js';
import Obj from './Obj.js';
import Particle from "./Particle.js";
import Bullet from "./Bullet.js";
import areaGaussian from "../util/areaGaussian.js";

class Unit extends Obj {
  type = 'Unit';
  color = 'rgb( 0, 255, 100 )';
  canCollide = true;
  alive = true;
  mind;
  fraction = null;
  hpInitial = 100;
  figureInitial = [
    { x: 0,  y: 0 },
    { x: -5,  y: -5 },
    { x: -2,  y: -5 },
    { x: 10, y: 0 },
    { x: -2,  y: 5 },
    { x: -5,  y: 5 }
  ];
  mass;
  reloadTime = .1;
  reloading = false;
  bulletSlots = [
    { x: 20, y: 0, a: 0, s: 10 }
  ];
  bulletSlotsFinal = null;
  hp = null;
  renderOpts = {
    // nVec: true,
    // dVec: true,
    // vVec: true,
    // rVec: true
  };

  constructor ( props ) {
    super( props );
    merge( this, props );
    this.hp = this.hpInitial;
    this.mass = areaGaussian( this.figureInitial );
  }

  explode () {
    for ( let i = 0; i < this.mass; i++ ) {
      this.map.add( new Particle({
        color: this.color,
        x: this.x,
        y: this.y,
        d: new Vector({ x: 0, y: 1 }).rotateD( Math.random() * 360 ),
        v: ( new Vector({ x: 0, y: 300 }) ).rotateD( Math.random() * 360 ).multiply( Math.random() * 2 ),
        size: this.mass * .02
      }));
    }
  }

  moveEffect () {
    if ( this.v.length() > 2 ) {
      this.map.add( new Particle({
        color: this.color,
        x: this.x,
        y: this.y,
        d: ( new Vector( this.d ) ).rotateD( Math.random() * 360 ),
        v: ( new Vector( this.v ) ).rotateD( 180 + ( Math.random() - .5 ) * 30 ),
        sizeInitial: 3
      }));
    }
  }

  moveForward () {
    this.v.add( ( new Vector( this.d ) ).multiply( 20 ) );
  }

  moveBackward () {
    this.v.add( ( new Vector( this.d ) ).multiply( 10 ).rotateD( 180 ) );
  }

  moveLeft () {
    this.v.add( ( new Vector( this.d ) ).multiply( 10 ).rotateD( -90 ) );
  }

  moveRight () {
    this.v.add( ( new Vector( this.d ) ).multiply( 10 ).rotateD( 90 ) );
  }

  rotateLeft () {
    this.e = -1 * Math.PI * this.delta;
  }

  rotateRight () {
    this.e = Math.PI * this.delta;
  }

  // collision ( obj, iseg ) {
  //   if ( obj.type === 'Unit' ) {
  //     obj.hp -= 50;
  //   }
  //
  //   let
  //     x1 = iseg[0].x,
  //     x2 = iseg[1].x,
  //     y1 = iseg[0].y,
  //     y2 = iseg[1].y,
  //     ex = x1 + ( x2 - x1 ) / 2,
  //     ey = y1 + ( y2 - y1 ) / 2,
  //     vec = new Vector({ x: x2 - x1, y: y2 - y1 }).rotateD( -90 ).setLength( 10 );
  //
  //   this.tmp = {
  //     iseg: iseg,
  //     vec: vec,
  //     e: { x: ex, y: ey }
  //   }
  //
  //   console.log( 'cp0', this.d );
  //   this.d.reflect( vec );
  //   console.log( 'cp1', this.d );
  // }

  updateSlots () {
    this.bulletSlotsFinal = this.bulletSlots.map( ( point ) => {
      return {
        x: this.x + ( point.x * Math.cos( this.a ) - point.y * Math.sin( this.a ) ),
        y: this.y + ( point.y * Math.cos( this.a ) + point.x * Math.sin( this.a ) ),
        a: point.a,
        s: point.s
      };
    });
  }

  coolDown () {
    if ( this.reloading ) {
      if ( this.reloading > 0 ) {
        this.reloading -= this.delta;
      } else {
        this.reloading = false;
      }
    }
  }

  shot () {
    if ( !this.reloading ) {
      this.bulletSlotsFinal.forEach( ( point ) => {
        this.map.add( new Bullet({
          friction: 0,
          color: this.color,
          x: point.x,
          y: point.y,
          d: ( new Vector( this.d ) ).rotate( point.a ),
          v: ( new Vector( this.d ) ).multiply( 500 ).rotate( point.a ).rotateD( ( Math.random() - .5 ) * point.s )
        }));
      });

      this.reloading = this.reloadTime;
    }
  }

  die () {
    this.explode();
    this.alive = false;
    this.map.remove( this );
    if ( this.onDead instanceof Function ) this.onDead.call( this );
  }

  live ( delta = 0 ) {
    this.delta = delta;

    this.collision();
    this.coolDown();
    this.move();
    this.rotateFigure();
    this.applyPosition();
    this.updateSlots();
    this.calcSegments();
    this.updGrid();
    // this.moveEffect();

    if ( this.mind && this.mind.prototype ) {
      this.mind = new this.mind( this );
    }

    if ( this.mind ) {
      this.mind.act();
    }

    if ( this.hp <= 0 ) this.die();
  }

  info () {
    return {
      id: this.id,
      color: this.color,
      fraction: this.fraction,
      alive: this.alive,
      reloading: this.reloading,
      x: this.x,
      y: this.y,
      a: this.a,
      d: this.d,
      v: this.v,
      e: this.e,
      gridPos: this.gridPos,
      vl: this.v.length(),
      hp: (() => {
        if ( this.hp / this.hpInitial < .1 ) return `<span class='text-red'>${this.hp}</span>`;
        else if ( this.hp / this.hpInitial < .2 ) return `<span class='text-yellow'>${this.hp}</span>`;
        return `<span class='text-green'>${this.hp}</span>`;
      })(),
      mind: this.mind && this.mind.info()
    };
  }
}

export default Unit;
