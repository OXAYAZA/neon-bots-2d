import merge from "../util/merge.js";
import Vector from '../util/Vector.js';
import Obj from './Obj.js';
import Particle from "./Particle.js";
import Bullet from "./Bullet.js";

class Unit extends Obj {
  type = 'Unit';
  color = 'hsl( 50, 100%, 50% )';
  collide = true;
  alive = true;
  hpInitial = 100;
  figureInitial = [
    { x: 0,  y: 0 },
    { x: -5,  y: 5 },
    { x: -2,  y: 5 },
    { x: 10, y: 0 },
    { x: -2,  y: -5 },
    { x: -5,  y: -5 }
  ];
  mass = 50;
  reloadTime = 5;
  reloading = false;
  bulletSlots = [
    { x: 11, y: 0, a: 0 }
  ];
  bulletSlotsFinal = null;
  hp = null;

  constructor ( props ) {
    super( props );
    merge( this, props );
    this.hp = this.hpInitial;
  }

  updateColor () {
    this.color = `hsl( ${ 100 / this.hpInitial * this.hp }, 100%, 50% )`;
  }

  explode () {
    for ( let i = 0; i < this.mass; i++ ) {
      this.canvas.add( new Particle({
        canvas: this.canvas,
        x: this.x,
        y: this.y,
        d: new Vector({ x: 0, y: 1 }).rotateD( Math.random() * 360 ),
        v: ( new Vector({ x: 0, y: 1 }) ).rotateD( Math.random() * 360 ).multiply( Math.random() * 2 ),
        size: this.mass * .02
      }));
    }
  }

  moveEffect () {
    if ( this.v.length() > 2 ) {
      this.canvas.add( new Particle({
        canvas: this.canvas,
        x: this.x,
        y: this.y,
        d: ( new Vector( this.d ) ).rotateD( Math.random() * 360 ),
        v: ( new Vector( this.v ) ).rotateD( 180 + ( Math.random() - .5 ) * 30 ),
        sizeInitial: 3
      }));
    }
  }

  moveForward () {
    this.v.add( ( new Vector( this.d ) ).multiply( .2 ) );
  }

  moveBackward () {
    this.v.add( ( new Vector( this.d ) ).multiply( .1 ).rotateD( 180 ) );
  }

  moveLeft () {
    this.v.add( ( new Vector( this.d ) ).multiply( .1 ).rotateD( -90 ) );
  }

  moveRight () {
    this.v.add( ( new Vector( this.d ) ).multiply( .1 ).rotateD( 90 ) );
  }

  rotateLeft () {
    this.d.rotateD( -2 );
  }

  rotateRight () {
    this.d.rotateD( 2 );
  }

  collision ( obj ) {
    if ( obj.type === 'Unit' ) {
      obj.hp -= 50;
    }
  }

  updateSlots () {
    this.bulletSlotsFinal = this.bulletSlots.map( ( point ) => {
      return {
        x: this.x + ( point.x * Math.cos( this.a ) - point.y * Math.sin( this.a ) ),
        y: this.y + ( point.y * Math.cos( this.a ) + point.x * Math.sin( this.a ) ),
        a: point.a
      };
    });
  }

  coolDown () {
    if ( this.reloading ) {
      if ( this.reloading > 0 ) {
        this.reloading -= 1;
      } else {
        this.reloading = false;
      }
    }
  }

  shot () {
    if ( !this.reloading ) {
      this.bulletSlotsFinal.forEach( ( point ) => {
        this.canvas.add( new Bullet({
          canvas: this.canvas,
          friction: 0,
          color: 'rgb(255, 0, 255)',
          x: point.x,
          y: point.y,
          d: ( new Vector( this.d ) ).rotate( point.a ),
          v: ( new Vector( this.d ) ).multiply( 10 ).rotate( point.a ).rotateD( ( Math.random() - .5 ) * 10 )
        }));
      });

      this.reloading = this.reloadTime;
    }
  }

  die () {
    this.explode();
    this.alive = false;
    this.canvas.remove( this );
  }

  live () {
    this.coolDown();
    this.move();
    this.rotate();
    this.rotateFigure();
    this.applyPosition();
    this.updateSlots();
    this.calcSegments();
    this.updateColor();
    this.moveEffect();

    if ( this.hp <= 0 ) this.die();
  }

  info () {
    return {
      id: this.id,
      type: this.type,
      collide: this.collide,
      color: this.color,
      x: this.x,
      y: this.y,
      a: this.a,
      d: this.d,
      v: this.v,
      hp: this.hp
    };
  }
}

export default Unit;
