import Vector from '../util/Vector.js';

class Simple {
	body = null;
	target = null;
	distance = Infinity;
	direction = null;
	angle = null;

	constructor ( body ) {
		this.body = body;
	}

	scan () {
		this.target = null;
		this.distance = Infinity;

		Object.keys( window.canvas.unitLayer ).map( ( item ) => {
			let target = window.canvas.unitLayer[ item ];
			let distance = Math.sqrt( Math.pow( target.x - this.body.x, 2 ) + Math.pow( target.y - this.body.y, 2 ) );

			if ( this.body !== target && this.body.fraction !== target.fraction && target.alive && distance < this.distance ) {
				this.distance = distance;
				this.target = target;
			}
		});
	}

	calculate () {
		this.distance = Math.sqrt( Math.pow( this.target.x - this.body.x, 2 ) + Math.pow( this.target.y - this.body.y, 2 ) );
		this.direction = new Vector({ x: this.target.x - this.body.x, y: this.target.y - this.body.y });
		this.angle = this.direction.angle();
	}

	rotate () {
		if ( this.angle < this.body.a ) {
			this.body.rotateLeft();
		} else {
			this.body.rotateRight();
		}
	}

	move () {
		if ( this.distance > 200 ) {
			this.body.moveForward();
		} else if ( this.distance < 100 ) {
			this.body.moveBackward();
		} else {
			this.body.moveLeft();
		}
	}

	attack () {
		if ( this.distance < 300 ) {
			this.body.shot();
		}
	}

	act () {
		this.scan();

		if ( this.target && this.target.alive ) {
			this.calculate();
			this.rotate();
			this.move();
			this.attack();
		}
	}

	info () {
		return {
			target: this.target && this.target.type,
			distance: this.distance,
			angle: this.angle,
			direction: this.direction
		};
	}
}

export default Simple;
