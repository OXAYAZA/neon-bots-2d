import Obj from './Obj.js';
import Vector from '../util/Vector.js';
import merge from "../util/merge.js";

class Unit extends Obj {
  type = 'Unit';
  color = 'hsl( 50, 100%, 50% )';
  collide = true;
  friction = .05;
  hpInitial = 100;
  figureInitial = [
    { x: 0,  y: 0 },
    { x: -5,  y: 5 },
    { x: -2,  y: 5 },
    { x: 10, y: 0 },
    { x: -2,  y: -5 },
    { x: -5,  y: -5 }
  ];
  hp = null;

  constructor ( props ) {
    super( props );
    merge( this, props );
    this.hp = this.hpInitial;
  }

  updateColor () {
    this.color = `hsl( ${ 100 / this.hpInitial * this.hp }, 100%, 50% )`;
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

  live () {
    this.move();
    this.rotate();
    this.rotateFigure();
    this.applyPosition();
    this.calcSegments();
    this.updateColor();
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
