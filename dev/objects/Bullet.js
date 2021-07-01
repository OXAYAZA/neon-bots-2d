import merge from '../util/merge.js';
import Particle from "./Particle.js";
import Vector from "./Vector.js";

// Bullet prototype
function Bullet ( opts ) {
	if ( !opts.canvas ) throw new Error( 'canvas is a required parameter!' );

	merge( this, {
		canvas: null,
		id: null,
		type: 'Bullet',
		x: 0,
		y: 0,
		d: new Vector({ x: 1, y: 0 }),
		v: new Vector({ x: 0, y: 0 }),
		vMax: 5,
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
		hp: null,
		cb: {
			liveS: null,
			liveE: null,
			die: null
		}
	});

	merge( this, opts );

	this.hp = this.fhp;
}

Bullet.rotate = function ( point, angle ) {
	return {
		x: point.x * Math.cos( angle ) - point.y * Math.sin( angle ),
		y: point.y * Math.cos( angle ) + point.x * Math.sin( angle )
	};
};

Bullet.prototype.live = function () {
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
		let tmp = Bullet.rotate( point, this.d.angle() );
		return { x: tmp.x + this.x, y: tmp.y + this.y };
	});

	this.fSegments = this.fPoints.map( function ( point, index, points ) {
		return [ point, points[ ( points.length > index + 1 ) ? index + 1 : 0 ] ];
	});

	this.hp -= 1;

	if ( this.hp <= 0 ) this.die();

	if ( this.cb && this.cb.liveE instanceof Function ) {
		this.cb.liveE.call( this );
	}
};

Bullet.prototype.die = function () {
	this.canvas.remove( this );

	if ( this.cb && this.cb.die instanceof Function ) {
		this.cb.die.call( this );
	}
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
			d: ( new Vector( this.d ) ).rotateD( 180 ),
			v: ( new Vector( this.v ) ).rotateD( 180 + ( Math.random() - .5 ) * 45 ).multiply( Math.random() * .5 ),
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

	// this.canvas.ctx.strokeStyle = "black";
	// this.canvas.ctx.beginPath();
	// this.canvas.ctx.moveTo( this.x, this.y );
	// this.canvas.ctx.lineTo( this.x + ( this.v.x * 10 ), this.y + ( this.v.y * 10 ) );
	// this.canvas.ctx.closePath();
	// this.canvas.ctx.stroke();
};

export default Bullet;
