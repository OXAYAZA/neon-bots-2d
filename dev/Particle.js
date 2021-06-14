import merge from './merge.js';

// Particle prototype
function Particle ( opts ) {
	if ( !opts.canvas ) throw new Error( 'canvas is a required parameter!' );

	merge( this, Particle.defaults );
	merge( this, opts );

	this.hp = this.fhp;
}

Particle.defaults = {
	canvas: null,
	id: null,
	x: 0,
	y: 0,
	dx: 0,
	dy: 1,
	v: 0,
	a: 0,
	va: 0,
	da: 0,
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
	hp: null
};

Particle.rotate = function ( point, angle ) {
	return {
		x: point.x * Math.cos( angle ) - point.y * Math.sin( angle ),
		y: point.y * Math.cos( angle ) + point.x * Math.sin( angle )
	};
};

Particle.prototype.live = function () {
	this.da = this.va;
	this.dx = this.v * Math.cos( this.a );
	this.dy = this.v * Math.sin( this.a );

	this.x += this.dx;
	this.y += this.dy;
	this.a += this.da;

	this.fPoints = this.points.map( ( point ) => {
		return { x: point.x * this.size, y: point.y * this.size };
	});

	this.fPoints = this.fPoints.map( ( point ) => {
		return Particle.rotate( point, this.a );
	});

	this.fPoints = this.fPoints.map( ( point ) => {
		let percantage = this.hp / this.fhp;
		let tmp = Particle.rotate( point, this.a );
		return { x: tmp.x * percantage + this.x, y: tmp.y * percantage + this.y };
	});

	this.fSegments = this.fPoints.map( function ( point, index, points ) {
		return [ point, points[ ( points.length > index + 1 ) ? index + 1 : 0 ] ];
	});

	this.hp -= 1;
	this.lightness = this.lightness <= 50 ? this.lightness : this.lightness - 1;

	if ( this.hp <= 0 ) this.die();
};

Particle.prototype.die = function () {
	this.canvas.remove( this );
};

Particle.prototype.render = function () {
	this.canvas.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
	this.canvas.ctx.beginPath();

	this.fPoints.forEach( ( point, index ) => {
		if ( index ) this.canvas.ctx.lineTo( point.x, point.y );
		else this.canvas.ctx.moveTo( point.x, point.y );
	});

	this.canvas.ctx.fill();
};

export default Particle;