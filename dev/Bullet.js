import merge from './merge.js';

// Bullet prototype
function Bullet ( opts ) {
	if ( !opts.canvas ) throw new Error( 'canvas is a required parameter!' );

	merge( this, Bullet.defaults );
	merge( this, opts );

	this.hp = this.fhp;
}

Bullet.defaults = {
	canvas: null,
	id: null,
	type: 'Bullet',
	x: 0,
	y: 0,
	dx: 0,
	dy: 1,
	v: 0,
	a: 0,
	va: 0,
	da: 0,
	fhp: 50,

	points: [
		{ x: -3, y: -3 },
		{ x: -3, y: 3 },
		{ x: 3, y: 3 },
		{ x: 3, y: -3 },
	],

	hue: 0,
	saturation: 100,
	lightness: 50,

	fPoints: null,
	hp: null
};

Bullet.rotate = function ( point, angle ) {
	return {
		x: point.x * Math.cos( angle ) - point.y * Math.sin( angle ),
		y: point.y * Math.cos( angle ) + point.x * Math.sin( angle )
	};
};

Bullet.prototype.live = function () {
	this.da = this.va;
	this.dx = this.v * Math.cos( this.a );
	this.dy = this.v * Math.sin( this.a );

	this.x += this.dx;
	this.y += this.dy;
	this.a += this.da;

	this.fPoints = this.points.map( ( point ) => {
		let tmp = Bullet.rotate( point, this.a );
		return { x: tmp.x + this.x, y: tmp.y + this.y };
	});

	this.hp -= 1;

	if ( this.hp <= 0 ) this.die();
};

Bullet.prototype.die = function () {
	this.canvas.remove( this );
};

Bullet.prototype.render = function () {
	this.canvas.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
	this.canvas.ctx.beginPath();

	this.fPoints.forEach( ( point, index ) => {
		if ( index ) this.canvas.ctx.lineTo( point.x, point.y );
		else this.canvas.ctx.moveTo( point.x, point.y );
	});

	this.canvas.ctx.fill();
};

export default Bullet;