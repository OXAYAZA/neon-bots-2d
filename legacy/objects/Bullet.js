import merge from "../util/merge.js";
import Vector from "../util/Vector.js";
import Obj from './Obj.js';
import Particle from "./Particle.js";

class Bullet extends Obj {
  type = 'Bullet';
  color = 'rgb( 255, 0, 0 )';
  canCollide = true;
  damage = 10;
  hpInitial = 1;
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

  collision () {
    if ( this.collide ) {
      if ( 'hp' in this.collide.obj ) {
        this.collide.obj.hp -= this.damage;
      }

      for ( let i = 0; i < 10; i++ ) {
        this.map.add( new Particle({
          color: this.color,
          x: this.x,
          y: this.y,
          d: ( new Vector( this.d ) ).rotateD( 180 ),
          v: ( new Vector( this.v ) ).rotateD( 180 + ( Math.random() - .5 ) * 45 ).multiply( Math.random() * .5 ),
          size: 2
        }));
      }

      this.die();
      this.collide = false;
    }
  }

  live ( delta = 0 ) {
    this.delta = delta;
    this.hp -= this.delta;

    this.collision();
    this.move();
    this.rotateFigure();
    this.applyPosition();
    this.calcSegments();

    if ( this.hp <= 0 ) this.die();
  }
}

export default Bullet;
