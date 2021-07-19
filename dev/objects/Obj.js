import merge from '../util/merge.js';
import objectsIntersect from '../util/objectsIntersect.js';
import Vector from "../util/Vector.js";

class Obj {
  canvas;                            // Холст для отрисовки объекта
  id;                                // Уникальный идентификатор объекта (обычно устанавливается холстом)
  delta = 0;                         // Коррекция по времени
  type = 'Object';                   // Тип объекта
  collide = false;                   // Включение проверки столкновений для объекта
  color = 'rgb( 255, 255, 255 )';    // Цвет заливки объекта
  friction = .05;                    // Торможение объекта при движении

  gridArr = [];                      // Занимаемые ячейки сетки
  gridPos = {                        // Позиция в сетке
    x: 0,
    y: 0,
  };

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

  onDead = null;                     // Посмертный колбек
  onRender = null;                   // Колбек после отрисовки

  constructor ( props = {} ) {
    // Проверка параметров
    if ( !props.canvas ) {
      throw new Error( 'canvas is required property' );
    }

    // TODO Добавить проверки параметров

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

    this.x = this.x + ( this.v.x * this.delta );
    this.y = this.y + ( this.v.y * this.delta );
  }

  rotate () {
    this.a = this.d.angle();
  }

  updGrid () {
    this.gridArr = [];

    let
      minX = null,
      maxX = null,
      minY = null,
      maxY = null;

    this.figureFinal.forEach( ( point ) => {
      if ( typeof( minX ) !== 'number' || point.x < minX ) minX = point.x;
      if ( typeof( maxX ) !== 'number' || point.x > maxX ) maxX = point.x;
      if ( typeof( minY ) !== 'number'  || point.y < minY ) minY = point.y;
      if ( typeof( maxY ) !== 'number'  || point.y > maxY ) maxY = point.y;
    });

    minX = Math.round( minX / 10 );
    maxX = Math.round( maxX / 10 );
    minY = Math.round( minY / 10 );
    maxY = Math.round( maxY / 10 );

    // TODO try должен быть исправлен ограничением игровой области
    try {
      for ( let x = minX; x <= maxX; x++ ) {
        for ( let y = minY; y <= maxY; y++ ) {
          let tmpSquare = {
            figureFinal: [
              { x: x * 10 - 7 , y: y * 10 - 7 },
              { x: x * 10 + 7 , y: y * 10 - 7 },
              { x: x * 10 + 7 , y: y * 10 + 7 },
              { x: x * 10 - 7 , y: y * 10 + 7 }
            ],
            figureSegments: [
              [{ x: x * 10 - 7 , y: y * 10 - 7 }, { x: x * 10 + 7 , y: y * 10 - 7 }],
              [{ x: x * 10 + 7 , y: y * 10 - 7 }, { x: x * 10 + 7 , y: y * 10 + 7 }],
              [{ x: x * 10 + 7 , y: y * 10 + 7 }, { x: x * 10 - 7 , y: y * 10 + 7 }],
              [{ x: x * 10 - 7 , y: y * 10 + 7 }, { x: x * 10 - 7 , y: y * 10 - 7 }]
            ]
          }

          if ( objectsIntersect( tmpSquare, this ) ) {
            this.canvas.grid.nodes[y][x].walkable = false;
            this.canvas.grid.nodes[y][x].obj = this;
            this.gridArr.push({ x: x, y: y });
          }
        }
      }

      this.gridPos.x = Math.round( this.x / 10 );
      this.gridPos.y = Math.round( this.y / 10 );
    } catch ( error ) {}
  }

  collision ( obj ) {

  }

  live ( delta = 0 ) {
    this.delta = delta;

    this.move();
    this.rotate();
    this.rotateFigure();
    this.applyPosition();
    this.calcSegments();
    this.updGrid();
  }

  die () {
    this.canvas.remove( this );
    if ( this.onDead instanceof Function ) this.onDead.call( this );
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

    if ( this.onRender instanceof Function ) this.onRender.call( this );
  }

  info () {
    return {
      id: this.id,
      delta: this.delta,
      type: this.type,
      gridPos: this.gridPos,
      collide: this.collide,
      color: this.color,
      x: this.x,
      y: this.y,
      a: this.a,
      d: this.d,
      v: this.v
    };
  }
}

export default Obj;
