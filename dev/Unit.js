import merge from './merge.js';
import Vector from './Vector.js';
import Particle from './Particle.js';
import Bullet from './Bullet.js';

// Unit prototype
function Unit ( opts ) {
	if ( !opts.canvas ) throw new Error( 'canvas is a required parameter!' );

	merge( this, {
		canvas: null,
		id: null,
		type: 'Unit',
		x: 0,
		y: 0,
		d: new Vector({ x: 1, y: 0 }),
		v: new Vector({ x: 0, y: 0 }),
		vMax: 5,
		fhp: 100,
		mass: 50,
		reloadTime: 3,
		reloading: false,
		color: 'hsl( 50, 100%, 50% )',
		alive: true,
		collide: true,
		points: [  // Initial unit figure points
			{ x: 0,  y: 0 },
			{ x: -5,  y: 5 },
			{ x: -2,  y: 5 },
			{ x: 10, y: 0 },
			{ x: -2,  y: -5 },
			{ x: -5,  y: -5 }
		],
		bPoints: [
			{ x: 11, y: 0 }
		],
		fPoints: null,  // Unit figure points after rotation applying
		fSegments: null,
		fbPoints: null,
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

Unit.rotate = function ( point, angle ) {
	return {
		x: point.x * Math.cos( angle ) - point.y * Math.sin( angle ),
		y: point.y * Math.cos( angle ) + point.x * Math.sin( angle )
	};
};

Unit.prototype.live = function () {
	if ( this.cb && this.cb.liveS instanceof Function ) {
		this.cb.liveS.call( this );
	}

	this.color = `hsl( ${ 100 / this.fhp * this.hp }, 100%, 50% )`;

	if ( !this.v.isZero() ) {
		this.v.multiply( .95 );

		if ( this.v.length() < .05 ) {
			this.v.multiply( 0 );
		}
	}

	this.x += this.v.x;
	this.y += this.v.y;

	this.fbPoints = this.bPoints.map( ( point ) => {
		let tmp = Unit.rotate( point, this.d.angle() );
		return { x: tmp.x + this.x, y: tmp.y + this.y };
	});

	this.fPoints = this.points.map( ( point ) => {
		let tmp = Unit.rotate( point, this.d.angle() );
		return { x: tmp.x + this.x, y: tmp.y + this.y };
	});

	this.fSegments = this.fPoints.map( function ( point, index, points ) {
		return [ point, points[ ( points.length > index + 1 ) ? index + 1 : 0 ] ];
	});

	if ( this.reloading ) {
		if ( this.reloading > 0 ) {
			this.reloading -= 1;
		} else {
			this.reloading = false;
		}
	}

	if ( this.v.length() > 2 ) {
		this.canvas.add( new Particle({
			x: this.x,
			y: this.y,
			size: 3,
			d: ( new Vector( this.d ) ).rotateD( Math.random() * 360 ),
			v: ( new Vector( this.v ) ).rotateD( 180 + ( Math.random() - .5 ) * 20 ),
			canvas: this.canvas
		}));
	}

	if ( this.hp <= 0 ) this.die();

	if ( this.cb && this.cb.liveE instanceof Function ) {
		this.cb.liveE.call( this );
	}
};

Unit.prototype.die = function () {
	for ( let i = 0; i < this.mass; i++ ) {
		this.canvas.add( new Particle({
			x: this.x,
			y: this.y,
			size: this.mass * .02,
			d: new Vector({ x: 0, y: 1 }).rotateD( Math.random() * 360 ),
			v: ( new Vector({ x: 0, y: 1 }) ).rotateD( Math.random() * 360 ).multiply( Math.random() * 3 ),
			canvas: this.canvas
		}));
	}

	this.alive = false;
	this.canvas.remove( this );

	if ( this.cb && this.cb.die instanceof Function ) {
		this.cb.die.call( this );
	}
};

Unit.prototype.collision = function ( obj ) {
	if ( 'type' in obj && obj.type === 'Unit' ) {
		obj.hp -= 50;
	}
};

Unit.prototype.fire = function () {
	if ( !this.reloading ) {
		this.fbPoints.forEach( ( point ) => {
			this.canvas.add( new Bullet({
				x: point.x,
				y: point.y,
				d: new Vector( this.d ),
				v: ( new Vector( this.d ) ).multiply( 40 ),
				canvas: this.canvas
			}));
		});

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

	this.canvas.ctx.closePath();
	this.canvas.ctx.fill();

	// this.canvas.ctx.strokeStyle = "black";
	// this.canvas.ctx.beginPath();
	// this.canvas.ctx.moveTo( this.x, this.y );
	// this.canvas.ctx.lineTo( this.x + ( this.v.x * 10 ), this.y + ( this.v.y * 10 ) );
	// this.canvas.ctx.closePath();
	// this.canvas.ctx.stroke();
};

export default Unit;