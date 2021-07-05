import merge from "../util/merge.js";
import Obj from './Obj.js';

class Particle extends Obj {
  type = 'Particle';
  hue = 24;
  saturation = 100;
  lightness = 80;
  sizeInitial = 2;
  hpInitial = .3;
  hp = null;

  constructor ( props ) {
    super( props );
    merge( this, props );

    this.color = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
    this.hp = this.hpInitial;
    this.figureInitial = this.figureInitial.map( ( point ) => {
      return {
        x: point.x * this.sizeInitial,
        y: point.y * this.sizeInitial
      };
    });
  }

  updateColor () {
    this.lightness = this.lightness <= 50 ? this.lightness : this.lightness - 1;
    this.color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }

  resizeFigure ( reTransform ) {
    let percentage = this.hp / this.hpInitial;

    this.figureRaw = ( reTransform ? this.figureRaw : this.figureInitial ).map( ( point ) => {
      return {
        x: point.x * percentage,
        y: point.y * percentage
      };
    });
  }

  live ( delta = 0 ) {
    this.delta = delta;
    this.hp -= this.delta;

    this.move();
    this.rotate();
    this.resizeFigure();
    this.rotateFigure( true );
    this.applyPosition();
    this.calcSegments();
    this.updateColor();

    if ( this.hp <= 0 ) this.die();
  }
}

export default Particle;
