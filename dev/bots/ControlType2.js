import Vector from "../util/Vector.js";

class ControlType2 {
	body = null;
	angle = null;
	target = {
		x: null,
		y: null
	};

	constructor ( body ) {
		this.body = body;
	}

	calculate () {
		if ( window.mouse.x && window.mouse.y ) {
			this.target.x = window.mouse.x - this.body.map.offset.x;
			this.target.y = window.mouse.y - this.body.map.offset.y;

			this.direction = new Vector({
				x: this.target.x - this.body.x,
				y: this.target.y - this.body.y
			});

			this.angle =
				Math.atan2( this.body.d.x, this.body.d.y ) -
				Math.atan2( this.direction.x, this.direction.y );
		}
	}

	rotate () {
		if ( this.angle < 0 && this.angle > - Math.PI ) {
			this.body.rotateLeft();
		} else if ( this.angle < 0 && this.angle < - Math.PI ) {
			this.body.rotateRight();
		} else if ( this.angle > 0 && this.angle < Math.PI ) {
			this.body.rotateRight();
		} else if ( this.angle > 0 && this.angle > Math.PI ) {
			this.body.rotateLeft();
		}
	}

	act () {
		this.calculate();
		this.rotate();

		if ( window.keys[ 'KeyW' ] ) {
			this.body.moveForward();
		}

		if ( window.keys[ 'KeyS' ] ) {
			this.body.moveBackward();
		}

		if ( window.keys[ 'KeyA' ] ) {
			this.body.moveLeft();
		}

		if ( window.keys[ 'KeyD' ] ) {
			this.body.moveRight();
		}

		if ( window.keys[ 'Space' ] ) {
			this.body.shot();
		}

		// TODO Тач управление
		// if ( window.directionControllerOffset.x < -.5 ) {
		// 	this.body.rotateLeft();
		// }
		//
		// if ( window.directionControllerOffset.x > .5 ) {
		// 	this.body.rotateRight();
		// }
		//
		// if ( window.directionControllerOffset.y < -.5 ) {
		// 	this.body.moveForward();
		// }
		//
		// if ( window.directionControllerOffset.y > .5 ) {
		// 	this.body.moveBackward();
		// }
		//
		// if ( window.touchButtons[ 'shotButton' ] ) {
		// 	this.body.shot();
		// }
	}

	info () {
		return null;
	}
}

export default ControlType2;
