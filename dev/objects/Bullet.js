import merge from "../util/merge.js";
import Vector from "../util/Vector.js";
import Obj from './Obj.js';
import Particle from "./Particle.js";

class Bullet extends Obj {
  type = 'Bullet';
  color = 'rgb( 255, 0, 0 )';
  collide = true;
  damage = 10;
  hpInitial = 50;
  figureInitial = [
    { x: -3, y: -2 },
    { x: -3, y: 2 },
    { x: 3, y: 2 },
    { x: 3, y: -2 }
  ];
  hp = null;

  constructor ( props ) {
    super( props );
    merge( this, props );
    this.hp = this.hpInitial;
  }

  collision ( obj ) {
    if ( 'hp' in obj ) {
      obj.hp -= this.damage;
    }

    for ( let i = 0; i < 10; i++ ) {
      this.canvas.add( new Particle({
        canvas: this.canvas,
        x: this.x,
        y: this.y,
        d: ( new Vector( this.d ) ).rotateD( 180 ),
        v: ( new Vector( this.v ) ).rotateD( 180 + ( Math.random() - .5 ) * 45 ).multiply( Math.random() * .5 ),
        size: 2
      }));
    }

    this.die();
  }

  live () {
    this.hp -= 1;

    this.move();
    this.rotate();
    this.rotateFigure();
    this.applyPosition();
    this.calcSegments();

    if ( this.hp <= 0 ) this.die();
  }
}

export default Bullet;