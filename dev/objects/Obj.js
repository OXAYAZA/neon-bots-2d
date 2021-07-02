import merge from '../util/merge.js';
import Vector from "../util/Vector.js";

class Obj {
  canvas;                            // Холст для отрисовки объекта
  id;                                // Уникальный идентификатор объекта (обычно устанавливается холстом)
  type = 'Object';                   // Тип объекта
  collide = false;                   // Включение проверки столкновений для объекта
  color = 'hsl( 0, 100%, 100% )';    // Цвет заливки объекта
  friction = .05;                    // Торможение объекта при движении

  x = 0;                             // Координата X
  y = 0;                             // Координата Y
  a = 0;                             // Угол поворота объекта в радианах

  d = new Vector({ x: 1, y: 0 });    // Вектор направления объекта
  v = new Vector({ x: 0, y: 0 });    // Вектор скорости объекта

  figureInitial = [                  // Фигура объекта (коллайдер?) при нулевом угле поворота
    { x: 1,  y: 1 },
    { x: 1,  y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 1 }
  ];

  figureRaw;                         // Фигура объекта, после применения трансформаций но без учета позиции
  figureFinal;                       // Финальная фигура объекта, после применения трансформаций и позиции
  figureSegments;                    // Отрезки фигуры, для определения пересечений

  constructor ( props = {} ) {
    // Проверка параметров
    if ( !props.canvas ) {
      throw new Error( 'canvas is required property' );
    }

    // TODO Добавить проверки свойств

    // Установка новых свойств
    merge( this, props );
  }

  rotateFigure ( reTransform ) {
    this.figureRaw = ( reTransform ? this.figureRaw : this.figureInitial ).map( ( point ) => {
      return {
        x: point.x * Math.cos( this.a ) - point.y * Math.sin( this.a ),
        y: point.y * Math.cos( this.a ) + point.x * Math.sin( this.a )
      };
    });
  }

  applyPosition () {
    this.figureFinal = this.figureRaw.map( ( point ) => {
      return {
        x: this.x + point.x,
        y: this.y + point.y
      };
    });
  }

  calcSegments () {
    this.figureSegments = this.figureFinal.map( function ( point, index, points ) {
      return [ point, points[ ( points.length > index + 1 ) ? index + 1 : 0 ] ];
    });
  }

  move () {
    if ( !this.v.isZero() ) {
      this.v.multiply( 1 - this.friction );

      if ( this.v.length() < .05 ) {
        this.v.multiply( 0 );
      }
    }

    this.x += this.v.x;
    this.y += this.v.y;
  }

  rotate () {
    this.a = this.d.angle();
  }

  live () {
    this.move();
    this.rotate();
    this.rotateFigure();
    this.applyPosition();
    this.calcSegments();
  }

  die () {
    this.canvas.remove( this );
  }

  render () {
    this.canvas.ctx.fillStyle = this.color;
    this.canvas.ctx.beginPath();

    this.figureFinal.forEach( ( point, index ) => {
      if ( index ) this.canvas.ctx.lineTo( point.x, point.y );
      else this.canvas.ctx.moveTo( point.x, point.y );
    });

    this.canvas.ctx.closePath();
    this.canvas.ctx.fill();
  }

  info () {
    return {
      id: this.id,
      type: this.type,
      collide: this.collide,
      color: this.color,
      x: this.x,
      y: this.y,
      a: this.a
    };
  }
}

export default Obj;
