import Obj from './Obj.js';
import merge from "../util/merge.js";

class Bullet extends Obj {
  type = 'Unit';
  color = 'rgb( 255, 0, 0 )';
  collide = true;
  damage = 10;
  hpInitial = 50;
  figureInitial = [
    { x: -2, y: -1 },
    { x: -2, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
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
