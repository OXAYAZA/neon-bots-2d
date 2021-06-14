import merge from './merge.js';
import Particle from './Particle.js';
import Bullet from './Bullet.js';

// Unit prototype
function Unit ( opts ) {
	if ( !opts.canvas ) throw new Error( 'canvas is a required parameter!' );

	merge( this, Unit.defaults );
	merge( this, opts );

	this.hp = this.fhp;
}

Unit.defaults = {
	canvas: null,
	id: null,
	type: 'Unit',
	x: 0,
	y: 0,
	dx: 0,
	dy: 0,
	v: 0,
	a: 0,
	va: 0,
	da: 0,
	fhp: 100,
	hp: null,
	reloadTime: 10,
	reloading: false,
	color: 'hsl( 50, 100%, 50% )',
	alive: true,

	points: [  // Initial unit figure points
		{ x: 10, y: 0 },
		{ x: -5,  y: -5 },
		{ x: 0,  y: 0 },
		{ x: -5,  y: 5 },
	],

	fPoints: null,  // Unit figure points after rotation applying

	cb: {
		live: null
	}
};

Unit.rotate = function ( point, angle ) {
	return {
		x: point.x * Math.cos( angle ) - point.y * Math.sin( angle ),
		y: point.y * Math.cos( angle ) + point.x * Math.sin( angle )
	};
};

Unit.prototype.live = function () {
	if ( this.cb && this.cb.live instanceof Function ) {
		this.cb.live.call( this );
	}

	this.color = `hsl( ${ 100 / this.fhp * this.hp }, 100%, 50% )`;

	this.da = this.va;
	this.dx = this.v * Math.cos( this.a );
	this.dy = this.v * Math.sin( this.a );

	this.x += this.dx;
	this.y += this.dy;
	this.a += this.da;

	this.fPoints = this.points.map( ( point ) => {
		let tmp = Unit.rotate( point, this.a );
		return { x: tmp.x + this.x, y: tmp.y + this.y };
	});

	if ( this.reloading ) {
		if ( this.reloading > 0 ) {
			this.reloading -= 1;
		} else {
			this.reloading = false;
		}
	}

	if ( this.v !== 0 ) {
		this.canvas.add( new Particle({
			x: this.x,
			y: this.y,
			width: 4,
			height: 4,
			v: this.v * .15,
			a: Math.random() * 6,
			canvas: this.canvas
		}));
	}

	if ( this.hp <= 0 ) this.die();
};

Unit.prototype.die = function () {
	for ( let i = 0; i < 50; i++ ) {
		this.canvas.add( new Particle({
			x: this.x,
			y: this.y,
			width: 6,
			height: 6,
			v: Math.random(),
			a: Math.random() * 6,
			canvas: this.canvas
		}));
	}

	this.alive = false;
	this.canvas.remove( this );
};

Unit.prototype.fire = function () {
	if ( !this.reloading ) {
		this.canvas.add( new Bullet({
			x: this.x,
			y: this.y,
			v: this.v + 15,
			a: this.a,
			canvas: this.canvas
		}));

		this.reloading = this.reloadTime;
	}
};

Unit.prototype.render = function () {
	this.canvas.ctx.fillStyle = this.color;
	this.canvas.ctx.beginPath();

	this.fPoints.forEach( ( point, index ) => {
		if ( index ) this.canvas.ctx.lineTo( point.x, point.y );
		else this.canvas.ctx.moveTo( point.x, point.y );
	});

	this.canvas.ctx.fill();
};

export default Unit;