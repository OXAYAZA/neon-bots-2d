import Obj from './Obj.js';
import Vector from '../util/Vector.js';

class Unit extends Obj {
  type = 'Unit';
  color = 'hsl( 50, 100%, 50% )';
  d = new Vector({ x: 1, y: 0 });
  v = new Vector({ x: 0, y: 0 });
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
    this.hp = this.hpInitial;
  }

  updColor () {
    this.color = `hsl( ${ 100 / this.hpInitial * this.hp }, 100%, 50% )`;
  }

  move () {
    if ( !this.v.isZero() ) {
      this.v.multiply( .95 );

      if ( this.v.length() < .05 ) {
        this.v.multiply( 0 );
      }
    }

    this.x += this.v.x;
    this.y += this.v.y;
  }

  live () {
    this.rotate();
    this.calcSegments();
    this.updColor();
  }
}

export default Unit;
