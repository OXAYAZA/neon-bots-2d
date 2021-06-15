import merge from './merge.js';
import Particle from "./Particle.js";

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
	damage: 2,
	collide: true,

	points: [
		{ x: -3, y: -2 },
		{ x: -3, y: 2 },
		{ x: 3, y: 2 },
		{ x: 3, y: -2 },
	],

	hue: 0,
	saturation: 100,
	lightness: 50,

	fPoints: null,
	fSegments: null,
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

	this.fSegments = this.fPoints.map( function ( point, index, points ) {
		return [ point, points[ ( points.length > index + 1 ) ? index + 1 : 0 ] ];
	});

	this.hp -= 1;

	if ( this.hp <= 0 ) this.die();
};

Bullet.prototype.die = function () {
	this.canvas.remove( this );
};

Bullet.prototype.collision = function ( obj ) {
	if ( 'hp' in obj ) {
		obj.hp -= this.damage;
	}

	for ( let i = 0; i < 10; i++ ) {
		this.canvas.add( new Particle({
			x: this.x,
			y: this.y,
			size: 2,
			v: this.v * .2 * Math.random(),
			a: this.a + 3.2 + ( Math.random() - .5 ) * 1.6,
			canvas: this.canvas
		}));
	}

	this.die();
};

Bullet.prototype.render = function () {
	this.canvas.ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
	this.canvas.ctx.beginPath();

	this.fPoints.forEach( ( point, index ) => {
		if ( index ) this.canvas.ctx.lineTo( point.x, point.y );
		else this.canvas.ctx.moveTo( point.x, point.y );
	});

	this.canvas.ctx.closePath();
	this.canvas.ctx.fill();
};

export default Bullet;