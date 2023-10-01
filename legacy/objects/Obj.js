import merge from '../util/merge.js';
import objectsIntersect from '../util/objectsIntersect.js';
import Vector from "../util/Vector.js";

class Obj {
  map = null;                        // Map to which the object is linked
  id;                                // Unique object identifier (usually set by canvas)
  delta = 0;                         // Time correction
  type = 'Object';                   // Object type
  canCollide = false;                // Collision checking for an object
  collide = false;                   // Is object colliding now
  color = 'rgb( 255, 255, 255 )';    // Object fill color
  friction = .05;                    // Braking an object while moving

  gridArr = [];                      // Occupied grid cells
  gridPos = {                        // Position on grid
    x: 0,
    y: 0,
  };

  x = 0;                             // X coordinate
  y = 0;                             // Y coordinate
  a = 0;                             // Angle of rotation of the object in radians

  d = new Vector({ x: 1, y: 0 });    // Object direction vector
  v = new Vector({ x: 0, y: 0 });    // Object velocity vector
  e = 0;                             // Object angle velocity

  figureInitial = [                  // Object figure (collider?) at zero rotation angle
    { x: 1,  y: 1 },
    { x: 1,  y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 1 }
  ];

  figureRaw;                         // The figure of the object, after applying transformations but without taking into account the position
  figureFinal;                       // The final figure of the object, after applying transformations and position
  figureSegments;                    // Segments of a figure to determine intersections

  onDead = null;                     // Death callback
  onRender = null;                   // Rendering callback

  renderOpts = {                     // Additional rendering options
    nVec: false,                     // Normal vectors of figure segments
    dVec: false,                     // Direction vector
    vVec: false,                     // Velocity vector
    rVec: false                      // Rotation vector
  };

  constructor ( props = {} ) {
    // TODO Add parameter checks

    // Setting new properties
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

    this.d.rotate( this.e );
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

    minX = ( minX - ( minX % this.map.cellSize ) ) / this.map.cellSize;
    maxX = ( maxX - ( maxX % this.map.cellSize ) ) / this.map.cellSize;
    minY = ( minY - ( minY % this.map.cellSize ) ) / this.map.cellSize;
    maxY = ( maxY - ( maxY % this.map.cellSize ) ) / this.map.cellSize;

    // TODO try should be fixed by limiting the play area
    try {
      for ( let x = minX; x <= maxX; x++ ) {
        for ( let y = minY; y <= maxY; y++ ) {
          if ( objectsIntersect( this.map.cellFigure( x, y ), this ) ) {
            this.map.grid.nodes[y][x].walkable = false;
            this.map.grid.nodes[y][x].obj = this;
            this.gridArr.push({ x: x, y: y });
          }
        }
      }

      this.gridPos.x = Math.round( this.x / this.map.cellSize );
      this.gridPos.y = Math.round( this.y / this.map.cellSize );
    } catch ( error ) {}
  }

  collision () {
    if ( this.collide ) {
      if ( this.collide.segment ) {
        let
          x1 = this.collide.segment[0].x,
          x2 = this.collide.segment[1].x,
          y1 = this.collide.segment[0].y,
          y2 = this.collide.segment[1].y,
          vec = new Vector({ x: x2 - x1, y: y2 - y1 }).rotateD( -90 ).setLength( 10 );

        this.v.reflect( vec );
      }
      this.collide = false;
    }
  }

  live ( delta = 0 ) {
    this.delta = delta;

    this.collision();
    this.move();
    this.rotateFigure();
    this.applyPosition();
    this.calcSegments();
    this.updGrid();
  }

  die () {
    this.map.remove( this );
    if ( this.onDead instanceof Function ) this.onDead.call( this );
  }

  render ( offset ) {
    this.map.ctx.fillStyle = this.color;
    this.map.ctx.strokeStyle = 'rgb( 0, 0, 0 )';
    this.map.ctx.beginPath();

    this.figureFinal.forEach( ( point, index ) => {
      if ( index ) this.map.ctx.lineTo( offset.x + point.x, offset.y + point.y );
      else this.map.ctx.moveTo( offset.x + point.x, offset.y + point.y );
    });

    this.map.ctx.closePath();
    this.map.ctx.fill();
    this.map.ctx.stroke();

    // Normal vectors
    if ( this.renderOpts.nVec ) {
      this.figureSegments.forEach( ( segment ) => {
        let
          x1 = segment[0].x,
          x2 = segment[1].x,
          y1 = segment[0].y,
          y2 = segment[1].y,
          nx = x1 + ( x2 - x1 ) / 2,
          ny = y1 + ( y2 - y1 ) / 2,
          vec = new Vector({ x: x2 - x1, y: y2 - y1 }).rotateD( -90 ).setLength( 10 );

        this.map.ctx.strokeStyle = 'rgba( 255, 255, 255 )';
        this.map.ctx.beginPath();
        this.map.ctx.moveTo( offset.x + nx, offset.y + ny );
        this.map.ctx.lineTo( offset.x + nx + vec.x, offset.y + ny + vec.y );
        this.map.ctx.closePath();
        this.map.ctx.stroke();
      });
    }

    // Direction vector
    if ( this.renderOpts.dVec ) {
      let dVec = new Vector( this.d ).setLength( 30 );
      this.map.ctx.strokeStyle = 'rgb( 50, 71, 210 )';
      this.map.ctx.beginPath();
      this.map.ctx.moveTo( offset.x + this.x, offset.y + this.y );
      this.map.ctx.lineTo( offset.x + this.x + dVec.x, offset.y + this.y + dVec.y );
      this.map.ctx.closePath();
      this.map.ctx.stroke();
    }

    // Velocity vector
    if ( this.renderOpts.vVec ) {
      let vVec = new Vector( this.v ).multiply( .2 );
      this.map.ctx.strokeStyle = 'rgb( 210, 50, 50 )';
      this.map.ctx.beginPath();
      this.map.ctx.moveTo( offset.x + this.x, offset.y + this.y );
      this.map.ctx.lineTo( offset.x + this.x + vVec.x, offset.y + this.y + vVec.y );
      this.map.ctx.closePath();
      this.map.ctx.stroke();
    }

    // Rotation vector
    if ( this.renderOpts.rVec ) {
      this.figureFinal.forEach( ( point ) => {
        let vec = new Vector({ x: point.x - this.x, y: point.y - this.y }).rotateD( 90 ).setLength( this.e * 100 );

        this.map.ctx.strokeStyle = 'rgb(210,183,50)';
        this.map.ctx.beginPath();
        // this.map.ctx.moveTo( offset.x + this.x, offset.y + this.y );
        this.map.ctx.moveTo( offset.x + point.x, offset.y + point.y );
        this.map.ctx.lineTo( offset.x + point.x + vec.x, offset.y + point.y + vec.y );
        this.map.ctx.closePath();
        this.map.ctx.stroke();
      });
    }

    if ( this.onRender instanceof Function ) this.onRender.call( this );
  }

  info () {
    return {
      id: this.id,
      delta: this.delta,
      type: this.type,
      gridPos: this.gridPos,
      canCollide: this.canCollide,
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
