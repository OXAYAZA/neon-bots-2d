import merge from '../util/merge.js';
import Vector from "./Vector.js";

// Particle prototype
function _Particle (opts ) {
	if ( !opts.canvas ) throw new Error( 'canvas is a required parameter!' );

	merge( this, _Particle.defaults );
	merge( this, opts );

	if ( this.size ) {
		this.points = this.points.map( ( point ) => {
			return { x: point.x * this.size, y: point.y * this.size };
		});
	}

	this.hp = this.fhp;
}

_Particle.defaults = {
	canvas: null,
	id: null,
	x: 0,
	y: 0,
	d: new Vector({ x: 1, y: 0 }),
	v: new Vector({ x: 0, y: 0 }),
	vMax: 5,
	fhp: 50,
	size: 2,
	hue: 24,
	saturation: 100,
	lightness: 80,
	points: [
		{ x: -1, y: -1 },
		{ x: -1, y: 1 },
		{ x: 1, y: 1 },
		{ x: 1, y: -1 },
	],
	fPoints: null,
	fSegments: null,
	hp: null,
	cb: {
		liveS: null,
		liveE: null,
		die: null
	}
};

_Particle.rotate = function (point, angle ) {
	return {
		x: point.x * Math.cos( angle ) - point.y * Math.sin( angle ),
		y: point.y * Math.cos( angle ) + point.x * Math.sin( angle )
	};
};

_Particle.prototype.live = function () {
	if ( this.cb && this.cb.liveS instanceof Function ) {
		this.cb.liveS.call( this );
	}

	if ( !this.v.isZero() ) {
		this.v.multiply( .95 );

		if ( this.v.length() < .05 ) {
			this.v.multiply( 0 );
		}
	}

	this.x += this.v.x;
	this.y += this.v.y;

	this.fPoints = this.points.map( ( point ) => {
		let percantage = this.hp / this.fhp;
		let tmp = _Particle.rotate( point, this.d.angle() );
		return { x: tmp.x * percantage + this.x, y: tmp.y * percantage + this.y };
	});

	this.fSegments = this.fPoints.map( function ( point, index, points ) {
		return [ point, points[ ( points.length > index + 1 ) ? index + 1 : 0 ] ];
	});

	this.hp -= 1;
	this.lightness = this.lightness <= 50 ? this.lightness : this.lightness - 1;

	if ( this.hp <= 0 ) this.die();

	if ( this.cb && this.cb.liveE instanceof Function ) {
		this.cb.liveE.call( this );
	}
};

_Particle.prototype.die = function () {
	this.canvas.remove( this );

	if ( this.cb && this.cb.die instanceof Function ) {
		this.cb.die.call( this );
	}
};

_Particle.prototype.render = function () {
	this.canvas.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
	this.canvas.ctx.beginPath();

	this.fPoints.forEach( ( point, index ) => {
		if ( index ) this.canvas.ctx.lineTo( point.x, point.y );
		else this.canvas.ctx.moveTo( point.x, point.y );
	});

	this.canvas.ctx.closePath();
	this.canvas.ctx.fill();

	// this.canvas.ctx.strokeStyle = "black";
	// this.canvas.ctx.beginPath();
	// this.canvas.ctx.moveTo( this.x, this.y );
	// this.canvas.ctx.lineTo( this.x + ( this.v.x * 10 ), this.y + ( this.v.y * 10 ) );
	// this.canvas.ctx.closePath();
	// this.canvas.ctx.stroke();
};

export default _Particle;
